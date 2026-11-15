"""Text -> natural speech with Kokoro (Kokoro-82M, offline), saved as mp3 through ffmpeg."""
import re, subprocess

RATE = 24000  # Kokoro's sample rate


# Names that appear in the explanations, said the way a person would say them.
WORDS = {
    "hPrevInstance": "H previous instance", "hInstance": "H instance", "lpCmdLine": "L P command line",
    "nCmdShow": "N command show", "CALLBACK": "callback", "OutputDebugStringA": "Output Debug String A",
    "OutputDebugString": "Output Debug String", "tmainCRTStartup": "T main C R T startup",
    "crtexew": "C R T E X E W", "MSVCRTD": "M S V C R T D", "kernel32": "kernel 32", "Win32": "Win 32",
    "HINSTANCE": "H instance", "HWND": "H W N D", "PVOID": "P void", "LPSTR": "L P S T R", "CRT": "C R T",
    "CONSOLE": "console", "WINDOWS": "windows", "ENTRY": "entry", "VS": "Visual Studio", "MSDN": "M S D N",
}


def clock(m):
    h, mi, s = (int(x) if x else None for x in m.groups())
    out = (f"{h} hour{'s' * (h != 1)} " if h is not None else "") + f"{mi} minutes"
    return out + (f" {s}" if s else "")


def spoken(text):
    """Make code-ish words easy to say. Pseudocode should already be plain English; this is the safety net."""
    t = re.sub(r"\s+", " ", str(text))
    t = re.sub(r"\b(" + "|".join(sorted(WORDS, key=len, reverse=True)) + r")\b", lambda m: WORDS[m.group(1)], t)
    # symbols that the explanations talk about: say them as words before the clean-up below removes them
    t = t.replace("C++", "C plus plus").replace("/*", " slash star ").replace("*/", " star slash ")
    t = re.sub(r"\\n\b", " backslash n ", t)
    t = re.sub(r"(?<![\w:/])//", " double slash ", t)
    t = re.sub(r"(?<![\w/])/(?=\w)", " slash ", t)                 # /link, /ENTRY
    t = t.replace('"_"', "underscore")
    t = re.sub(r"@(\d+)", r" at \1", t)
    t = re.sub(r"\b(?:(\d):)?(\d{1,2}):(\d{2})\b", clock, t)      # video times: 54:00, 1:07:00
    t = re.sub(r"(?<=[A-Za-z])/(?=[A-Za-z])", " or ", t)           # COM/OLE
    t = re.sub(r"\b(\w+)\(\)\s*;", r"\1,", t)                      # foo(); -> foo,
    t = re.sub(r"\b(\w+)\(\)", r"\1", t)
    t = re.sub(r"\(\s*\)", " parentheses ", t)
    t = re.sub(r"(?<=[\s(]);", " semicolon", t)                    # a ; on its own
    t = re.sub(r"(?<=\d)\s*=\s*(?=\d)", " equals ", t)
    t = re.sub(r"\s=\s", " is ", t)
    t = re.sub(r"\s\+\s", " plus ", t)
    t = re.sub(r"→|─▶|▶", " to ", t).replace("×", " times ").replace("−", " minus ")
    t = re.sub(r"\be\.g\.", "for example", t)
    t = re.sub(r"\bi\.e\.", "that is", t)
    t = re.sub(r"\.(cpp|obj|exe|dll|lib|bat|h)\b", lambda m: " dot " + " ".join(m.group(1).upper()), t, flags=re.I)
    t = re.sub(r"\b(LNK|C)(\d{4})\b", r"\1 \2", t).replace("LNK", "L N K")
    t = re.sub(r"\bcl\b", "C L", t)
    t = re.sub(r"\bx(64|86)\b", r"x \1", t)
    t = re.sub(r"\b(LP|H|P)(CSTR|STR|INSTANCE|WND|DC|VOID)\b",
               lambda m: " ".join(m.group(1)) + " " + ("instance" if m.group(2) == "INSTANCE" else " ".join(m.group(2))), t)
    t = re.sub(r"\b_+(?=[A-Za-z])", "", t)
    t = re.sub(r"([A-Za-z])_+(?=\s|$)", r"\1", t)
    t = re.sub(r"([a-z])([A-Z])", r"\1 \2", t)          # OutputDebugStringA -> Output Debug String A
    t = re.sub(r"[{}<>#*`\[\]\\|]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


class Voice:
    def __init__(self, name="af_heart", speed=1.0):
        from kokoro import KPipeline  # loaded here: importing it (and PyTorch) takes seconds
        self.name, self.speed = name, speed
        self.pipe = KPipeline(lang_code=name[0], repo_id="hexgrad/Kokoro-82M")  # a = American, b = British

    def audio(self, text):
        import numpy as np
        chunks = [a.numpy() for _, _, a in self.pipe(spoken(text), voice=self.name, speed=self.speed) if a is not None]
        return np.concatenate(chunks) if chunks else np.zeros(0, dtype=np.float32)

    def save_mp3(self, text, path):
        import numpy as np
        pcm = (np.clip(self.audio(text), -1, 1) * 32767).astype("<i2").tobytes()
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "-",
                        "-codec:a", "libmp3lame", "-b:a", "48k", str(path)], input=pcm, check=True)
