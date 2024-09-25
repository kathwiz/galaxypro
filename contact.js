contact.tag = "CONTACT"
contact.prototype = new behaviour();

function contact() {
	if (debug.logging) debug.log(contact.tag, "loaded");
	
	if (typeof this.emailoffice_fb_setup != 'undefined') this.emailoffice_fb_setup();
	else if (debug.logging) debug.log(contact.tag, "emailoffice fb deleted");
		
	this.extra_setup(contact.tag);
}

contact.prototype.emailoffice_fb_setup = function () {	
	if($('.error').length >0) {
		$('.error').next('dd').children('input[type="text"], input[type="password"], select, textarea, .select-box').css('border', '1px solid #c00');
	}
	$("a.emailoffice").fancybox({
		'width' : 500,
		'height' : ($("a.emailoffice.multioffice").length>0)?430:400,
		'type' : 'iframe',
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}
