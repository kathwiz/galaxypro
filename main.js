/**** JS Lib For Templates  ****/
/**** Beta Version 1.0      ****/

/**** --------------------- ****/
/****  set to true in live  ****/
/****---------------------- ****/
var production = false;
/**** --------------------- ****/
/****  set to false in live ****/
/****---------------------- ****/
var experimental = false;
/**** ----------------------****/
/**** ----------------------****/
/**** ----------------------****/


// TODO add conditional try catches https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
/**** DEBUG OPTIONS ****/
var debug = {
	"decorate": true,					// enable decorated console output
	"logging": true,					// enable logging (should be off in release)
	"log": function (tag, msg) { if (!production) {if (debug.filter.indexOf(tag) != -1 || debug.filter.indexOf("*") != -1) { console.log(tag + ": " + msg) }} }, // The debug.log function (extra catch for production mode)
	"filter": ["*"],                	// filters the logging output from debug.log - tag reference: {* - wilcard, HOME - home.js, ...}
	"html_tagging": false,           	// (experimental) will report both in the html and in the console when an attribute was expected but not found
	"selections": true,					// show failed selections in document.ready
	"show_mapping": true,				// show the original and mapped selector
	"live_logging": true,           	// show failed selections in realtime
	"live_logging_show_all": false,		// show all or just empty selectors
	"live_logging_start": false,  		// -> 											These are used for live logging do not modify (without purpose)
	"live_logging_start_index": 0, 		// ->											^
	"show_selections": function (tag) {
			// Search for failed selections
			for (var i = debug.live_logging_start_index; i < selections.length; i++) {
				if (selections[i].result.length == 0) {
					debug.log(tag, "failed selector: "+selections[i].selector+(debug.show_mapping ? " <-- " + selections[i].original : ""));
				}
			}
			debug.live_logging_start_index = selections.length;
	}
}
if (production) {
	debug.decorate = false;
	debug.logging = false;
	debug.html_tagging = false;
	debug.selections = false;
	debug.live_logging = false;
}

// A cool debugging trick, overriding selection
// powers selections and live logging
// now it also applies the map to ALL selections
// if necessary add :nomap to the end of your selector
// to not apply the mapping
var selections = [];
jQuery.noConflict();
$ = function(selector,context){ 
	
	var original = selector;
	if (typeof selector == "string") {
		if (selector.indexOf(":nomap") != -1) selector = selector.split(":nomap")[0];
		else 								  selector = (typeof dmatch[selector] != 'undefined') ? dmatch[selector] : selector;
	}
	
	var res = new jQuery.fn.init(selector,context||document); 
	
	if (!production) {
		selections.push({"selector":selector, "original":original, "result":res});
		if (debug.live_logging && debug.live_logging_start && res.length==0) {
			console.log("failed selector: "+selector+(debug.show_mapping ? " <-- " + original : "")); 
		} else if (debug.live_logging && debug.live_logging_start && debug.live_logging_show_all) {
			console.dir({"selector":selector, "original":original ,"result":res}); 
		}
	}
	
	return res;  
};
$.fn = $.prototype = jQuery.fn;
jQuery.extend($, jQuery); // copy's trim, extend etc to $


// Be very careful when enabling this option
// IT HAS NOT been tested and may have unpredictable effects
// in some environments
if (experimental && debug.html_tagging) {
	var _oldAttr = $.fn.attr;
	$.fn.attr = function(name, value) {
		var res = _oldAttr.call(this, name, value);
		//console.log(typeof res);
		//console.log(this);
		if (typeof value !== "undefined") return res;
		else if (typeof this != 'undefined') {
			if (this.length>0) {
				var ret_value = this[0].getAttribute(name);
					if (name != "debug") {
						if (typeof ret_value == 'undefined' || ret_value == "" || ret_value == null) {
							this.attr("debug", this.attr("debug") + "missing attribute " + name);
						}
					}	
				return ret_value;
			} else {
				if (debug.logging) console.log("ERROR: tried to get attribute ("+name+") from below failed selector");
			}
		} else {
			console.dir(this);
			console.log("-");
			console.log("----------------------------\\/ BAD BAD BAD \\/-------------------------------");
			console.log("it is suggested you turn off experimental for testing this page");
			console.log("----------------------------/\\ BAD BAD BAD /\\-------------------------------");
			console.log("-");
		}
	}
}

/**** SELECTOR MAP ****/
// not sure yet if this map  lives here or comes from the php
// should be a default map somewhere - this should fill out unspecified
// values here from the default, allowing all selectors to use map
// (except in overrides.js)
var dmatch = {
	'.tab-container': '.tab-content',
	'.tab-container:eq(0)': '.tab-content',
	'.tab-container:not(.style-only)' : '.tab-content:not(.style-only)'
}

/**** PAGE DEFINITION ****/
var libs = ["actions"];
var loaded_libs = [];
// removed function libraries.. this is only for behavioural files
function get_page_libs() {
	switch ($("#request_uri").val()) {
		case "index.php": 
			libs.push("home"); 
			break;
		case "listings.php": case "recent-sales.php": case "rental-listings.php": case "open-homes.php" : case "rental-inspections.php": case "leased-properties.php":
        case "investment-listings.php": case "development-listings.php": case "commercial-listings.php": case "land-listings.php":case "residential-listings.php":case "residential-rental-listings.php": case "recent-leases.php": case "holiday-rental-listings.php": case "commercial-lease-listings.php":case "auctions.php":
			libs.push("tabs");
			libs.push("listings");
            libs.push("auctions");
			//libs.push("mapv3");
			break;
		case "our-team.php":case "sales-team.php":case "rental-team.php":
			libs.push("staff");
			libs.push("tabs");
			break;
		case "details.php": case "development-details.php":
			libs.push("tabs");
			libs.push("forms");
			libs.push("details");
			break;
		case "property-alert.php":case "rental-property-alert.php":
			libs.push("alerts");
			libs.push("forms");
			break;
		case "contact-us.php":
			libs.push("tabs");
			libs.push("forms");
			libs.push("contact_us");
			break;
		case "market-appraisal.php":
			libs.push("forms");
			break;
		case "rental-inspections.php": case "open-homes.php":
			libs.push("inspections");
			break;	
		case "tenant-services.php": case "landlord-services.php":
			libs.push("cms");
			libs.push("forms");
			break;
		case "company-profile.php":
			break;
		case "staff-profile.php":
			libs.push("profiles");
			break;
		case "tenant-forms.php":
			libs.push("renting");
			break;
	}
}
/**** CONSTANTS ****/
var enable_abajax = true; //ajax loading option
var mouse_on_dropdown = false; //for customized select box
var IOS = (navigator.userAgent.match(/iPad|iPhone|iPod/i) != null)?true:false; //for IOS devices
var max_suburbs = 8; //maximum number of suburb seo links visible

/**** DOCUMENT READY ****/
$(document).ready(function(){
	get_page_libs();
	if (debug.logging) {
		console.log($("#request_uri").val());
		for (var i = 0; i < libs.length; i++) {
			console.log("will load " + libs[i]);
		}
	}
	
	if (debug.decorate) console.log("---------------------------------------------------------------------------------------------------");
	if (debug.decorate) console.log(" START INIT ");
	if (debug.show_mapping && debug.logging) console.log(" you can see the mapping of selectors in the following form ");
	if (debug.show_mapping && debug.logging) console.log(" selector: #example_dmatch <-- #example_original ");
	if (debug.decorate) console.log("---------------------------------------------------------------------------------------------------"); 

	Overrides = new overrides();
	Overrides.apply();

	if (debug.selections) debug.show_selections("MISC");
	
	if (debug.decorate)  console.log("---------------------------------------------------------------------------------------------------"); 
	
	/**** Load Behaviours ****/
	
	if (libs.indexOf("actions") != -1) { ioActions = new actions(); loaded_libs.push("actions"); }
	
	if (libs.indexOf("listings") != -1) { ioListings = new listings(); loaded_libs.push("listings"); }
	
	if (libs.indexOf("home") != -1) { ioHome = new home(); loaded_libs.push("home"); }
	
	if (libs.indexOf("tabs") != -1) { ioTabs = new tabs(); loaded_libs.push("tabs"); }
	
	if (libs.indexOf("details") != -1) { ioDetails = new details(); loaded_libs.push("details"); }

	if (libs.indexOf("alerts") != -1) { ioAlerts = new alerts(); loaded_libs.push("alerts"); }
	
	if (libs.indexOf("contact_us") != -1) { ioContact_us = new contact_us(); loaded_libs.push("contact_us"); }
	
	if (libs.indexOf("cms") != -1) { ioCms = new cms(); loaded_libs.push("cms"); }
	
	if (libs.indexOf("forms") != -1) { ioForms = new forms(); loaded_libs.push("forms"); }
	
	if (libs.indexOf("auctions") != -1) { ioAuctions = new auctions(); loaded_libs.push("auctions"); }
	
	if (libs.indexOf("staff") != -1) { ioStaff = new staff(); loaded_libs.push("staff"); }
	
	if (libs.indexOf("directions") != -1) { ioDirections = new directions(); loaded_libs.push("directions"); }
	
	if (libs.indexOf("profiles") != -1) { ioProfiles = new profiles(); loaded_libs.push("profiles"); }
	
	if (libs.indexOf("renting") != -1) { ioProfiles = new renting(); loaded_libs.push("renting"); }
	
	// Search for html debug errors
	if (debug.html_tagging) {
		if (debug.decorate) console.log("---------------------------------------------------------------------------------------------------");
		var html_errors = [];	
		$("[debug]").map(function() { html_errors.push({"msg":this.getAttribute("debug"), "source": this}); });
		if (html_errors.length > 0) console.dir(html_errors);
		else console.log("No HTML Errors Found");
		if (debug.decorate) console.log("---------------------------------------------------------------------------------------------------");
	}
	if (debug.live_logging) {
		debug.live_logging_start = true;
		debug.live_logging_start_index = selections.length;
	}
	if (debug.decorate) console.log("---------------------------------------------------------------------------------------------------");
	if (debug.decorate) console.log("END INIT"+((debug.live_logging)?" - Below is live selector logging":""));
	if (debug.decorate) console.log("---------------------------------------------------------------------------------------------------");
	
	// Check for missed libraries
	for (var i = 0; i < libs.length; i++) {
		if (loaded_libs.indexOf(libs[i]) == -1) {
			if (debug.logging) console.log("did not load " + libs[i]);
		}
	}
});