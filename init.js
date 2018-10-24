pageBox = [this.getPageBox({nPage: 0}), this.getPageBox({nPage: 1})]

box_count_x = [0, 0]
box_count_y = [0, 0]

function next_square(nPage) {
	var l = 30
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
	f.borderWidth = 1
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
	return this[Math.abs(Fuzzer.randint()) % this.length];
}

randstring = function () {
	var r = ""
	var length = (randint() % MAX_STRING_LENGTH) + 1
	for(var i = 0; i < length; i++) r += String.fromCharCode(randint() % 0xffff)
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
	charLimit: randint,
	comb: randbool,
	commitOnSelChange: randbool,
	currentValueIndices: function (numItems) {
		var length = (randint() % numItems) + 1
		var A = new Array()
		for(var i = 0; i < length; i++) A.push( (randint() % numItems) )
		return [ (randint() % numItems), A ].choice()  
	},
	/*TODO defaultStyle: null, */
	defaultValue: randstring
	doNotScroll: randbool,
	doNotSpellCheck: randbool,
	delay: randbool,
	display: function () {
		return [display.visible, display.hidden, display.noprint, display.noView].choice()
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
	lineWidth: randint,
	multiline: randbool,
	multipleSelection: randbool,
	/*TODO name: ,*/
	/*TODO numItems: ,*/
	/*TODO page: ,*/
	password: randbool,
	print: randbool,
	radiosInUnison: randbool,
	readonly: randbool,
	rect: function () {
		return next_square(0)
	}

}

///////////////////////////////////////textField
//stand alone textField
var f = this.addField("textfield", "text", 0, next_square(0));
f.borderWidth 	= 1
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
f.borderWidth = 1
f.textColor = color.red
f.borderColor = color.red
var f = this.addField("textField0", "text", 1, next_square(1));
f.borderWidth = 1
f.borderColor = color.red
f.textColor = color.red

//hierachy textField
var f =this.addField("textField1.A", "text", 0, next_square(0));
f.borderWidth = 1
f.borderColor = color.red
f.textColor = color.red
var f = this.addField("textField1.B", "text", 1, next_square(1));
f.borderWidth = 1
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
f.borderWidth = 1
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
f.borderWidth = 1
f.borderColor = color.green
f.textColor = color.red

var f = this.addField("button0", "button", 1, next_square(1))
f.buttonSetCaption("button0")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.borderWidth = 1
f.borderColor = color.green
f.textColor = color.red

//hierachy button
var f = this.addField("button1.A", "button", 0, next_square(0))
f.buttonScaleWhen = scaleWhen.always
f.buttonSetCaption("button1.A")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.borderWidth = 1
f.borderColor = color.green
f.textColor = color.red
var f = this.addField("button1.B", "button", 1, next_square(1))
f.buttonSetCaption("button1.B")
f.buttonAlignX = 10
f.buttonAlignY = 10
f.buttonPosition = position.textIconH
f.borderWidth = 1
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

