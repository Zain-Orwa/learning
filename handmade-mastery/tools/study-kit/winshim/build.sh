#!/bin/sh
# Build one course file for the VS Code debugger: a Debug build (-g -O0) using the
# windows.h stand-in in this folder. Called by .vscode/tasks.json.
#
# Usage: build.sh <file.c|file.cpp> [x86_64|arm64]
#   x86_64 (default) runs through Rosetta, so registers and assembly look like Casey's (rax, rip…).
#   arm64 is the Mac's own CPU (x0, pc…).
# Output: <file's folder>/build/<name>   (build/ is ignored by git)
set -e
src="$1"
arch="${2:-x86_64}"
here="$(cd "$(dirname "$0")" && pwd)"
dir="$(cd "$(dirname "$src")" && pwd)"
name="$(basename "$src")"
stem="${name%.*}"
case "$name" in
    *.cpp) cc=clang++ ;;
    *.c)   cc=clang ;;
    *)     echo "Open a .c or .cpp file first (this is $name)."; exit 1 ;;
esac
mkdir -p "$dir/build"
winmain=""
grep -qw WinMain "$dir/$name" && winmain="-DCODELAB_WITH_WINMAIN"
clang -arch "$arch" -g -O0 -c $winmain -I"$here" "$here/winmain_shim.c" -o "$dir/build/winmain_shim.o"
cd "$dir"
$cc -arch "$arch" -g -O0 -I"$here" "$name" build/winmain_shim.o -o "build/$stem"
echo "Built build/$stem ($arch)"
