/* Code Lab: the Mac side of the Windows stand-in (see windows.h).
 * Debug output goes to stderr; the Code Lab page shows it in the Output panel,
 * the way Visual Studio's debugger shows OutputDebugString text.
 */
#include <stdio.h>
#include "windows.h"

void OutputDebugStringA(LPCSTR lpOutputString)
{
    if (lpOutputString) {
        fputs(lpOutputString, stderr);
        fflush(stderr);
    }
}

#ifdef CODELAB_WITH_WINMAIN
int main(void)
{
    return WinMain(0, 0, "", SW_SHOWDEFAULT);
}
#endif
