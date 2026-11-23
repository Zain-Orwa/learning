/* Code Lab stand-in for <windows.h>.
 *
 * Only the small part of Windows that the Intro to C course uses, so the same
 * code builds on the Mac. Two ways it is used:
 *   - Run (on the Mac): winmain_shim.c supplies OutputDebugStringA and a main()
 *     that calls your WinMain.
 *   - Disassembly (--target=x86_64-pc-windows-msvc): _WIN32 is defined, so the
 *     declarations below match real Windows, like the real header.
 */
#ifndef CODELAB_WINDOWS_H
#define CODELAB_WINDOWS_H

#ifdef _WIN32
#define WINAPI __stdcall
#else
#define WINAPI
#endif
#define CALLBACK WINAPI
#define APIENTRY WINAPI

/* Sizes match Windows: int and long are 32-bit there, so LONG/DWORD use int. */
typedef void *HANDLE;
typedef struct HINSTANCE__ *HINSTANCE;
typedef HINSTANCE HMODULE;
typedef struct HWND__ *HWND;
typedef char CHAR;
typedef char *LPSTR, *PSTR;
typedef const char *LPCSTR, *PCSTR;
typedef int BOOL;
typedef int INT;
typedef int LONG;
typedef unsigned int UINT;
typedef unsigned int DWORD;
typedef unsigned short WORD;
typedef unsigned char BYTE;
typedef void VOID;

#define TRUE 1
#define FALSE 0
#define SW_SHOWDEFAULT 10

#ifdef __cplusplus
extern "C" {
#endif

void WINAPI OutputDebugStringA(LPCSTR lpOutputString);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd);

#ifdef __cplusplus
}
#endif

#define OutputDebugString OutputDebugStringA

#ifndef _WIN32
/* MSVC's breakpoint intrinsic; on the Mac it stops the program with a trap. */
#define __debugbreak() __builtin_debugtrap()
#endif

#endif
