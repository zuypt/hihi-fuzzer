import sys
import struct
import threading
import os as op
import ctypes
from winappdbg.win32    import *
from time               import sleep
from winappdbg          import System
from winappdbg          import Debug, EventHandler, HexDump, Crash, CrashDump

user32 = ctypes.windll.user32

try:
    from winappdbg import CrashDAO
except ImportError:
    raise ImportError("Error: SQLAlchemy is not installed!")

class Fuzzer(EventHandler):
    def __init__(self, logfile):
        EventHandler.__init__(self)
        self.modules        = {}
        self.loaded_modules = {}
        self.logfile        = logfile
        self.crashed        = 0

    def exception(self, event):
        code    = event.get_exception_code()
        if code in [EXCEPTION_ACCESS_VIOLATION, EXCEPTION_ARRAY_BOUNDS_EXCEEDED, EXCEPTION_ILLEGAL_INSTRUCTION, EXCEPTION_PRIV_INSTRUCTION, EXCEPTION_STACK_OVERFLOW, EXCEPTION_GUARD_PAGE]:
            thread      = event.get_thread()
            process     = event.get_process()
            address     = event.get_fault_address()
            context     = thread.get_context()
            stack_trace = thread.get_stack_trace_with_labels()

            t = '=======CRASH CONTEXT==============='
            print t
            self.logfile.write(t + '\n')
            regs_dump =  CrashDump.dump_registers(context)
            eip       = thread.get_pc()
            code      = thread.disassemble_around(eip)
            print regs_dump
            self.logfile.write(regs_dump)

            code_dump   = CrashDump.dump_code(code,eip)
            label_dump  = CrashDump.dump_stack_trace_with_labels(stack_trace)
            
            print code_dump
            print label_dump

            self.logfile.write(code_dump    + '\n')
            self.logfile.write(label_dump   + '\n')

            for module_name in self.modules:
                m = module_name + ' ' + hex(self.modules[module_name])
                print m
                self.logfile.write(m + '\n')
            self.logfile.write('[**]' + repr(Rands) + '\n')
            self.crashed = 1
            process.kill()

    def load_dll(self, event):
        pid     = event.get_pid()
        module  = event.get_module()
        process = event.get_process()

        base = module.get_base()
        self.modules[module.get_name()] = base

    def printf_hook(self, event):
        global Rands

        process = event.get_process()
        thread  = event.get_thread()

        registers = thread.get_context()
        eax       = registers['Eax']

        d = process.peek_string(eax, fUnicode = True)
        if d[0] == '\x02':
            try:
                Rands.append(int(d[1:].strip()))
            except:
                print repr(d)
                raw_input('[SHIT HAPPENS]')
        elif d[0] == '\x01':
            print d[1:]
            self.logfile.write(d[1:] + '\n')
        elif d[0] == '\x03':
            process.kill()

    def create_process(self, event):
        pid     = event.get_pid()
        process = event.get_process()

        for module in process.iter_modules():
            if module.match_name('EScript.api'):
                base = module.get_base()
                event.debug.break_at(pid, 0x00C74BB + base, self.printf_hook)      

Rands       = []

def fuzz_one(iteration, logfile):
    EXECUTALBE_PATH     = r'C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Acrobat.exe'
    PDF_PATH            = op.getcwd() + r'\trusted\fuzz.pdf'
    # PDF_PATH            = op.getcwd() + r'\test.pdf'
    fuzzer              = Fuzzer(logfile)

    system  = System()
    process = system.start_process( EXECUTALBE_PATH + ' ' + PDF_PATH )

    hMsgBox = None
    while not hMsgBox:
        try:
            hMsgBox = FindWindowA('#32770', 'Warning: JavaScript Window - ')
        except:
            pass
    sleep(5)
    try:
        SetForegroundWindow(hMsgBox)
    except:
        pass
    user32.keybd_event(0xd, 0xd, 0, 0)
    user32.keybd_event(0xd, 0xd, 2, 0)

    with Debug( fuzzer, bKillOnExit = True ) as debug:
        try:
            debug.attach(process.get_pid())
            debug.loop()
        except KeyboardInterrupt:
            print "Interrupted by user"
            debug.stop()
        finally:
            debug.stop()
    return fuzzer.crashed

def main():
    global Rands

    i = 0
    while (1):
        fname   = 'logs\\runs\\iter%d' % i
        logfile = open(fname, 'w')
        crashed = fuzz_one(i, logfile)
        logfile.close()     
        Rands   = []
        op.system('taskkill /f /im adobe_licutil.exe')
        if crashed:
            op.system('move %s %s' % (fname, 'logs\\crashes'))
        i += 1
        
if __name__ == '__main__':
    main()
