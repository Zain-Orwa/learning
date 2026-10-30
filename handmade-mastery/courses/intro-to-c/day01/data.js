
window.STUDY = {blocks: [
/* ============ 1 ============ */
{id:"b01", title:"Why this series, and getting a compiler", start:"0:00", end:"5:21",
summary:"Casey explains the plan. Handmade Hero will build a complete game in C, live, and these Intro to C streams exist so a beginner can follow it. Then he gets a C compiler on Windows, which means installing Microsoft Visual Studio.",
watchFor:[
 "At 1:38: what Casey says he **won't** stop to explain once the game series starts (the `?:` operator, how the stack works). That's why this prelude exists.",
 "At 2:46: on Windows you have to go and get a C compiler yourself. On Linux one is usually already there.",
 "At 3:02 to 4:00: which edition of Visual Studio he picks, and why the web and Team Foundation editions are noise."
],
pauseAt:{t:"4:00", do:"Say out loud what a compiler is *for*, in one sentence. Then keep watching. Block 3 tests whether you were right."},
deferred:["How the stack works and the `?:` operator (1:40). He says the game series won't stop for these. The stack is covered in Intro to C Day 3."],
explain:`<p>Day 1 is short on code and long on <b>the toolchain</b>: the chain of programs that turns text you type into something a CPU runs. That chain is the subject of the whole video. This first block just sets it up.</p>
<h3>What Casey actually says</h3>
<ul><li>Handmade Hero is a full game written in C from scratch, live, explaining every decision.</li>
<li>He won't pause the game series for basics, so this prelude covers them.</li>
<li>Windows doesn't ship with a C compiler. You install Microsoft's, which comes inside Visual Studio.</li></ul>
<h3>Update for today</h3>
<p>Casey downloads "Visual Studio Express 2013 for Windows Desktop" and records in Visual Studio 2008. Both are long gone. On Day 2 he tells viewers to switch to the free <b>Community</b> edition, and that's still the one to use. When the installer asks, pick the <b>"Desktop development with C++"</b> workload. That gives you the compiler (<code>cl.exe</code>), the linker (<code>link.exe</code>), the Windows headers and the debugger. The menus look different from 2008, but every idea in this video still applies exactly.</p>
<div class="callout"><b>Mental model to hold for the whole day:</b> text file → <b>compiler</b> → object file → <b>linker</b> → .exe → <b>Windows loads it</b> → the CPU runs it. Every block below fills in one arrow.</div>`,
experiment:`<p><b>Goal:</b> have a working toolchain before block 2.</p>
<ol><li>Install <a href="https://visualstudio.microsoft.com/vs/community/" target="_blank" rel="noopener">Visual Studio Community</a> with the <b>Desktop development with C++</b> workload.</li>
<li>From the Start menu, open <b>x64 Native Tools Command Prompt for VS</b>. Type <code>cl</code> and press Enter. You should see "Microsoft (R) C/C++ Optimizing Compiler…" and a usage line. That program is the compiler Casey is talking about. The IDE only drives it.</li>
<li>Type <code>link</code>. Same idea: this is the linker you'll meet at 27:10.</li></ol>
<p class="small muted">No Windows machine? Do the C parts on <a href="https://godbolt.org" target="_blank" rel="noopener">Compiler Explorer</a> with an "x64 msvc" compiler. For the build and run steps you'll need Windows (or a Windows VM).</p>`,
questions:[
 {t:"1:38", q:"Why does Casey record an Intro to C series before Handmade Hero instead of explaining basics as they come up?", a:"Once the game series starts he wants to focus on why the game code is written the way it is, without stopping for basics like the ?: operator or how the stack works (unless one is directly relevant). The prelude gives beginners enough C to follow along.", hint:"Think about what would happen to a game-programming stream if it paused for every basic."},
 {t:"2:46", q:"What's the first thing you need on Windows to program in C, and why is it extra work compared with Linux?", a:"A C compiler. Windows doesn't include one, so you install Microsoft's, which comes with Visual Studio. Linux distributions usually ship with a compiler (gcc or clang) already available."},
 {t:"4:00", q:"Of all the Visual Studio editions, which one does Casey want, and what's the deciding feature?", a:"The desktop edition (Express 2013 for Windows Desktop at the time), because it's the one that compiles C/C++ into native Windows programs. The web and Team Foundation editions are for other jobs. Today the equivalent is Community with the C++ desktop workload."}
],
cards:[
 ["What is a **toolchain**?","The chain of programs that turns source text into a running program: compiler → linker → (OS loader) → CPU."],
 ["Which Visual Studio to install today, and which workload?","Visual Studio Community (free), workload \"Desktop development with C++\"."],
 ["What are the compiler and linker programs called in MSVC?","`cl.exe` (compiler) and `link.exe` (linker)."]
],
code:`<p>No code in this block. Here is the one-line toolchain check from the experiment, so you know what "working" looks like:</p>
<pre><code>C:\\&gt; cl
Microsoft (R) C/C++ Optimizing Compiler Version 19.xx for x64
usage: cl [ option... ] filename... [ /link linkoption... ]</code></pre>
<p>The version number tells you which compiler you have. The usage line already hints at the two stages: <code>cl</code> compiles, and anything after <code>/link</code> is handed to the linker.</p>`,
why:`<p>Most programmers only know the IDE's green "play" button. When something breaks between the text and the running program, they're stuck. Casey starts here because Handmade Hero drops the IDE build system on its very first episode and drives <code>cl</code> directly from a batch file. Knowing that the IDE is a front end for two command-line programs is what makes that move feel obvious instead of scary.</p>
<p><b>In the AI era:</b> AI tools write a lot of code now. The person who can say exactly which stage failed (compile, link, load or run) fixes problems in minutes while others paste errors back into a chat window. That skill starts with this mental model.</p>`},

/* ============ 2 ============ */
{id:"b02", title:"Creating a project and your first .cpp file", start:"5:21", end:"12:13",
summary:"Casey creates a Win32 Project, explains console vs. windowed programs, ticks Empty Project, finds the Solution Explorer, adds test.cpp, and points out that C source is nothing but plain text.",
watchFor:[
 "At 6:03: the two Win32 options. The difference is a legacy Windows split between command-line and windowed programs.",
 "At 6:41: on Windows one .exe can't cleanly be both. Casey doesn't care because games don't need the command line.",
 "At 7:27: **Empty project**, so the wizard doesn't generate code you didn't write.",
 "At 8:39: what a \"solution\" is. It's just Microsoft's word for a list of things to build.",
 "At 10:36: C source files are raw text. No hidden formatting.",
 "At 11:22 to 12:10: yellow bar = unsaved change, green bar = saved but changed since the last build."
],
deferred:["Command-line programs (6:27). He says \"we'll look at in the future\" and shows a command prompt briefly at 1:01:23.","DLLs and static libraries (7:36). Handmade Hero uses a DLL for live code reloading around Day 21."],
explain:`<h3>Console vs. windowed: the "subsystem"</h3>
<p>Every Windows .exe carries a flag in its header called the <b>subsystem</b>. <code>CONSOLE</code> means "give me a text console window when I start". <code>WINDOWS</code> means "don't, I'll make my own windows". This flag is what Casey means by "you have to build an app as one or the other". The two project types in the wizard mostly just set this flag, and with it which startup function name the linker expects. That second point turns into a real error in block 5.</p>
<h3>Solution vs. project</h3>
<ul><li>A <b>project</b> describes how to build <i>one</i> output (one .exe or one library): which files and which settings.</li>
<li>A <b>solution</b> is a container of projects. The bold one is the <b>startup project</b>, the one that runs when you press Start.</li></ul>
<p>For a one-person game, one solution holding one project is all you need. Casey says he'll soon stop using this machinery entirely.</p>
<h3>Source code is plain text</h3>
<p>A .cpp file is a sequence of characters, the same kind of file Notepad saves. Everything the tools do starts from reading that text. Nothing is hidden in the file. The colors you see in the editor are added by the editor and aren't stored anywhere.</p>
<h3>.cpp vs .c</h3>
<p>Casey names the file <code>test.cpp</code>, so the compiler treats it as C++. Handmade Hero is written in a "C-style" subset of C++: almost entirely plain C, using a few C++ conveniences. That matters once in today's video (block 11), when C++ is stricter than old C.</p>`,
experiment:`<ol><li>In Visual Studio: <b>Create a new project</b> → search "Empty Project" (C++, Windows) → name it <code>test</code>.</li>
<li>Right-click <b>Source Files</b> → Add → New Item → C++ File → <code>test.cpp</code>.</li>
<li>Type one line of nonsense. Watch the yellow change bar appear. Press <b>Ctrl+S</b> and watch it turn green.</li>
<li>Right-click the project → <b>Properties</b> → Linker → System → <b>SubSystem</b>. Set it to <b>Windows (/SUBSYSTEM:WINDOWS)</b>. A modern "Empty Project" defaults to Console. Casey's Win32 Project set Windows for him, and you need it to match his errors later.</li>
<li>Open the folder on disk (right-click project → <i>Open Folder in File Explorer</i>). Open <code>test.cpp</code> in Notepad. Same text, no colors: proof that the source is plain text.</li></ol>`,
questions:[
 {t:"6:03", q:"What is the actual difference between a Win32 Console Application and a Win32 Project?", a:"Whether the program is built as a command-line (console) program or a windowed application. It's a flag in the .exe (the subsystem) that tells Windows whether to give the program a console. It also changes which startup function the build expects.", hint:"It's decided when the program is built, and Windows reads it when the program starts."},
 {t:"6:41", q:"Why doesn't the console/windowed limitation bother Casey for Handmade Hero?", a:"Games don't need to run as command-line tools. A windowed program is all a game needs."},
 {t:"8:39", q:"In your own words: what is a Visual Studio \"solution\"?", a:"Microsoft's name for the thing you're building: a container listing one or more projects and how to build them. The bold project is the startup project."},
 {t:"10:36", q:"What is a C source file, physically?", a:"A plain text file: raw characters with no formatting or annotation. The compiler reads and interprets that text."}
],
cards:[
 ["Console app vs. windowed app on Windows: where is the choice recorded?","In the .exe header's **subsystem** field (CONSOLE or WINDOWS), set at build time by the linker."],
 ["What does the bold project in Solution Explorer mean?","It's the **startup project**: the one that builds and runs when you press Start or F5."],
 ["Yellow vs. green change bar in VS?","Yellow = changed and not saved. Green = saved, but changed since the last build."],
 ["Why tick **Empty project**?","So the wizard doesn't generate code you didn't write. You start from a blank file."],
 ["Is a .cpp file special binary data?","No. It's plain text. The tools give it meaning."]
],
code:`<p>Nothing compiles yet. This is the state of <code>test.cpp</code> when Casey first hits Build (around 12:20): just text with no meaning to C.</p>
<pre><code>this is some text in a file</code></pre>
<p>Keep this file. In the next block it produces your first compiler error, on purpose.</p>`,
why:`<p>Knowing that a project is just "a list of files plus settings that get passed to cl and link" removes the mystery from build systems: CMake, MSBuild, Make and the rest. They all generate the same two kinds of command. In Handmade Hero, Casey replaces the whole project system with a <code>build.bat</code> of a few lines on Day 1. This block is why that works.</p>`},

/* ============ 3 ============ */
{id:"b03", title:"Building: what compiling actually means", start:"12:13", end:"16:55",
summary:"Casey hits Build Solution and reads the output window line by line: which project, which configuration (Debug | Win32), then \"Compiling\". He defines compilation as translation, from text humans read into instructions for one specific kind of CPU.",
watchFor:[
 "At 12:51: the output window pops up by itself. It's the log of every build stage.",
 "At 13:57: **configuration** = Debug or Release, and Win32 (32-bit) or x64 (64-bit).",
 "At 15:16: compilation as translation: parse the text, understand its meaning, emit something else.",
 "At 16:28: the output targets a **specific** processor family: x86 or x64 machine code."
],
pauseAt:{t:"16:37", do:"Before going on: what does the compiler produce? Not an .exe, yet. Hold that thought for block 5."},
deferred:["Building without the IDE (13:45). Handmade Hero Day 1 does exactly this with build.bat.","Configurations in depth (14:07): \"as we'll see later on\"."],
explain:`<h3>Configuration = which kind of build</h3>
<p>The same source can be built in several ways:</p>
<ul><li><b>Debug</b>: no optimization, extra checks, full debug information. Each line of C maps simply to machine code, so the debugger can follow along.</li>
<li><b>Release</b> (Casey also says "Retail"): optimized, fast, much harder to step through.</li>
<li><b>Platform</b>: <code>Win32</code> means 32-bit x86 code. <code>x64</code> means 64-bit code. Same C, different machine instructions.</li></ul>
<h3>What a compiler does</h3>
<p>Casey's definition: compilation means moving something from one format to another, like translating. A C compiler does three things:</p>
<ol><li><b>Parse</b>: read the characters and work out the structure (this is a function, this is a call…).</li>
<li><b>Understand</b>: check the meaning (does that name exist? do the types fit?). Compile errors come from steps 1 and 2.</li>
<li><b>Emit</b>: write out <b>machine code</b>, numbers that a particular CPU decodes as instructions.</li></ol>
<div class="callout"><b>Prerequisite, explained now: what is "machine code" for "a specific CPU"?</b> A CPU only does a small set of simple operations: copy this number, add these two, jump over there. Each operation is encoded as a few bytes. x64 chips (Intel, AMD) and ARM chips (phones, Apple M-series) use different encodings, so the same C produces different bytes for each. That's why the compiler has to know its <b>target</b>. You'll read this code, called assembly, on Intro to C Day 2.</div>`,
experiment:`<ol><li>With your nonsense <code>test.cpp</code> from block 2, press <b>Build → Build Solution</b> (Ctrl+Shift+B). Read the output window top to bottom and find the project, the configuration and the "Compiling" step, just like Casey.</li>
<li>Switch the toolbar from <b>Debug</b> to <b>Release</b>, and from <b>x64</b> to <b>x86</b>. Build again and see the configuration line change.</li>
<li><b>See the translation.</b> Open <a href="https://godbolt.org" target="_blank" rel="noopener">Compiler Explorer</a>, choose language C++ and compiler <b>x64 msvc v19.latest</b>, and type:
<pre><code>int add(int a, int b) { return a + b; }</code></pre>
The right pane shows the machine instructions (as readable assembly). Now switch the compiler to <b>ARM64 msvc</b>, or any <b>armv8 clang</b>. Same C, different instructions. That is what "compiling for a specific processor" means.</li></ol>
<p class="small muted">Don't try to read the assembly yet. Just notice that it's different for each target. Day 2 teaches you to read it.</p>`,
questions:[
 {t:"13:57", q:"What two kinds of choice does a build configuration like \"Debug | Win32\" encode?", a:"Debug vs. Release (how the code is built: unoptimized with debug help vs. optimized) and the platform (Win32 = 32-bit x86, x64 = 64-bit). Same source, different output."},
 {t:"15:16", q:"Give Casey's general definition of compilation, then what it means specifically for C.", a:"Generally: translating something from one format into another. For C: parse the text, understand what it means, and produce machine code for the target CPU."},
 {t:"16:28", q:"Why can't one compiled program run on every CPU?", a:"Compilation produces instructions for a specific processor family (x86, x64, ARM…). Each family has its own instruction encoding, so the bytes made for one aren't valid instructions for another.", hint:"Look back at the Compiler Explorer experiment."},
 {t:"14:25", q:"Why might a game have a Debug build with extra code in it?", a:"Developer builds carry test code, debug menus, editors and checks that help you develop, but you don't want them, or their cost, in the shipped Release build."}
],
cards:[
 ["**Compilation**, in one sentence","Translating source text into machine code for a specific target CPU (parse → understand → emit)."],
 ["Debug vs. Release","Debug: unoptimized, debuggable, extra checks. Release: optimized, fast, hard to step through."],
 ["Win32 vs. x64 platform","32-bit x86 code vs. 64-bit x64 code. Same C, different machine instructions."],
 ["Where do compile errors come from?","The compiler failing to parse or make sense of the text (syntax, unknown names, wrong types)."]
],
code:`<p>What Casey's output window shows, annotated (the wording differs a little in modern VS):</p>
<pre><code>1>------ Build started: Project: test, Configuration: Debug Win32 ------
   └ project name    └ which build (Debug|Release) and platform (Win32|x64)
1>Compiling...
1>test.cpp            ← each source file being translated
1>test.cpp(1) : error C2146: syntax error ...
   └ file(line) : error Cxxxx = a COMPILER error (C prefix)
========== Build: 0 succeeded, 1 failed, 0 up-to-date, 0 skipped ==========</code></pre>
<p>Learn the <b>C</b> in <code>C2146</code>. In block 5 you'll see an <b>LNK</b> prefix instead, and that one letter tells you which stage failed.</p>`,
why:`<p>Handmade Hero builds in Debug on purpose for most of the series, so the debugger can step line by line. Casey turns optimization on later and shows how much faster the code gets. Knowing what a configuration changes is what lets you reason about why the same code is 10× slower in Debug.</p>
<p>From the CPU's side: the compiler is the <i>only</i> thing standing between your intent and the machine. The habit of asking "what instructions did my C become?" is the habit Handmade Hero builds from Day 2 onward, and it's what separates programmers who can make code fast from those who can't.</p>`},

/* ============ 4 ============ */
{id:"b04", title:"Excursion: processors, cores, hyperthreads", start:"16:55", end:"23:10",
summary:"The \"1>\" in front of each output line sends Casey off on a tangent. He opens Task Manager and explains physical processors, cores and hyperthreads, the units that show up as \"logical processors\". He comes back to say that compilers can run several jobs in parallel, and the number tags which job printed each line.",
watchFor:[
 "At 17:22: Ctrl+Shift+Esc opens Task Manager. One graph per **logical processor**.",
 "At 18:08: physical processors are chips in sockets. Most PCs have one; servers can have many.",
 "At 18:52: a **core** is a unit inside a chip that can do the work of a standalone CPU.",
 "At 20:08: **hyperthreads**: one core holds the state of more than one running thread and switches between them.",
 "At 23:21: why this matters for the build: compilers use several logical processors, and \"1>\" says which job printed the line."
],
deferred:["Cores and hyperthreads in depth (17:57). \"More later on in the actual series.\" Handmade Hero's multithreading arc starts around Day 122.","What a core's state is: what it was running, where it is (20:40). \"We'll get into what all of those are in detail later.\" Registers and the instruction pointer arrive on Intro to C Day 2."],
explain:`<h3>The hierarchy</h3>
<pre><code>Machine
 └─ Socket / physical CPU   (Casey's Xeon box: 2 of these)
     └─ Core                (a full execution engine: math units, memory units…)
         └─ Hardware thread (hyperthread / SMT: a second saved "who am I running" state)
             = what Windows shows as one "logical processor"</code></pre>
<p>Casey's machine has two Xeon W5580 chips. Each has 4 cores, and each core runs 2 hyperthreads, so 2 × 4 × 2 = <b>16 logical processors</b>: the 16 little graphs in his Task Manager.</p>
<h3>One correction to keep in mind</h3>
<p>Casey describes a hyperthreaded core as running only one of its states "at a given time" and switching quickly. That's a fair first picture, and he says there's "tons more to talk about". On modern chips, instructions from both hardware threads are usually <b>in flight in the same core at the same time</b>, sharing its execution units. When one thread stalls (for example, waiting on memory), the other keeps those units busy. That's why a hyperthread doesn't count as a whole extra core: two threads on one core usually finish somewhat faster than one, but nowhere near twice as fast.</p>
<h3>Back to the build</h3>
<p>Compiling many files is easy to split up. Each .cpp can be compiled on its own (block 5 shows why), so the compiler can farm files out to different logical processors. The <code>1&gt;</code> prefix identifies which project build or job produced the line. With one file you only ever see <code>1&gt;</code>.</p>`,
experiment:`<ol><li>Press <b>Ctrl+Shift+Esc</b> → Performance → CPU. Modern Windows prints <b>Sockets</b>, <b>Cores</b> and <b>Logical processors</b> at the bottom right, the numbers Casey couldn't find in 2014. Write down your three numbers and check: logical ÷ cores = threads per core.</li>
<li>Right-click the graph → <i>Change graph to → Logical processors</i> to get Casey's grid of per-thread graphs.</li>
<li>Optional deeper look: run Sysinternals <a href="https://learn.microsoft.com/en-us/sysinternals/downloads/coreinfo" target="_blank" rel="noopener">Coreinfo</a> in a terminal. Its map shows which logical processors share a physical core (marked with <code>*</code>).</li>
<li>Or in PowerShell: <code>Get-CimInstance Win32_Processor | Select Name,NumberOfCores,NumberOfLogicalProcessors</code></li></ol>`,
questions:[
 {t:"17:41", q:"What does each small graph in Task Manager's CPU view represent?", a:"One logical processor: a unit Windows can schedule a thread on. Usually a hardware thread (hyperthread) of a core."},
 {t:"18:52", q:"What is a core, compared with a physical processor?", a:"A physical processor is the chip in the socket. A core is an execution unit inside that chip, able to do the work of a standalone CPU (math units, memory addressing and so on). One chip holds several cores."},
 {t:"20:08", q:"What is a hyperthread, and why does it look like a separate processor to Windows?", a:"A core keeps the state of more than one running thread (what it's running, where it is in the program) and runs both through the same execution hardware. Because each state can run a program, the OS treats each as a logical processor.", hint:"What does the core remember about each thing it's running?"},
 {t:"21:56", q:"Casey's machine: 2 sockets, 4 cores per chip, 2 hardware threads per core. How many graphs in Task Manager?", a:"2 × 4 × 2 = 16 logical processors, so 16 graphs."},
 {t:"23:43", q:"Back to the build log: what does the \"1>\" prefix mean, and why would you see \"2>\" or \"3>\"?", a:"It tags which build job produced the line. With bigger builds (several projects or many files) the build tools run jobs in parallel on several logical processors and you see different numbers."}
],
cards:[
 ["Physical processor vs. core vs. hyperthread","Chip in the socket → full execution engine inside it → extra thread state sharing one core's hardware."],
 ["What is a **logical processor**?","Anything the OS can schedule a thread on, usually one hardware thread (hyperthread) of a core."],
 ["Is a hyperthread as good as an extra core?","No. It shares the core's execution units. It helps mostly by filling idle slots, for example while the other thread waits on memory."],
 ["Logical processors = ?","sockets × cores per socket × threads per core."],
 ["Why can compilers use many cores easily?","Each .cpp file compiles independently, so files can be compiled in parallel."]
],
code:`<p>No C code here. This is the "code" of the topic: the multiplication that turns Task Manager's numbers into a picture of your hardware.</p>
<pre><code>logical_processors = sockets * cores_per_socket * threads_per_core
// Casey:  16  =  2 * 4 * 2
// yours:  __  =  _ * _ * _</code></pre>`,
why:`<p>This is Casey's first "CPU first" tangent, and it sets the tone for the series. Handmade Hero later splits rendering work across all of these logical processors (the multithreading arc around Day 122) and has to care about which threads share a core. Programmers who think of "the CPU" as one thing that runs one line at a time can't make that kind of decision.</p>
<p><b>Lasting value:</b> clock speeds have barely grown in 15 years. Almost all new performance comes from more cores and more work per core. Knowing the core/thread hierarchy is now basic literacy for anyone who cares about speed.</p>`},
]};

window.STUDY.blocks.push(
/* ============ 5 ============ */
{id:"b05", title:"Errors, object files and the linker", start:"23:10", end:"32:17",
summary:"The nonsense file fails to compile. Casey types the smallest valid code (an empty function), and the build gets further: past the compiler and the resource compiler, to the linker. He explains why builds are split into compile and link, then reads the first link error: unresolved external symbol _WinMain@16.",
watchFor:[
 "At 24:19 to 24:37: a compile error. Double-clicking it jumps to the line.",
 "At 25:50: the \"rote code\" he types: `void foo(void) {}`. Simple, and it compiles.",
 "At 26:24: the resource compiler packs icons and similar data into the .exe. Ignore it for now.",
 "At 27:52: each .cpp becomes an **intermediate file** (an object file). Only changed files get recompiled.",
 "At 28:49 to 29:45: the **linker** gathers the object files, **resolves references** between them, and packages one .exe.",
 "At 30:23: linker errors have no line number. They name a symbol and the function that referenced it.",
 "At 31:06: `unresolved external symbol _WinMain@16 referenced in function _tmainCRTStartup`."
],
pauseAt:{t:"31:16", do:"Before Casey explains it, try to decode the error yourself: who wants WinMain, and why can't the linker find it?"},
deferred:["The resource compiler and icons (27:02). \"You do need to know how to do eventually.\"","Why you can't simply ship the .exe (29:58). That's the C runtime and Microsoft's redistributables, held off \"to focus on the basics\".","Reading cryptic linker errors (30:52). \"We'll get to what all those mean and how to suss them out later.\""],
explain:`<h3>Two stages, two kinds of error</h3>
<pre><code>test.cpp ──cl (compile)──▶ test.obj ─┐
foo.cpp  ──cl (compile)──▶ foo.obj  ─┼─ link ──▶ test.exe
bar.cpp  ──cl (compile)──▶ bar.obj  ─┘     ▲
                                  (+ libraries: CRT, kernel32.lib …)</code></pre>
<ul><li><b>Compiler</b>: works on <i>one</i> .cpp at a time, a <b>translation unit</b>. Output: an <b>object file</b> (<code>.obj</code>) holding mostly finished machine code plus a list of names it <i>defines</i> and names it <i>needs</i> but couldn't find in this file.</li>
<li><b>Linker</b>: reads all the .obj files and libraries, matches every "needed" name to a "defined" name, patches the real addresses into the code, and writes the .exe.</li></ul>
<p>Why split it? Casey's reason: if you change one file out of hundreds, only that file is recompiled. The linker then quickly stitches the old and new .obj files together. He adds that it's partly for legacy reasons. Handmade Hero later compiles everything as a single translation unit (a "unity build"), because for one person's project that's simply faster.</p>
<h3>Reading the error</h3>
<p><code>unresolved external symbol _WinMain@16 referenced in function _tmainCRTStartup</code></p>
<ul><li><b>symbol</b>: a name the linker deals in (a function or a global variable).</li>
<li><b>external</b>: defined outside the translation unit that uses it.</li>
<li><b>unresolved</b>: the linker searched every .obj and library and found no definition.</li>
<li><b>referenced in _tmainCRTStartup</b>: someone else's code (startup code that comes with the compiler) calls WinMain. You didn't write that call. Casey promises at 35:40 that the reason is a surprise for Day 2.</li></ul>
<div class="callout"><b>Prerequisite, explained now: what's the "_" and "@16"?</b> On 32-bit Windows, functions using this calling style get their names <b>decorated</b>: a leading underscore, plus <code>@</code> and the number of bytes of arguments. WinMain takes 4 arguments × 4 bytes = 16. That's all you need today. Calling conventions themselves are parked (block 10). On an <b>x64</b> build there's no decoration, so modern VS prints something like <code>unresolved external symbol WinMain referenced in function "int __cdecl invoke_main(void)"</code>. Same error, newer startup code.</div>`,
experiment:`<p><b>Split the two stages by hand</b> in the x64 Native Tools Command Prompt, in a scratch folder:</p>
<ol><li>Create <code>test.cpp</code> containing only <code>void foo(void) {}</code>.</li>
<li><code>cl /c test.cpp</code>. The <code>/c</code> means compile only. You get <code>test.obj</code>, no .exe and no error. The compiler is happy.</li>
<li><code>dumpbin /symbols test.obj</code>. Find a line containing <code>foo</code>. It's marked <code>External</code> and sits in a section (<code>SECT1</code>…), which means this .obj <i>defines</i> it.</li>
<li><code>link test.obj /subsystem:windows</code>. Now you get Casey's error, <b>LNK2019 / LNK1120</b>: the startup code wants <code>WinMain</code> and nobody defined it.</li>
<li>In Visual Studio, build the same thing (with SubSystem set to Windows from block 2) and compare the output with Casey's at 31:06.</li></ol>`,
questions:[
 {t:"27:52", q:"What does the compiler produce for each .cpp file, and why is that useful?", a:"An intermediate object file (.obj) with mostly translated machine code. If a .cpp doesn't change, its .obj can be reused, so only changed files get recompiled."},
 {t:"29:05", q:"Why can't the compiler resolve a call to a function defined in another .cpp file?", a:"It only sees one translation unit at a time, so it doesn't know where (or whether) the other function exists. It leaves a reference for the linker, which sees every object file and can match them up.", hint:"How many files does the compiler look at in one go?"},
 {t:"29:45", q:"List the linker's three jobs, as Casey describes them.", a:"Gather all the object files (and libraries), resolve the references where they point to each other, and package everything into one .exe."},
 {t:"31:24", q:"Decode \"unresolved external symbol _WinMain@16 referenced in function _tmainCRTStartup\" word by word.", a:"A symbol (name) called WinMain, defined outside the unit that uses it (external), couldn't be found anywhere (unresolved). The code that needs it is _tmainCRTStartup, startup code supplied with the compiler. The _ and @16 are 32-bit name decoration (16 bytes of arguments)."},
 {t:"30:23", q:"How do you tell a compile error from a link error in the output window?", a:"Compile errors have a file(line) location and a C#### code. Link errors come from the linker, have an LNK#### code, usually no line number, and are about symbols: unresolved or defined twice."}
],
cards:[
 ["What is an object file (.obj)?","The compiler's output for one .cpp: machine code plus a table of symbols it defines and symbols it still needs."],
 ["What is a **translation unit**?","One .cpp file (after its #includes are pasted in), which the compiler translates on its own."],
 ["Linker's job in 3 verbs","Gather object files → resolve references → package one .exe."],
 ["**Unresolved external symbol** means…","Something references a name that no object file or library defines."],
 ["C2xxx vs. LNK2xxx error codes","C = compiler, about the text of one file. LNK = linker, about symbols across files."],
 ["Why is it **_WinMain@16** on 32-bit?","Name decoration: leading _ and @ plus the argument bytes (4 args × 4 bytes). No decoration on x64."]
],
code:`<p>The "rote code" Casey types at 26:02. It's the smallest thing that gets past the compiler:</p>
<pre><code>void foo(void)
{
}</code></pre>
<p>It's valid C, so <code>test.obj</code> gets made. But nothing in it is called <code>WinMain</code>, so the linker fails:</p>
<pre><code>1>Linking...
1>MSVCRTD.lib(crtexew.obj) : error LNK2019: unresolved external symbol _WinMain@16
  referenced in function ___tmainCRTStartup
     └ the CRT startup .obj (inside a library) is the one asking for WinMain
1>test.exe : fatal error LNK1120: 1 unresolved externals</code></pre>
<p>Notice <code>crtexew.obj</code>: the code that wants WinMain lives in a <b>library</b> you never asked for. That's the thread Casey pulls on Day 2.</p>`,
why:`<p>Compile vs. link is the most useful debugging split in native programming. "Identifier not found" is a compile problem: fix the text or add a declaration. "Unresolved external" is a link problem: a definition is missing, a .lib isn't linked, or a name doesn't match. Telling them apart instantly saves hours.</p>
<p>Handmade Hero builds directly on this. Casey's <code>build.bat</code> calls <code>cl</code> with linker options, links <code>user32.lib</code> and <code>gdi32.lib</code> by hand when it needs them, and later compiles the game into a DLL that's linked at runtime so code can be hot-reloaded. Each of those is just "who resolves which symbol, and when".</p>`},

/* ============ 6 ============ */
{id:"b06", title:"How Windows starts your program: the entry point", start:"32:17", end:"40:09",
summary:"Casey asks how Windows knows where to start running our code, given that Windows and our program were never linked together. The answer: the .exe file format holds an entry address the linker writes, found by a predefined name, WinMain. He looks WinMain up on MSDN, copies its prototype, builds with F7, and hits errors that need windows.h.",
watchFor:[
 "At 32:30: the CPU is already running Windows. How does Windows hand control to *our* code?",
 "At 33:19: nesting dolls: kernel, BIOS. Only the code at the very bottom is fully linked.",
 "At 34:04 to 34:52: an .exe is a file with a format. Windows reads where to start, loads it into memory, and tells the CPU to jump there.",
 "At 35:06: we mark the start with a **predefined name**. A linker setting could change it, but nobody does.",
 "At 35:40: \"I'm going to say it's WinMain… it's not actually WinMain.\" Remember this.",
 "At 35:58 to 37:20: MSDN, now called Microsoft Learn, as the reference for everything Windows-specific.",
 "At 38:05: **F7** builds (in VS 2008's keyboard layout), and building auto-saves your files."
],
deferred:["The work Windows does on an .exe while loading it (34:31): \"which we'll talk about again in a little bit\".","Why WinMain isn't really the entry point (35:40). Promised for the next stream.","Function prototypes (37:30): \"we'll get into a lot of stuff with these later\". Introduced in block 8, completed in block 11."],
explain:`<h3>The handoff problem</h3>
<p>Linking (block 5) resolves every reference <i>inside</i> your program. But Windows was built years before your program, and the two were never linked together. So how does Windows know which byte of your code to run first?</p>
<h3>Answer: the executable file format</h3>
<p>An .exe is a file in a documented format, PE (Portable Executable) on Windows. Besides your machine code, its header carries data, including an <b>AddressOfEntryPoint</b>. Starting a program goes roughly like this:</p>
<ol><li>Windows opens the .exe and reads its headers.</li>
<li>It maps the code and data into memory and does some fix-up work that Casey parks.</li>
<li>It sets the CPU running at <i>image base + AddressOfEntryPoint</i>.</li></ol>
<p>The <b>linker</b> writes that address. To know which function you mean, it looks for a <b>predefined name</b>. For windowed programs, Casey says that name is <code>WinMain</code>. You can override it with a linker switch (<code>/ENTRY</code>, the "Foo" he mentions at 35:24), but almost nobody does.</p>
<h3>Turtles all the way down</h3>
<p>Only the very first code is truly self-contained. The firmware (BIOS or UEFI) loads the OS kernel. The kernel loads your program, using the same idea each time: a known format and a known place to start.</p>
<h3>Your new reference manual</h3>
<p>MSDN is now <b>Microsoft Learn</b>. Search "WinMain function" to find the page Casey reads. It's where you look up every Windows function in Handmade Hero. Casey's advice: nobody remembers this, everyone looks it up.</p>`,
experiment:`<ol><li>Look at the real entry address. After block 8 your project builds. Run <code>dumpbin /headers test.exe</code> in the Native Tools prompt and find <b>entry point</b> under OPTIONAL HEADER VALUES, plus <b>subsystem</b> (Windows GUI). Those are the two header fields this block is about.</li>
<li>Want a picture instead? Open the .exe in <a href="https://github.com/hasherezade/pe-bear" target="_blank" rel="noopener">PE-bear</a> (open source) → Optional Header → <code>AddressOfEntryPoint</code>.</li>
<li>Open <a href="https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-winmain" target="_blank" rel="noopener">WinMain on Microsoft Learn</a>. Copy the prototype into <code>test.cpp</code> below <code>foo</code>, add a body <code>{ }</code>, and build. You should get Casey's next errors: Windows types like <code>HINSTANCE</code> are unknown. Keep the errors. They set up block 7.</li></ol>`,
questions:[
 {t:"32:44", q:"Why can't the linker just connect our program to Windows the way it connects our own files?", a:"Windows isn't part of our build. It was compiled and linked separately, long before. Our program and Windows were never linked together, so another mechanism is needed to hand control to our code."},
 {t:"34:25", q:"Step by step, how does Windows start running an .exe?", a:"It reads the executable file format, loads the file into memory (doing some fix-up work), then uses information the linker stored in the file (the entry point address) to tell the CPU where to jump and start executing."},
 {t:"35:06", q:"How do we tell the linker which function is the start? Can it be changed?", a:"By using the predefined name it looks for (WinMain for windowed programs, as Casey puts it for now). A linker setting can name a different function, but almost nobody changes it."},
 {t:"33:30", q:"Casey calls it \"Russian nesting dolls\". What's at the bottom, and why is it the only fully linked program?", a:"The BIOS/firmware loads the OS kernel, which loads programs. Something like a kernel contains everything itself, and even it gets started by the firmware. Every layer above is started by the one below through a known file format and entry point."},
 {t:"38:20", q:"Why did the yellow bars turn green when Casey pressed F7?", a:"Visual Studio saves all unsaved files before building, by default. You can change this in Tools → Options (\"Before building: save all changes\")."}
],
cards:[
 ["What is an **entry point**?","The address where the CPU starts executing a program. The linker writes it into the .exe header."],
 ["What file format are Windows .exe files?","PE (Portable Executable): headers (including entry point and subsystem) plus code and data sections."],
 ["Who decides the entry point, and how?","The linker, by finding a predefined symbol name (overridable with /ENTRY)."],
 ["Where do you look up Windows functions?","Microsoft Learn (formerly MSDN), e.g. \"WinMain function\"."],
 ["What tool prints an .exe's headers?","`dumpbin /headers file.exe` (or PE-bear for a GUI)."]
],
code:`<p>The WinMain prototype as Casey copies it from MSDN at around 37:44, with the annotations he removes in block 7:</p>
<pre><code>int CALLBACK WinMain(
  _In_ HINSTANCE hInstance,
  _In_ HINSTANCE hPrevInstance,
  _In_ LPSTR     lpCmdLine,
  _In_ int       nCmdShow
);</code></pre>
<p>Pasted into <code>test.cpp</code> with a body, then built: the compiler stops at <code>HINSTANCE</code>. Nothing has told it what that word means. Block 12 shows the fix, <code>#include &lt;windows.h&gt;</code>, which Casey adds quickly at 39:35.</p>`,
why:`<p>"Where does my program actually start?" is a question most programmers never ask, and it's central to Handmade Hero. Casey keeps pulling on this thread: WinMain isn't the real entry point (Day 2), the C runtime runs code before yours, and much later Handmade Hero can drop the C runtime entirely. Each step is about taking control of what happens before your first line runs.</p>
<p>Knowing the PE format also explains real-world things: why antivirus tools inspect headers, how game anti-cheat and mod loaders work, and what a "loader" is when your program fails before main.</p>`},

/* ============ 7 ============ */
{id:"b07", title:"Windows types, Hungarian notation, _In_", start:"40:09", end:"46:15",
summary:"Casey decodes the strange words in WinMain's prototype. HINSTANCE and LPSTR are names Windows made up, unreadable even to an experienced C programmer who hasn't used Windows. He explains Hungarian notation (H = handle, LP = long pointer, P = pointer) and pleads with you not to use it. Then he explains the _In_ annotations and deletes them.",
watchFor:[
 "At 41:06: \"even an experienced C programmer … would not know what LPSTR meant\". Not knowing is normal.",
 "At 41:43: `HINSTANCE` refers to a running program. `LPSTR` is a pointer to a string.",
 "At 42:37: Hungarian notation: prefixes that encode what something is.",
 "At 43:45: **H = handle**: something you use to talk to Windows about an object in an opaque way.",
 "At 43:59: \"Please don't do this. This is a terrible idea.\"",
 "At 45:29: `_In_` marks data flowing **into** Windows; `_Out_` marks data flowing back to you."
],
deferred:["What these types really are and how they're defined (41:01): \"I'll get into what these specifically mean in a bit\". Typedefs and macros come with the windows.h tour.","Pointers (44:16): \"which we'll talk about in a while\". Intro to C Day 3."],
explain:`<h3>Where these words come from</h3>
<p>Keywords like <code>int</code> and <code>void</code> belong to C itself. <code>HINSTANCE</code>, <code>LPSTR</code> and friends are <b>names Windows defined</b> in its header files. They're new names for basic types. If you don't know them, that's not a gap in your C. Windows made them up.</p>
<h3>Hungarian notation, decoded</h3>
<table><thead><tr><th>Prefix</th><th>Meaning</th><th>Example</th></tr></thead><tbody>
<tr><td class="mono">H</td><td>Handle: an opaque ID you pass back to Windows</td><td class="mono">HINSTANCE, HWND</td></tr>
<tr><td class="mono">P</td><td>Pointer (an address in memory)</td><td class="mono">PVOID</td></tr>
<tr><td class="mono">LP</td><td>"Long" (far) pointer, from 16-bit Windows's segmented memory. Today it's just a pointer.</td><td class="mono">LPSTR</td></tr>
<tr><td class="mono">STR</td><td>String (a run of characters)</td><td class="mono">LPSTR</td></tr>
<tr><td class="mono">n / i</td><td>A number</td><td class="mono">nCmdShow</td></tr></tbody></table>
<p>Casey wasn't sure what L meant. The answer is the 16-bit-era "long" or "far" pointer that could reach outside the current memory segment. That distinction disappeared in 32-bit Windows, but the names stayed. That's Casey's point: the prefixes go stale and just add noise.</p>
<div class="callout"><b>Prerequisite, explained now: what's a handle?</b> Windows owns the real data about your running program (its memory, its windows). It won't give you that data. It gives you a <b>handle</b>: a value meaning "the thing Windows knows as #42". You pass the handle back whenever you ask Windows to do something with that thing. It's like a coat-check ticket: useless on its own, and it means something only to the person who gave it to you.</div>
<h3>The _In_ annotations</h3>
<p><code>_In_</code> and <code>_Out_</code> come from Microsoft's <b>SAL</b> (Source-code Annotation Language). They tell readers and analysis tools which way data flows: into Windows, or back out to you. They're not core C. Casey's "middle compiler" is the <b>MIDL</b> compiler, used for COM/OLE interface files. Casey deletes the annotations because the compiler rejected them in his setup. With <code>windows.h</code> included they usually compile, but they don't change what the program does.</p>`,
experiment:`<ol><li>In Visual Studio, put the cursor on <code>HINSTANCE</code> and press <b>F12</b> (Go To Definition). Follow it until you reach a <code>typedef</code> or <code>DECLARE_HANDLE</code>. Don't try to understand it all yet. Just see that it's ordinary code in a header, not magic.</li>
<li>Do the same with <code>LPSTR</code>. You should land on something like <code>typedef CHAR *LPSTR;</code>: "LPSTR" is just a nickname for "pointer to char".</li>
<li>Name-decoding drill: from the prefixes alone, guess what these are: <code>HWND</code>, <code>LPCSTR</code>, <code>HDC</code>, <code>LPVOID</code>. Check one on Microsoft Learn.</li></ol>`,
questions:[
 {t:"41:06", q:"Why would an experienced C programmer who's never used Windows not understand LPSTR or HINSTANCE?", a:"They aren't part of C. Windows defined them in its own headers to name specific things in the operating system. Knowing C doesn't tell you Windows's naming."},
 {t:"43:45", q:"What does the H prefix mean, and what does a handle let you do?", a:"Handle: an opaque reference to something Windows manages. You pass it back to Windows to refer to that thing, for example HINSTANCE to refer to your running program."},
 {t:"43:23", q:"What is Hungarian notation, and why does Casey call it a terrible idea?", a:"Prefixing names with letters that encode what the thing is (p for pointer, h for handle…). The prefixes don't help, make code harder to read, and go stale: LP still says \"long pointer\" decades after that stopped meaning anything.", hint:"Think about LP today."},
 {t:"45:29", q:"What does _In_ mean on a parameter, and does it change what the code does?", a:"It's an annotation (SAL) saying data flows into the function (to Windows), as opposed to _Out_ for data coming back. It's for documentation and analysis tools, not program behavior."}
],
cards:[
 ["`HINSTANCE`","A handle referring to a running program (an instance of an executable in memory)."],
 ["`LPSTR`","\"Long pointer to string\": just a pointer to characters (char *)."],
 ["**Handle**","An opaque ID Windows gives you for something it manages. You hand it back to refer to that thing."],
 ["Hungarian notation","Prefixing names with type letters (h, p, lp, n…). Casey: please don't."],
 ["`_In_` / `_Out_`","SAL annotations: data flows into the call / out of the call. No runtime effect."]
],
code:`<p>The prototype after Casey deletes the annotations at around 46:08, read line by line:</p>
<pre><code>int CALLBACK WinMain(
  HINSTANCE hInstance,      // H = handle → "this running program"
  HINSTANCE hPrevInstance,  // legacy, always 0 today (block 10)
  LPSTR     lpCmdLine,      // LP STR = pointer to text: the command line
  int       nCmdShow)       // n = number: show normal, minimized or maximized
{
}</code></pre>
<p>Notice that Hungarian notation shows up twice: in the <b>types</b> (HINSTANCE, LPSTR) and in the <b>parameter names</b> (hInstance, lpCmdLine). Casey keeps the names in his code because they come straight from the docs.</p>`,
why:`<p>Most real-world C code is code <i>someone else</i> wrote, full of their conventions: Win32's, Linux kernel style, a game engine's macros. Casey models the right attitude here. Unknown names aren't a sign you're missing something deep. Look them up and decode them, then decide for yourself whether the convention is worth copying.</p>
<p>Handles come up all through Handmade Hero: <code>HWND</code> for the window, <code>HDC</code> for drawing, file handles, thread handles. "Opaque ID you pass back to the owner" is also how most operating system APIs, graphics APIs and game engine resource systems work.</p>`},

/* ============ 8 ============ */
{id:"b08", title:"First run, OutputDebugStringA, functions", start:"46:15", end:"54:52",
summary:"The program builds and runs under the debugger. It does nothing and exits. Casey adds one line, OutputDebugStringA(\"...\"), and text appears in the Output window. Then he uses the empty foo function to teach functions: definition, call, return type, parameters, signature vs. body, and comments.",
watchFor:[
 "At 46:32: Debug → **Start Debugging** runs the program. It starts and exits at once, because it does nothing.",
 "At 46:56: the Output window lines (\"Loaded … .dll\") come from the **debugger**.",
 "At 47:44: our first visible output, printed with `OutputDebugStringA`.",
 "At 49:35 to 49:52: move the line into `foo`, and output disappears. Call `foo();`, and it comes back.",
 "At 50:28: `void` before the name = returns nothing. At 51:22: `(void)` = takes nothing.",
 "At 52:10: **signature/prototype** (the first line) vs. **body** (the braces).",
 "At 52:39: comments: `//` to end of line, `/* … */` across lines."
],
pauseAt:{t:"49:40", do:"Before Casey calls foo(): predict why the output vanished. Then check."},
deferred:["What the \"A\" in OutputDebugStringA means (54:21). He says \"in a second\" but doesn't get to it. Intro to C Day 2 at 4:00 (ASCII vs. Unicode).","How OutputDebugString reaches the debugger (55:18): \"debugging services … more in-depth later\"."],
explain:`<h3>Running under the debugger</h3>
<p><b>Start Debugging</b> (F5) launches your .exe with the debugger attached. Your WinMain does nothing, returns, and the program ends, so all you see is the debugger's log of the DLLs Windows loaded for you.</p>
<h3>OutputDebugStringA</h3>
<p>A Windows function that sends a piece of text to whatever debugger is attached. Visual Studio shows it in the Output window. With no debugger attached, the text goes nowhere you can see. It's Handmade Hero's first logging tool.</p>
<h3>Functions</h3>
<pre><code>void      foo   (void)   ← signature / prototype
 │         │      └ parameters: what the caller gives it (void = nothing)
 │         └ name
 └ return type: what it gives back to the caller (void = nothing)
{
    OutputDebugStringA("...");   ← body: runs each time foo is called
}</code></pre>
<ul><li><b>Definition</b> = prototype + body: the whole function.</li>
<li><b>Call</b> = <code>foo();</code> runs the body at that spot, then continues after the call.</li>
<li>Code inside a function that's never called <b>never runs</b>. That's what Casey's vanishing-output demo shows.</li></ul>
<div class="callout"><b>What a call is at the CPU level (preview only):</b> the CPU jumps to the function's first instruction and, at the end, jumps back to just after the call. How it remembers where "back" is uses the stack, which is parked for Intro to C Day 3. Today, just hold "a call is a jump there and back".</div>
<h3>Comments</h3>
<p><code>//</code> ignores the rest of the line (added in C++, now in C too). <code>/* … */</code> ignores everything between the markers, across lines. The compiler throws comments away. They're notes for people.</p>`,
experiment:`<ol><li>Type Casey's program from the code step yourself, from scratch. Don't paste it. Press <b>F5</b> and find your sentence in the <b>Output</b> window (View → Output, "Show output from: Debug").</li>
<li>Repeat his demo: move the <code>OutputDebugStringA</code> line into <code>foo</code>, run, and confirm nothing prints. Add <code>foo();</code> to WinMain and run again.</li>
<li>Call <code>foo();</code> <b>three times</b>. How many lines print? That's reuse.</li>
<li>Now run the .exe <b>without</b> the debugger (Ctrl+F5, or double-click it in Explorer) with Sysinternals <a href="https://learn.microsoft.com/en-us/sysinternals/downloads/debugview" target="_blank" rel="noopener">DebugView</a> open. Your text shows up there. That shows the text goes to whatever debugger or listener is attached, not specifically to Visual Studio.</li>
<li>Set a breakpoint (F9) on the <code>foo();</code> line and press F5. Press <b>F11</b> to step into foo and <b>Shift+F11</b> to step back out. You're watching the "jump there and back".</li></ol>`,
questions:[
 {t:"46:44", q:"The first run showed nothing and exited immediately. Was that a bug?", a:"No. WinMain had an empty body, so the program started, had nothing to do, returned and exited. The Output window lines were the debugger reporting what it loaded."},
 {t:"49:35", q:"Why did the output disappear when Casey moved the line into foo, and what brought it back?", a:"A function's body runs only when the function is called. Nothing called foo, so its line never ran. Adding foo(); inside WinMain called it, and the line ran again.", hint:"Does defining a function run it?"},
 {t:"50:28", q:"In void foo(void), what does each void mean?", a:"The first void (before the name) is the return type: foo gives nothing back to its caller. The void in parentheses is the parameter list: foo takes nothing from its caller."},
 {t:"52:10", q:"What's the difference between a function's signature (prototype) and its body?", a:"The signature describes how to call it: return type, name, parameters. The body, inside the braces, is the code that runs when it's called."},
 {t:"52:39", q:"Name C's two comment styles and how each one ends.", a:"// comments run to the end of the line. /* ... */ comments run until the closing */, across lines if needed."}
],
cards:[
 ["What does `OutputDebugStringA` do?","Sends text to the attached debugger (VS Output window, DebugView). Without a listener you don't see it."],
 ["Function definition =","Prototype (signature) + body."],
 ["What does a function call do?","Runs the function's body at that point, then continues after the call."],
 ["`void` before a function name","The function returns nothing to its caller."],
 ["`(void)` in the parameter list","The function takes no inputs."],
 ["`//` vs `/* */`","// = to end of line. /* */ = until the closing marker, multi-line."],
 ["F5 / Ctrl+F5 / F9 / F11 in VS","Run with debugger / run without / toggle breakpoint / step into."]
],
code:`<p>The complete program at 54:00 (the string as on Casey's screen):</p>
<pre><code>#include &lt;windows.h&gt;

void foo(void)                // signature: returns nothing, takes nothing
{                             // ┐
    OutputDebugStringA("This is the first thing we have actually printed.\\n");
}                             // ┘ body

int CALLBACK WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,
                     LPSTR lpCmdLine, int nCmdShow)
{
    foo();                    // call: jump into foo, run its body, come back
}</code></pre>
<p><b>Read it in execution order:</b> Windows → (startup code) → WinMain → foo → OutputDebugStringA → back to foo → back to WinMain → WinMain ends → the program exits.</p>
<p class="small muted">The <code>\\n</code> at the end is a newline. Escape sequences are covered on Intro to C Day 2 (14:35). Casey's WinMain has no <code>return</code> line. A modern compiler may warn, or refuse with "must return a value". If yours does, add <code>return 0;</code> as WinMain's last line. It promises an <code>int</code>, so it should hand one back.</p>`,
why:`<p><code>OutputDebugStringA</code> is Handmade Hero's first logging tool. Casey uses it for weeks to print timing numbers and debug info, long before the game has any text rendering. "Print to the debugger" is the simplest feedback loop you have.</p>
<p>Functions are the unit of everything that follows. The detail to take away is the execution-order reading in the code step: tracing <i>who calls whom, in what order</i>. That's what the debugger's call stack shows, and the skill you'll need to read any codebase, including one an AI wrote for you.</p>`}
);

window.STUDY.blocks.push(
/* ============ 9 ============ */
{id:"b09", title:"Strings, semicolons, statements, whitespace", start:"54:52", end:"57:23",
summary:"A short syntax block. Call syntax mirrors the prototype. A string is text in double quotes. A semicolon ends a statement. Line breaks and indentation mean nothing to C, but a space inside a name splits it in two.",
watchFor:[
 "At 54:28: a call's parentheses hold what you pass, mirroring the prototype's parentheses.",
 "At 54:51: a basic C string is anything between double quotes.",
 "At 55:30: the semicolon marks the end of one logical piece of code, a **statement**.",
 "At 56:27: the end of a text line means nothing in C (unlike Python).",
 "At 56:54: `OutputDebug StringA`, with a space, breaks: the compiler sees two names."
],
deferred:[],
explain:`<h3>Strings (the Day 1 level)</h3>
<p><code>"like this"</code> is a <b>string literal</b>: text the compiler stores inside your program, which you can pass to functions. What a string really is in memory (bytes, a terminating zero, a pointer to the first character) is built up on Day 2 and Day 3. For now: double quotes make text you can hand to a function.</p>
<h3>Statements and semicolons</h3>
<p>A <b>statement</b> is one complete instruction to the program, like a call. C needs a <code>;</code> to know where each one ends, because line breaks don't count:</p>
<pre><code>foo(); foo();          // two statements on one line: fine
OutputDebugStringA(
    "split across lines"
);                     // one statement over three lines: also fine</code></pre>
<h3>Whitespace</h3>
<p>Spaces, tabs and newlines just separate <b>tokens</b>, the "words" of C. Indentation is purely for human readers. The one rule: whitespace can't go <i>inside</i> a token, because it splits it. <code>OutputDebug StringA</code> becomes the two tokens <code>OutputDebug</code> and <code>StringA</code>, and the compiler complains that it doesn't know <code>OutputDebug</code>.</p>
<div class="callout"><b>Prerequisite, explained now: tokens.</b> Before understanding anything, the compiler chops your text into tokens: names (<code>foo</code>), keywords (<code>void</code>), punctuation (<code>(</code> <code>)</code> <code>{</code> <code>;</code>) and literals (<code>"text"</code>, <code>5</code>). That's the "parse" step from block 3. Whitespace is only there to separate tokens, which is why it doesn't matter anywhere else.</div>`,
experiment:`<ol><li>Delete the <code>;</code> after <code>foo()</code> and build. Read the exact error text, then put it back.</li>
<li>Put all of WinMain on <b>one line</b>. It still builds and runs the same. Undo.</li>
<li>Add a space: <code>OutputDebug StringA(...)</code>. Build and read the error. Casey describes it at 57:01: an unknown identifier.</li>
<li>Put two calls on one line, <code>foo(); foo();</code>, and run. Two lines print.</li></ol>`,
questions:[
 {t:"54:51", q:"How do you write a basic string in C, and what did Casey do with his?", a:"Put the text between double quotes. He passed his string to OutputDebugStringA inside the call's parentheses, so it got printed."},
 {t:"55:30", q:"What does a semicolon tell the compiler?", a:"That a logical piece of code, a statement, is finished. The text line ending doesn't mark that in C."},
 {t:"56:34", q:"Does indentation change what a C program does? Where does whitespace matter?", a:"No. Indentation is only for readers. Whitespace matters only inside what should be one name or token: a space splits it in two (OutputDebug StringA fails)."},
 {t:"56:19", q:"Write one line containing two statements, and explain why that's allowed.", a:"foo(); foo(); is allowed. Statements end at semicolons, not at line breaks, so any number can share a line."}
],
cards:[
 ["String literal","Text in double quotes, stored in the program, e.g. \"hello\"."],
 ["What ends a statement in C?","A semicolon `;`, not the end of the line."],
 ["Does C care about indentation?","No. Whitespace only separates tokens."],
 ["Why does `OutputDebug StringA` fail?","The space splits one name into two tokens, and `OutputDebug` is unknown."],
 ["What is a **token**?","The smallest meaningful piece of C text: a name, keyword, punctuation mark or literal."]
],
code:`<p>The one call statement, tokenized the way the compiler sees it:</p>
<pre><code>OutputDebugStringA ( "This is the first thing we have actually printed.\\n" ) ;
└──── name ──────┘ │ └──────────────── string literal ─────────────────┘ │ │
                   └ open paren                          close paren ──┘ └ end of statement</code></pre>
<p>Six tokens. Every bit of whitespace between them could be removed, or doubled, and the program would be identical.</p>`,
why:`<p>Small block, durable payoff: when you know the compiler reads <i>tokens</i> separated by whitespace, error messages make sense. "Missing ';' before '}'" tells you exactly what the parser expected. Handmade Hero's code style (braces on their own lines, aligned parameters) is Casey's own choice, layered on top of rules that don't care.</p>`},

/* ============ 10 ============ */
{id:"b10", title:"WinMain in detail: int, CALLBACK and the four parameters", start:"57:23", end:"1:03:53",
summary:"Casey walks WinMain's decoration: int as the return type, CALLBACK as a macro that marks a special calling convention, then each parameter: hInstance (a handle to ourselves), hPrevInstance (legacy, ignore it), lpCmdLine (shown via the command prompt and a shortcut's Target field) and nCmdShow (the shortcut's Run: normal/minimized/maximized).",
watchFor:[
 "At 57:34 to 58:01: `int` = this function hands back a whole number (−5, 12…).",
 "At 58:07: `CALLBACK` is a **macro** that expands to special decoration.",
 "At 58:42: Windows and our program were compiled separately, so they must agree on **how functions are called**.",
 "At 59:41: `hInstance` is a handle Windows gives us that refers to our own running program.",
 "At 1:00:32: `hPrevInstance`: completely ignore it.",
 "At 1:01:23 to 1:02:38: `lpCmdLine`, demonstrated with the command prompt and a shortcut's Target field.",
 "At 1:02:46 to 1:03:30: `nCmdShow` = the \"Run: Normal / Minimized / Maximized\" dropdown, passed in as a number."
],
deferred:["Macros (58:18): \"we'll look at those a little bit later on when I dive into this windows.h file\".","Calling conventions, i.e. how C actually generates the call (59:00): \"I think that'll probably be next video\".","Getting hInstance by a back channel (1:00:31): \"we'll cover that later too\". That's GetModuleHandle(0).","Using the command line (1:01:35): \"we will be talking about how to use it later\". Handmade Hero Day 1 lives in it.","nCmdShow in detail (1:03:35). It's used when Handmade Hero opens its window, around Day 2."],
explain:`<h3>int: the return value</h3>
<p>WinMain promises to hand back an <code>int</code>, a whole number. When WinMain returns, that number becomes the program's <b>exit code</b>, which Windows can report. By convention, 0 means "fine".</p>
<h3>CALLBACK: just enough for today</h3>
<p><code>CALLBACK</code> isn't a C keyword. It's a <b>macro</b>, a word that windows.h replaces with other text before compiling. It expands to a marker telling the compiler that this function follows Windows's agreed <b>calling convention</b>: the exact rules for passing arguments and returning values. Casey's reasoning is the part to remember: <i>Windows and your program were compiled separately, so they need a shared agreement</i>. The details are parked. On 32-bit, that agreement is where the <code>@16</code> from block 5 comes from.</p>
<h3>The four parameters</h3>
<table><thead><tr><th>Parameter</th><th>What it is</th><th>Use in a game</th></tr></thead><tbody>
<tr><td class="mono">hInstance</td><td>Handle to <i>our own</i> loaded program</td><td>Passed back to Windows when creating the game window</td></tr>
<tr><td class="mono">hPrevInstance</td><td>Legacy from 16-bit Windows. Always 0 now.</td><td>Ignore it</td></tr>
<tr><td class="mono">lpCmdLine</td><td>The text typed after the program name when it was launched</td><td>Launch options (e.g. a level name)</td></tr>
<tr><td class="mono">nCmdShow</td><td>Number meaning normal / minimized / maximized</td><td>How to first show the window</td></tr></tbody></table>
<p>Casey's point about the command line: even a program never run from a console still receives one, because shortcuts can add text after the program path in their <b>Target</b> field.</p>`,
experiment:`<ol><li>Make the return value visible: end WinMain with <code>return 42;</code>. Open a Command Prompt in the build folder (e.g. <code>x64\\Debug</code>) and run <code>start /wait test.exe</code> then <code>echo %errorlevel%</code>. It prints <b>42</b>, the int you returned.</li>
<li>See lpCmdLine arrive: inside WinMain add <code>OutputDebugStringA(lpCmdLine);</code>. In VS go to Project → Properties → Debugging → <b>Command Arguments</b>, type <code>hello from the command line</code>, and press F5. Your text appears in Output. (Passing a parameter you received to another function is new. It works because both are "pointer to text".)</li>
<li>Recreate Casey's shortcut demo: right-click your .exe → Create shortcut → Properties. Add text after the path in <b>Target</b>, and look at the <b>Run</b> dropdown: that's nCmdShow. Run it with DebugView open to see the text.</li>
<li>Peek at the macro: right-click <code>CALLBACK</code> → Go To Definition. It's <code>#define CALLBACK __stdcall</code>. Note it and move on. It's parked.</li></ol>`,
questions:[
 {t:"57:46", q:"What does the int before WinMain mean, and where does that number go?", a:"WinMain returns an integer to whoever called it. The value becomes the program's exit code (0 conventionally means success)."},
 {t:"58:42", q:"Why does WinMain need special decoration like CALLBACK when foo doesn't?", a:"Windows (through its startup code) calls WinMain, and Windows wasn't compiled with our program. Both sides must agree on how the function is called, and CALLBACK marks that agreed convention. foo is called only by our own code, compiled together, so the defaults are enough.", hint:"Who calls WinMain? Who calls foo?"},
 {t:"58:07", q:"Is CALLBACK a C keyword? What is it?", a:"No. It's a macro defined in Windows headers that gets replaced with a calling-convention marker (__stdcall) before compilation."},
 {t:"59:41", q:"What is hInstance, and why would we ever need it?", a:"A handle to our own running program. We pass it back to Windows when asking for services about our program, for example when creating our window."},
 {t:"1:02:09", q:"A game is never launched from a console. Why might it still get a command line?", a:"Shortcuts (and other launchers) can add text after the program path in their Target field, and that text arrives in lpCmdLine."},
 {t:"1:03:12", q:"Where does the value of nCmdShow come from?", a:"From how the program was launched, for example a shortcut's Run setting (Normal window / Minimized / Maximized), passed in as a number."}
],
cards:[
 ["WinMain's return `int` becomes…","The program's exit code (0 = success by convention)."],
 ["`CALLBACK`","A macro (#define CALLBACK __stdcall) marking the calling convention Windows expects."],
 ["Calling convention, in one line","The agreed rules for how a function receives arguments and returns values."],
 ["`hInstance`","Handle to our own loaded program, passed back to Windows when needed."],
 ["`hPrevInstance`","Legacy from 16-bit Windows, always 0. Ignore it."],
 ["`lpCmdLine`","Text passed after the program name (console or shortcut Target)."],
 ["`nCmdShow`","How the window should first appear (normal/min/max), as a number."]
],
code:`<p>WinMain with every parameter put to use: the experiments above, in one place:</p>
<pre><code>#include &lt;windows.h&gt;

int CALLBACK WinMain(HINSTANCE hInstance,     // "me", as Windows knows me
                     HINSTANCE hPrevInstance, // always 0, ignored
                     LPSTR lpCmdLine,         // e.g. "hello from the command line"
                     int nCmdShow)            // e.g. SW_SHOWNORMAL
{
    OutputDebugStringA("Command line: ");
    OutputDebugStringA(lpCmdLine);            // pass along the text we received
    OutputDebugStringA("\\n");
    return 42;                                // → exit code, see %errorlevel%
}</code></pre>`,
why:`<p>Handmade Hero Day 2 opens the game window with <code>RegisterClass</code> and <code>CreateWindowEx</code>, and the very first field filled in is <code>hInstance</code>. This block is the setup for that.</p>
<p>Casey's "both sides must agree" idea is one of the most general ideas in systems programming. Calling conventions, file formats (block 6), network protocols and GPU command buffers are all contracts between code that was built separately. Bugs live where the two sides disagree.</p>`},

/* ============ 11 ============ */
{id:"b11", title:"Declaration vs. definition: forward declarations", start:"1:03:53", end:"1:07:46",
summary:"Casey deletes foo's definition and gets a **compile** error (identifier not found), not a link error. Why? C++ won't let you use a name it hasn't seen. Then he writes a forward declaration, the prototype ending in a semicolon, and the error turns into a **link** error: the compiler emits the call and leaves the linker a note to patch in the address.",
watchFor:[
 "At 1:04:11: without foo, `foo();` gives \"identifier not found\". That's a compile error.",
 "At 1:04:27: \"Why wasn't that a linker error?\" This is the puzzle of the block.",
 "At 1:05:03: you can't use something before it has been declared. Old C was looser; C++ is strict.",
 "At 1:05:54: **declaration** (signature only, ending in `;`) vs. **definition** (signature + body).",
 "At 1:06:57: with just a declaration, the compile error becomes a link error.",
 "At 1:07:17: \"hey linker, when you find this function, please patch it in here\"."
],
pauseAt:{t:"1:04:33", do:"Pause on Casey's question and answer it yourself before he does. You already have every piece from blocks 5 and 8."},
deferred:[],
explain:`<h3>The rule</h3>
<p>The compiler reads your file <b>top to bottom, once</b>. Before you can call <code>foo</code>, it has to have seen what <code>foo</code> looks like: what it takes and what it returns. Otherwise it can't generate the call.</p>
<h3>Declaration vs. definition</h3>
<pre><code>void foo(void);            // DECLARATION: "foo exists, here's how to call it"
void foo(void) { ... }     // DEFINITION:  the declaration + the actual body</code></pre>
<ul><li>A declaration is enough for the <b>compiler</b> to translate a call: it knows what to pass and what comes back.</li>
<li>Only a definition gives the <b>linker</b> something to point that call at.</li></ul>
<h3>Why the error moved</h3>
<table><thead><tr><th>State of foo</th><th>Compiler</th><th>Linker</th></tr></thead><tbody>
<tr><td>Nothing at all</td><td><b>Error</b>: identifier not found</td><td>never reached</td></tr>
<tr><td>Declaration only</td><td>OK: emits the call and records "needs foo"</td><td><b>Error</b>: unresolved external</td></tr>
<tr><td>Declaration + definition (anywhere in the build)</td><td>OK</td><td>OK: patches in foo's address</td></tr></tbody></table>
<p>This is exactly how one .cpp calls a function defined in <i>another</i> .cpp. Each file declares what it uses, one file defines it, and the linker joins them up. That answers the question from block 5: unresolved externals exist at all <i>because</i> declarations let the compiler move on without the body.</p>
<div class="callout later"><b>C vs. C++:</b> early C let you call an undeclared function and guessed that it returned <code>int</code>. C99 removed that, and C++ never allowed it. Casey's file is .cpp, so it's strict either way.</div>`,
experiment:`<ol><li>Re-run Casey's three states in VS: (a) delete foo entirely → build → read the C3861-style error. (b) Add only <code>void foo(void);</code> above WinMain → build → read the LNK2019 error. (c) Add the definition back, <b>below</b> WinMain this time → it builds. Order no longer matters, because the declaration came first.</li>
<li><b>Watch the "note to the linker".</b> On <a href="https://godbolt.org" target="_blank" rel="noopener">Compiler Explorer</a> (x64 msvc), compile:
<pre><code>void foo(void);
int main(void) { foo(); return 0; }</code></pre>
No error, because Compiler Explorer only compiles and doesn't link. In the output, find <code>call</code> followed by foo's (decorated) name. The compiler produced the call without knowing where foo lives.</li>
<li>Same thing locally: <code>cl /c test.cpp</code> with the declaration only, then <code>dumpbin /symbols test.obj</code>. foo shows as <b>UNDEF External</b>, meaning the .obj needs it but doesn't define it. Compare with block 5, where it had a section number.</li></ol>`,
questions:[
 {t:"1:04:27", q:"After deleting foo, why was \"identifier not found\" a compile error rather than a link error?", a:"In C++ you can't use a name the compiler hasn't seen declared. With no declaration, the compiler can't even translate the call, so it fails before the linker runs."},
 {t:"1:05:54", q:"Define declaration and definition, with an example of each.", a:"Declaration: the signature only, ending in a semicolon (void foo(void);). It says the function exists and how to call it. Definition: the signature plus the body (void foo(void) { ... }). The actual code."},
 {t:"1:07:17", q:"With only a declaration, what exactly does the compiler do with the call to foo?", a:"It generates the call (it knows the arguments and return type from the signature) and leaves a marker in the object file asking the linker to patch in foo's address once it finds the definition.", hint:"Look at the dumpbin experiment: what does UNDEF mean?"},
 {t:"1:05:47", q:"How do forward declarations explain the very existence of unresolved-external link errors?", a:"Because declarations let the compiler accept calls to functions whose bodies it hasn't seen (possibly in other files). If no file ever defines them, only the linker can notice, so the error shows up at link time."},
 {t:"1:06:57", q:"Predict: declare foo, call it, and define foo in a second .cpp in the same project. What happens?", a:"It builds and runs. Each file compiles on its own (the declaration is enough), and the linker finds foo's definition in the other file's .obj and patches the call."}
],
cards:[
 ["Declaration","Signature only, ends in `;`. Tells the compiler how to call it."],
 ["Definition","Signature + body: the actual code the linker can point calls at."],
 ["Undeclared name used → which error?","Compile error (identifier not found)."],
 ["Declared but never defined → which error?","Link error (unresolved external symbol)."],
 ["What does the compiler leave for the linker at a call to a declared-only function?","A relocation/marker: \"patch foo's address here\" (shown as UNDEF in dumpbin /symbols)."],
 ["Does order matter once a declaration is at the top?","No. The definition can come later in the file, or in another file."]
],
code:`<p>Casey's file at 1:07:00, with his comments:</p>
<pre><code>#include &lt;windows.h&gt;

// Function declaration
void foo(void);                 // ← enough for the compiler to emit the call

int CALLBACK WinMain(HINSTANCE hInstance,
                     HINSTANCE hPrevInstance,
                     LPSTR lpCmdLine,
                     int nCmdShow)
{
    foo();                      // compiles; linker must find foo somewhere
}

// (no definition anywhere → LNK2019 unresolved external symbol foo)</code></pre>
<p>Add this anywhere, even in another .cpp, and the build links:</p>
<pre><code>// Function definition
void foo(void)
{
    OutputDebugStringA("This is the first thing we have actually printed.\\n");
}</code></pre>`,
why:`<p>Header files are built on this split. A <code>.h</code> is mostly declarations, so many .cpp files can call the same functions while one .cpp holds the definitions. windows.h (the next block) is thousands of declarations whose definitions live in Windows's own DLLs. Handmade Hero later splits the game into a platform layer and a game layer that talk through a few declared functions. Same mechanism, used on purpose.</p>
<p>Reading a build error and knowing in one second "the compiler doesn't know this name" vs. "the linker can't find this body" is a real professional skill. It's also exactly the error class AI-generated code produces most often: missing includes, missing libraries, functions it invented.</p>`},

/* ============ 12 ============ */
{id:"b12", title:"#include: who defined everything else?", start:"1:07:46", end:"1:11:58",
summary:"Keywords (blue) are built into the language. Everything else, like WinMain's types, CALLBACK and OutputDebugStringA, came from one line: #include <windows.h>. Casey explains that #include literally pastes another file's contents in place, opens windows.h to show it's mostly more includes, and previews Day 2: assembly, linking, the C runtime, and why WinMain isn't really the entry point.",
watchFor:[
 "At 1:07:59: blue keywords (`void`, `int`) work in any C compiler. Everything else had to come from somewhere.",
 "At 1:08:40: `#include` names a file. Forward slashes work everywhere; backslashes only on Windows.",
 "At 1:09:14: \"go get this file and stick the entire contents of it right here.\"",
 "At 1:09:34: right-click → Open Document jumps into the included file.",
 "At 1:09:52: windows.h is mostly *more* includes, so a dozen-line program becomes enormous.",
 "At 1:10:59: the Day 2 preview: assembly, linking, the C runtime library, and WinMain's \"misdirection\"."
],
deferred:["Macros, types and other things in windows.h (1:10:33): \"that we'll get into next week\".","Day 2 preview (1:11:05): stepping into the generated assembly, how linking actually works, the C runtime library, and why WinMain isn't the real entry point."],
explain:`<h3>Two kinds of names</h3>
<ul><li><b>Keywords</b>: <code>void</code>, <code>int</code>, plus punctuation like <code>{ } ( ) ;</code>. These are the language itself, and work on every C compiler.</li>
<li><b>Everything else</b>: <code>HINSTANCE</code>, <code>LPSTR</code>, <code>CALLBACK</code>, <code>OutputDebugStringA</code>, <code>WinMain</code>'s declaration. These are ordinary C declarations and macros written by Microsoft in header files.</li></ul>
<h3>#include is copy-paste</h3>
<p><code>#include</code> isn't really part of C's grammar. It's handled by the <b>preprocessor</b>, a text pass that runs before the compiler proper. It replaces the line with the full contents of the named file, and that file's own <code>#include</code>s get expanded the same way, recursively. What reaches the compiler is one long file: the translation unit from block 5.</p>
<div class="callout"><b>Putting today together:</b> windows.h supplies the <b>declarations</b> (block 11) for <code>OutputDebugStringA</code> and the rest, so the compiler is happy. The <b>definitions</b> live in Windows itself (kernel32.dll), and the linker connects the two through an import library (kernel32.lib) that Visual Studio links by default. Declaration from a header, definition from a library: same mechanism as foo, at a larger scale.</div>
<h3>&lt;angle&gt; vs. "quotes"</h3>
<p><code>#include &lt;windows.h&gt;</code> searches the system and SDK include folders. <code>#include "mine.h"</code> searches next to your file first. Casey doesn't cover this distinction today. It's here so the angle brackets don't puzzle you.</p>`,
experiment:`<ol><li><b>Measure the paste.</b> In the Native Tools prompt: <code>cl /P test.cpp</code>. This writes <code>test.i</code>, your file after preprocessing. Count its lines in PowerShell: <code>(Get-Content test.i).Count</code>. Expect tens of thousands, from a dozen-line file.</li>
<li>Open <code>test.i</code> and search for <code>OutputDebugStringA</code>. You'll find its <b>declaration</b>, a prototype ending in <code>;</code>, exactly like block 11's foo.</li>
<li>Prove that #include is just pasting: make <code>hello.h</code> containing only <code>OutputDebugStringA("pasted!\\n");</code> and write <code>#include "hello.h"</code> as a line <i>inside</i> WinMain's body. Build and run. It prints. (Don't actually write code this way. The point is that it's text substitution.)</li>
<li>See where the definitions come from: open your .exe in <a href="https://github.com/lucasg/Dependencies" target="_blank" rel="noopener">Dependencies</a> (open source) and find <b>KERNEL32.dll</b> → <code>OutputDebugStringA</code> among its imports.</li></ol>`,
questions:[
 {t:"1:07:59", q:"Which names in Casey's program are built into C, and which came from somewhere else?", a:"Built in: keywords like void and int, plus punctuation ({ } ( ) ;). Everything else (HINSTANCE, LPSTR, CALLBACK, OutputDebugStringA, WinMain's declaration) came from windows.h and the files it includes."},
 {t:"1:09:14", q:"What does #include literally do?", a:"Finds the named file and pastes its entire contents in place of the #include line, before compilation. Included files can include more files."},
 {t:"1:09:52", q:"Why is the program Casey compiles much longer than the dozen lines he typed?", a:"windows.h includes many other headers, which include more, and all that text is pasted into the translation unit. The compiler sees tens of thousands of lines."},
 {t:"1:08:55", q:"Why does Casey prefer forward slashes in include paths, even on Windows?", a:"Forward slashes work for includes on every platform. Backslashes only work on Windows."},
 {t:"1:10:33", q:"Tie it all together: windows.h gave the compiler what it needed to call OutputDebugStringA. Where's the actual code, and who connects the two?", a:"windows.h provides only the declaration. The definition is in Windows's own kernel32.dll. The linker resolves it through the kernel32 import library linked by default, and Windows wires it up when it loads the program.", hint:"Block 11: a declaration is enough to compile. Something else has to supply the body."}
],
cards:[
 ["What does `#include \"file\"` do?","Pastes the file's entire contents at that line, before compilation (done by the preprocessor)."],
 ["Keyword vs. header-defined name","Keywords belong to the language. Other names are declarations or macros from included files."],
 ["Why is windows.h so big?","It includes many other headers, which include more, recursively."],
 ["How do you see a file after preprocessing?","`cl /P file.cpp` → writes file.i."],
 ["Where is `OutputDebugStringA` defined?","In Windows's kernel32.dll. windows.h only declares it."],
 ["`<file.h>` vs `\"file.h\"`","Angle brackets: system/SDK include paths. Quotes: next to your file first."]
],
code:`<p>The finished Day 1 program with every line labeled by the block that explains it. Read this once a day for a week.</p>
<pre><code>#include &lt;windows.h&gt;          // b12: paste Windows declarations here (preprocessor)

// Function declaration
void foo(void);               // b11: enough for the compiler to emit a call

int CALLBACK WinMain(         // b06: the name the startup code calls (entry point)
                              // b10: int → exit code; CALLBACK → calling convention
    HINSTANCE hInstance,      // b07/b10: handle to this running program
    HINSTANCE hPrevInstance,  // b10: legacy, always 0
    LPSTR lpCmdLine,          // b07/b10: pointer to command-line text
    int nCmdShow)             // b10: normal/minimized/maximized
{
    foo();                    // b08: call → run foo's body, come back
    return 0;                 // b10: the int WinMain promised (Casey omits it; modern compilers may insist)
}                             // b09: statements end with ';', whitespace is free

// Function definition
void foo(void)                // b08: returns nothing, takes nothing
{
    OutputDebugStringA("This is the first thing we have actually printed.\\n");
                              // b08: declared in windows.h, defined in kernel32.dll
}
// Build: b03 compile → b05 .obj → b05 link → b06 .exe with entry point → Windows runs it</code></pre>`,
why:`<p>Every Handmade Hero file starts with includes, and Casey is unusually careful about them. He keeps windows.h out of the game code entirely, so the game layer never depends on the platform. That design comes later, but it rests on today's idea: an include is a paste, and what you paste defines what your code depends on.</p>
<p><b>Final check for Day 1:</b> close everything, open a blank file, and rebuild this program from memory, including the forward declaration. Then explain out loud what happens from double-clicking the .exe to the text appearing in the debugger. If you can do both, you own Day 1.</p>`}
);

window.STUDY.parked = [
 {t:"1:40", what:"The `?:` operator and how the stack works", where:"Not in Handmade Hero unless relevant, so he made this series. The stack: Intro to C **Day 3** (26:55)."},
 {t:"6:27", what:"Command-line (console) programs", where:"Shown briefly at 1:01:23. Handmade Hero **Day 1** builds everything from the command line."},
 {t:"7:36", what:"DLLs and static libraries", where:"Handmade Hero, around **Day 21** (loading game code from a DLL for live reloading)."},
 {t:"13:45", what:"Building without the Visual Studio project system", where:"Handmade Hero **Day 1** (build.bat calling cl directly)."},
 {t:"14:07", what:"Build configurations in detail", where:"Later in Handmade Hero (compiler switches and optimization)."},
 {t:"17:57", what:"Cores and hyperthreads in more depth", where:"Handmade Hero's multithreading arc, around **Day 122**."},
 {t:"20:43", what:"What a core's \"state\" is (what it's running, where it is)", where:"Registers and the instruction pointer: Intro to C **Day 2** (1:01:15 onward)."},
 {t:"23:04", what:"Getting more hardware detail (threads per core)", where:"Not revisited. Use Task Manager or Coreinfo (block 4 experiment)."},
 {t:"27:02", what:"The resource compiler and app icons", where:"Later, when needed."},
 {t:"29:58", what:"Why you can't simply ship the .exe", where:"The C runtime library and its DLLs. Previewed for **Day 2**; handled properly later in Handmade Hero."},
 {t:"30:52", what:"Deciphering cryptic linker errors", where:"Practice as they come. Block 5 and 11 experiments cover the basics."},
 {t:"34:31", what:"The work Windows does on an .exe while loading it", where:"Intro to C **Day 5** (0:04, \"From Code to Executable to Memory\")."},
 {t:"35:40", what:"Why WinMain isn't really the entry point", where:"Promised for the next stream (1:11:20): the C runtime startup code calls WinMain."},
 {t:"41:01", what:"What HINSTANCE, LPSTR and other Windows types really are", where:"Typedefs and macros. Intro to C **Day 2** (30:55, \"the seedy Macro underbelly of the Win32 API\")."},
 {t:"44:16", what:"Pointers", where:"Intro to C **Day 3** (8:05)."},
 {t:"54:21", what:"What the \"A\" in OutputDebugStringA means", where:"Said \"in a second\" but never reached. Intro to C **Day 2** (4:00): ASCII vs. Unicode."},
 {t:"55:18", what:"How OutputDebugString reaches the debugger (debugging services)", where:"\"Probably not … in too much deep detail.\""},
 {t:"58:18", what:"Macros (how CALLBACK works)", where:"Intro to C **Day 2** (30:55), where the windows.h macros are opened up."},
 {t:"59:00", what:"Calling conventions: how C actually generates a call", where:"\"Probably next video.\" Assembly starts on Intro to C **Day 2** (59:37)."},
 {t:"1:00:31", what:"Getting hInstance without WinMain's parameter", where:"Later (GetModuleHandle)."},
 {t:"1:03:35", what:"nCmdShow in detail", where:"When Handmade Hero creates its window (around **Day 2**)."},
 {t:"1:10:33", what:"The macros, types and other contents of windows.h", where:"\"Next week\": Intro to C **Day 2**."}
];

window.STUDY.tools = [
 {role:"core · build, run, debug", name:"Visual Studio Community", url:"https://visualstudio.microsoft.com/vs/community/", use:"Free compiler, linker and debugger, the same tools Casey uses. Install the \"Desktop development with C++\" workload. Used in every block."},
 {role:"core · see the translation", name:"Compiler Explorer", url:"https://godbolt.org/", use:"Open source. Type C, see the machine code each line becomes, and switch target CPUs. Used in blocks 3 and 11. Becomes your main tool from Day 2."},
 {role:"core · remember", name:"Anki", url:"https://apps.ankiweb.net/", use:"Open-source spaced repetition. Use this page's Review tab, or export the cards (Review → Export) and import the .tsv into Anki to keep the schedule on your phone."},
 {role:"core · map the episodes", name:"Handmade Hero Episode Guide", url:"https://guide.handmadehero.org/intro-to-c/day1/", use:"Community-made timestamps for every episode. Use it to jump to the Day 2–5 spots listed under Parked for later."},
 {role:"inspect the .exe", name:"PE-bear", url:"https://github.com/hasherezade/pe-bear", use:"Open-source viewer for the .exe format. Shows the entry point and subsystem from blocks 2 and 6 visually. `dumpbin`, included with VS, gives the same information as text."},
 {role:"see imports", name:"Dependencies", url:"https://github.com/lucasg/Dependencies", use:"Open source. Shows which DLL functions your .exe imports, e.g. OutputDebugStringA from KERNEL32 (block 12)."},
 {role:"see debug output", name:"DebugView (Sysinternals)", url:"https://learn.microsoft.com/en-us/sysinternals/downloads/debugview", use:"Free. Captures OutputDebugString text with no IDE attached (block 8)."},
 {role:"see your CPU", name:"Coreinfo (Sysinternals)", url:"https://learn.microsoft.com/en-us/sysinternals/downloads/coreinfo", use:"Free. Maps logical processors to cores and sockets (block 4)."},
 {role:"draw it", name:"Excalidraw", url:"https://excalidraw.com/", use:"Open-source whiteboard. Redraw the compile → link → load pipeline from memory once per block. Drawing it without looking is a strong memory test."},
 {role:"reference", name:"Microsoft Learn: WinMain", url:"https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-winmain", use:"The modern MSDN page Casey reads at 35:58. Also look up OutputDebugStringA."},
 {role:"later: Day 2+ debugger", name:"RAD Debugger", url:"https://github.com/EpicGamesExt/raddebugger", use:"Open-source Windows debugger, popular in the Handmade community. Not needed for Day 1. Try it once Day 2 starts stepping through assembly."}
];

window.STUDY.how = `<h2>How to study with this kit</h2>
<p>Each block takes you through the same seven steps, in this order. The yellow arrow marks where you are, like the instruction pointer in Visual Studio's debugger.</p>
<div class="loop"><span class="on">1 Watch</span><span>2 Explain</span><span>3 Experiment</span><span>4 Answer</span><span>5 Flashcards</span><span>6 Read code</span><span>7 Why it matters</span></div>
<ol>
<li><b>Watch</b> only the block's time range, at normal speed, with the "watch for" list open. Stop at the pause point and answer it before going on.</li>
<li><b>Explain</b>: read the notes. They follow Casey closely, add a prerequisite only where you'd otherwise get stuck, and fix the few things that changed since 2014.</li>
<li><b>Experiment</b>: do it with your own hands. Type the code; don't paste it. Break it on purpose and read the error.</li>
<li><b>Answer</b>: write answers from memory <i>before</i> you open the model answer. "Check my answer" grades your understanding and gives a follow-up question. The "Ask about this block" box stays inside the block's topic and tells you when something is parked for later.</li>
<li><b>Flashcards</b>: say each answer out loud, then flip. Marking the step done adds the cards to <b>Review</b>.</li>
<li><b>Read code</b>: read the annotated code in execution order and say what each line does.</li>
<li><b>Why it matters</b>: connect the block to Handmade Hero and to the CPU. This is what makes it stick.</li></ol>
<h3>A schedule that works</h3>
<table><thead><tr><th>When</th><th>What</th><th>Time</th></tr></thead><tbody>
<tr><td>Sitting 1</td><td>Blocks 1–4 (setup, building, CPU tangent)</td><td>~75 min</td></tr>
<tr><td>Sitting 2</td><td>Blocks 5–8 (linker, entry point, Windows types, first run)</td><td>~100 min</td></tr>
<tr><td>Sitting 3</td><td>Blocks 9–12 (syntax, WinMain, declarations, #include)</td><td>~80 min</td></tr>
<tr><td>Next day</td><td>Review tab (5–10 min) + rebuild the program from a blank file</td><td>~20 min</td></tr>
<tr><td>Day 7 and on</td><td>Only the cards the Review tab says are due</td><td>~5 min</td></tr></tbody></table>
<h3>Why this order works</h3>
<ul><li><b>Retrieval beats rereading.</b> Answering and flashcards force you to pull ideas out of memory. That effort is what makes them stay.</li>
<li><b>Spacing.</b> Cards come back after 1 day, then about 6, then longer each time you get them right. Five minutes a day keeps everything.</li>
<li><b>Doing it yourself.</b> Typing code, breaking it and reading errors builds the kind of memory that reading alone can't.</li>
<li><b>Staying in scope.</b> When Casey says "later", the kit says later. Parked topics go to their own list, so you don't drown in Day 4 material on Day 1.</li></ul>
<h3>Using AI without losing the skill</h3>
<p>Use Claude as a <b>quizzer and checker</b>, not an answer machine. Write your answer first, then ask for grading. Ask "why" and "what would break if…", not "what's the answer". The goal is that <i>you</i> can explain compile vs. link and what happens at program start with no tools at all. That's the part AI can't do for you, and what lets you check the code it writes.</p>
<h3>Your progress</h3>
<p class="small muted">When you're signed in to Claude, progress, answers and card schedules are saved to your account. Otherwise they're kept in this browser only.</p>`;


/* ---- page settings for this episode ---- */
window.STUDY.title = "Intro to C on Windows, Day 1";
window.STUDY.eyebrow = "Handmade Hero prelude · Casey Muratori · 72 min";
window.STUDY.storageKey = "intro-c-day01";
window.STUDY.course = "intro-to-c, Day 01";
window.STUDY.cardTag = "intro-c::day01";
window.STUDY.video = { file: "Intro_to_C_on_Windows_-_Day_1.mp4", length: "1:11:58" };
window.STUDY.qa = {
  label: "separate recording",
  html: `<p>Casey ends the stream at 1:11:49 and says he'll keep answering questions live, but <b>splits that Q&amp;A into a separate recording</b>. So Day 1's Q&amp;A isn't in this video.</p>
<p><b>To add it:</b> get the Day 1 Q&amp;A video, open Claude Code in <code>handmade-mastery</code> and say: "Add the Day 1 Q&amp;A to the study kit." Claude transcribes it and adds it as extra parts.</p>
<p><b>How Q&amp;A parts work:</b> the player stops after each question from chat. Guess Casey's answer first, then listen to his.</p>
<p>Meanwhile: do your Review cards, then rebuild the Day 1 program from a blank file on the Windows PC.</p>`
};
window.STUDY.how = `<h2>How this page works</h2>
<p>The page guides you through the video <b>one part at a time</b>. Only the current part is open. The others are locked until you finish it.</p>
<div class="loop"><span class="on">Watch</span><span>Recall</span><span>Answer</span><span>Explain</span><span>Experiment</span><span>Read code</span><span>Flashcards</span><span>Why it matters</span></div>
<ol>
<li><b>Watch.</b> Load the video file once per visit. The player plays only this part and <b>stops by itself</b> at the end. You can't run ahead.</li>
<li><b>Parking lot.</b> Want to search something while watching? Don't leave. Write it in the parking lot and keep watching. You'll see it again in Recall.</li>
<li><b>Recall.</b> Write what Casey explained, from memory. Then compare with the notes and handle your parked questions.</li>
<li><b>Answer.</b> Answer the questions before you see any explanation. "Copy for Claude" copies the question and your answer so any Claude account can grade it.</li>
<li><b>Explain → Experiment → Read code → Flashcards → Why it matters.</b> The rest of the part, one step at a time.</li>
<li><b>Break.</b> After each part: a short break (5 min), and a longer one (15 min) after every 3 parts. Or stop for today.</li></ol>
<h3>Coming back</h3>
<p>The page saves your exact place in this browser, down to the second in the video. Next time it says <b>Welcome back</b>, offers a quick card warm-up, and continues where you stopped.</p>
<p>When you stop for today, press <b>Copy position</b> and paste it to Claude (<code>/study</code>), so it can save your place in <code>journey/STATE.md</code> for every account and machine.</p>
<h3>Why it's built like this</h3>
<ul><li><b>Short parts + questions after each one</b> reduce daydreaming and improve learning from lecture videos (Szpunar, Khan &amp; Schacter, 2013).</li>
<li><b>Recall before reading</b>: pulling ideas out of memory is what makes them stay.</li>
<li><b>Spaced review</b>: cards come back after 1 day, about 6 days, then longer.</li>
<li><b>Staying in scope</b>: when Casey says "later", it goes to the Parked tab.</li></ul>`;

/* ---- lesson-template fields (guess first, one sentence, analogy, common mistake) ---- */
(function(){
const T = {
 b01:{guess:"What do you think a compiler does, in one sentence?",
  oneLiner:"Handmade Hero builds a whole game in C, and on Windows you first have to install a C compiler (Visual Studio).",
  analogy:"A compiler is like a translator for a trip abroad: Windows doesn't come with one, so you bring your own.",
  mistake:"Installing Visual Studio without the \"Desktop development with C++\" workload. Then there's no `cl.exe`."},
 b02:{guess:"Why might Windows need to know, before a program even starts, whether it's a console program or a program with a window?",
  oneLiner:"A project is a list of plain-text source files plus settings, and on Windows it's built as either a console program or a windowed program.",
  analogy:"A solution is a binder, each project in it is a recipe card, and the .cpp files are the plain-paper pages of the recipe.",
  mistake:"Making a Console project and then wondering why the linker wants `main` instead of `WinMain`. The subsystem setting doesn't match your code."},
 b03:{guess:"When you press Build, what do you think your text file gets turned into?",
  oneLiner:"Compiling translates human-readable C text into machine code for one specific kind of CPU.",
  analogy:"Compiling is like translating a book: the same story becomes French for x64 or Japanese for ARM. A French reader can't read the Japanese edition.",
  mistake:"Thinking an .exe built for x64 runs on any computer, for example an ARM Mac."},
 b04:{guess:"A PC has 2 CPU chips, but Task Manager shows 16 CPU graphs. Guess why.",
  oneLiner:"One chip holds several cores, each core can run more than one hardware thread, and Windows counts each thread as a logical processor.",
  analogy:"A core is a cook. Hyperthreading gives one cook two order tickets: while one dish waits in the oven, the cook works on the other. Two tickets, still one cook.",
  mistake:"Thinking 16 logical processors means 16 times the speed. Hyperthreads share one core's hardware."},
 b05:{guess:"A game has 100 .cpp files and you change one. What would you want the build to redo, and why?",
  oneLiner:"The compiler turns each .cpp into an object file on its own; the linker joins them, connects the names between them, and writes the .exe.",
  analogy:"Each chapter of a book is written separately, with notes like \"see chapter 7\". The linker is the editor who binds the chapters and fills in the real page numbers.",
  mistake:"Trying to fix a linker error (LNK…) by editing syntax. Linker errors are about a missing definition or library, not about how a line is written."},
 b06:{guess:"Windows didn't compile your program. So how could it know where in your .exe to start running?",
  oneLiner:"The linker writes the address of the start function (found by its name) into the .exe header, and Windows jumps there after loading the file.",
  analogy:"An .exe is a parcel with a label. Windows reads the label (the header), unpacks the parcel into memory, and the label says where to start reading.",
  mistake:"Believing WinMain is the very first code that runs. It isn't, and Casey explains why on Day 2."},
 b07:{guess:"Guess what the H in HINSTANCE and the LP in LPSTR stand for.",
  oneLiner:"HINSTANCE and LPSTR are Windows's own type names written in Hungarian notation: H means handle, LP means (long) pointer.",
  analogy:"A handle is a coat-check ticket: the ticket isn't your coat, but you hand it back to get the coat.",
  mistake:"Copying Hungarian prefixes into your own code because Windows uses them. Casey says don't."},
 b08:{guess:"If you write a function but never call it, does its code run? Why or why not?",
  oneLiner:"A function is a named, reusable block of code: its signature says what goes in and out, and its body runs only when it's called.",
  analogy:"A function is a recipe card. Writing the card cooks nothing; food appears only when someone says \"make recipe foo now\" (a call).",
  mistake:"Defining a function and expecting it to run without calling it."},
 b09:{guess:"Does C care if you put a whole function on one line? What kind of space would break your code?",
  oneLiner:"A semicolon ends a statement; whitespace only separates tokens, so it matters only when it splits a name.",
  analogy:"Spaces in C are like spaces between words: add as many as you want between words, but a space inside a word makes two words.",
  mistake:"Forgetting a `;` and then looking at the wrong line: the error is often reported on the next line."},
 b10:{guess:"WinMain returns an int. Who do you think receives that number, and what is it for?",
  oneLiner:"WinMain returns an int exit code, is marked CALLBACK so it matches the way Windows calls functions, and receives four values about how the program was started.",
  analogy:"WinMain is a form with fixed fields: Windows fills in four boxes, you must reply in the agreed format (CALLBACK), and you hand back a number (the exit code).",
  mistake:"Ignoring what `int` promises. A function that says it returns `int` should return one (`return 0;`)."},
 b11:{guess:"You call a function that is only declared, with no body anywhere. Compiler error or linker error? Guess.",
  oneLiner:"A declaration tells the compiler how to call a function; only a definition gives the linker a body to connect the call to.",
  analogy:"A declaration is a phone-book entry: it lets you dial. The definition is the person who answers. No person, and the call fails at the end (link error).",
  mistake:"Mixing up a declaration (ends with `;`, no body) with a definition (has a `{ }` body)."},
 b12:{guess:"You never wrote OutputDebugStringA or HINSTANCE. Where do you think those names come from?",
  oneLiner:"#include pastes another file's text in place, and windows.h brings in the declarations of everything Windows provides.",
  analogy:"#include is like photocopying a reference sheet and stapling it into your notes at that exact spot.",
  mistake:"Thinking `#include <windows.h>` adds Windows's code to your program. It adds only declarations; the code lives in Windows's DLLs."}
};
window.STUDY.blocks.forEach(b=>Object.assign(b, T[b.id]||{}));
})();
