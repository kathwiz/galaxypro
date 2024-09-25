staff.tag = "STAFF"
staff.prototype = new behaviour();

function staff() {
	if (debug.logging) debug.log(staff.tag, "loaded");
	
	if (typeof this.emailagent_fb_setup != 'undefined') this.emailagent_fb_setup();
	else if (debug.logging) debug.log(staff.tag, "emailagent fb deleted");
	
	this.extra_setup(staff.tag);
}

staff.prototype.emailagent_fb_setup = function () {
	$("a.emailagent").fancybox({
		'width' : 500,
		'height' : 365,
		'type' : 'iframe',
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}