/* Side trip: "How do CPUs Work?" by Branch Education (36 min).
   Left the course at Intro to C Day 1, Part 4 (processors, cores, hyperthreads); comes back to Day 1.
   20 parts = the video's own chapters. The sponsor (25:36), "About Branch Education" (30:09) and
   thank-you (35:55) chapters have nothing to learn and are skipped.
   Sources: transcript.txt (this folder) and the video's own frames in frames/. */

window.STUDY = {blocks: [
/* ============ 1 ============ */
{id:"b01", lab:"none", title:"The CPU Inside Your Computer", start:"0:00", end:"1:45",
summary:"Every device you use has a CPU (central processing unit). The video picks two CPUs to compare all the way through: the 6502 inside the Apple IIe from 1983, and the M1 inside a MacBook Pro.",
focus:"Notice the two chips the whole video compares, and the numbers given for each.",
watchFor:[
 "At 0:06: what the letters **CPU** stand for, and which devices have one.",
 "At 0:46: the **6502**, which the video calls a great-grandparent of modern processors.",
 "At 0:57: its two numbers: **4,528** transistors and about **430,000** calculations a second.",
 "At 1:18: the **M1**: **16 billion** transistors and about **3 trillion** calculations a second.",
 "At 1:36: the two chips are about **45 years** apart, but work in a similar way."
],
deferred:["What a transistor is and how it switches. Not in this video; Branch Education has separate videos on transistors.","Why the two chips work in a similar way (1:45). That is the next part."],
oneLiner:"A CPU is the brain of every computer, and the 6502 (thousands of transistors) and the M1 (billions) are the two examples the video compares.",
analogy:"A paper plane and a jet both fly because of wings and moving air. The 6502 and the M1 are like that: very different size, same basic idea.",
mistake:"Thinking a new chip is a different kind of machine. It is the same kind of machine with far more parts, running far faster.",
guess:"A chip from the 1970s and a chip from 2020: what do you think is the biggest difference between them?",
explain:`<h3>What the video says</h3>
<ul><li>A <b>CPU</b> is in every desktop, laptop, phone and game console. It is built from transistors joined by many layers of wires.</li>
<li>The <b>6502</b> ran the Apple IIe, the NES, the Commodore 64 and the Atari. It has 4,528 transistors and does about 430,000 calculations each second.</li>
<li>The <b>M1</b> in the MacBook Pro has 16 billion transistors and does about 3 trillion calculations each second.</li></ul>
<h3>How far apart is that?</h3>
<div class="tbl"><table><thead><tr><th></th><th>6502</th><th>M1</th><th>M1 ÷ 6502</th></tr></thead><tbody>
<tr><td>Transistors</td><td>4,528</td><td>16,000,000,000</td><td>about 3.5 million times</td></tr>
<tr><td>Calculations per second</td><td>430,000</td><td>3,000,000,000,000</td><td>about 7 million times</td></tr>
</tbody></table></div>
<p>The speed grew even more than the transistor count. So the M1 is not only bigger: each step is also much faster. Parts 12, 17 and 18 show where that extra speed comes from.</p>
<div class="callout"><b>Why this side trip:</b> in Intro to C Day 1, Casey says the compiler turns your text into instructions "the CPU runs". This video shows what "runs" really means.</div>`,
check:{q:"Which two chips does the video compare, and how do they differ in size and in speed?",
 rubric:[["The 6502 (old, in the Apple IIe) and the M1 (in the MacBook Pro)",40],["The M1 has far more transistors: billions against a few thousand",30],["The M1 does far more calculations each second",30]]},
practice:`<p>Open <b>Terminal</b> on this Mac and run:</p><pre><code>sysctl -n machdep.cpu.brand_string</code></pre><p>Write the chip name in your note. Is it the chip from the video, or a relative of it?</p>`,
experiment:`<p>Find the name of the CPU in this Mac with one Terminal command.</p>`,
practiceMinutes:2,
reviewQuestion:"The 6502 and the M1 are about 45 years apart. Give one number that shows how different they are, and say what they still have in common.",
questions:[
 {t:"0:57", q:"How many transistors does the 6502 have, and how many calculations can it do each second?", a:"4,528 transistors and about 430,000 calculations a second."},
 {t:"1:18", q:"What are the same two numbers for the M1?", a:"16 billion transistors and about 3 trillion calculations a second."}
],
cards:[
 ["What does **CPU** stand for?","Central processing unit: the chip that carries out a program's instructions."],
 ["6502: transistors and calculations per second?","4,528 transistors, about 430,000 calculations a second."],
 ["M1: transistors and calculations per second?","16 billion transistors, about 3 trillion calculations a second."]
],
explainCard:{concepts:[
 {icon:"chip", text:"A CPU is built from transistors connected by many layers of wires.", highlights:["transistors"]},
 {icon:"box", label:"6502", text:"4,528 transistors, about 430,000 calculations a second. It ran the Apple IIe, NES, Commodore 64 and Atari."},
 {icon:"chip", label:"M1", text:"16 billion transistors, about 3 trillion calculations a second.", highlights:["16 billion"]},
 {icon:"arrow", text:"About 45 years apart, but the way they work is similar.", highlights:["similar"]}],
 clarification:"Keep these two chips in mind. Every later part explains an idea once on the small chip and then shows the same idea on the big one."}
},

/* ============ 2 ============ */
{id:"b02", lab:"none", title:"The Technological DNA of CPUs", start:"1:45", end:"3:28",
summary:"A desktop CPU, a GPU, a phone's system on a chip and an AI chip all work on the same basic principle. The video calls this shared principle their technological DNA, and says it is not transistors and not logic gates.",
focus:"Notice what the shared \"DNA\" is said NOT to be. The video keeps the real answer for later.",
watchFor:[
 "At 1:53: the list of chips that share the same principle: CPU, GPU, **SoC**, AI chip.",
 "At 2:31: one chip is about **10 billion times** more powerful than the other, yet they share the principle.",
 "At 2:47: the DNA is **not** transistors and **not** logic gates.",
 "At 3:01: it is an **architectural design** and a **basic operational principle**."
],
deferred:["What the shared principle actually is (3:01). The video answers at 23:13, in Part 13.","The diagram of a performance core shown at 3:03. Parts 17 and 18."],
oneLiner:"All processors, old or new, share one basic way of working, and that shared way is a design and a principle, not a kind of part.",
analogy:"A bicycle, a car and a truck use different parts, but all of them turn wheels to move. The shared idea is the turning wheel, not the metal it is made from.",
mistake:"Saying \"all chips are the same because they all use transistors\". A memory chip also uses transistors, and it is not a processor.",
guess:"Guess now: what one way of working could a 1975 chip and an AI chip share?",
explain:`<h3>What the video says</h3>
<ul><li>Open a desktop and take the CPU or the GPU. Open a Nintendo Switch or a phone and take the <b>SoC</b> (system on a chip). Go into an AI data center and take an AI chip. All of them work on the same principle.</li>
<li>The game Oregon Trail from 50 years ago and today's AI programs run on processors with the same "technological DNA".</li>
<li>That DNA is <b>not</b> transistors and <b>not</b> logic gates. It is an <b>architectural design</b> and a <b>basic operational principle</b>.</li></ul>
<h3>Why "not transistors"?</h3>
<p>Transistors and logic gates are building materials, like bricks. Many chips are made of the same bricks and are not processors at all. A memory chip only stores. What makes a chip a <i>processor</i> is how the bricks are arranged and what the chip does again and again.</p>
<div class="callout"><b>Hold your guess.</b> The answer comes in Part 13. Parts 5 to 12 build up to it step by step.</div>`,
check:{q:"What does the video mean by the \"technological DNA\" of processors, and what does it say this DNA is not?",
 rubric:[["It is a shared design and basic way of working that all processors use",50],["It is not the transistors and not the logic gates",30],["It is the same in very different chips: old and new, CPU, GPU, SoC, AI chip",20]]},
practice:`<p>Write your guess in the note: <b>what is the shared way of working?</b> One sentence is enough. Do not look ahead. You will check this guess in Part 13.</p>`,
experiment:`<p>Write your guess for the shared principle and keep it for Part 13.</p>`,
practiceMinutes:2,
reviewQuestion:"A friend says: \"All processors are alike because they are all made of transistors.\" What is wrong with that, according to the video?",
questions:[
 {t:"1:53", q:"Name three kinds of chips that the video says share the same principle.", a:"Any three of: the CPU in a desktop, the GPU in a graphics card, the SoC in a phone or Nintendo Switch, an AI chip in a data center."},
 {t:"2:47", q:"What two things is the technological DNA NOT?", a:"Not transistors and not logic gates. It is an architectural design and a basic operational principle."}
],
cards:[
 ["What is an **SoC**?","A system on a chip: one chip that holds the processor and other parts, as in a phone or Nintendo Switch."],
 ["What is the \"technological DNA\" NOT?","Not transistors and not logic gates."]
],
explainCard:{concepts:[
 {icon:"list", text:"CPU, GPU, SoC and AI chips all work on the same basic principle.", highlights:["same basic principle"]},
 {icon:"flag", label:"NOT", text:"transistors, and not logic gates. Those are only building materials."},
 {icon:"gear", label:"IT IS", text:"an architectural design and a basic operational principle.", highlights:["architectural design"]}],
 clarification:"The video keeps the answer for later on purpose. First it builds a simple picture of a CPU (Parts 5 to 11)."}
},

/* ============ 3 ============ */
{id:"b03", lab:"none", title:"Teardown of a Laptop", start:"3:28", end:"4:39",
summary:"A 3D teardown of the MacBook Pro: touchpad, battery, speakers, fan and motherboard. On the motherboard are the SSD chips, and under the heat pipe sit the DRAM and the CPU. Inside the CPU package are three parts: a cover, an interposer and the die.",
focus:"Notice the three parts inside the CPU package, and which one does the real work.",
watchFor:[
 "At 3:43: the **SSD** storage chips on the motherboard, where files are saved.",
 "At 3:54: under the heat pipe: the **DRAM** (short-term working memory) and the CPU.",
 "At 4:06: the three parts of the package: **cover**, **interposer**, **die**.",
 "At 4:19: the **integrated circuit** (IC), also called the **die**: the working part."
],
deferred:["How the SSD and DRAM store data. Not in this video.","How data moves between SSD, DRAM and the CPU. Touched in Parts 6, 7 and 15."],
oneLiner:"The CPU you can hold is a package: a heat cover on top, an interposer with thousands of connections below, and the die, the real chip, soldered onto the interposer.",
analogy:"It is like a watch: the case protects it, the back plate holds the contacts, and the small movement inside is the part that really keeps time.",
mistake:"Thinking the grey square you see on a motherboard is the chip itself. It is the cover. The die is the small piece underneath.",
guess:"When you take the metal lid off a CPU, what do you expect to find under it?",
explain:`<h3>From laptop to die</h3>
<ol><li><b>Laptop</b>: touchpad, battery cells, speakers, cooling fan, and the <b>motherboard</b> in the middle.</li>
<li><b>Motherboard</b>: the <b>SSD</b> chips keep your files. Under the heat pipe are the <b>DRAM</b> (short-term working memory) and the <b>CPU</b>.</li>
<li><b>CPU package</b>, three parts:
 <ul><li><b>Cover</b> on top: protects the chip and carries heat away.</li>
 <li><b>Interposer</b> at the bottom: thousands of connection points on both sides, with wires inside. It joins the tiny die to the motherboard.</li>
 <li><b>Die</b> (integrated circuit, IC): soldered onto the interposer. This is the functional part of the CPU.</li></ul></li></ol>
<h3>Three kinds of memory, already</h3>
<p>This part quietly introduces two of the three memory places used in the rest of the video: the <b>SSD</b> (long-term) and the <b>DRAM</b> (short-term). The third, the <b>cache</b>, is on the die itself (Part 4).</p>`,
check:{q:"Inside the CPU package there are three parts. Name them and say what each one does.",
 rubric:[["Cover: protects the chip and moves heat away",30],["Interposer: connects the die to the motherboard through thousands of connection points",35],["Die (integrated circuit): the working part that holds the transistors",35]]},
practice:`<p>On this Mac open <b>Apple menu → About This Mac</b> (then <b>More Info</b> if needed). Write down the <b>Chip</b>, the <b>Memory</b> and the <b>Storage</b>. Next to each, write the word the video uses for it: CPU, DRAM or SSD.</p>`,
experiment:`<p>Read this Mac's chip, memory and storage, and match them to CPU, DRAM and SSD.</p>`,
practiceMinutes:3,
reviewQuestion:"You remove the metal cover from a CPU. What two things are below it, and which of them is the real processor?",
questions:[
 {t:"3:54", q:"What sits under the heat pipe on the motherboard?", a:"The DRAM, which is the short-term working memory, and the CPU."},
 {t:"4:19", q:"What are two other names for the functional part of the CPU?", a:"The integrated circuit (IC) and the die."}
],
cards:[
 ["What is the **die**?","The integrated circuit: the small piece of silicon with the transistors. It is the working part of the CPU."],
 ["What does the **interposer** do?","It connects the die to the motherboard with thousands of connection points and wires inside it."],
 ["SSD or DRAM: which one is long-term storage?","The SSD keeps files long-term. The DRAM is short-term working memory."]
],
explainCard:{concepts:[
 {icon:"box", label:"COVER", text:"protects the chip and conducts heat away."},
 {icon:"chain", label:"INTERPOSER", text:"thousands of connection points and inner wires that join the die to the motherboard."},
 {icon:"chip", label:"DIE", text:"the integrated circuit, the functional part of the CPU.", highlights:["functional part"]}],
 clarification:"On this laptop the DRAM sits right next to the die, under the same cover. In many other computers the DRAM is on separate sticks."}
},

/* ============ 4 ============ */
{id:"b04", lab:"cpu", title:"A CPU Die", start:"4:39", end:"5:59",
summary:"The die is divided into sections: four high-performance cores, four energy-efficient cores, graphics cores, cache memory and more. Zooming into one performance core gives a block diagram. Zooming further shows layers of wires with transistors at the bottom.",
focus:"Notice the three zoom levels: sections of the die, blocks inside one core, then wires and transistors.",
watchFor:[
 "At 4:30: the sections of the die: **4 performance cores**, **4 efficiency cores**, graphics cores, **cache memory**.",
 "At 4:48: one performance core is split into **functional blocks**, then drawn as an architectural diagram.",
 "At 5:16: a huge multi-layer maze of **wires**, with the transistors at the very bottom.",
 "At 5:26: **six transistors** wired together make one AND logic gate.",
 "At 5:33: this view shows about **650** transistors out of 16 billion."
],
deferred:["How the core diagram works (5:02). The video says you will understand it by the end: Parts 17 and 18.","How a logic gate is built from transistors. Only shown briefly here."],
oneLiner:"A die is organised in levels: big sections such as cores and cache, blocks inside each core, and at the bottom billions of transistors joined by layers of wires.",
analogy:"A city seen from a plane has districts. Closer, a district has buildings. Closer again, each building is made of bricks. The die has the same three levels.",
mistake:"Thinking a \"core\" is the whole chip. A core is one section of the die, and the M1 has eight of them plus many other sections.",
guess:"If you zoom into the die until you see single transistors, what do you think is above them?",
explain:`<h3>Three zoom levels</h3>
<ol><li><b>The die</b>: 4 high-performance cores, 4 energy-efficient cores, graphics processing cores, cache memory and many other sections.</li>
<li><b>One performance core</b>: separate functional blocks. The video labels them and rearranges them into an <b>architectural diagram</b> that shows how data and instructions move inside one core.</li>
<li><b>Nanoscopic view</b>: a multi-layer maze of wires, and at the very bottom the transistors. Six transistors wired together make one <b>AND gate</b>. The frame shows about 650 of the 16 billion transistors.</li></ol>
<h3>Link to the course</h3>
<p>In Intro to C Day 1, Part 4, Casey talks about <b>cores</b> and Task Manager shows one graph for each logical processor. This part shows where those cores physically are: each one is a rectangle on the die. The video's M1 has two kinds of core, fast ones and power-saving ones.</p>`,
check:{q:"Go from big to small: what do you find when you zoom into the M1 die, level by level?",
 rubric:[["The die is split into sections such as performance cores, efficiency cores, graphics cores and cache",40],["One core is made of functional blocks, drawn as a diagram",25],["At the bottom are transistors joined by many layers of wires, forming logic gates",35]]},
practice:`<p>Look at the CPU lab below: how many cores does this Mac report? Then run this in Terminal to see the two kinds of core:</p><pre><code>sysctl hw.perflevel0.physicalcpu hw.perflevel1.physicalcpu</code></pre><p>Level 0 is the performance cores and level 1 the efficiency cores. Write both numbers. Do they match the die in the video (4 and 4)?</p>`,
experiment:`<p>Count this Mac's performance and efficiency cores and compare with the die in the video.</p>`,
practiceMinutes:3,
reviewQuestion:"Task Manager or Activity Monitor shows several CPU graphs. Using the die in the video, explain where those cores physically are and what kinds the M1 has.",
questions:[
 {t:"4:30", q:"Which sections does the video point out on the die?", a:"Four high-performance cores, four energy-efficient cores, graphics processing cores, cache memory and many other sections."},
 {t:"5:26", q:"How many transistors does the video show wired together for one AND gate?", a:"Six transistors."}
],
cards:[
 ["How many cores does the video's M1 have, and of which kinds?","Eight: four high-performance cores and four energy-efficient cores."],
 ["What is at the very bottom of the chip, under the layers of wires?","The transistors."]
],
explainCard:{concepts:[
 {icon:"window", label:"DIE", text:"sections: 4 performance cores, 4 efficiency cores, graphics cores, cache memory.", highlights:["cache memory"]},
 {icon:"list", label:"ONE CORE", text:"functional blocks, redrawn as an architectural diagram."},
 {icon:"chip", label:"BOTTOM", text:"transistors under many layers of wires. Six transistors make one AND gate.", highlights:["AND gate"]}],
 clarification:"The diagram of one core looks hard now. The video promises it will make sense by the end, and Parts 17 and 18 come back to it."}
},

/* ============ 5 ============ */
{id:"b05", lab:"none", title:"Analogy of a CPU", start:"5:59", end:"7:10",
summary:"\"A CPU is a powerful calculator\" is only about 20% of the picture. The video completes it: a table with a pencil and a sheet of paper, rows of bookshelves, a cart that carries a few books, and a robot called the control unit that does all the moving, reading and writing.",
focus:"Notice every object added around the calculator, and who does the work.",
watchFor:[
 "At 6:02: the calculator picture is only about **20%** complete.",
 "At 6:12: a **table**, a **pencil** and a **sheet of paper**.",
 "At 6:18: **bookshelves** with thousands of books, and a **cart** for a small stack of books.",
 "At 6:31: the robot: the **control unit** (controller).",
 "At 6:38: what the controller can do: move books, read them, write, and use the calculator."
],
deferred:["Which computer part each object stands for. That is the next part."],
oneLiner:"A CPU is not just a calculator: it is a calculator on a table with paper and pencil, next to bookshelves and a cart, all operated by a control-unit robot.",
analogy:"This part is itself the analogy: a very fast librarian robot working at a desk with a calculator.",
mistake:"Leaving out the robot. A calculator does nothing by itself; something must decide what to press and what to fetch next.",
guess:"If a CPU were only a calculator, what would be missing for it to run a program by itself?",
explain:`<h3>The complete scene</h3>
<div class="tbl"><table><thead><tr><th>Object</th><th>What it adds</th></tr></thead><tbody>
<tr><td>Calculator</td><td>Does the maths. This is the well-known 20%.</td></tr>
<tr><td>Table, pencil, sheet of paper</td><td>A place to work and to write down numbers in use.</td></tr>
<tr><td>Bookshelves</td><td>Thousands of books.</td></tr>
<tr><td>Cart</td><td>Carries a small stack of books between shelves and table.</td></tr>
<tr><td>Robot (control unit)</td><td>Takes books from the shelves to the cart and the table and back. Reads books, writes on the paper and in the books, and presses the calculator.</td></tr>
</tbody></table></div>
<p>The video says you can think of the controller as a very fast human. It is a robot only because they are bad at animating humans.</p>
<h3>Why the calculator is only 20%</h3>
<p>A calculator waits for someone to type. A CPU must also <b>know what to do next</b>, <b>get its numbers from somewhere</b> and <b>put the results somewhere</b>. The other 80% is exactly that: instructions, memory and control.</p>`,
check:{q:"The video says \"a CPU is a calculator\" is only about 20% right. Which objects does it add to complete the picture?",
 rubric:[["A table with a pencil and a sheet of paper",25],["Bookshelves full of books, and a cart to carry a few books",35],["A robot controller that moves the books, reads and writes, and uses the calculator",40]]},
practice:`<p>On paper, draw the scene from memory: six objects, each with a one-word label. Then open <b>Graphics</b> and compare with the frames. Write which object you forgot, if any.</p>`,
experiment:`<p>Draw the analogy scene from memory and compare it with the video's frames.</p>`,
practiceMinutes:3,
reviewQuestion:"Why is a calculator alone a poor picture of a CPU? Name what else is needed.",
questions:[
 {t:"6:02", q:"How complete is the \"CPU is a calculator\" analogy, according to the video?", a:"Only about 20% complete. It is missing some critical parts."},
 {t:"6:38", q:"What can the controller robot do?", a:"Take books from the shelves, move them to the cart and the table and put them back; read books; write on the paper and in the books; and use the calculator."}
],
cards:[
 ["Which object in the analogy does all the moving, reading and writing?","The robot, called the control unit or controller."],
 ["Name the six objects of the CPU analogy.","Calculator, table, pencil and paper, bookshelves, cart, and the controller robot."]
],
explainCard:{concepts:[
 {icon:"gear", label:"20%", text:"the calculator: it only does the maths."},
 {icon:"file", text:"A table with a pencil and a sheet of paper to work on.", highlights:["sheet of paper"]},
 {icon:"book", text:"Bookshelves with thousands of books, and a cart for a small stack.", highlights:["cart"]},
 {icon:"flag", label:"CONTROLLER", text:"the robot that moves books, reads, writes and uses the calculator."}],
 clarification:"Do not worry yet about what each object means in a real computer. The next part gives every object its real name."}
},

/* ============ 6 ============ */
{id:"b06", lab:"none", title:"Explaining the CPU Analogy", start:"7:10", end:"9:47",
summary:"Each object gets its real name: bookshelves are the SSD, the cart is the DRAM, the table is the CPU, the one open book is the cache, the sheet of paper is the registers and the calculator is the ALU. The ALU adds, subtracts, multiplies, shifts bits, does logic and compares numbers, and its display is called the accumulator.",
focus:"Notice which object stands for which computer part, and what the ALU can do besides adding.",
watchFor:[
 "At 7:11: bookshelves = **SSD** storage. At 7:18: cart = **DRAM**, table = **CPU**.",
 "At 7:25: room for one open book = the very small **cache memory** inside the CPU.",
 "At 7:36: the sheet of paper = the **registers**: four general-purpose ones and a few special places.",
 "At 8:01: the calculator = the **ALU** (arithmetic logic unit). It works in binary.",
 "At 8:27: bit shifts: add a 0 at the end. In binary that multiplies by **2**.",
 "At 9:09: **comparisons** raise a flag: equals, less than or greater than.",
 "At 9:32: the calculator's display is the **accumulator**."
],
deferred:["The \"special locations\" on the paper (7:46). The program counter is Part 8; the current instruction register is Part 11.","Real CPUs have 16, 32 or more registers. The video uses 4 to keep the picture small; the M1's 32 appear in Part 18."],
oneLiner:"Shelves are the SSD, the cart is the DRAM, the table is the CPU, the open book is the cache, the paper is the registers and the calculator is the ALU.",
analogy:"Think of distance: the paper is in your hand, the open book is on the desk, the cart is beside the desk and the shelves are across the hall. Closer means faster and smaller.",
mistake:"Mixing up registers and memory. Registers are the few numbers on the sheet of paper, inside the CPU. Memory is the books.",
guess:"The calculator can add and multiply. What else might a CPU's calculator need to do so that a program can make decisions?",
explain:`<h3>The mapping</h3>
<div class="tbl"><table><thead><tr><th>Analogy</th><th>Real part</th><th>Notes</th></tr></thead><tbody>
<tr><td>Bookshelves</td><td>SSD (storage)</td><td>Huge, long-term, far away</td></tr>
<tr><td>Cart</td><td>DRAM</td><td>Smaller, temporary, close</td></tr>
<tr><td>Table and what is on it</td><td>CPU</td><td></td></tr>
<tr><td>Space for one open book</td><td>Cache memory</td><td>Very limited, inside the CPU</td></tr>
<tr><td>Sheet of paper</td><td>Registers</td><td>Values in use right now: 4 general-purpose registers (R0 to R3) and a few special places</td></tr>
<tr><td>Pencil</td><td>Writing and erasing</td><td>On the paper and in the books</td></tr>
<tr><td>Calculator</td><td>ALU</td><td>Arithmetic logic unit</td></tr>
<tr><td>Calculator display</td><td>Accumulator</td><td>Where the result appears</td></tr>
</tbody></table></div>
<h3>What the ALU can do</h3>
<ul><li><b>Arithmetic</b>: add, subtract, multiply. Also +1 and −1.</li>
<li><b>Bit shift</b>: put a 0 at the end. In decimal that is ×10; in binary it is ×2. Example from the video: <code>0011 0101</code> becomes <code>0110 1010</code>.</li>
<li><b>Logic</b>: AND, OR, exclusive OR, done on each bit position of two numbers.</li>
<li><b>Comparison</b>: put in two numbers and one flag goes up: equals, less than or greater than.</li></ul>
<p><b>Comparison is the important one.</b> Without it a program could never choose: no <code>if</code>, no loop. Part 9 uses it.</p>`,
check:{q:"What computer part does each object stand for: the bookshelves, the cart, the open book on the table, the sheet of paper and the calculator?",
 rubric:[["Bookshelves are the SSD storage and the cart is the DRAM",35],["The open book is the cache and the sheet of paper is the registers",35],["The calculator is the ALU, which does arithmetic, logic and comparisons",30]]},
practice:`<p>Do the video's two ALU examples by hand, on paper:</p><ol><li><b>Left bit shift</b> of <code>0011 0101</code>. Write the result in binary. What are the two numbers in decimal?</li><li><b>Logical AND</b> of <code>1011 1011</code> and <code>0001 0110</code>.</li></ol><p>Then open <b>Graphics</b> and check both against the frames at 8:47 and 9:07.</p>`,
experiment:`<p>Work out a left bit shift and a logical AND by hand, then check them against the video.</p>`,
practiceMinutes:4,
reviewQuestion:"Put these in order from closest to the calculator to farthest away, and give the real name of each: bookshelves, sheet of paper, cart, open book.",
questions:[
 {t:"7:36", q:"What does the single sheet of paper stand for, and what is written on it?", a:"The registers: values that are being used right now. It has four general-purpose registers and a few special locations."},
 {t:"9:15", q:"What happens when the ALU compares two equal numbers?", a:"The equals flag goes up, and the other comparison flags (less than, greater than) stay down."}
],
cards:[
 ["What does **ALU** stand for, and what does it do?","Arithmetic logic unit. It does arithmetic, bit shifts, logic operations and comparisons, in binary."],
 ["What is a **register**?","A small place inside the CPU that holds a value being used right now. In the analogy: a line on the sheet of paper."],
 ["What is the **accumulator**?","The ALU's output: in the analogy, the calculator's display."],
 ["In binary, what does shifting a number left by one place do?","It multiplies the number by 2."]
],
explainCard:{concepts:[
 {icon:"book", label:"SHELVES → CART", text:"SSD storage, then DRAM: far and huge, then closer and smaller.", highlights:["DRAM"]},
 {icon:"file", label:"ON THE TABLE", text:"one open book is the cache; the sheet of paper is the registers.", highlights:["cache","registers"]},
 {icon:"gear", label:"CALCULATOR", text:"the ALU: add, subtract, multiply, shift, AND/OR/XOR, compare.", highlights:["ALU"]},
 {icon:"flag", text:"A comparison raises a flag: equals, less than or greater than.", highlights:["flag"]}],
 clarification:"The on-screen note says real CPUs have 16, 32 or more registers. Four is only to keep the drawing readable."}
},

/* ============ 7 ============ */
{id:"b07", lab:"code", title:"How do CPUs Complete Instructions?", start:"9:47", end:"12:34",
summary:"A program is loaded like books moved from the shelves to the cart, and one book onto the table. A book has two kinds of pages: instructions and data. The first three instructions are load, increment and store, and together they are the single line of code i++.",
focus:"Notice the two kinds of pages in the book, and the three instructions that make up i++.",
watchFor:[
 "At 9:46: loading a program = books from shelves to cart, one book onto the table.",
 "At 9:59: DRAM and cache are **temporary** and small; the SSD holds much more and keeps it.",
 "At 10:31: two kinds of pages: **instructions** and **data** (recipe and ingredients).",
 "At 11:16: instruction 1, **load**: copy the value at an address into a register.",
 "At 11:41: instruction 2, **increment**: the ALU adds 1 to register 0.",
 "At 11:56: instruction 3, **store**: write the result back to the same address.",
 "At 12:10: these three instructions equal one line of code: `i++`."
],
pauseAt:{t:"12:10", do:"Before the code appears, guess which single line of C would need a load, an add-one and a store."},
deferred:["How the CPU knows which instruction is next (12:28). That is the program counter, Part 8.","Why the cache and DRAM are faster than the SSD. Not explained in this video."],
oneLiner:"A program is pages of instructions plus pages of data, and even `i++` takes three instructions: load the value, add one, store it back.",
analogy:"The video's own: instructions are the steps of a recipe and data is the ingredients. You need both, and the same ingredients can make many dishes.",
mistake:"Thinking one line of C is one instruction. Most lines become several simple instructions.",
guess:"How many separate steps do you think a CPU needs to do `i++` on a variable that lives in memory?",
explain:`<h3>Loading a program</h3>
<p>Books go from the SSD shelves to the DRAM cart, and one book goes onto the table (the cache) and is opened. When the computer is off there are no books in the DRAM or the CPU. When it is on, books move around all the time.</p>
<div class="tbl"><table><thead><tr><th>Place</th><th>Kind</th><th>Size</th><th>Speed</th></tr></thead><tbody>
<tr><td>Cache (open book)</td><td>Temporary</td><td>Very limited</td><td>Very quick</td></tr>
<tr><td>DRAM (cart)</td><td>Temporary</td><td>Limited</td><td>Quick</td></tr>
<tr><td>SSD (shelves)</td><td>Semi-permanent</td><td>Massive</td><td>Slow</td></tr>
</tbody></table></div>
<h3>What is inside the book</h3>
<p>Two kinds of pages. <b>Instructions</b>: numbered steps, like a recipe. <b>Data</b>: a list of addresses, each holding a value, like ingredients.</p>
<h3>The first three instructions</h3>
<ol><li><b>load</b> Address[161] to Register[0]: find address 161 in the data pages and copy its value (174) onto the paper.</li>
<li><b>increment</b> Register[0]: put the value into the ALU and press +1.</li>
<li><b>store</b> Accumulator in Address[161]: write the result from the display back to address 161.</li></ol>
<p>Together: <code>i++;</code>. The variable <code>i</code> lives at address 161.</p>
<div class="callout"><b>Link to the course:</b> this is what the compiler from Intro to C Day 1 produces. You write <code>i++</code>; it writes the load, add and store instructions into the .exe.</div>`,
check:{q:"The line `i++` becomes three instructions. Name them in order and say what each one does.",
 rubric:[["Load: copy the value from its memory address into a register",35],["Increment: the ALU adds 1 to the value",30],["Store: write the result back to the same memory address",35]]},
practice:`<p>See it for real. In the Code Lab below, write a small program with an <code>int i</code> and the line <code>i++;</code>. Press <b>Disassembly</b>.</p><p>Find the instructions made for <code>i++</code>. Which one loads, which adds 1 and which stores? Copy those lines into your note.</p><p class="small muted">The Code Lab shows x64 instructions (the Windows PC's chip family), where load and store are both spelled <code>mov</code>. Look at which side the memory address in square brackets is on.</p>`,
experiment:`<p>Write a program with <code>i++</code> and find its load, add and store instructions in the Disassembly.</p>`,
practiceMinutes:6,
reviewQuestion:"What two kinds of pages does a program \"book\" hold, and why can the CPU not do `i++` in one step when `i` is in memory?",
questions:[
 {t:"10:31", q:"What are the two types of pages in a program's book?", a:"Instructions, like the numbered steps of a recipe, and data: addresses with a value stored at each one, like ingredients."},
 {t:"11:16", q:"What does a load instruction do?", a:"It finds a specific address in the data pages and copies the value stored there into a general-purpose register."}
],
cards:[
 ["What does a **load** instruction do?","Copies the value at a memory address into a register."],
 ["What does a **store** instruction do?","Writes a value (here the ALU's result) back to a memory address."],
 ["Which three instructions make up `i++`?","Load the value, add one with the ALU, store the result back."],
 ["Cache, DRAM, SSD: which is smallest and fastest?","The cache. The SSD is the largest and slowest."]
],
code:`<p>The first three instructions on the video's page, and the line of code they come from:</p>
<pre><code>1  load       Address[161]  to Register[0]
2  increment  Register[0]   by 1
3  store      Accumulator   in Address[161]</code></pre>
<p>In C this is one line: <code>i++;</code> where <code>i</code> is the value at address 161.</p>`,
explainCard:{concepts:[
 {icon:"book", text:"A program book has two kinds of pages: instructions and data.", highlights:["instructions","data"]},
 {icon:"arrow", label:"LOAD", text:"copy the value at an address into a register."},
 {icon:"gear", label:"INCREMENT", text:"the ALU adds 1."},
 {icon:"arrow", label:"STORE", text:"write the result back to the same address."}],
 clarification:"The video shows numbers in decimal so they are easy to read. Its note says the CPU and the ALU really work only in binary."}
},

/* ============ 8 ============ */
{id:"b08", lab:"none", title:"The Program Counter", start:"12:34", end:"13:33",
summary:"A special place on the sheet of paper, the program counter (PC), holds the number of the next instruction. After each instruction it goes up by one. A jump instruction writes a new number into it, so the program continues somewhere else.",
focus:"Notice how the program counter changes after a normal instruction, and after a jump.",
watchFor:[
 "At 12:28: the **program counter** (PC) keeps track of the next instruction.",
 "At 12:41: its other names: **instruction address register** and **instruction pointer**.",
 "At 12:46: PC is 5: do instruction 5, then PC becomes 6.",
 "At 13:09: a **jump** at instruction 7 sets the PC to **42**.",
 "At 13:20: the order becomes 5, 6, 7, 42, 43, 44."
],
deferred:["Jumps that happen only sometimes (conditional branches). That is the next part."],
oneLiner:"The program counter holds the address of the next instruction: it normally goes up by one, and a jump simply writes a new number into it.",
analogy:"It is your finger on a recipe: after each step it moves down one line, unless the step says \"now go to step 42\".",
mistake:"Thinking a jump is special magic. A jump only writes a different number into the program counter.",
guess:"After finishing instruction 5, how could a CPU know that instruction 6 is next?",
explain:`<h3>What the video says</h3>
<ul><li>The <b>program counter</b> (PC) is one of the special places on the sheet of paper. It holds the number of the next instruction to do.</li>
<li>It is also called the <b>instruction address register</b> or the <b>instruction pointer</b>.</li>
<li>Normal case: PC is 5, so instruction 5 is done, and the PC goes up by one to 6.</li>
<li><b>Jump</b>: instruction 7 is a jump. It sets the PC directly to 42. The order is 5, 6, 7, 42, 43, 44, and so on.</li></ul>
<h3>Why this small counter matters</h3>
<p>The PC is the only thing that decides the order of a program. Change the number and the program continues somewhere else. Calling a function, returning from it, loops and <code>if</code> all work by changing the PC.</p>
<div class="callout"><b>Link to the course:</b> in Intro to C Day 1 Casey parks "what a core's state is". The answer starts here: a core's state is its registers plus this pointer. On x64 it is called <code>RIP</code>, and the yellow arrow in the Visual Studio debugger shows where it points.</div>`,
check:{q:"What does the program counter hold, how does it normally change, and what does a jump instruction do to it?",
 rubric:[["It holds the address (number) of the next instruction to do",40],["Normally it goes up by one after each instruction",25],["A jump writes a new value into it, so the program continues from there",35]]},
practice:`<p>Trace by hand. The PC is 5 and instruction 7 is <code>jump 42</code>.</p><ol><li>Write the next six values of the PC.</li><li>Now suppose instruction 43 is <code>jump 5</code>. What happens to the program?</li></ol>`,
experiment:`<p>Trace the program counter by hand through a jump.</p>`,
practiceMinutes:3,
reviewQuestion:"Give the three names of the place that tracks the next instruction, and explain in one sentence how a jump changes the order of a program.",
questions:[
 {t:"12:41", q:"What are the other two names for the program counter?", a:"The instruction address register and the instruction pointer."},
 {t:"13:09", q:"How does the jump at instruction 7 make the CPU continue at instruction 42?", a:"It directly sets the value in the program counter to 42."}
],
cards:[
 ["What does the **program counter** hold?","The address of the next instruction to do."],
 ["What does a **jump** instruction do?","It sets the program counter to a new value, so the program continues there."],
 ["Other names for the program counter?","Instruction address register; instruction pointer."]
],
explainCard:{concepts:[
 {icon:"tag", label:"PC", text:"holds the number of the next instruction.", highlights:["next instruction"]},
 {icon:"arrow", label:"NORMAL", text:"after each instruction the PC goes up by one."},
 {icon:"flag", label:"JUMP", text:"writes a new number into the PC: 5, 6, 7, then 42, 43, 44."}],
 clarification:"The PC lives on the sheet of paper with the other registers. It is a register with one special job."}
},

/* ============ 9 ============ */
{id:"b09", lab:"code", title:"Loops and Branches", start:"13:33", end:"16:01",
summary:"A conditional branch changes the program counter only when a comparison flag is up. With a load, a compare and a branch at the top, and a jump at the bottom, the CPU repeats a for loop four times. The C++ you write becomes machine code; its readable form is called assembly.",
focus:"Notice the three instructions at the top of the loop and the one at the bottom, and how the flags decide.",
watchFor:[
 "At 13:32: a **conditional branch** is used for `if` statements and loops.",
 "At 14:00: each colour links a piece of the C++ line to its instructions.",
 "At 14:32: the top of the loop: **load**, **compare**, **branch greater than or equal to**.",
 "At 14:46: compare puts `i` and 4 into the ALU and sets the **flags**.",
 "At 15:07: if the flag is up, the PC is set to 23: leave the loop.",
 "At 15:15: otherwise the loop runs to the **jump** at 22, which sets the PC back to 6.",
 "At 15:37: C++ on the left; the CPU runs **machine code**; the readable form is **assembly**."
],
pauseAt:{t:"14:40", do:"The three instructions for `i < 4` are on screen. Before the video explains, say what you think each one does."},
deferred:["How a compiler turns code into instructions (14:08). Part 16 here, and Intro to C Day 1 Part 3.","What goes wrong when the CPU must wait for a branch. Branch prediction, Part 17."],
oneLiner:"A loop is a compare and a conditional branch at the top and a jump back at the bottom: the branch leaves the loop only when the comparison flag is up.",
analogy:"A guard at a door checks your ticket each time you walk round. While the number is too small you go round again; when it is big enough the guard sends you out.",
mistake:"Thinking the loop body \"knows\" it repeats. Nothing repeats by itself: the jump at the bottom sends the program counter back up each time.",
guess:"The loop body runs four times. How many times do you think the compare at the top runs?",
explain:`<h3>The loop in the video</h3>
<pre><code>int j = 3;
int k = 4;
for (int i = 0; i &lt; 4; i++) {
    j++;
    k = k * 7;
}</code></pre>
<h3>How the CPU repeats it</h3>
<ol><li><b>Before the loop</b>: <code>i</code> is set to 0 and stored at address 160.</li>
<li><b>Top of the loop</b> (the test <code>i &lt; 4</code>), three instructions:
 <ul><li><b>6 load</b>: copy <code>i</code> from address 160 into register 0.</li>
 <li><b>7 compare</b>: the ALU compares register 0 with the value 4 and sets the flags.</li>
 <li><b>8 branch if greater than or equal</b>: if the greater-than flag or the equals flag is up, set the PC to 23 and leave the loop.</li></ul></li>
<li><b>Body</b>: the instructions for <code>j++</code> and <code>k = k * 7</code>.</li>
<li><b>Bottom</b>: load <code>i</code>, add 1, store it. Then <b>22 jump</b> sets the PC back to 6.</li></ol>
<p>While <code>i</code> is 0, 1, 2 or 3 only the less-than flag goes up. Greater-than and equals stay down, so the branch does nothing and the body runs: four times. When <code>i</code> is 4 the equals flag goes up and the branch leaves.</p>
<h3>Notice the opposite test</h3>
<p>The C++ says "repeat while <code>i &lt; 4</code>". The CPU asks the opposite: "is <code>i</code> greater than or equal to 4? Then leave." That is normal. A compiler often turns the condition around.</p>
<h3>Three languages</h3>
<p><b>C++</b> is what you write. <b>Machine code</b> is the binary the CPU really runs. <b>Assembly</b> is machine code written with readable names. The video changed its assembly a little to make it easier to read.</p>`,
check:{q:"How does a CPU repeat a `for` loop four times? Describe the instructions at the top of the loop and at the bottom.",
 rubric:[["Top: load the counter and compare it with 4 in the ALU, which sets flags",35],["A conditional branch: if the flag is up the program counter jumps past the loop, if not the body runs",35],["Bottom: a jump sets the program counter back to the top of the loop",30]]},
practice:`<p>Type the video's loop in the Code Lab (inside a <code>main</code> function) and press <b>Disassembly</b>.</p><ol><li>Find the compare instruction (<code>cmp</code>).</li><li>Find the conditional jump right after it. Its name starts with <code>j</code>.</li><li>Find the jump that goes back to the top (<code>jmp</code>).</li></ol><p>In your note, write the three instructions and which part of the <code>for</code> line each one belongs to.</p>`,
experiment:`<p>Write the loop from the video and find its compare, conditional jump and jump-back in the Disassembly.</p>`,
practiceMinutes:8,
reviewQuestion:"A loop runs its body four times. Explain why the compare instruction runs five times, and what makes the loop finally stop.",
questions:[
 {t:"14:32", q:"Which three instructions are at the top of the loop?", a:"Load, compare, and branch greater than or equal to."},
 {t:"15:15", q:"What does the jump at address 22 do?", a:"It sets the program counter to 6, the top of the for loop, so the test runs again."},
 {t:"15:37", q:"What is the difference between machine code and assembly?", a:"Machine code is the binary the CPU actually runs. Assembly is a semi-readable written form of the same instructions."}
],
cards:[
 ["What is a **conditional branch**?","An instruction that changes the program counter only if a comparison flag is set. It is used for `if` statements and loops."],
 ["What does a **compare** instruction produce?","Flags: equals, less than or greater than. It does not change the two numbers."],
 ["Machine code or assembly: which one does the CPU run?","Machine code (binary). Assembly is its readable form."]
],
code:`<p>The instructions for the loop, shortened from the video's page:</p>
<pre><code> 5  store   integerValue[0]  Address[160]     i = 0
 6  load    Register[0]      Address[160]     top of loop: get i
 7  compare Register[0]      integerValue[4]  i against 4, sets flags
 8  branch.greater.or.equal.to  Address[23]   flag up: leave the loop
 9  ...                                       body: j++ and k = k * 7
18  load    Register[0]      Address[160]     i++
19  add     Register[0]      integerValue[1]
20  move    Register[0]      Accumulator
21  store   Register[0]      Address[160]
22  jump    Address[6]                        back to the top
23  ret                                       after the loop</code></pre>`,
explainCard:{concepts:[
 {icon:"arrow", label:"LOAD", text:"get the counter i from memory."},
 {icon:"gear", label:"COMPARE", text:"the ALU compares i with 4 and sets the flags.", highlights:["flags"]},
 {icon:"flag", label:"BRANCH", text:"if greater-than or equals is up, set the PC past the loop."},
 {icon:"chain", label:"JUMP", text:"at the bottom, set the PC back to the top."}],
 clarification:"The on-screen note explains that the video's listing sometimes uses a move then a store where it earlier showed one step. Some CPU designs do it in one step."}
},

/* ============ 10 ============ */
{id:"b10", lab:"code", title:"All Possible Instructions", start:"16:01", end:"17:07",
summary:"You might expect tens of thousands of different instructions. In fact the 6502 can complete only 56 different instructions and the M1 only 354, and most are simple. Everything a computer does is a long sequence of these.",
focus:"Notice how few different instructions each chip has, and how programs still get so large.",
watchFor:[
 "At 16:07: the **6502** can complete only **56** different instructions.",
 "At 16:17: the **M1** can complete **354**.",
 "At 16:28: read a few names in the list: most instructions are simple.",
 "At 16:36: everything you do is built from sequences of those 354.",
 "At 16:46: many programs have **millions** of lines of instructions."
],
deferred:["Why the M1's set is called ARMv8.4 and RISC. Part 16.","How the CPU tells one instruction from another. The decoder, Part 11."],
oneLiner:"A CPU knows only a small fixed set of simple instructions, 56 on the 6502 and 354 on the M1, and every program is a very long sequence of them.",
analogy:"English has 26 letters, yet every book is written with them. A CPU's instructions are its alphabet.",
mistake:"Thinking a complex program needs complex instructions. It needs many simple ones in the right order.",
guess:"How many different instructions do you think a modern laptop CPU can complete: hundreds, thousands or millions?",
explain:`<h3>What the video says</h3>
<ul><li>The 6502 in the Apple IIe could complete only <b>56</b> different instructions.</li>
<li>The M1 in the MacBook Pro can complete <b>354</b>.</li>
<li>Most of them are simple: add, compare, load, store, branch and variations of these.</li>
<li>Every single thing on your computer is built from sequences of those 354. Many programs have millions upon millions of lines of instructions.</li></ul>
<h3>Two different numbers</h3>
<div class="tbl"><table><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>
<tr><td>How many <b>kinds</b> of instruction exist?</td><td>Few: 56 or 354. Fixed when the chip is designed.</td></tr>
<tr><td>How many instructions are <b>in a program</b>?</td><td>Many: thousands to millions. Decided by the program.</td></tr>
</tbody></table></div>
<p>The list of all instructions a chip understands is called its <b>instruction set</b>. Part 16 names the M1's set.</p>
<div class="callout"><b>Link to the course:</b> this is why the compiler in Intro to C Day 1 must know its target. It may only use instructions that the target chip has.</div>`,
check:{q:"About how many different instructions can the 6502 and the M1 each complete, and how can so few run every program?",
 rubric:[["The 6502 has 56 and the M1 has 354: hundreds at most, not tens of thousands",40],["Each instruction is simple",20],["Programs are very long sequences of these instructions, often millions",40]]},
practice:`<p>Open your loop program from Part 9 in the Code Lab and press <b>Disassembly</b>. Count how many <b>different</b> instruction names it uses (for example <code>mov</code> counts once, however often it appears). Write the number and the names in your note.</p><p class="small muted">No loop program yet? Use any small program you wrote in the Code Lab.</p>`,
experiment:`<p>Count the different instruction names in the disassembly of a small program.</p>`,
practiceMinutes:4,
reviewQuestion:"What is the difference between the number of kinds of instruction a CPU has and the number of instructions in a program? Give the video's numbers for the first.",
questions:[
 {t:"16:07", q:"How many different instructions could the 6502 complete?", a:"Only 56."},
 {t:"16:17", q:"How many can the M1 complete?", a:"354."}
],
cards:[
 ["How many different instructions: 6502 and M1?","6502: 56. M1: 354."],
 ["What is an **instruction set**?","The fixed list of all the different instructions a CPU can complete."]
],
explainCard:{concepts:[
 {icon:"list", label:"6502", text:"56 different instructions."},
 {icon:"list", label:"M1", text:"354 different instructions."},
 {icon:"arrow", text:"Programs are sequences of these, often millions of lines long.", highlights:["millions"]}],
 clarification:"Few kinds of instruction, very many instructions in a program. Keep these two numbers apart."}
},

/* ============ 11 ============ */
{id:"b11", lab:"none", title:"Fetch Decode Execute", start:"17:07", end:"21:14",
summary:"Every instruction is completed in three steps. Fetch: use the program counter to find the instruction, copy it into the current instruction register and add one to the program counter. Decode: the instruction decoder turns the instruction's bits into control signals. Execute: the signals make the parts do the work.",
focus:"Notice what happens in each of the three steps, and what the decoder turns the bits into.",
watchFor:[
 "At 17:03: the three steps: **Fetch, Decode, Execute**.",
 "At 17:11: Fetch uses the **PC** to find the instruction and copies it into the **CIR**.",
 "At 17:32: at the same time the PC goes up by one.",
 "At 17:37: Decode: the **instruction decoder** reads the bits and makes **control signals**.",
 "At 18:39: the first bit selects the ALU; the next three bits pick the function; the last four pick the registers.",
 "At 19:10: Execute: control and **timing signals** send register 0 and register 1 to the ALU.",
 "At 20:11: the three steps form a **cycle**. Watch the second run, a store."
],
pauseAt:{t:"18:30", do:"The instruction 1000 0001 is on the decoder. Before the video explains, guess what the first bit might choose."},
deferred:["Real instruction decoding (19:02). The video says it is much more complicated than this.","How the clock times these steps. That is the next part."],
oneLiner:"Fetch gets the next instruction using the program counter, decode turns its bits into control signals, and execute uses those signals to do the work.",
analogy:"A cook reads the next line of the recipe (fetch), understands what it asks for (decode), and does it (execute). Then the next line.",
mistake:"Thinking the instruction itself does the work. The instruction is only a number; the decoder turns it into signals that switch on the right parts.",
guess:"To carry out one instruction from the book, what steps do you think the controller must go through?",
explain:`<h3>The three steps</h3>
<ol><li><b>Fetch</b>. The controller uses the value in the program counter to find that instruction in the book. It copies the instruction into the <b>current instruction register</b> (CIR). At the same time the PC goes up by one.</li>
<li><b>Decode</b>. The instruction in the CIR goes into the <b>instruction decoder</b>, a key part of the controller. Using the instruction's binary values and a very complex arrangement of logic gates, it produces the <b>control signals</b> and sends them to the parts of the CPU.</li>
<li><b>Execute</b>. The control signals and a set of <b>timing signals</b> make the parts do the work.</li></ol>
<h3>The video's example: add register 0 and register 1</h3>
<p>The instruction's machine code is <code>1000 0001</code>.</p>
<div class="tbl"><table><thead><tr><th>Bits</th><th>Value</th><th>Meaning</th></tr></thead><tbody>
<tr><td>First bit</td><td><code>1</code></td><td>Use the ALU (<code>0</code> would mean a load, store or jump)</td></tr>
<tr><td>Next three bits</td><td><code>000</code></td><td>The ALU function: add</td></tr>
<tr><td>Last four bits</td><td><code>00</code> <code>01</code></td><td>Register 0 and register 1</td></tr>
</tbody></table></div>
<p>ALU functions on screen: <code>000</code> add, <code>001</code> subtract, <code>010</code> multiply, <code>011</code> +1/−1, <code>100</code> shift, <code>101</code> logical operations, <code>110</code> bitwise comparisons, <code>111</code> compare. Registers: <code>00</code> R0, <code>01</code> R1, <code>10</code> R2, <code>11</code> R3.</p>
<p>During execute, the value in R0 (42) and then the value in R1 (68) are sent to the ALU. It adds them, and a timing signal saves the result in the accumulator.</p>
<h3>Why timing signals?</h3>
<p>Electricity needs time to travel from the registers to the ALU, and transistors and logic gates need time to change state. The timing signals wait long enough for the correct result to be ready.</p>
<h3>Then again</h3>
<p>The cycle repeats with the new PC value. The second run in the video fetches a <b>store</b>: the value in the accumulator is written to a memory address.</p>
<div class="callout"><b>Honest note:</b> this 8-bit code is the video's own simple example. Real 6502 and M1 instructions are encoded differently, but the idea is the same: groups of bits choose the part, the function and the operands.</div>`,
check:{q:"Describe the three steps a CPU uses to complete one instruction.",
 rubric:[["Fetch: use the program counter to find the instruction, copy it into the current instruction register, and add one to the program counter",35],["Decode: the instruction decoder turns the instruction's bits into control signals",35],["Execute: the control signals make the parts do the work, for example the ALU adds two registers and the result is saved",30]]},
practice:`<p>Be the decoder. Use the video's tables (they are in <b>Graphics</b>, the frames at 18:44, 18:50 and 18:58) and decode these two instructions by hand:</p><ol><li><code>1010 1011</code></li><li><code>1111 0001</code></li></ol><p>For each one write: which part is selected, which function, and which two registers.</p>`,
experiment:`<p>Decode two 8-bit instructions by hand with the video's tables.</p>`,
practiceMinutes:5,
reviewQuestion:"During Fetch two special places on the sheet of paper change. Which two, and how? Then say what the decoder produces.",
questions:[
 {t:"17:22", q:"Where does the controller copy the fetched instruction?", a:"Into a special location called the current instruction register, or CIR."},
 {t:"17:45", q:"What two things does the instruction decoder do?", a:"It interprets what the machine code of the instruction means, and at the same time it produces the control signals to execute that instruction."},
 {t:"19:29", q:"Why are timing signals needed during Execute?", a:"Electricity takes time to travel from the registers to the ALU, and transistors and logic gates take time to change state. The timing signals make sure the result is correct before it is saved."}
],
cards:[
 ["What happens in **Fetch**?","The program counter is used to find the instruction, it is copied into the current instruction register, and the program counter goes up by one."],
 ["What happens in **Decode**?","The instruction decoder turns the instruction's bits into control signals."],
 ["What happens in **Execute**?","Control and timing signals make the CPU's parts carry out the instruction."],
 ["What is the **CIR**?","The current instruction register: it holds the instruction being worked on."]
],
code:`<p>The start of the program page used in this part, and the instruction being fetched:</p>
<pre><code>1  load   Register[0]      Address[161]
2  load   Register[1]      Address[163]
3  add    Register[0]      Register[1]      machine code 1000 0001
4  store  integerValue[0]  Address[161]
5  store  Accumulator      Address[21]

Registers:  R0 = 42   R1 = 68
PC = 003  →  after Fetch: CIR = "add Register[0] to Register[1]", PC = 004</code></pre>`,
explainCard:{concepts:[
 {icon:"arrow", label:"FETCH", text:"use the PC to find the instruction, copy it into the CIR, add one to the PC.", highlights:["CIR"]},
 {icon:"gear", label:"DECODE", text:"the instruction decoder turns the bits into control signals.", highlights:["control signals"]},
 {icon:"flag", label:"EXECUTE", text:"control and timing signals make the parts do the work."},
 {icon:"chain", text:"Then the cycle repeats with the new value in the program counter.", highlights:["cycle"]}],
 clarification:"The decoder is the part of the controller robot that understands instructions. It is one of the most complicated parts of a CPU."}
},

/* ============ 12 ============ */
{id:"b12", lab:"none", title:"CPU Clock and Fetch Decode Execute", start:"21:14", end:"22:53",
summary:"Every processor uses the fetch, decode, execute cycle, and the computer's clock sets its pace. The 6502 was an 8-bit chip with a 1 MHz clock; the M1 is a 64-bit chip with a 3.2 GHz clock. Modern chips also use pipelining: several instructions are in different steps at the same time.",
focus:"Notice what the clock does to the cycle, and what pipelining changes.",
watchFor:[
 "At 21:13: the cycle is used in **every** processor, 6502 or M1.",
 "At 21:36: the **clock** regulates the pace of the cycle.",
 "At 21:46: 6502: **1 MHz**, so each step takes **one microsecond**.",
 "At 21:58: 6502 is **8-bit**: registers and ALU inputs and outputs are 8 bits wide.",
 "At 22:09: M1: **64-bit**, **3.2 GHz**, each step about **a third of a nanosecond**.",
 "At 22:24: **pipelining**: fetch, decode and execute of different instructions at the same time."
],
deferred:["Other optimizations in modern processors (22:43). Parts 17 and 18.","Instructions that need more than one cycle. Only mentioned in an on-screen note."],
oneLiner:"The clock ticks and each tick moves the cycle one step; a faster clock means shorter steps, and pipelining lets several instructions be in different steps at once.",
analogy:"Pipelining is a car wash with three stations. One car is rinsed while the next is soaped and a third is drying. Each car still passes all three, but a finished car comes out at every step.",
mistake:"Thinking pipelining makes one instruction faster. Each instruction still takes three steps; the gain is that a new one finishes every tick.",
guess:"What do you think tells the CPU when to move from fetch to decode to execute?",
explain:`<h3>The clock sets the pace</h3>
<div class="tbl"><table><thead><tr><th></th><th>6502</th><th>M1</th></tr></thead><tbody>
<tr><td>Clock</td><td>1 MHz: a million ticks a second</td><td>3.2 GHz: 3.2 billion ticks a second</td></tr>
<tr><td>Time for one step</td><td>1 microsecond</td><td>about a third of a nanosecond</td></tr>
<tr><td>Width</td><td>8-bit</td><td>64-bit</td></tr>
</tbody></table></div>
<p><b>8-bit</b> means the registers and the ALU's inputs and output are 8 bits wide. <b>64-bit</b> means they are 64 bits wide, so the M1 handles much larger numbers in one step.</p>
<h3>Pipelining</h3>
<p>Without it, one instruction finishes all three steps before the next starts: three ticks for each instruction. With pipelining, instructions are queued up. While instruction 1 is in decode, instruction 2 is already being fetched.</p>
<div class="tbl"><table><thead><tr><th></th><th>Tick 1</th><th>Tick 2</th><th>Tick 3</th><th>Tick 4</th><th>Tick 5</th></tr></thead><tbody>
<tr><td>Instruction 1</td><td>Fetch</td><td>Decode</td><td>Execute</td><td></td><td></td></tr>
<tr><td>Instruction 2</td><td></td><td>Fetch</td><td>Decode</td><td>Execute</td><td></td></tr>
<tr><td>Instruction 3</td><td></td><td></td><td>Fetch</td><td>Decode</td><td>Execute</td></tr>
</tbody></table></div>
<p>After the first two ticks, one instruction finishes on every tick. In the video's table, seven instructions finish in nine cycles.</p>
<div class="callout"><b>Honest note:</b> "one step per tick" is the video's simple model. Its on-screen note says some instructions take one cycle and others take several.</div>`,
check:{q:"What does the clock do in the fetch, decode, execute cycle, and what does pipelining add?",
 rubric:[["The clock sets the pace: each tick moves the cycle one step",35],["A faster clock means a shorter step: the 6502 at 1 MHz against the M1 at 3.2 GHz",25],["Pipelining: several instructions are in different steps at the same time",40]]},
practice:`<p>Work these out on paper:</p><ol><li>The 6502 ticks a million times a second. If each instruction needs three ticks, about how many instructions does it finish each second? Compare with the 430,000 calculations a second from Part 1.</li><li>In the video's pipeline table, 7 instructions finish in 9 cycles. How many cycles would 7 instructions need <b>without</b> pipelining?</li></ol>`,
experiment:`<p>Calculate instructions per second for the 6502, and the saving from pipelining.</p>`,
practiceMinutes:4,
reviewQuestion:"Two chips run the same cycle. One has a 1 MHz clock, the other 3.2 GHz and pipelining. Explain the two separate reasons the second finishes more instructions each second.",
questions:[
 {t:"21:46", q:"How long did each step of the cycle take on the 6502, and why?", a:"One microsecond, because its clock ticked a million times a second (1 MHz)."},
 {t:"22:24", q:"What is pipelining?", a:"A technique where several instructions are queued up, so fetch, decode and execute for different instructions are completed at the same time."}
],
cards:[
 ["What does the CPU **clock** do?","It regulates the pace of the fetch, decode, execute cycle."],
 ["6502 and M1: clock speed and bit width?","6502: 1 MHz, 8-bit. M1: 3.2 GHz, 64-bit."],
 ["What is **pipelining**?","Working on several instructions at once, each in a different step of the cycle."],
 ["What does **8-bit** or **64-bit** describe?","The width of the registers and of the ALU's inputs and output."]
],
explainCard:{concepts:[
 {icon:"gear", label:"CLOCK", text:"each tick moves the cycle one step."},
 {icon:"chip", label:"6502", text:"1 MHz and 8-bit: one microsecond for each step."},
 {icon:"chip", label:"M1", text:"3.2 GHz and 64-bit: about a third of a nanosecond for each step."},
 {icon:"list", label:"PIPELINING", text:"different instructions are in fetch, decode and execute at the same time.", highlights:["at the same time"]}],
 clarification:"A faster clock shortens each step. Pipelining overlaps the steps. They are two separate ways to finish more instructions each second."}
},

/* ============ 13 ============ */
{id:"b13", lab:"none", title:"Uncovering the Technological DNA: Fetch Decode Execute", start:"22:53", end:"23:47",
summary:"From the second a device is turned on until it is shut off, its processor cycles through fetch, decode, execute, using programs of instructions and data, paced by the clock. This cycle is the technological DNA of every processor of the past 50 years.",
focus:"Notice the answer to the question from Part 2: what the shared DNA is.",
watchFor:[
 "At 22:53: from power on to power off, the processor keeps cycling.",
 "At 23:13: the answer: the **fetch, decode, execute cycle** is the technological DNA.",
 "At 23:25: trillions to quadrillions of operations every second in a single chip."
],
deferred:["Chips that do not use this cycle (23:38). That is the next part."],
oneLiner:"The shared DNA of every processor is the fetch, decode, execute cycle, repeated without stopping and paced by the clock.",
analogy:"A heartbeat: from birth to death it repeats the same small motion, and everything else the body does depends on it.",
mistake:"Thinking the CPU rests when you do nothing. While the device is on, the cycle never stops.",
guess:"You guessed the shared principle in Part 2. Say it again in one sentence before you watch.",
explain:`<h3>The answer to Part 2</h3>
<p>The <b>fetch, decode, execute cycle</b> is the common piece of technological DNA. It has powered every processor built in the past 50 years: the 6502, the M1, a phone, a game console, a GPU, an AI server.</p>
<p>Three things keep it going:</p>
<ol><li><b>Programs</b> filled with instructions and data (the book).</li>
<li>The <b>cycle</b> itself: fetch, decode, execute, again and again.</li>
<li>The <b>clock</b>, which regulates the pace.</li></ol>
<h3>Why it is so powerful</h3>
<p>The hardware stays the same; only the book changes. One chip can run a game, a browser or a compiler, because each is just a different list of the same simple instructions. That flexibility is the point, and the next part shows chips that give it up.</p>
<div class="callout"><b>Link to the course:</b> in Intro to C Day 1, Windows loads your .exe and "starts the CPU at the entry point". Now you can say exactly what that means: it puts the entry address in the program counter, and the cycle does the rest.</div>`,
check:{q:"What is the \"technological DNA\" shared by every processor, and what keeps it going?",
 rubric:[["The fetch, decode, execute cycle",50],["It repeats without stopping from power on to power off, over programs of instructions and data",30],["The clock regulates its pace",20]]},
practice:`<p>Look at the guess you wrote in Part 2. Was it right, partly right or wrong? Write one sentence about what you missed or got right.</p><p>Then answer in your note: when Windows starts your .exe, which register does it set so that the cycle begins in your program?</p>`,
experiment:`<p>Compare your guess from Part 2 with the video's answer.</p>`,
practiceMinutes:2,
reviewQuestion:"What single repeating process do a 1975 chip and a modern AI chip share, and why does it let one chip run any program?",
questions:[
 {t:"23:13", q:"What is the common section of technological DNA?", a:"The fetch, decode, execute cycle."},
 {t:"22:53", q:"When does a processor stop cycling through fetch, decode, execute?", a:"Only when the device is shut off. From power on to power off it cycles continuously."}
],
cards:[
 ["What is the \"technological DNA\" of every processor?","The fetch, decode, execute cycle."]
],
explainCard:{concepts:[
 {icon:"chain", text:"The fetch, decode, execute cycle is the shared technological DNA.", highlights:["fetch, decode, execute cycle"]},
 {icon:"book", text:"It runs over programs made of instructions and data."},
 {icon:"gear", text:"The clock regulates its pace, from power on to power off.", highlights:["clock"]}],
 clarification:"This is the centre of the whole video. Everything before it built up to this answer, and everything after it compares other chips against it."}
},

/* ============ 14 ============ */
{id:"b14", lab:"none", title:"ASICs and FPGAs", start:"23:47", end:"24:35",
summary:"There are chips that do not use the cycle. ASICs (for example in a Bitcoin miner) and FPGAs (in car computers and cameras) skip fetch and decode: data flows through a set pattern of logic gates. They are highly optimized but very inflexible. Quantum computers are further away still.",
focus:"Notice which steps ASICs and FPGAs leave out, and what they gain and lose.",
watchFor:[
 "At 23:44: **ASIC** = application-specific integrated circuit, shown in a Bitcoin mining computer.",
 "At 24:00: **FPGA** = field-programmable gate array, in car computers and cameras.",
 "At 24:09: they do **not** use the fetch and decode steps.",
 "At 24:21: highly **optimized** but very **inflexible**.",
 "At 24:25: quantum computers use qubits and quantum circuits."
],
deferred:["Quantum computers (24:25). The video leaves them for future videos.","How an FPGA is reprogrammed. Not in this video."],
oneLiner:"ASICs and FPGAs skip fetch and decode and push data through a fixed pattern of logic gates, which makes them very fast at one job and unable to do others.",
analogy:"A CPU is a cook who can follow any recipe. An ASIC is a machine that only makes one kind of biscuit, much faster than the cook, and nothing else.",
mistake:"Thinking every chip is a small CPU. Many chips have no program counter and no instructions at all.",
guess:"If a chip only ever does one job, which steps of fetch, decode, execute could it leave out?",
explain:`<h3>What the video says</h3>
<ul><li><b>ASIC</b>: application-specific integrated circuit. Example: the chips in a Bitcoin mining computer.</li>
<li><b>FPGA</b>: field-programmable gate array. Example: the main chips in some car computers and cameras.</li>
<li>Neither uses the <b>fetch</b> and <b>decode</b> steps. They do repetitive operations by flowing data through a set pattern of logic gates and execution units.</li>
<li>Result: highly optimized, but very inflexible.</li>
<li>Even further away are <b>quantum computers</b>, based on qubits and quantum circuits.</li></ul>
<h3>The trade</h3>
<div class="tbl"><table><thead><tr><th></th><th>CPU</th><th>ASIC / FPGA</th></tr></thead><tbody>
<tr><td>What decides the work</td><td>The program (the book)</td><td>The wiring of the gates</td></tr>
<tr><td>Fetch and decode</td><td>Yes, for every instruction</td><td>No</td></tr>
<tr><td>Strength</td><td>Can run any program</td><td>Very fast and efficient at one job</td></tr>
<tr><td>Weakness</td><td>Spends time fetching and decoding</td><td>Cannot do other jobs</td></tr>
</tbody></table></div>
<p><b>Going a little deeper:</b> the video groups the two together. One difference is in the names. An ASIC's pattern is fixed when it is made. An FPGA is "field-programmable": its pattern of gates can be set up again later. Once it is set up, though, data flows through it in the same way, with no instructions being fetched.</p>`,
check:{q:"How do ASICs and FPGAs work differently from a CPU, and what is the trade-off?",
 rubric:[["They do not fetch and decode instructions: data flows through a set pattern of logic gates",50],["This makes them highly optimized for their one job",25],["They are inflexible: they cannot run any program like a CPU can",25]]},
practice:`<p>For each job, write <b>CPU</b> or <b>ASIC/FPGA</b> and one reason:</p><ol><li>Running a web browser, a game and a compiler on the same machine.</li><li>Doing the same Bitcoin calculation billions of times.</li><li>Processing every frame from a camera sensor in the same way.</li></ol>`,
experiment:`<p>Decide for three jobs whether a CPU or a fixed-pattern chip fits better.</p>`,
practiceMinutes:2,
reviewQuestion:"A chip mines Bitcoin far faster than your laptop's CPU but cannot open a text file. Explain why, using fetch and decode.",
questions:[
 {t:"24:09", q:"Which steps do ASICs and FPGAs not use?", a:"The fetch and decode steps."},
 {t:"24:21", q:"What do they gain and what do they lose by that?", a:"They are highly optimized, but very inflexible."}
],
cards:[
 ["What is an **ASIC**?","An application-specific integrated circuit: a chip built for one job, for example Bitcoin mining."],
 ["What is an **FPGA**?","A field-programmable gate array: a chip whose pattern of logic gates is set up for one job, used in car computers and cameras."],
 ["Why are ASICs and FPGAs inflexible?","They have no fetch and decode: data flows through a set pattern of gates, so they cannot follow a new program."]
],
explainCard:{concepts:[
 {icon:"box", label:"ASIC", text:"built for one application, like Bitcoin mining."},
 {icon:"window", label:"FPGA", text:"a gate array set up for one job, in car computers and cameras."},
 {icon:"flag", text:"No fetch and no decode: data flows through a set pattern of logic gates.", highlights:["set pattern"]},
 {icon:"info", text:"Highly optimized, but very inflexible.", highlights:["inflexible"]}],
 clarification:"Seeing what a chip looks like without the cycle makes the cycle easier to understand: fetch and decode are the price of being able to run anything."}
},

/* ============ 15 ============ */
{id:"b15", lab:"none", title:"Memory and Writeback", start:"24:35", end:"25:36",
summary:"Two more steps are often added to the cycle: memory and writeback. Memory is like moving books from shelves to cart to table. Writeback is like writing data into the books and returning old books. They use the memory address register, and usually take much longer than fetch, decode and execute.",
focus:"Notice the two extra steps, and why they are sometimes counted in the cycle and sometimes not.",
watchFor:[
 "At 24:34: two more steps: **memory** and **writeback**.",
 "At 24:44: memory = books from the SSD shelves to the DRAM cart to the table (cache).",
 "At 24:54: writeback = writing data into the books; old books go back to the cart and shelves.",
 "At 25:06: both use the **memory address register**.",
 "At 25:14: they usually take much **longer** than fetch, decode, execute."
],
deferred:["How data really moves between cache, DRAM and SSD (25:26). Branch Education says a separate video is coming.","The layers between this cycle and a running game (25:33). Not covered."],
oneLiner:"Memory brings the needed data to the CPU and writeback saves results, and because these are slower and not always needed, some descriptions count them in the cycle and some do not.",
analogy:"Cooking a step takes a second, but sometimes you must first walk to the store room for an ingredient, and afterwards put things away. Those walks are memory and writeback.",
mistake:"Thinking every instruction takes the same time. An instruction that needs a book from the shelves takes far longer than one that only uses the paper.",
guess:"After fetch, decode and execute, what else might an instruction still need to do?",
explain:`<h3>What the video says</h3>
<ul><li><b>Memory</b>: like moving books from the SSD shelves onto the DRAM cart, and then onto the table (cache).</li>
<li><b>Writeback</b>: like writing data into the books. When the table needs room for a new book, the old one goes back on the cart and later to the shelves.</li>
<li>Both use another special location, the <b>memory address register</b>. On screen it holds a bookshelf number, a row and a book number.</li>
<li>They usually take much longer than fetch, decode and execute. So in some architectures and textbooks they are part of the cycle, and in others they are not.</li></ul>
<h3>The five-step version</h3>
<p>Fetch → Decode → Execute → Memory → Writeback.</p>
<p><b>Going a little deeper:</b> in many textbooks the five steps are defined a bit more narrowly. There, <i>memory</i> is the step where a load or store instruction reads or writes its data address, and <i>writeback</i> is the step where the result is written into a register. The video uses the book-moving picture instead, and its on-screen note says memory and writeback are more complicated and will get their own video.</p>
<div class="callout"><b>Link to Part 7:</b> load and store are the instructions that need the memory step. Add and compare, which use only registers, do not.</div>`,
check:{q:"Which two steps are sometimes added after fetch, decode and execute, what does each do, and why are they sometimes left out of the cycle?",
 rubric:[["The two steps are memory and writeback",40],["Memory brings data to the CPU (books moved to the table); writeback writes results back",35],["They take longer than the other three steps, so some descriptions do not count them in the cycle",25]]},
practice:`<p>From memory, write the five steps in order. Next to each, write the object from the analogy that does most of the work in that step (robot, calculator, paper, book, cart or shelves).</p>`,
experiment:`<p>Write the five steps from memory and match each to an object in the analogy.</p>`,
practiceMinutes:2,
reviewQuestion:"Name the five steps of the longer cycle in order, and say which two are much slower and why.",
questions:[
 {t:"25:06", q:"Which special location do the memory and writeback steps use?", a:"The memory address register."},
 {t:"25:14", q:"Why are memory and writeback not always counted as part of the cycle?", a:"They typically take a lot longer to complete than fetch, decode and execute, so some architectures and textbooks include them and some do not."}
],
cards:[
 ["What are the five steps of the longer cycle?","Fetch, decode, execute, memory, writeback."],
 ["What is the **memory address register**?","A special location used by the memory and writeback steps to hold the address being read or written."]
],
explainCard:{concepts:[
 {icon:"book", label:"MEMORY", text:"bring the needed data to the CPU: shelves to cart to table."},
 {icon:"file", label:"WRITEBACK", text:"write results into the books and return old books."},
 {icon:"tag", text:"Both use the memory address register.", highlights:["memory address register"]},
 {icon:"info", text:"They take longer than fetch, decode, execute, so they are not always counted in the cycle."}],
 clarification:"The chapter after this one in the video is the sponsor's section (25:36 to 28:02). The side trip skips it."}
},

/* ============ 16 ============ */
{id:"b16", lab:"none", title:"RISC vs CISC", start:"28:02", end:"30:09",
summary:"The M1's 354 instructions are called ARMv8.4, a RISC design (reduced instruction set computer). Intel and AMD chips use CISC (complex instruction set computer), with thousands of possible instructions. The same Snake game compiles to 676 instructions on ARM and 560 on x86-64.",
focus:"Notice which chips are RISC and which are CISC, and how the same program turns out differently for each.",
watchFor:[
 "At 28:08: the M1's set is **ARMv8.4**, a **RISC** architecture.",
 "At 28:19: Snake: 145 lines of C++ become **676** assembly instructions for ARM.",
 "At 28:48: Intel and AMD chips use **CISC**, with thousands of possible instructions.",
 "At 29:06: the same Snake on **x86-64**: only **560** instructions.",
 "At 29:17: RISC instructions are simple and run at a steady fast rate; RISC is more energy efficient.",
 "At 29:37: CISC packs more into one instruction; its decoder is much more complicated."
],
deferred:["More pros and cons of RISC and CISC (29:57). The video saves them for another video.","How a compiler chooses instructions. Intro to C Day 1 Part 3, and the assembly from Day 2."],
oneLiner:"RISC (ARM, the M1) uses a few hundred simple instructions that run at a steady rate, while CISC (x86-64, Intel and AMD) uses thousands of instructions that each do more.",
analogy:"RISC is a box of plain building bricks: you need more of them, but each is simple. CISC adds many special pieces: fewer are needed, but each one is harder to make and to fit.",
mistake:"Thinking fewer instructions in the program means a faster program. CISC's 560 instructions each do more, and some take several clock cycles.",
guess:"The same game is compiled for two chip families. Do you expect the same number of instructions in both? Why?",
explain:`<h3>What the video says</h3>
<div class="tbl"><table><thead><tr><th></th><th>RISC</th><th>CISC</th></tr></thead><tbody>
<tr><td>Stands for</td><td>Reduced instruction set computer</td><td>Complex instruction set computer</td></tr>
<tr><td>Example</td><td>ARMv8.4: the M1, all smartphones</td><td>x86-64: Intel and AMD chips</td></tr>
<tr><td>Number of instructions</td><td>354 on the M1</td><td>Thousands</td></tr>
<tr><td>Each instruction</td><td>Small and simple</td><td>Large and complex, does more</td></tr>
<tr><td>Time for one instruction</td><td>Steady: one clock cycle</td><td>Varies: sometimes two or more cycles</td></tr>
<tr><td>Decoder</td><td>Simpler; fixed format</td><td>Much more complicated; variable format</td></tr>
<tr><td>Energy</td><td>More efficient</td><td>Not the focus</td></tr>
<tr><td>Snake (145 lines of C++)</td><td>676 instructions</td><td>560 instructions</td></tr>
</tbody></table></div>
<h3>The compiler's job</h3>
<p>A <b>compiler</b> is a separate piece of software. It takes the C++ code together with the chip's instruction set and produces the list of instructions, the same ones found in the "book", here a program named <code>snake.app</code>.</p>
<h3>Why RISC needs more instructions</h3>
<p>A RISC instruction does one small thing. A CISC instruction can combine several small things, for example reading from memory and adding in one instruction. So the same program needs fewer CISC instructions, but each can take longer and is harder to decode.</p>
<div class="callout"><b>Link to the course:</b> this is Intro to C Day 1 Part 3 again: "the same C becomes different bytes for x64 and for ARM". Your Windows PC is x86-64 (CISC). This Mac is ARM (RISC). The Code Lab shows x64 instructions because the course targets Windows.</div>`,
check:{q:"Give two differences between RISC and CISC, and say which one the M1 uses and which one Intel and AMD chips use.",
 rubric:[["The M1 (ARM) is RISC; Intel and AMD (x86-64) are CISC",30],["RISC: a few hundred simple instructions, steady speed, energy efficient",35],["CISC: thousands of instructions, each does more, with a more complex decoder or varying time",35]]},
practice:`<p>In Terminal on this Mac run <code>uname -m</code> and write the answer. Is that family RISC or CISC?</p><p>Then answer in one sentence: Snake needs 676 instructions on ARM and 560 on x86-64. Why does the RISC version need more?</p>`,
experiment:`<p>Find this Mac's chip family and explain why RISC programs have more instructions.</p>`,
practiceMinutes:2,
reviewQuestion:"The same C++ program has 676 instructions for one chip and 560 for another. Which is RISC, which is CISC, and what explains the difference?",
questions:[
 {t:"28:08", q:"What is the M1's instruction set called, and what kind of architecture is it?", a:"ARMv8.4. It is a RISC architecture: reduced instruction set computer."},
 {t:"28:26", q:"What is the job of a compiler here?", a:"It is a separate piece of software that takes the C++ code along with the chip's instruction set and generates the list of assembly instructions, equivalent to the machine code in the program."},
 {t:"29:37", q:"Name one cost of CISC.", a:"The instruction decoder is much more complicated, and instructions have a variable execution rate, sometimes taking multiple clock cycles."}
],
cards:[
 ["What does **RISC** stand for, and who uses it?","Reduced instruction set computer. ARM chips: the M1 and all smartphones."],
 ["What does **CISC** stand for, and who uses it?","Complex instruction set computer. x86-64 chips from Intel and AMD."],
 ["Snake in the video: instructions on ARM and on x86-64?","676 on ARM (RISC) and 560 on x86-64 (CISC)."]
],
explainCard:{concepts:[
 {icon:"chip", label:"RISC", text:"ARMv8.4 on the M1: 354 simple instructions, steady speed, energy efficient.", highlights:["energy efficient"]},
 {icon:"chip", label:"CISC", text:"x86-64 on Intel and AMD: thousands of instructions that each do more.", highlights:["thousands"]},
 {icon:"gear", text:"A compiler turns the same C++ into different instruction lists: 676 for ARM, 560 for x86-64.", highlights:["compiler"]}],
 clarification:"The video calls these simplified differences. Modern chips of both kinds borrow ideas from each other."}
},

/* ============ 17 ============ */
{id:"b17", lab:"none", title:"Extrapolating to the M1", start:"31:09", end:"33:36",
summary:"The simple analogy is very close to a real Apple IIe: floppy drives are the shelves, DRAM chips are the cart, and the 6502 die holds the decoder, ALU, program counter and registers. It has no cache. For the M1 the table must become much bigger, with areas for each core, and one performance core adds caches, a pipeline and a branch predictor.",
focus:"Notice why the 6502 needs no cache, and what one M1 performance core adds.",
watchFor:[
 "At 31:25: the analogy is close to the **Apple IIe**: floppy drives = shelves, DRAM chips = cart.",
 "At 31:41: inside the 6502: instruction decoder, ALU, program counter, current instruction register.",
 "At 32:24: **no cache** in the 6502: DRAM in the 80s was as fast as the instructions.",
 "At 32:51: for the M1 the table gets much bigger, with areas for each core and the GPU.",
 "At 33:16: one performance core: separate **64 KB** data and instruction caches.",
 "At 33:22: a **pipeline** queues eight instructions each clock cycle, and a **branch predictor** helps it."
],
deferred:["The other blocks of the performance core. That is the next part.","How a branch predictor guesses. Only named here."],
oneLiner:"The 6502 really is the simple analogy with no cache, and an M1 performance core is the same idea made much bigger, with caches, a wide pipeline and a branch predictor added.",
analogy:"The 6502 is one cook at a small table. The M1 is a large kitchen with several cooks, each with a bigger table, their own shelf of ingredients within reach, and a helper who guesses the next order.",
mistake:"Thinking the M1 works on a different principle. It still fetches, decodes and executes; it just does many at once and keeps data closer.",
guess:"Why might a chip from the 1980s work fine without any cache memory?",
explain:`<h3>The analogy is a real 6502</h3>
<ul><li><b>Floppy drives</b> = the bookshelves. <b>DRAM chips</b> = the cart.</li>
<li>The 6502 die has the <b>instruction decoder</b>, the <b>ALU</b>, the <b>program counter</b>, the <b>current instruction register</b> and the other registers.</li>
<li>The video points out where the PC fetches an instruction, where instructions and data are bussed in and out to the DRAM, and where the decoder makes the control signals.</li></ul>
<h3>Why no cache?</h3>
<p>On screen: the 6502's clock step is about <b>980 ns</b> and DRAM access took <b>150 to 200 ns</b>. The memory answered faster than the CPU could take a step, so a closer, faster copy was not needed. The table in the analogy is even smaller: no open book on it.</p>
<p>Today it is the other way round. The M1 takes a step in about a third of a nanosecond, far faster than DRAM. So it keeps a small, very fast copy of what it needs right on the die: the cache.</p>
<h3>Scaling up to the M1</h3>
<ol><li>Make the table much bigger.</li>
<li>Mark off areas for each performance core, each efficiency core, the GPU and other parts.</li>
<li>Inside one performance core:
 <ul><li>Separate <b>64 KB caches</b> for data and for instructions.</li>
 <li>A <b>pipeline</b> that queues eight instructions for each clock cycle.</li>
 <li>A <b>branch predictor</b>, to reduce problems with conditional branches and keep the pipeline flowing.</li></ul></li></ol>
<h3>Why a branch predictor?</h3>
<p>Remember Part 9: a conditional branch decides where the program goes only when it executes. But a pipeline has already started fetching the next instructions. Which ones? The predictor guesses the direction, so the pipeline does not have to wait.</p>`,
check:{q:"Why did the 6502 need no cache? And what do the caches, the pipeline and the branch predictor add in an M1 performance core?",
 rubric:[["The 6502's memory (DRAM) was as fast as its steps, so no closer copy was needed",34],["The M1 core has its own instruction and data caches, and a pipeline that works on several instructions each cycle",33],["The branch predictor guesses which way a branch goes so the pipeline does not have to wait",33]]},
practice:`<p>The video's diagram says each cache is 64 KB. Ask this Mac for its own numbers in Terminal:</p><pre><code>sysctl hw.perflevel0.l1icachesize hw.perflevel0.l1dcachesize</code></pre><p>The answers are in bytes. Divide by 1024 to get KB and write both next to the video's 64. Are they the same? (The video itself says its diagrams are approximations.)</p>`,
experiment:`<p>Read this Mac's real cache sizes and compare them with the diagram in the video.</p>`,
practiceMinutes:4,
reviewQuestion:"A pipeline has already fetched the next instructions when it reaches a conditional branch. What problem does that cause, and which part of the M1 core deals with it?",
questions:[
 {t:"32:24", q:"Why is there no cache in the 6502?", a:"The DRAM chips in the 80s were just as fast as the instructions, so the table in the analogy is even smaller."},
 {t:"33:22", q:"What does the branch predictor do?", a:"It reduces issues with conditional branching and helps the pipeline run smoothly."}
],
cards:[
 ["Why did the 6502 have no cache?","Its memory was as fast as the CPU's own steps, so nothing closer was needed."],
 ["What is a **branch predictor** for?","It guesses the direction of a conditional branch so the pipeline can keep fetching without waiting."],
 ["In the Apple IIe, what were the bookshelves and the cart?","Floppy drives were the bookshelves; DRAM chips were the cart."]
],
explainCard:{concepts:[
 {icon:"box", label:"APPLE IIe", text:"floppy drives are the shelves, DRAM chips the cart, the 6502 the table."},
 {icon:"info", label:"NO CACHE", text:"memory was as fast as the 6502's steps."},
 {icon:"chip", label:"M1 CORE", text:"64 KB instruction and data caches, and a pipeline of eight instructions each cycle.", highlights:["pipeline"]},
 {icon:"flag", text:"A branch predictor keeps the pipeline flowing through conditional branches.", highlights:["branch predictor"]}],
 clarification:"The chapter before this one in the video is \"About Branch Education\" (30:09 to 31:09). The side trip skips it."}
},

/* ============ 18 ============ */
{id:"b18", lab:"none", title:"The Diagram of a Performance Core", start:"33:36", end:"34:09",
summary:"The core diagram matches the analogy block by block: a pipelined instruction decoder, 32 general-purpose registers, the calculator split into eight smaller calculators that each handle a few functions, and a special section for load and store instructions.",
focus:"Notice what happened to the sheet of paper and to the calculator in the M1's diagram.",
watchFor:[
 "At 33:34: the **pipelined instruction decoder** (four decoders side by side).",
 "At 33:39: **32 general-purpose registers** instead of four.",
 "At 33:45: the calculator is broken into **eight smaller calculators**, each with a few functions.",
 "At 33:51: a special section for **load and store** instructions.",
 "At 33:58: this is just one core; the GPU and the neural processor are built differently."
],
deferred:["Rename and reorder buffer, dispatch, port queues. They are on the diagram but the video does not explain them.","The GPU's architecture. Part 20."],
oneLiner:"In an M1 performance core the paper has 32 registers, the one calculator is eight smaller specialised ones, the decoder works on several instructions at once and loads and stores have their own section.",
analogy:"One cook with one knife has become a line of eight specialists: one chops, one fries, one bakes. Several steps of the recipe can be done at the same moment.",
mistake:"Thinking eight calculators means eight cores. All eight are inside one core, working on different instructions of the same program.",
guess:"If a core works on many instructions at once, what must happen to its one calculator?",
explain:`<h3>The diagram against the analogy</h3>
<div class="tbl"><table><thead><tr><th>Analogy (and the 6502)</th><th>M1 performance core</th></tr></thead><tbody>
<tr><td>The robot reads one instruction</td><td>Instruction fetch feeds a <b>pipelined decoder</b>: four decoders side by side, then a decode queue</td></tr>
<tr><td>Sheet of paper with 4 registers</td><td><b>32</b> general-purpose registers</td></tr>
<tr><td>One calculator (ALU)</td><td><b>Eight</b> smaller calculators, each handling a few functions: branch, ALU, multiply and divide, and others</td></tr>
<tr><td>Load and store done by the robot</td><td>A <b>special section</b> for load and store: load buffer, store buffer, load store unit</td></tr>
<tr><td>One open book</td><td>Separate L1 instruction cache and L1 data cache</td></tr>
</tbody></table></div>
<h3>Why split the calculator?</h3>
<p>The pipeline brings in several instructions each cycle. One calculator could do only one of them at a time. Eight smaller ones can each take a different instruction in the same cycle: one adds, one compares for a branch, one multiplies.</p>
<p>The video adds that this is the layout of a single core. The graphics processor and the neural processor on the same chip have entirely different architectures.</p>
<div class="callout"><b>You can now read the diagram from Part 2.</b> Bottom to top it is the cycle: fetch → decode → registers → execute units → load and store → cache.</div>`,
check:{q:"In the M1 performance core diagram, what happened to the analogy's sheet of paper (registers) and its calculator (ALU), and what got its own section?",
 rubric:[["The registers: 32 general-purpose registers instead of four",35],["The calculator is split into eight smaller calculators that each handle a few functions",40],["Load and store instructions have their own special section",25]]},
practice:`<p>Open <b>Graphics</b> and look at the four frames of the diagram. Find and write down where you see: instruction fetch, the decoders, the registers, the ALUs, and the load and store section. Next to each write the object from the analogy it replaces.</p>`,
experiment:`<p>Find five blocks on the core diagram and match each to an object in the analogy.</p>`,
practiceMinutes:3,
reviewQuestion:"An M1 performance core has eight \"calculators\" where the analogy had one. Why is that useful, and is it the same thing as having eight cores?",
questions:[
 {t:"33:39", q:"How many general-purpose registers does the diagram show?", a:"32."},
 {t:"33:45", q:"What is one key difference between the calculator in the analogy and the M1 core?", a:"The calculator is broken up into eight separate smaller calculators, each handling a few functions."}
],
cards:[
 ["How many general-purpose registers in the M1 core diagram?","32."],
 ["What became of the single ALU calculator in the M1 core?","It is split into eight smaller calculators, each handling a few functions."]
],
explainCard:{concepts:[
 {icon:"gear", label:"DECODER", text:"pipelined: several instructions are decoded together."},
 {icon:"file", label:"REGISTERS", text:"32 general-purpose registers instead of four."},
 {icon:"list", label:"CALCULATOR", text:"eight smaller calculators, each handling a few functions.", highlights:["eight"]},
 {icon:"arrow", label:"LOAD / STORE", text:"a special section of their own."}],
 clarification:"Some blocks on the diagram, such as the rename and reorder buffer, are not explained in the video. It is fine to leave them for later."}
},

/* ============ 19 ============ */
{id:"b19", lab:"none", title:"CPU vs SoC", start:"34:09", end:"34:58",
summary:"The M1 holds three kinds of processor (CPU cores, a GPU and a neural processing unit) plus hardware accelerators such as the media engine. That makes it closer to a system on a chip (SoC) than a traditional CPU. The video says desktop CPUs can be called SoCs too, so the difference is more marketing than technical.",
focus:"Notice what is on the M1 besides the CPU cores, and what the video says about the word SoC.",
watchFor:[
 "At 34:06: three types of processor on one chip, plus **hardware accelerators** like the media engine.",
 "At 34:15: that makes the M1 closer to a **system on a chip** (SoC) than a traditional CPU.",
 "At 34:22: all these processors, even a desktop CPU, can be considered SoCs.",
 "At 34:30: the difference is more a **marketing** term than a technical one.",
 "At 34:35: the diagrams are **close approximations**, because the designs are proprietary."
],
deferred:["How the neural processing unit works. Not in this video.","The rise of SoCs. An on-screen note says another video is in progress."],
oneLiner:"The M1 is a system on a chip because one die holds CPU cores, a GPU, a neural processor and accelerators, though the video says the CPU or SoC label is mostly marketing.",
analogy:"A CPU is one office; an SoC is the whole building with many offices under one roof. Most \"offices\" sold today are really small buildings.",
mistake:"Saying \"the M1 is the CPU\". The CPU cores are only one area of the M1; much of the die is other things.",
guess:"Besides CPU cores, what else do you think is built into the M1 chip?",
explain:`<h3>What the video says</h3>
<p>On screen the M1 is added up like this:</p>
<p><b>Processing cores + GPU + NPU + hardware accelerators + I/O + NoC + security + other = M1 SoC</b></p>
<ul><li>Three types of processor: the CPU's <b>processing cores</b>, the <b>GPU</b> (graphics) and the <b>NPU</b> (neural processing unit).</li>
<li><b>Hardware accelerators</b>, such as the media engine.</li>
<li>So the M1 is closer to a <b>system on a chip</b> than a traditional CPU.</li>
<li>All the processors in these devices, including the CPU in a desktop computer, can be considered SoCs. The difference is more a marketing term than a technical one.</li></ul>
<h3>A note about trust</h3>
<p>The M1 and all modern processors are proprietary designs. The diagrams in the video are close approximations, built with input from industry experts. This is why a number on a diagram may differ from what your own Mac reports (Part 17).</p>
<div class="callout"><b>Link to Part 14:</b> a hardware accelerator such as the media engine is the ASIC idea placed inside the SoC: a fixed pattern of gates for one job, next to cores that can run anything.</div>`,
check:{q:"Why is the M1 closer to a system on a chip than a plain CPU, and what does the video say about the labels CPU and SoC?",
 rubric:[["One chip holds several processors: CPU cores, a GPU and a neural processing unit",45],["It also holds hardware accelerators such as the media engine, and other parts",20],["The label is more marketing than technical: desktop CPUs can be considered SoCs too",35]]},
practice:`<p>Open <b>Apple menu → About This Mac</b>. Does it say "Processor" or "Chip"? Then list three things that are inside that one chip besides the CPU cores, using the frame at 34:18 in <b>Graphics</b>.</p>`,
experiment:`<p>Check how this Mac names its chip and list what else is inside it.</p>`,
practiceMinutes:2,
reviewQuestion:"Someone asks whether the M1 is a CPU. Give an accurate two-sentence answer.",
questions:[
 {t:"34:06", q:"Which three types of processor does the M1 include?", a:"The CPU's processing cores, the graphics processing unit (GPU) and the neural processing unit (NPU)."},
 {t:"34:30", q:"According to the video, is the difference between a CPU and an SoC mostly technical?", a:"No. It is more a marketing term than a technical one, because the processors in all these devices can be considered SoCs."}
],
cards:[
 ["What does **SoC** stand for?","System on a chip: one chip with CPU cores, GPU, other processors and accelerators together."],
 ["What is an **NPU**?","A neural processing unit: a processor on the chip built for neural-network calculations."]
],
explainCard:{concepts:[
 {icon:"chip", text:"One chip holds CPU cores, a GPU and a neural processing unit.", highlights:["neural processing unit"]},
 {icon:"gear", text:"It also holds hardware accelerators such as the media engine.", highlights:["hardware accelerators"]},
 {icon:"tag", label:"SoC", text:"system on a chip. The label is more marketing than technical."}],
 clarification:"The diagrams are approximations because the real designs are secret. Trust the ideas more than any single number on a diagram."}
},

/* ============ 20 ============ */
{id:"b20", lab:"none", title:"GPU Architecture", start:"34:58", end:"35:55",
summary:"In the analogy, one GPU core (a CUDA core) is about as complex as a whole 6502. A GPU chip has 10,000 to 20,000 of them. GPUs use 32-bit ALUs and work in a way called SIMT: one instruction is fetched and decoded once, then sent to a batch of cores that each execute it on different data.",
focus:"Notice what one GPU core is compared to, and what is shared and what is different in SIMT.",
watchFor:[
 "At 35:04: a GPU **CUDA core** is about as complex as the **6502**.",
 "At 35:11: **10,000 to 20,000** CUDA cores in one GPU chip.",
 "At 35:21: GPUs typically use **32-bit** ALU calculators.",
 "At 35:25: **SIMT**: single instruction, multiple thread.",
 "At 35:38: the cores execute the same instruction with **different addresses and data**."
],
deferred:["The details of SIMT and GPU architecture (35:43). The video points to its separate video on how graphics cards work."],
oneLiner:"A GPU is thousands of simple cores, each about as complex as a 6502, that all execute the same fetched and decoded instruction on different data.",
analogy:"A hall with ten thousand desks, each with a small calculator. One announcer reads out a single step, and every desk does that step on its own numbers.",
mistake:"Thinking a GPU is a faster CPU. Each GPU core is simple; the power comes from thousands doing the same step at once.",
guess:"A GPU must do the same maths on millions of pixels. How might it be organised differently from a CPU?",
explain:`<h3>What the video says</h3>
<ul><li>One GPU <b>CUDA core</b> is very similar in complexity to the architecture of the 6502.</li>
<li>A single GPU chip has <b>10,000 to 20,000</b> CUDA cores: like a massive array of 6502 cores.</li>
<li>GPUs typically use <b>32-bit</b> ALU calculators.</li>
<li>They perform <b>SIMT</b>: single instruction, multiple thread. One instruction is fetched and decoded, then distributed to a batch of cores. Those cores execute it using different addresses and data.</li></ul>
<h3>CPU against GPU, in the terms of this video</h3>
<div class="tbl"><table><thead><tr><th></th><th>CPU core (M1 performance core)</th><th>GPU</th></tr></thead><tbody>
<tr><td>Cores</td><td>A few, each very complex</td><td>Thousands, each simple</td></tr>
<tr><td>Fetch and decode</td><td>Each core does its own</td><td>Done once, shared by a batch of cores</td></tr>
<tr><td>Execute</td><td>Different instructions at once</td><td>The same instruction on different data</td></tr>
<tr><td>Good at</td><td>Programs full of decisions</td><td>The same calculation repeated on many values</td></tr>
</tbody></table></div>
<h3>The cycle is still there</h3>
<p>SIMT is still fetch, decode, execute. Only the execute step is multiplied. That is why the video says a GPU shares the same technological DNA (Part 2).</p>`,
check:{q:"In the analogy, what is a GPU made of, and what does SIMT mean?",
 rubric:[["Thousands of simple cores (10,000 to 20,000), each about as complex as a 6502",40],["SIMT: one instruction is fetched and decoded once and sent to a batch of cores",35],["Each core executes that instruction on different addresses and data",25]]},
practice:`<p>A GPU must make 1,000 pixels brighter by the same amount. In two sentences, describe how SIMT does it: what is done once, and what is different for each core?</p>`,
experiment:`<p>Describe how SIMT would brighten 1,000 pixels.</p>`,
practiceMinutes:2,
reviewQuestion:"Compare a CPU core and a GPU using fetch, decode and execute: which steps are shared between GPU cores, and which step is repeated on each?",
questions:[
 {t:"35:04", q:"What is a single CUDA core compared to?", a:"The 6502: it is very similar in complexity to the 6502's architecture."},
 {t:"35:25", q:"What does SIMT stand for and how does it work?", a:"Single instruction, multiple thread. One instruction is fetched, decoded and then distributed to a batch of cores, which execute it using different addresses and data."}
],
cards:[
 ["What does **SIMT** stand for?","Single instruction, multiple thread: one fetched and decoded instruction is executed by many cores on different data."],
 ["How many CUDA cores are in one GPU chip, according to the video?","10,000 to 20,000."],
 ["One GPU core is about as complex as which chip?","The 6502."]
],
explainCard:{concepts:[
 {icon:"chip", text:"One GPU CUDA core is about as complex as a whole 6502.", highlights:["6502"]},
 {icon:"list", text:"A GPU chip has 10,000 to 20,000 of these cores.", highlights:["10,000 to 20,000"]},
 {icon:"chain", label:"SIMT", text:"one instruction is fetched and decoded, then a batch of cores execute it on different data."}],
 clarification:"This is the last learning part. The final chapter of the video (35:55) is the thank-you to supporters."}
}
]};

/* ---- topics the video leaves for later ---- */
window.STUDY.parked = [
 {t:"3:03", what:"The diagram of a performance core", where:"Shown early as a teaser. Explained in Parts 17 and 18 of this side trip."},
 {t:"14:08", what:"How compilers turn code into instructions", where:"Part 16 here (RISC vs CISC). In the course: Intro to C **Day 1**, Part 3, and the assembly from **Day 2**."},
 {t:"19:02", what:"Real instruction decoding", where:"The video says it is much more complicated. Intro to C **Day 2** shows real x64 instructions."},
 {t:"22:43", what:"Other optimizations in modern processors", where:"Parts 17 and 18: caches, the wide pipeline, the branch predictor."},
 {t:"24:25", what:"Quantum computers", where:"Future Branch Education videos."},
 {t:"25:26", what:"How data moves between cache, DRAM and SSD", where:"A separate Branch Education video, announced as in progress."},
 {t:"29:57", what:"More pros and cons of RISC and CISC", where:"Saved for another Branch Education video."},
 {t:"35:43", what:"SIMT and GPU architecture in detail", where:"Branch Education's separate video on how graphics cards work."}
];

window.STUDY.tools = [
 {role:"see real instructions", name:"Compiler Explorer", url:"https://godbolt.org/", use:"Type C and see the instructions it becomes. Switch between an x86-64 compiler and an ARM64 compiler to compare CISC and RISC for the same code (Parts 7, 9 and 16)."},
 {role:"see a 6502 work", name:"Visual 6502", url:"http://www.visual6502.org/", use:"A transistor-level simulation of the real 6502 chip in your browser. Optional: look at it after Part 17."},
 {role:"the source", name:"Branch Education", url:"https://www.youtube.com/@BranchEducation", use:"The channel behind this video. Its videos on graphics cards and transistors continue where this one stops."}
];

/* ---- page settings for this side trip ---- */
window.STUDY.title = "Side trip: How CPUs Work";
window.STUDY.eyebrow = "Side trip from Intro to C Day 1 · Branch Education · 36 min";
window.STUDY.storageKey = "side-trip-how-cpus-work";
window.STUDY.course = "side trip: How CPUs Work (Branch Education)";
window.STUDY.unitPrefix = "cpu01";
window.STUDY.unitLabel = "CPU side trip";
window.STUDY.cardTag = "side-trip::how-cpus-work";
window.STUDY.video = { file: "How_CPU_Works.mp4", length: "36:22" };
window.STUDY.teacher = "Branch Education";
window.STUDY.lessonLabel = "Side trip";
window.STUDY.positionHeading = "Side trip position";
window.STUDY.watchNote = "This is a side trip: there is no Windows code to write. Watch the animation, then open **Graphics** to go through the video's own pictures one by one.";
window.STUDY.pendingNote = "Small tasks for this Mac. They do not block the course; do them when you can.";
window.STUDY.micContext = "How CPUs work: central processing unit, fetch, decode, execute, ALU, registers, program counter, accumulator, cache, DRAM, SSD, 6502, M1, pipeline, RISC, CISC.";
window.STUDY.terms = ["ALU","DRAM","SSD","CIR","6502","M1","SoC","RISC","CISC","ASIC","FPGA","SIMT","CUDA","ARMv8.4","x86-64","accumulator","interposer"];
window.STUDY.qa = {
  label: "back to the course",
  html: `<p><b>Side trip finished.</b> You left the course at Intro to C Day 1, Part 4 (processors, cores, hyperthreads) to understand what a CPU does. Now go back.</p>
<p>Take these four ideas with you:</p>
<ul><li><b>The cycle</b>: fetch, decode, execute, paced by the clock. This is what "the CPU runs your .exe" means.</li>
<li><b>The program counter</b>: Windows starts your program by pointing it at the entry point. In the debugger it is the yellow arrow.</li>
<li><b>Instructions</b>: one line of C becomes several simple instructions, and the compiler may only use the ones its target chip has (x64 on the Windows PC, ARM on this Mac).</li>
<li><b>Cores</b>: each graph in Task Manager is one more fetch, decode, execute cycle running at the same time.</li></ul>
<p>The reviews for these parts stay in the normal review list, so they will come back with the rest.</p>`
};

/* ---- the video's own graphics, one by one, for the Graphics panel ---- */
(function(){
const fig=(id,t,title,text)=>{
  const [m,s]=t.split(":");
  return `<figure style="margin:0 0 24px"><img src="frames/${id}-${m.padStart(2,"0")}m${s}s.jpg" alt="${title}" loading="lazy" style="display:block;width:100%;height:auto;border-radius:8px"><figcaption style="margin-top:8px"><b>${t} · ${title}.</b> ${text}</figcaption></figure>`;
};
const V={
b01:[
 ["0:17","Every device has a CPU","Real chips from different devices float above the title, among them a desktop CPU and a phone chip. The point of the picture: different devices, the same kind of part."],
 ["0:27","The M1 on the laptop's motherboard","The copper block above the chip is its wiring, lifted off so you can see it. A processor is transistors plus dozens of layers of wires that connect them."],
 ["1:02","The 6502 opened up","The small coloured square in the middle is the whole processor. The gold lines carry its signals out to the 40 pins. The label gives its size: 4,528 transistors."],
 ["1:20","One chip, a whole generation","Pink lines run from the 6502 to the Atari, the Commodore 64, the Apple IIe and the NES. The same chip was the heart of all of them."],
 ["1:30","The M1's number","16,000,000,000 transistors. Compare with 4,528: about 3.5 million times more."]
],
b02:[
 ["1:46","Both chips on one timeline","The 6502 at the left end, the M1 at the right, 45 years between them. The video's claim is that the same principle runs along this whole line."],
 ["2:22","More members of the family","Above the timeline: SoC, M1, SoC, GPU, CPU and AI chip. Different jobs and sizes, the same technological DNA."],
 ["2:46","Looking for the DNA inside the M1","The label on the chip reads 16 billion transistors and 3 trillion calculations a second. The video now opens this chip to look for what it shares with the 6502."],
 ["3:04","The teaser diagram","This is the block diagram of one M1 performance core. It looks impossible now. Parts 17 and 18 come back to it, and by then you can read it."]
],
b03:[
 ["3:39","The laptop in layers","The teardown lifts each layer and labels it. Here the touchpad and, below it, the battery cells."],
 ["3:44","The motherboard","The long green board in the middle carries the chips. Everything else in the laptop is power, cooling, input and output for it."],
 ["3:58","DRAM and CPU side by side","With the heat pipe removed: the two green DRAM chips sit right next to the large silver cover of the CPU, inside the gold frame."],
 ["4:11","Part 1 of the package: the cover","The cover glows green. It protects the chip and conducts heat away from it."],
 ["4:16","The package pulled apart","The cover on the left, the green interposer on the right, and the small die between them."],
 ["4:25","The integrated circuit","The small rainbow square is the die: the functional part of the CPU. The green board under it is the interposer that connects it to the motherboard."]
],
b04:[
 ["4:46","Sections of the die","Blue boxes mark the performance cores and green boxes the efficiency cores. The rest of the surface is graphics cores, cache and other sections."],
 ["5:00","One performance core as a diagram","The blocks of one core are labelled and rearranged into the blue architectural diagram. It shows how data and instructions move inside a single core."],
 ["5:22","The maze of wires","Zoomed in much further: many layers of copper wires. They connect the transistors, which are at the very bottom."],
 ["5:36","Transistors","The dashed box marks about 650 transistors. The whole chip has 16 billion of them."]
],
b05:[
 ["6:10","Only 20% right","The chip next to a calculator, and a meter that stops at 20%. A calculator is a real part of the picture, but a small part."],
 ["6:20","The table","The calculator now sits on a table with a pencil and a sheet of paper."],
 ["6:30","Shelves and cart","The table stands in a huge library. The white cart beside it carries a small stack of books between the shelves and the table."],
 ["6:36","The controller","The robot is the control unit. It moves the books, reads them, writes, and presses the calculator's buttons."],
 ["6:54","The working area","Seen from above: calculator, pencil, sheet of paper and one open book. Almost everything in the next parts happens on this table."]
],
b06:[
 ["7:17","Bookshelves = SSD","The laptop's board laid out in the library. The purple chips are the SSD: the long-term storage that the bookshelves stand for."],
 ["7:32","Open book = cache","The striped frame around the one open book matches the cache memory area on the die at the left. Very little room, very close."],
 ["7:50","Sheet of paper = registers","The paper has four lines, R0 to R3: the general-purpose registers. The note at the top says real CPUs have 16, 32 or more."],
 ["8:05","Calculator = ALU","The calculator is outlined, next to the place on the core diagram where the ALUs are. ALU means arithmetic logic unit."],
 ["8:29","Increment","The +1 button. One of the ALU's simplest functions: make a number one larger."],
 ["8:47","Bit shift","Left side: in decimal, adding a 0 at the end multiplies by 10. Right side: in binary, 0011 0101 becomes 0110 1010, which is multiplying by 2."],
 ["9:07","Logical AND","R0 = 10111011 and R1 = 00010110. The result 00010010 has a 1 only where both inputs have a 1."],
 ["9:31","Comparison and flags","R0 and R1 hold the same number, so the green equals flag is up. The less-than and greater-than flags stay down. These flags are what a branch reads in Part 9."]
],
b07:[
 ["10:06","Three places for a program","Labels over the table and cart: cache is temporary, very small and very quick; DRAM is temporary, limited and quick. The SSD shelves are huge, semi-permanent and slow."],
 ["10:42","Recipe and ingredients","The cookbook picture: instructions are the numbered steps, data is the ingredients. A program needs both."],
 ["11:30","Instruction 1: load","Left page: the list of instructions. Right page: the data, addresses with values. The load copies the value at Address[161] into Register[0]."],
 ["11:54","Instruction 2: increment","The value from register 0 goes through the ALU calculator and +1 is pressed."],
 ["12:15","Three instructions = one line of code","The bracket joins load, increment and store to a single line in main.cpp: i++;"]
],
b08:[
 ["12:43","A new place on the paper","Below the four registers: PC, the program counter. It will hold the number of the next instruction."],
 ["12:51","PC = 005","The PC holds 5, so instruction 5 is the one to do now. When it is done the PC becomes 6."],
 ["13:15","PC = 007: a jump","Line 7 is outlined on the page: jump Address[42]."],
 ["13:21","PC = 042","The jump wrote 42 into the program counter. The next instruction is line 42, not line 8."]
],
b09:[
 ["13:52","The loop","A for loop that repeats the two lines inside it four times. The green shape counts the four passes."],
 ["14:22","Code to instructions, by colour","Each coloured piece of the for line points to the instructions of the same colour on the page. One line of code is spread over several groups."],
 ["14:40","The test i < 4","Three instructions, at addresses 6, 7 and 8: load i into register 0, compare it with 4, and branch if greater than or equal to address 23."],
 ["14:58","Compare sets the flags","The ALU shows COMPARE 0 AND 4. Above it are three flags: less than, greater than, equals. With i = 0 only the less-than flag goes up. Greater-than and equals stay down, so the branch does nothing and the loop continues."],
 ["15:28","The jump back","The green arrow goes from the jump at the bottom (address 22) up to address 6, the top of the loop."],
 ["15:46","C++ becomes machine code","Left: the C++ you write. Right: the binary the CPU runs. The narration adds that the readable form of machine code is called assembly."]
],
b10:[
 ["16:17","The 6502's whole list","Every instruction the 6502 can complete, in two columns: 56 in total."],
 ["16:22","The M1's list","The M1's instructions scroll past beside the chip: 354 in total."],
 ["16:30","All possible instructions","Both lists together. Read a few names: add, compare, load, branch. Most are simple."],
 ["16:50","Every program is made of these","The app icons beside the laptop stand for real programs. Each one is a very long sequence taken from the same list."]
],
b11:[
 ["17:14","The three steps","A bar across the top of the table: Fetch, Decode, Execute. The dot shows the step in progress."],
 ["17:32","Fetch","Use the PC to find the instruction, and copy the instruction into the CIR. On the paper: PC is 003 and the CIR holds add Register[0] to Register[1], machine code 1000 0001."],
 ["17:56","Decode: the decoder","The round white device is the instruction decoder, part of the CPU controller. It reads the instruction from the CIR and interprets the machine code."],
 ["18:13","Inside the decoder","The lid opens on a dense arrangement of logic gates. This circuit turns the bits of the instruction into control signals."],
 ["18:44","The first bit","1 means use the ALU. 0 means a load, a store or a jump. The orange wires leaving the decoder are the control signals."],
 ["18:50","The next three bits: which function","000 add, 001 subtract, 010 multiply, 011 plus or minus one, 100 shift, 101 logical operations, 110 bitwise comparisons, 111 compare. The registers hold 42 and 68."],
 ["18:58","The last four bits: which registers","00 is register 0, 01 is register 1, 10 is register 2, 11 is register 3. So 1000 0001 means: ALU, add, register 0 and register 1."],
 ["19:26","Execute","The ALU display shows 42 + 68. The green clock beside it stands for the timing signals that save the result at the right moment."],
 ["20:56","The cycle again: a store","The second run of the cycle. This time the instruction is a store: the value in the accumulator is written to a memory address in the data pages."]
],
b12:[
 ["21:27","The same cycle in both chips","The 6502's die on the Apple IIe and the M1's die on the laptop, with the clock between them. Both run fetch, decode, execute."],
 ["21:57","One step for each tick","The square wave is the clock signal. Each pulse is labelled Fetch, Decode or Execute in turn. On the 6502 one step takes a microsecond."],
 ["22:03","The 6502 is 8-bit","The 6502 and its ALU calculator, with bits streaming in. Its registers and the ALU's inputs and output are 8 bits wide."],
 ["22:15","The M1 is 64-bit","The same picture with 64-bit numbers, far wider. The M1 handles much larger numbers in one step."],
 ["22:39","Pipelining","Rows are instructions, columns are clock cycles. Instruction 1 does Fetch, Decode, Execute in cycles 1 to 3; instruction 2 starts in cycle 2, and so on. Seven instructions finish in nine cycles."]
],
b13:[
 ["23:18","The cycle in every device","The coloured spiral is fetch, decode, execute repeating. It runs above a whole row of devices: consoles, laptop, graphics card, server."],
 ["23:34","Counting the cycles","The spiral becomes too tight to see and a counter shows how many operations have been done. A single chip does trillions to quadrillions each second."]
],
b14:[
 ["23:58","An ASIC","A Bitcoin mining computer. Inside, it is full of chips that can do one calculation only."],
 ["24:04","ASIC and FPGA","Left: the ASIC boards of the miner. Right: a car and a camera, where FPGAs are the main chips. Neither kind fetches or decodes instructions."],
 ["24:28","Quantum computer","Further away again: a machine based on qubits and quantum circuits. The video leaves it for future videos."]
],
b15:[
 ["24:44","Five steps","The bar on the table now has five dots: Fetch, Decode, Execute, Memory, Writeback."],
 ["24:48","Memory","The cart next to the shelves, labelled Memory: books are moved from the shelves to the cart and on to the table."],
 ["25:04","Writeback","The pink lines show data being written back, and old books returning to the cart and the shelves. The note at the top says memory and writeback are a lot more complicated and will get another video."],
 ["25:12","Memory address register","The label lists a bookshelf number, a row and a book number. This register holds the address of the data being read or written."]
],
b16:[
 ["28:15","RISC and ARMv8.4","The M1's die with the label RISC and the name of its instruction set, ARMv8.4."],
 ["28:39","Compiling Snake for ARM","The Snake game's C++ and the RISC instruction set both go into the ARMv8 compiler. Out comes a list of assembly instructions, scrolling on the right. The counter on the output box is still climbing here; it ends at 676."],
 ["29:09","The CISC side","Intel and AMD chips. The same 145 lines of C++, but the instruction set is CISC, with 5000+ possible instructions. Compiled for x86-64, Snake comes out as 560 instructions."],
 ["29:57","The comparison table","RISC: small and simple instructions, one clock cycle, software and compiler optimization, energy efficient, easier to design, fixed format, used in embedded and mobile devices. CISC: large and complex instructions, two or more cycles, hardware and microprogramming, not energy focused, harder to design because of the complex decoder, variable format."]
],
b17:[
 ["31:58","Inside the real 6502","The die of the 6502 labelled as blocks. The decoder logic on the left is highlighted, with the decoder from the analogy drawn on it: instructions are decoded here and the control signals are generated. On the right: program counter, accumulator and ALU."],
 ["32:22","The same parts as the analogy","The diagram in colour. Find the current instruction register at the top left, and the program counter, accumulator and ALU on the right: the sheet of paper and the calculator."],
 ["32:28","No cache","The red Cache box sits outside the chip, with the program books in it: the 6502 has no cache. Its memory was fast enough without one."],
 ["32:46","From 4,528 to 16 billion","The whole 6502 die, with its transistor count, in the library hall. Next the video shows how much bigger the table must become for the M1."],
 ["33:04","The M1's die, labelled","GPU cores take the top. Four performance cores are at the left and four efficient cores in the middle. Every box is a separate section of the big table."],
 ["33:34","Branch predictor","At the start of the pipeline, next to the L1 instruction cache: the branch predictor. The small tree drawing shows it choosing one of the possible paths ahead of time."]
],
b18:[
 ["33:37","Front end: fetch and decode","Bottom: instruction fetch, with the branch predictor beside it. Above: four decoders (4-way instruction decode) feeding a decode queue. Above that: the rename and reorder buffer."],
 ["33:41","32 registers","The grid of small boxes is the 32 general-purpose registers: the M1's version of the four lines on the sheet of paper."],
 ["33:45","Eight calculators","A row of execution units, each with its own port queue: branch, ALU, ALU, multiply and division ALU, and others. The single calculator has become eight specialised ones."],
 ["33:53","Load and store","The striped boxes under the L1 data cache: load store unit, load buffer and store buffer. Loads and stores have their own section."]
],
b19:[
 ["34:18","What adds up to the M1","The row under the die: processing cores + GPU + NPU + hardware accelerator, then I/O + NoC + security + other = M1 SoC."],
 ["34:30","A desktop CPU on the same scale","The bar under the chip runs from CPU to SoC. The marker for desktop processors from Intel and AMD sits between the two, closer to SoC."],
 ["34:50","Approximations","The labelled M1 with the word Approximations: the real design is secret, so the diagram is a careful estimate."]
],
b20:[
 ["35:11","One CUDA core ≈ one 6502","A single GPU core next to the 6502 die: about the same complexity."],
 ["35:15","10,000 to 20,000 cores","The GPU chip with its count of CUDA cores."],
 ["35:19","A hall of desks","The analogy for a GPU: behind the GPU chip, the library is filled with rows of small desks, each one a simple core."],
 ["35:39","SIMT","The diagram at the top right: one Fetch box, one Decode box, then many core boxes below. One instruction, executed by many cores on different data."]
]};
window.STUDY.blocks.forEach(b=>{
  const v=V[b.id]; if(!v) return;
  b.visual=`<h3>The video's own graphics, in order</h3><p>Go from top to bottom. Each picture is a frame from this part of the video, with the time it appears and what to notice in it.</p>`+v.map(x=>fig(b.id,x[0],x[1],x[2])).join("");
});
})();

window.STUDY.how = `<h2>A side trip, studied the same way</h2>
<p><b>Why you are here:</b> Intro to C Day 1 talks about the CPU, cores and "the instructions the CPU runs". This video shows what that means. When you finish, the page sends you back to the course.</p>
<p><b>Watch → Check → Practice</b>, one part at a time. The 20 parts are the video's own chapters.</p>
<p><b>Graphics:</b> every part has the video's own pictures, in order, each with the time and what to notice. Open <b>Graphics</b> in Study support, or "Show the idea" on the Check step.</p>
<p><b>Check:</b> answer in your own words. Only the visible checklist counts and 80% is enough.</p>
<p><b>Practice:</b> small tasks on this Mac: a Terminal command, a trace on paper, or the Code Lab. There is no Windows code in this side trip.</p>
<p><b>Your place in the course is safe.</b> This side trip saves its own position. <code>./study</code> still opens Intro to C; <code>./study cpu</code> opens this page.</p>
<p>The sponsor, "About Branch Education" and thank-you chapters are skipped.</p>`;
