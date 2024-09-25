if (!Array.prototype.indexOf) {
 Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
  "use strict";
  if (this == null) {
   throw new TypeError();
  }
  var t = Object(this);
  var len = t.length >>> 0;
  if (len === 0) {
   return -1;
  }
  var n = 0;
  if (arguments.length > 1) {
   n = Number(arguments[1]);
   if (n != n) { // shortcut for verifying if it's NaN
    n = 0;
   } else if (n != 0 && n != Infinity && n != -Infinity) {
    n = (n > 0 || -1) * Math.floor(Math.abs(n));
   }
  }
  if (n >= len) {
   return -1;
  }
  var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
  for (; k < len; k++) {
   if (k in t && t[k] === searchElement) {
    return k;
   }
  }
  return -1;
 }
}

// Extra functions that will be run at the end of listings section document ready
// on document ready ->
//   other js files ..
//   ...
//   listings {
//     other stuff
//     ...
//     extra functions
//   }
//   more js files
//   ...
function behaviour() { 
	this.extra = []; 
}

behaviour.prototype.extra_setup = function (tag) {
    if (debug.decorate && debug.selections)  console.log("-------------------------------------"); 
	if (debug.decorate && debug.selections)  console.log("             SELECTORS               "); 
	if (debug.decorate && debug.selections)  console.log("-------------------------------------"); 
	
	// show selections
	if (debug.selections) debug.show_selections(tag);	
	
	if (debug.logging && debug.decorate && this.extra.length > 0)  console.log("-------------------------------------"); 
	if (debug.logging && this.extra.length > 0)  		   		   console.log("                EXTRA                "); 
	if (debug.logging && debug.decorate && this.extra.length > 0)  console.log("-------------------------------------"); 
	for (var i = 0; i < this.extra.length; i++) {
		if (typeof this.extra[i].run != "undefined") this.extra[i].run();
		else this.extra[i]();
		
		if (debug.logging) debug.log(this.extra[i].name, "extra setup");
		// show selections
		if (debug.selections) debug.show_selections(tag);
	}
	

	
	if (debug.decorate && debug.selections)  console.log("-------------------------------------"); 
}
