
var util = require('util');

function Person() { 
    this.name = 'byvoid'; 
    this.toString = function() { 
    return this.name; 
    }; 
} 
var obj = new Person(); 
console.log(util.inspect(obj)); 
console.log(util.inspect(obj, true)); 


var re = util.isArray([])
console.log(re);   // true 
var re = util.isArray(new Array)
console.log(re);   // true
var re = util.isArray({})
console.log(re);   // false


var re = util.isRegExp(/some regexp/)
console.log(re);   // true
var re = util.isRegExp(new RegExp('another regexp'))
console.log(re);   // true
var re = util.isRegExp({})
console.log(re);   // false

var re = util.isDate(new Date())
console.log(re);   // true
var re = util.isDate(Date())
console.log(re);   // false (without 'new' returns a String)
var re = util.isDate({})
console.log(re);   // false

var re = util.isError(new Error())
console.log(re);   // true
var re = util.isError(new TypeError())
console.log(re);   // true
var re = util.isError({ name: 'Error', message: 'an error occurred' })
console.log(re);   // false

