"""What Task Manager's CPU page shows, read from this computer with the standard library.

topology() is read once (it never changes while the helper runs): name, sockets, cores,
logical processors and, on Apple Silicon, the performance/efficiency core groups.
ticks() is cheap and is called about once a second: one [busy, total] counter pair per
logical processor. The page turns two readings into a usage percent (busy delta / total
delta), the same way Task Manager does, so the server keeps no state between calls.

macOS: sysctlbyname + host_processor_info through ctypes (no subprocess per poll).
Linux: /proc/cpuinfo and /proc/stat. Anything else: counts only, no live usage.
"""
import ctypes
import ctypes.util
import os
import platform
import sys
import threading

_TOPO = None
_TOPO_LOCK = threading.Lock()
_TICK_LOCK = threading.Lock()
_LIBC = None


def _libc():
    global _LIBC
    if _LIBC is None:
        _LIBC = ctypes.CDLL(ctypes.util.find_library("c") or "/usr/lib/libSystem.dylib", use_errno=True)
    return _LIBC


def _sysctl(name, kind=int):
    """One sysctl value, or None when the key does not exist on this Mac."""
    libc = _libc()
    size = ctypes.c_size_t(0)
    if libc.sysctlbyname(name.encode(), None, ctypes.byref(size), None, 0) != 0 or not size.value:
        return None
    buf = ctypes.create_string_buffer(size.value)
    if libc.sysctlbyname(name.encode(), buf, ctypes.byref(size), None, 0) != 0:
        return None
    raw = buf.raw[:size.value]
    if kind is str:
        return raw.split(b"\0", 1)[0].decode(errors="replace").strip() or None
    return int.from_bytes(raw, sys.byteorder) if raw else None


def _mac_topology():
    groups = []
    for i in range(_sysctl("hw.nperflevels") or 0):
        p = f"hw.perflevel{i}."
        cores = _sysctl(p + "physicalcpu")
        if cores:
            groups.append({"name": _sysctl(p + "name", str) or f"Level {i}",
                           "cores": cores, "logical": _sysctl(p + "logicalcpu") or cores})
    hz = _sysctl("hw.cpufrequency_max") or _sysctl("hw.cpufrequency")
    return {"name": _sysctl("machdep.cpu.brand_string", str) or platform.processor() or "CPU",
            "sockets": _sysctl("hw.packages") or 1,
            "cores": _sysctl("hw.physicalcpu"),
            "logical": _sysctl("hw.logicalcpu") or os.cpu_count(),
            "groups": groups,
            "ghz": round(hz / 1e9, 2) if hz else None}


def _linux_topology():
    name, sockets, cores, mhz, phys = None, set(), set(), None, None
    try:
        with open("/proc/cpuinfo", encoding="utf-8", errors="replace") as f:
            for line in f:
                key, _, val = line.partition(":")
                key, val = key.strip(), val.strip()
                if key == "model name" and not name:
                    name = val
                elif key == "physical id":
                    phys = val
                    sockets.add(val)
                elif key == "core id":
                    cores.add((phys, val))
                elif key == "cpu MHz" and not mhz:
                    mhz = float(val)
    except (OSError, ValueError):
        pass
    return {"name": name or platform.processor() or "CPU", "sockets": len(sockets) or 1,
            "cores": len(cores) or None, "logical": os.cpu_count(), "groups": [],
            "ghz": round(mhz / 1000, 2) if mhz else None}


def topology():
    global _TOPO
    with _TOPO_LOCK:
        if _TOPO is None:
            try:
                topo = _mac_topology() if sys.platform == "darwin" else _linux_topology()
            except Exception:                            # never break the page over a missing key
                topo = {"name": "CPU", "sockets": 1, "cores": None, "logical": os.cpu_count(),
                        "groups": [], "ghz": None}
            topo["os"] = {"darwin": "macOS", "linux": "Linux", "win32": "Windows"}.get(sys.platform, sys.platform)
            topo["arch"] = platform.machine()
            _TOPO = topo
        return dict(_TOPO)


# ---------- live counters ----------
class _Mach:
    """host_processor_info(PROCESSOR_CPU_LOAD_INFO): per-CPU user/system/idle/nice ticks."""
    CPU_LOAD = 2                                         # PROCESSOR_CPU_LOAD_INFO
    STATES = 4                                           # user, system, idle, nice

    def __init__(self):
        libc = _libc()
        self.host_info = libc.host_processor_info
        self.host_info.argtypes = [ctypes.c_uint, ctypes.c_int, ctypes.POINTER(ctypes.c_uint),
                                   ctypes.POINTER(ctypes.POINTER(ctypes.c_int)), ctypes.POINTER(ctypes.c_uint)]
        self.dealloc = libc.vm_deallocate
        self.dealloc.argtypes = [ctypes.c_uint, ctypes.c_size_t, ctypes.c_size_t]
        libc.mach_host_self.restype = ctypes.c_uint
        self.host = libc.mach_host_self()                # one port for the helper's lifetime
        self.task = ctypes.c_uint.in_dll(libc, "mach_task_self_").value

    def read(self):
        count, n = ctypes.c_uint(0), ctypes.c_uint(0)
        info = ctypes.POINTER(ctypes.c_int)()
        if self.host_info(self.host, self.CPU_LOAD, ctypes.byref(count), ctypes.byref(info), ctypes.byref(n)) != 0:
            return None
        try:
            out = []
            for c in range(count.value):
                user, system, idle, nice = (info[c * self.STATES + k] & 0xFFFFFFFF for k in range(4))
                busy = user + system + nice
                out.append([busy, busy + idle])
            return out
        finally:                                         # the kernel lent us memory: hand it back every call
            self.dealloc(self.task, ctypes.cast(info, ctypes.c_void_p).value or 0,
                         n.value * ctypes.sizeof(ctypes.c_int))


_MACH = None


def _linux_ticks():
    out = []
    with open("/proc/stat", encoding="ascii") as f:
        for line in f:
            if line.startswith("cpu") and line[3:4].isdigit():
                v = [int(x) for x in line.split()[1:]]
                idle = v[3] + (v[4] if len(v) > 4 else 0)         # idle + iowait
                total = sum(v[:8])                               # guest time is already inside user
                out.append([total - idle, total])
    return out


def ticks():
    """[[busy, total], ...] per logical processor, or None when this OS has no counters."""
    global _MACH
    try:
        if sys.platform == "darwin":
            with _TICK_LOCK:
                if _MACH is None:
                    _MACH = _Mach()
                return _MACH.read()
        if sys.platform.startswith("linux"):
            return _linux_ticks()
    except Exception:
        return None
    return None


def snapshot():
    return {**topology(), "ticks": ticks()}


if __name__ == "__main__":
    import json
    import time
    a = ticks()
    time.sleep(0.5)
    b = ticks()
    snap = topology()
    if a and b:
        snap["usage"] = [round(100 * (y[0] - x[0]) / max(1, y[1] - x[1])) for x, y in zip(a, b)]
    print(json.dumps(snap, indent=1))
