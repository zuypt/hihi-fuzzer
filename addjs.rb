require 'origami'
include Origami

javascript_code = File.read('fuzzer.js')

pdf  = PDF.read "template.pdf", lazy: false
pdf.onDocumentOpen(Action::JavaScript javascript_code).save('fuzz.pdf')