require 'origami'
include Origami

javascript_code = File.read(ARGV[1])

pdf  	= PDF.read ARGV[0], lazy: false
outfile = File.open(ARGV[2], 'wb')  
pdf.onDocumentOpen(Action::JavaScript javascript_code).save(outfile)

