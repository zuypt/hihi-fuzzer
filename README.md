# How:
* Instead of passing random arguments I carefully craft each argument for each native function call.
* Using app.SetInterval instead of for loop so there is time for page rendering.

# Dependencies:
* https://github.com/MarioVilas/winappdbg
* https://github.com/gdelugre/origami
* 32bit python
* capstone

# Usage:
 * Open `js.pdf` with Adobe Acrobat a console would appear. Paste the code inside `init.js` into the console and execute => save as template.pdf.
 * Template would contain many different type of Fields.
 * ruby addjs.rb template.pdf fuzzer.js trusted/fuzz.pdf
 * python fuzzer.py`

# TODO
 * Mutate template.pdf to look for file format bugs.
 * Do the same for annotation.
    