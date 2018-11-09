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
	util.printf("\x02", r)
	return r;
}

randuint = function () {
	var max 	= 2147483647
	var rand 	= Math.floor(Math.random() * (max + 1));
	util.printf("\x02", rand)
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

var randprop = function (obj) {
    var keys 		= Object.keys(obj)
    var prop_name 	= keys[ randuint() % keys.length ]
    var prop 		= obj[prop_name]
    return [prop_name, prop]
};

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
		var triggers = ["MouseUp", "MouseDown", "MouseEnter", "MouseExit", "OnFocus", "OnBlur", "Keystroke", "Validate", "Calculate", "Format"]
		var trigger = triggers.choice()

		var script = "fuzz_one()"
		f.setAction(trigger, script) 
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

var field_names = [
	"textField0", "textField1.A", "textField1.B", 
	"button", "button0", "button1.A", "button1.B",
	"combobox", "combobox0", 
	"listbox", "listbox0",
	"checkbox", "checkbox0", "checkbox1.A", "checkbox1.B",
	"radiobutton", "radiobutton0",
	"signature",

	"textField0_Z", "textField1.A_Z", "textField1.B_Z", 
	"button_Z", "button0_Z", "button1.A_Z", "button1.B_Z",
	"combobox_Z", "combobox0_Z", 
	"listbox_Z", "listbox0_Z",
	"checkbox_Z", "checkbox0_Z", "checkbox1.A_Z", "checkbox1.B_Z",
	"radiobutton_Z", "radiobutton0_Z",
	"signature_Z",

]

function fuzz_one () {
	/* pick a field from field list */
	var f = this.getField(field_names.choice())

	var t = randprop(field_properties)
	try {
		var r = t[1](f)
		assert (r != null)	
		f[t[0]] = r
	} catch (err) {
		util.printf("\x01=ProperptyException=")
		util.printf("\x01name: %s", err.name)
		util.printf("\x01line: %d", err.lineNum)
		util.printf("\x01message: %s\n", err.message)
	}

	t = randprop(field_methods)
	try {
		var r = t[1](f)
	} catch (err) {
		util.printf("\x01=MethodException=")
		util.printf("\x01name: %s", err.name)
		util.printf("\x01line: %d", err.lineNum)
		util.printf("\x01message: %s\n", err.message)
	}
}

/*
* main fuzzer loop
*/
while (true) {
	fuzz_one()
}
util.printf("\x01finished")