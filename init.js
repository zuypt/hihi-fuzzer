/* this code will be run inside adobe's javascript console  to create a template PDF file for fuzzing */
pageBox = [this.getPageBox({nPage: 0}), this.getPageBox({nPage: 1})]

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

/*
for (var i = 0; i < 28; i++) {
	var f = this.addField("text"+i, "text", 0, next_square(0))
	f.borderColor = color.red
	f.lineWidth = 1
}
*/

///////////////////////////////////////utils
MAX_STRING_LENGTH = 8
MAX_ARRAY_LENGTH = 8

randint = function () {
	var min = (-Math.pow(2, 31))
	var max = (Math.pow(2, 31)-1)
	var range =  max - min
	var rand = Math.floor(Math.random() * (range + 1));
	var r = min + rand;
	util.printf("%d,", r);
	return r;
}

randintarray = function () {
	var r = []
	var length = (randint() % MAX_ARRAY_LENGTH) + 1
	for(var i = 0; i < length; i++) r.push(randint())
	return r
}

randbool = function () {
	return [true, false].choice()
}

Array.prototype.choice = function (){
	return this[Math.abs(randint()) % this.length];
}

randstring = function () {
	/* CHECK */
	var r = ""
	var length = (randint() % MAX_STRING_LENGTH) + 1
	for(var i = 0; i < length; i++) r += String.fromCharCode(randint() & 0xff)
	return r
}

randcolor = function () {
	var c = []
	c.push(["T", "G", "RGB", "CMYK"].choice())

	if (c[0] == "G") c.push(Math.random())
	else if (c[0] == "RGB") {
		c.push(Math.random())
		c.push(Math.random())
		c.push(Math.random())
	} else if (c[0] == "CMYK") {
		c.push(Math.random())
		c.push(Math.random())
		c.push(Math.random())
		c.push(Math.random())
	}
	return c
}

assert = function (condition, message) {
    if (!condition) {
        throw message || "Fuzzer.assertion failed";
    }
}
///////////////////////////////////////utils

field_properties = {
	alignment: function () {
		return ["left", "right", "center"].choice()
	},
	borderStyle: function () {
		return ["solid", "dashed", "beveled", "inset", "underline"].choice()
	},
	buttonAlignX: function() {
		return Math.abs(randint() % 101)
	},
	buttonAlignY: function() {
		return Math.abs(randint() % 101)
	},
	buttonFitBounds: randbool,
	buttonPosition: function() {
		return [position.textOnly, position.iconOnly, position.iconTextV, position.textIconV, position.iconTextH, position.textIconH, position.overlay].choice()
	},
	buttonScaleHow: function () {
		return [scaleHow.proportional, scaleHow.anamorphic].choice()
	},
	buttonScaleWhen: function () {
		return [scaleWhen.always, scaleWhen.never, scaleWhen.tooBig, scaleWhen.tooSmall].choice()
	},
	calcOrderIndex: randint,
	/* CHECK */
	charLimit: function () {
		return Math.abs(randint()) % 1024
	},
	comb: randbool,
	commitOnSelChange: randbool,
	currentValueIndices: function (f) {
		var numItems = f.numItems
		var length = (randint() % numItems) + 1
		var A = new Array()
		for(var i = 0; i < length; i++) A.push( (randint() % numItems) )
		return [ (randint() % numItems), A ].choice()  
	},
	/*TODO defaultStyle: null, */
	defaultValue: randstring,
	doNotScroll: randbool,
	doNotSpellCheck: randbool,
	delay: randbool,
	display: function () {
		/* TESTING */
		//return [display.visible, display.hidden, display.noPrint, display.noView].choice()
		return display.visible
	},
	/*TODO doc: null, */
	editable: randbool,
	exportValues: randintarray,
	/*TODO fileSelect: null, */
	fillColor: randcolor,
	hidden: randbool,
	highlight: function () {
		return [highlight.n, highlight.i, highlight.p, highlight.o].choice()
	},
	/* CHECK more relax or not */
	//lineWidth: randint,
	lineWidth: function () {
		return [0, 1, 2, 3].choice()
	},
	multiline: randbool,
	multipleSelection: randbool,
	/*TODO name: ,*/
	/*TODO numItems: ,*/
	/*TODO page: ,*/
	password: randbool,
	print: randbool,
	radiosInUnison: randbool,
	readonly: randbool,
	//TODO not to messup the layout for now
	/* rect: function () {
		return next_square(0)
	}, */
	required: randbool,
	richText: randbool,
	richValue: function (f) {
		try {
			var spans = f.richValue
		} catch (err) {
			return null
		}
		
		var span_properties = {
			alignment: this.alignment(),
			fontFamily: function() {
				return ["symbol", "serif", "sans-serif", "cursive", "monospace", "fantasy"]
			},
			fontStretch: function () {
				return ["ultra-condensed", "extra-condensed, condensed", "semi-condensed, normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"].choice()
			},
			fontStyle: function () {
				return ["italic", "normal"].choice()
			},
			fontWeight: function () {
				/*CHECK should i put it in range */
				return randint()
			},
			strikethrough: randbool,
			subscript: randbool,
			superscript: randbool,
			text: randstring,
			textColor: randcolor,
			/*CHECK */
			textSize: Math.random,
			underline: randbool
		}

		if (spans.length) {
			var r_spans = []
			for (var i = 0; i < spans.length; i++) {
				var span = {}
				for(var prop in span_properties) {
					span[prop] = span_properties[prop]()
				}
				r_spans.push(span)
			}
			return r_spans
		}
	},
	rotation: function () {
		return [0, 190, 180, 270].choice()
	},
	strokeColor: randcolor,
	style: function () {
		return [style.ch, style.cr, style.di, style.ci, style.st, style.sq].choice()
	},
	submitName: randstring,
	textColor: randcolor,
	textFont: function () {
		return [font.Times, font.TimesB, font.TimesI, font.TimesBI, font.Helv, font.HelvB, font.HelvI, font.HelvBI, font.Cour, font.CourB, font.CourI, font.CourBI, font.Symbol, font.ZapfD].choice()
	},
	textSize: function () {
		return Math.abs(randint() % 1024)
	},
	/*TODO type:, */
	userName: randstring,
	/* CHECK more relax or not*/
	value: function (f) {
		//return {[randint(), randstring(), randintarray()].choice()}
		field_type = f.type
		if (field_type == "text") 	return randstring()
		if (field_type == "button") return null
		if (field_type == "listbox" || field_type == "combobox") return randintarray()
		if (field_type == "checkbox" || field_type == "radiobutton") return randstring()
	}	
	/*TODO valueAsString:, */
}

fields_methods = {
	/*TODO browseForFileToSubmit:, */
	buttonGetCaption: function(f) {
		f.buttonGetCaption([0, 1, 2].choice())
	},
	buttonGetIcon: function(f) {
		f.buttonGetIcon([0, 1, 2].choice())
	},
	/*TODO buttonImportIcon:, */
	buttonSetCaption: function(f) {
		f.buttonSetCaption(randstring(), [0, 1, 2].choice())
	},
	buttonSetIcon: function(f) {
		f.buttonSetIcon(this.getIcon('icon'))
	},
	/* CHECK */
	checkThisBox: function(f) {
		var nWidget = [0, 1].choice()
		f.checkThisBox(nWidget, randbool())
	},
	clearItems: function(f) {
		f.clearItems()
	},
	defaultIsChecked: function (f) {
		var nWidget = [0, 1].choice()
		f.defaultIsChecked(nWidget, randbool())
	},
	/* CHECK */
	deleteItemAt: function (f) {
		var nIdx = randint()
		f.deleteItemAt(nIdx)
	},
	getArray: function (f) {
		f.getArray()
	},
	/* CHECK */
	getItemAt: function (f) {
		var nIdx = randint()
		f.getItemAt(nIdx, randbool())
	},
	getLock: function (f) {
		f.getlock()
	},
	insertItemAt: function (f) {
		if (randint() % 2 == 0) {
			f.insertItemAt({cName:randstring(), nIdx: [-1, Math.abs(randint()) % 4]})
		} else {
			f.insertItemAt({cName: randstring(), nIdx: [-1, Math.abs(randint()) % 4], cExport: randstring()})
		}
	},
	isBoxChecked: function (f) {
		f.isBoxChecked([0, 1].choice())
	},
	isDefaultChecked: function (f) {
		f.isBoxChecked([0, 1].choice())
	},
	// setAction: function (f) {

	// },
	setFocus: function (f) {
		f.setFocus()
	},
	/* CHECK */
	setItems: randintarray
	/* TODO setLock:, */
}

function rand_field_properties(f) {
	for (var prop in field_properties) {
		try {
			var r = field_properties[prop](f)
			assert( r != undefined )
			if (r != null) f[prop] = r
		} catch (err) {
			;
		}
	}
}

function rand_field_methods(f) {
	for (var prop in field_methods) {
		try {
			var r = field_methods[prop](f)
		} catch (err) {
			;
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

//two textFields with same name each on seperate page
var f = this.addField("textField0_Z", "text", 0, next_square(0));
rand_field_properties(f)
var f = this.addField("textField0_Z", "text", 1, next_square(1));
rand_field_properties(f)

//hierachy textField
var f =this.addField("textField1.A_Z", "text", 0, next_square(0));
rand_field_properties(f)
var f = this.addField("textField1.B_Z", "text", 1, next_square(1));
rand_field_properties(f)

///////////////////////////////////////textField

///////////////////////////////////////buttonField
//stand alone button
var f = this.addField("button_Z", "button", 0, next_square(0))
f.buttonSetCaption("button")
rand_field_properties(f)
f.buttonSetIcon(this.getIcon('icon'))

//buttons with same name on two seperate page
var f = this.addField("button0_Z", "button", 0, next_square(0))
f.buttonSetCaption("button0")
rand_field_properties(f)

var f = this.addField("button0_Z", "button", 1, next_square(1))
f.buttonSetCaption("button0")
rand_field_properties(f)

//hierachy button
var f = this.addField("button1.A_Z", "button", 0, next_square(0))
f.buttonSetCaption("button1.A")
rand_field_properties(f)
var f = this.addField("button1.B_Z", "button", 1, next_square(1))
f.buttonSetCaption("button1.B")
rand_field_properties(f)
///////////////////////////////////////buttonField

///////////////////////////////////////combobox
//stand alone combobox
var f = this.addField("combobox_Z", "combobox", 0, next_square(0))
rand_field_properties(f)

//combobox with same name
var f = this.addField("combobox0_Z", "combobox", 0, next_square(0))
rand_field_properties(f)
var f = this.addField("combobox0_Z", "combobox", 1, next_square(1))
rand_field_properties(f)
///////////////////////////////////////combobox

///////////////////////////////////////listbox
//stand alone combobox
var f = this.addField("listbox_Z", "listbox", 0, next_square(0))
rand_field_properties(f)

//combobox with same name
var f = this.addField("listbox0_Z", "listbox", 0, next_square(0))
rand_field_properties(f)

var f = this.addField("listbox0_Z", "listbox", 1, next_square(1))
rand_field_properties(f)
///////////////////////////////////////listbox

///////////////////////////////////////checkbox
//stand alone checkbox
var f = this.addField("checkbox_Z", "checkbox", 0, next_square(0))
rand_field_properties(f)

//checkbox with samename
var f = this.addField("checkbox0_Z", "checkbox", 0, next_square(0))
rand_field_properties(f)
var f = this.addField("checkbox0_Z", "checkbox", 1, next_square(1))
rand_field_properties(f)

//hierachy checkBox
var f = this.addField("checkbox1.A_Z", "checkbox", 0, next_square(0))
rand_field_properties(f)
var f = this.addField("checkbox1.B_Z", "checkbox", 1, next_square(1))
rand_field_properties(f)
///////////////////////////////////////checkbox

///////////////////////////////////////radiobutton
//stand alone checkbox
var f = this.addField("radiobutton_Z", "radiobutton", 0, next_square(0))
rand_field_properties(f)

//checkbox with samename
var f = this.addField("radiobutton0_Z", "radiobutton", 0, next_square(0))
rand_field_properties(f)
var f = this.addField("radiobutton0_Z", "radiobutton", 1, next_square(1))
rand_field_properties(f)
///////////////////////////////////////radiobutton

///////////////////////////////////////signature
//stand alone signature
var f = this.addField("signature_Z", "signature", 0, next_square(0))
rand_field_properties(f)
///////////////////////////////////////signature

