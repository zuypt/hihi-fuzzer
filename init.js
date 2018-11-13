/* run this code inside acrobat with js.pdf to generate template file */
/*
* util functions
*/
pageBox 	= [this.getPageBox({nPage: 0}), this.getPageBox({nPage: 1})]
box_count_x = [0, 0]
box_count_y = [0, 0]

function next_square(nPage) {
	var l = 50
	var n = Math.floor(596/l)

	var x0 = ( pageBox[nPage][0] + l*box_count_x[nPage] )
	var y0 = pageBox[nPage][1] - (l * box_count_y[nPage])
	var x1 = x0 + l
	var y1 = y0 - l

	var r = [x0, y0, x1, y1]
	box_count_x[nPage] += 1

	if (box_count_x[nPage] == n) {
		box_count_x[nPage] = 0
		box_count_y[nPage] += 1
	}
	return r
}

Array.prototype.choice = function (){
	return this[randuint() % this.length];
}

randint = function () {
	var min 	= -2147483648
	var max 	= 2147483647
	var range 	=  max - min
	var rand 	= Math.floor(Math.random() * (range + 1));
	var r 		= min + rand;
	util.printf("\n[.]%d\n", r)
	return r;
}

randuint = function () {
	var max 	= 2147483647
	var rand 	= Math.floor(Math.random() * (max + 1));
	util.printf("\n[.]%d\n", rand)
	return rand;
}

randfloat = function () {
	/* HACK */
	return (randuint() % 101) / 100
}

randstring = function () {
	/* CHECK */
	var r = ""
	var length = (randuint() % MAX_STRING_LENGTH) + 1
	for(var i = 0; i < length; i++) r += String.fromCharCode(randint() & 0xff)
	return r
}

randbool = function () {
	return [true, false].choice()
}

assert = function (condition, message) {
    if (!condition) {
    	var err = {}
    	err.name = "AssertionError"
    	if (message) err.message = message
        throw err
    }
}

MAX_STRING_LENGTH 	= 8
MAX_ARRAY_LENGTH 	= 8

randintarray = function () {
	var r = []
	var length = (randuint() % MAX_ARRAY_LENGTH) + 1
	for(var i = 0; i < length; i++) r.push(randint())
	return r
}

randstringarray = function () {
	var r = []
	var length = (randuint() % MAX_ARRAY_LENGTH) + 1
	for(var i = 0; i < length; i++) r.push(randstring())
	return r	
}

randcolor = function () {
	var c = []
	c.push(["T", "G", "RGB", "CMYK"].choice())

	if (c[0] == "G") c.push(randfloat())
	else if (c[0] == "RGB") {
		c.push( randfloat() )
		c.push( randfloat() )
		c.push( randfloat() )
	} else if (c[0] == "CMYK") {
		c.push( randfloat() )
		c.push( randfloat() )
		c.push( randfloat() )
		c.push( randfloat() )
	}
	return c
}

randspan = function () {
	var span = {
		alignment: field_properties.alignment(),
		fontFamily: function() {
			return ["symbol", "serif", "sans-serif", "cursive", "monospace", "fantasy"].choice()
		}(),
		fontStretch: function () {
			return ["ultra-condensed", "extra-condensed, condensed", "semi-condensed, normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"].choice()
		}(),
		fontStyle: function () {
			return ["italic", "normal"].choice()
		}(),
		fontWeight: function () {
			/* CHECK */
			return randint()
		}(),
		strikethrough: randbool(),
		subscript: randbool(),
		superscript: randbool(),
		text: randstring(),
		textColor: randcolor(),
		/*CHECK */
		textSize: randuint(),
		underline: randbool()
	}
	return span
}

field_properties = {
	alignment: function (f) {
		return ["left", "right", "center"].choice()
	},
	borderStyle: function (f) {
		return ["solid", "dashed", "beveled", "inset", "underline"].choice()
	},
	buttonAlignX: function(f) {
		return randuint() % 101
	},
	buttonAlignY: function(f) {
		return randuint() % 101
	},
	buttonFitBounds: randbool,
	buttonPosition: function(f) {
		return [position.textOnly, position.iconOnly, position.iconTextV, position.textIconV, position.iconTextH, position.textIconH, position.overlay].choice()
	},
	buttonScaleHow: function (f) {
		return [scaleHow.proportional, scaleHow.anamorphic].choice()
	},
	buttonScaleWhen: function (f) {
		return [scaleWhen.always, scaleWhen.never, scaleWhen.tooBig, scaleWhen.tooSmall].choice()
	},
	calcOrderIndex: randint,
	/* CHECK */
	charLimit: function (f) {
		return randuint() % 1024
	},
	comb: randbool,
	commitOnSelChange: randbool,
	currentValueIndices: function (f) {
		var numItems 	= f.numItems
		var length 		= (randint() % numItems) + 1
		var A 			= new Array()
		/* CHECK */
		for(var i = 0; i < length; i++) {
			A.push( (randuint() % numItems) )
		}
		return [(randuint()%numItems), A].choice()  
	},
	defaultStyle: randspan,
	defaultValue: randstring,
	doNotScroll: randbool,
	doNotSpellCheck: randbool,
	delay: randbool,
	display: function () {
		return [display.visible, display.hidden, display.noPrint, display.noView].choice()
	},
	doc: null,
	editable: randbool,
	exportValues: randintarray,
	/*TODO fileSelect: null, */
	fillColor: randcolor,
	hidden: randbool,
	highlight: function (f) {
		return [highlight.n, highlight.i, highlight.p, highlight.o].choice()
	},
	/* CHECK */
	lineWidth: function (f) {
		return [0, 1, 2, 3].choice()
	},
	multiline: randbool,
	multipleSelection: randbool,
	name: null,
	numItems: null,
	page: null,
	password: randbool,
	print: randbool,
	radiosInUnison: randbool,
	readonly: randbool,
	rect: function (f) {
		return next_square(0)
	},
	required: randbool,
	richText: randbool,
	richValue: function (f) {
		/* try to fetch length of the field */
		try {
			var spans = f.richValue
		} catch (err) { return null }
		
		var length = spans.length
		if (length) {
			var r_spans = []
			for (var i = 0; i < length; i++) {
				r_spans.push(randspan())
			}
			return r_spans
		}
		return null
	},
	rotation: function (f) {
		return [0, 190, 180, 270].choice()
	},
	strokeColor: randcolor,
	style: function (f) {
		return [style.ch, style.cr, style.di, style.ci, style.st, style.sq].choice()
	},
	submitName: randstring,
	textColor: randcolor,
	textFont: function (f) {
		return [font.Times, font.TimesB, font.TimesI, font.TimesBI, font.Helv, font.HelvB, font.HelvI, font.HelvBI, font.Cour, font.CourB, font.CourI, font.CourBI, font.Symbol, font.ZapfD].choice()
	},
	/* CHECK */
	textSize: function (f) {
		return randuint() % 32768
	},
	type: null,
	userName: randstring,
	/* CHECK */
	value: function (f) {
		var field_type = f.type
		if (field_type == "text") 	return randstring()
		if (field_type == "button") return null
		if (field_type == "listbox" || field_type == "combobox") return randintarray()
		if (field_type == "checkbox" || field_type == "radiobutton") return randstring()
	},	
	valueAsString: null
}

field_methods = {
	/*
	TODO browseForFileToSubmit:,
	*/
	buttonGetCaption: function(f) {
		f.buttonGetCaption([0, 1, 2].choice())
	},
	buttonGetIcon: function(f) {
		f.buttonGetIcon([0, 1, 2].choice())
	},
	/*
	TODO buttonImportIcon:,
	*/
	buttonSetCaption: function(f) {
		f.buttonSetCaption(randstring(), [0, 1, 2].choice())
	},
	buttonSetIcon: function(f) {
		f.buttonSetIcon(f.doc.getIcon('icon'))
	},
	checkThisBox: function(f) {
		/* CHECK nWidget */
		var nWidget = [0, 1].choice()
		f.checkThisBox(nWidget, randbool())
	},
	clearItems: function(f) {
		f.clearItems()
	},
	defaultIsChecked: function (f) {
		/* CHECK nWidget */
		var nWidget = [0, 1].choice()
		f.defaultIsChecked(nWidget, randbool())
	},
	deleteItemAt: function (f) {
		try {
			var length = f.numItems()
		} catch (err) { return null}
		/* CHECK nIdx */
		var nIdx = randuint() % length
		f.deleteItemAt(nIdx)
	},
	getArray: function (f) {
		f.getArray()
	},
	getItemAt: function (f) {
		/* CHECK */
		var nIdx = randint()
		f.getItemAt(nIdx, randbool())
	},
	getLock: function (f) {
		f.getLock()
	},
	insertItemAt: function (f) {
		var type = f.type
		if (type != "listbox" && type != "combobox") return null
		var length = f.numItems
		if (randuint() % 2 == 0) {
			f.insertItemAt({cName: randstring(), nIdx: [-1, randuint() % length].choice()})
		} else {
			f.insertItemAt({cName: randstring(), nIdx: [-1, randuint() % length].choice(), cExport: randstring()})
		}
	},
	isBoxChecked: function (f) {
		f.isBoxChecked([0, 1].choice())
	},
	isDefaultChecked: function (f) {
		f.isBoxChecked([0, 1].choice())
	},
	setAction: function (f) {

	},
	setFocus: function (f) {
		f.setFocus()
	},
	setItems: function (f) {
		/* CHECK */
		f.setItems(randstringarray())
	}
	/*
	*TODO setLock:,
	*/
}

function rand_field_properties(f) {
	for (var prop in field_properties) {
		try {
			if (field_properties[prop] != null) {
				var r = field_properties[prop](f)
				assert (r != null)
				f[prop] = r
			}
		} catch (err) {
			if (err.name != "InvalidGetError"  && err.name != "InvalidSetError" && err.name != "AssertionError") {
				console.println('[*]' + prop)
				console.println('[-]' + err.lineNumber)
				console.println(err.name)
				console.println(err)
			}
		}
	}
}

function rand_field_methods(f) {
	for (var prop in field_methods) {
		try {
			var r = field_methods[prop](f)
		} catch (err) {
			if (err.name != "GeneralError") {
				console.println('[*]' + prop)
				console.println('[-]' + err.lineNumber)
				console.println(err.name)
				console.println(err)	
				console.println(f.name)			
			}
		}
	}
}

/* hand crafted fields */
///////////////////////////////////////textField
//stand alone textField
var f = this.addField("textfield", "text", 0, next_square(0));
f.lineWidth 	= 1
f.borderColor 	= color.red
f.charLimit	 = 1337
f.alignment = "right"
f.borderStyle = border.d
f.comb = true
f.defaultValue = "1337"
f.fillColor = color.yellow
f.multiline = true
f.password = true
f.richText = true
f.richValue = "1338"
f.rotation = 180
f.textColor = color.green
f.textSize = 5
f.textColor = color.red

//two textFields with same name each on seperate page
var f = this.addField("textField0", "text", 0, next_square(0));
f.lineWidth = 1
f.textColor = color.red
f.borderColor = color.red
var f = this.addField("textField0", "text", 1, next_square(1));
f.lineWidth = 1
f.borderColor = color.red
f.textColor = color.red

//hierachy textField
var f =this.addField("textField1.A", "text", 0, next_square(0));
f.lineWidth = 1
f.borderColor = color.red
f.textColor = color.red
var f = this.addField("textField1.B", "text", 1, next_square(1));
f.lineWidth = 1
f.textColor = color.red
f.borderColor = color.red
///////////////////////////////////////textField

///////////////////////////////////////buttonField
//stand alone button
var f = this.addField("button", "button", 0, next_square(0))
f.buttonSetCaption("button")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.lineWidth = 1
f.borderColor = color.green
f.textColor = color.red
f.borderStyle = border.d;
f.buttonSetIcon(this.getIcon('icon'))

//buttons with same name on two seperate page
var f = this.addField("button0", "button", 0, next_square(0))
f.buttonSetCaption("button0")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.lineWidth = 1
f.borderColor = color.green
f.textColor = color.red

var f = this.addField("button0", "button", 1, next_square(1))
f.buttonSetCaption("button0")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.lineWidth = 1
f.borderColor = color.green
f.textColor = color.red

//hierachy button
var f = this.addField("button1.A", "button", 0, next_square(0))
f.buttonScaleWhen = scaleWhen.always
f.buttonSetCaption("button1.A")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.lineWidth = 1
f.borderColor = color.green
f.textColor = color.red
var f = this.addField("button1.B", "button", 1, next_square(1))
f.buttonSetCaption("button1.B")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.lineWidth = 1
f.borderColor = color.green
f.textColor = color.red
///////////////////////////////////////buttonField

///////////////////////////////////////combobox
//stand alone combobox
var f = this.addField("combobox", "combobox", 0, next_square(0))
f.setItems([
["Online Help", "http://www.example.com/myhelp.html"],
["How to Print", "http://www.example.com/myhelp.html#print"],
["How to eMail", "http://www.example.com/myhelp.html#email"]
]);
f.borderColor = color.yellow
f.textColor = color.red
//combobox with same name
var f = this.addField("combobox0", "combobox", 0, next_square(0))
f.setItems([
["Online Help", "http://www.example.com/myhelp.html"],
["How to Print", "http://www.example.com/myhelp.html#print"],
["How to eMail", "http://www.example.com/myhelp.html#email"]
]);
f.borderColor = color.yellow
f.textColor = color.red
var f = this.addField("combobox0", "combobox", 1, next_square(1))
f.setItems([
["Online Help", "http://www.example.com/myhelp.html"],
["How to Print", "http://www.example.com/myhelp.html#print"],
["How to eMail", "http://www.example.com/myhelp.html#email"]
]);
f.borderColor = color.yellow
f.textColor = color.red
///////////////////////////////////////combobox

///////////////////////////////////////listbox
//stand alone combobox
var f = this.addField("listbox", "listbox", 0, next_square(0))
f.setItems([
["Online Help", "http://www.example.com/myhelp.html"],
["How to Print", "http://www.example.com/myhelp.html#print"],
["How to eMail", "http://www.example.com/myhelp.html#email"]
]);
f.borderColor = color.yellow
f.textColor = color.red

//combobox with same name
var f = this.addField("listbox0", "listbox", 0, next_square(0))
f.setItems([
["Online Help", "http://www.example.com/myhelp.html"],
["How to Print", "http://www.example.com/myhelp.html#print"],
["How to eMail", "http://www.example.com/myhelp.html#email"]
]);
f.borderColor = color.blue
f.textColor = color.red
var f = this.addField("listbox0", "listbox", 1, next_square(1))
f.setItems([
["Online Help", "http://www.example.com/myhelp.html"],
["How to Print", "http://www.example.com/myhelp.html#print"],
["How to eMail", "http://www.example.com/myhelp.html#email"]
]);
f.borderColor = color.blue
f.textColor = color.red
///////////////////////////////////////listbox

///////////////////////////////////////checkbox
//stand alone checkbox
var f = this.addField("checkbox", "checkbox", 0, next_square(0))
f.borderStyle = border.d;
f.borderColor = color.red

//checkbox with samename
var f = this.addField("checkbox0", "checkbox", 0, next_square(0))
f.borderStyle = border.d;
f.borderColor = color.red
var f = this.addField("checkbox0", "checkbox", 1, next_square(1))
f.borderStyle = border.d;
f.borderColor = color.red

//hierachy checkBox
var f = this.addField("checkbox1.A", "checkbox", 0, next_square(0))
f.borderStyle = border.d;
f.borderColor = color.red
var f = this.addField("checkbox1.B", "checkbox", 1, next_square(1))
f.borderStyle = border.d;
f.borderColor = color.red
///////////////////////////////////////checkbox

///////////////////////////////////////radiobutton
//stand alone checkbox
var f = this.addField("radiobutton", "radiobutton", 0, next_square(0))
f.borderStyle = border.d;
f.borderColor = color.red

//checkbox with samename
var f = this.addField("radiobutton0", "radiobutton", 0, next_square(0))
f.borderStyle = border.d;
f.borderColor = color.red
var f = this.addField("radiobutton0", "radiobutton", 1, next_square(1))
f.borderStyle = border.d;
f.borderColor = color.red
///////////////////////////////////////radiobutton

///////////////////////////////////////signature
//stand alone signature
var f = this.addField("signature", "signature", 0, next_square(0))
///////////////////////////////////////signature


/* auto generated fields */


///////////////////////////////////////textField
//stand alone textField
var f = this.addField("textfield_Z", "text", 0, next_square(0));
rand_field_properties(f)
rand_field_methods(f)

//two textFields with same name each on seperate page
var f = this.addField("textField0_Z", "text", 0, next_square(0));
rand_field_properties(f)
rand_field_methods(f)
var f = this.addField("textField0_Z", "text", 1, next_square(1));
rand_field_properties(f)
rand_field_methods(f)

//hierachy textField
var f =this.addField("textField1.A_Z", "text", 0, next_square(0));
rand_field_properties(f)
rand_field_methods(f)
var f = this.addField("textField1.B_Z", "text", 1, next_square(1));
rand_field_properties(f)
rand_field_methods(f)

///////////////////////////////////////textField

///////////////////////////////////////buttonField
//stand alone button
var f = this.addField("button_Z", "button", 0, next_square(0))
f.buttonSetCaption("button")
f.buttonSetIcon(this.getIcon('icon'))
rand_field_properties(f)
rand_field_methods(f)


//buttons with same name on two seperate page
var f = this.addField("button0_Z", "button", 0, next_square(0))
f.buttonSetCaption("button0")
rand_field_properties(f)
rand_field_methods(f)

var f = this.addField("button0_Z", "button", 1, next_square(1))
f.buttonSetCaption("button0")
rand_field_properties(f)
rand_field_methods(f)

//hierachy button
var f = this.addField("button1.A_Z", "button", 0, next_square(0))
f.buttonSetCaption("button1.A")
rand_field_properties(f)
rand_field_methods(f)

var f = this.addField("button1.B_Z", "button", 1, next_square(1))
f.buttonSetCaption("button1.B")
rand_field_properties(f)
rand_field_methods(f)
///////////////////////////////////////buttonField

///////////////////////////////////////combobox
//stand alone combobox
var f = this.addField("combobox_Z", "combobox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)

//combobox with same name
var f = this.addField("combobox0_Z", "combobox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)
var f = this.addField("combobox0_Z", "combobox", 1, next_square(1))
rand_field_properties(f)
rand_field_methods(f)
///////////////////////////////////////combobox

///////////////////////////////////////listbox
//stand alone combobox
var f = this.addField("listbox_Z", "listbox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)

//combobox with same name
var f = this.addField("listbox0_Z", "listbox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)

var f = this.addField("listbox0_Z", "listbox", 1, next_square(1))
rand_field_properties(f)
rand_field_methods(f)
///////////////////////////////////////listbox

///////////////////////////////////////checkbox
//stand alone checkbox
var f = this.addField("checkbox_Z", "checkbox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)

//checkbox with samename
var f = this.addField("checkbox0_Z", "checkbox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)
var f = this.addField("checkbox0_Z", "checkbox", 1, next_square(1))
rand_field_properties(f)
rand_field_methods(f)

//hierachy checkBox
var f = this.addField("checkbox1.A_Z", "checkbox", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)
var f = this.addField("checkbox1.B_Z", "checkbox", 1, next_square(1))
rand_field_properties(f)
rand_field_methods(f)
///////////////////////////////////////checkbox

///////////////////////////////////////radiobutton
//stand alone checkbox
var f = this.addField("radiobutton_Z", "radiobutton", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)

//checkbox with samename
var f = this.addField("radiobutton0_Z", "radiobutton", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)
var f = this.addField("radiobutton0_Z", "radiobutton", 1, next_square(1))
rand_field_properties(f)
rand_field_methods(f)
///////////////////////////////////////radiobutton

///////////////////////////////////////signature
//stand alone signature
var f = this.addField("signature_Z", "signature", 0, next_square(0))
rand_field_properties(f)
rand_field_methods(f)
///////////////////////////////////////signature