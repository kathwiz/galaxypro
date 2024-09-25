details.tag = "DETAILS"
details.prototype = new behaviour();

function details() {
	if (debug.logging) debug.log(details.tag, "loaded");
	
	if (typeof this.adGallery_setup != 'undefined') this.adGallery_setup();
	else if (debug.logging) debug.log(details.tag, "adGallery deleted");
	
	if (typeof this.linkify_setup != 'undefined') this.linkify_setup();
	else if (debug.logging) debug.log(details.tag, "linkify deleted");
	
	// Fancy boxes setup
	if (typeof this.projlist_fb_setup != 'undefined') this.projlist_fb_setup();
	else if (debug.logging) debug.log(details.tag, "projlist fb deleted");
	
	if (typeof this.emailfriend_fb_setup != 'undefined') this.emailfriend_fb_setup();
	else if (debug.logging) debug.log(details.tag, "emailfriend fb deleted");
	
	if (typeof this.emailcontract_fb_setup != 'undefined') this.emailcontract_fb_setup();
	else if (debug.logging) debug.log(details.tag, "emailcontract fb deleted");
	
	if (typeof this.emailoffice_fb_setup != 'undefined') this.emailoffice_fb_setup();
	else if (debug.logging) debug.log(details.tag, "emailoffice fb deleted");
	
	if (typeof this.emailagent_fb_setup != 'undefined') this.emailagent_fb_setup();
	else if (debug.logging) debug.log(details.tag, "emailagent fb deleted");
	
	if (typeof this.directions_fb_setup != 'undefined') this.directions_fb_setup();
	else if (debug.logging) debug.log(details.tag, "directions fb deleted");
	
	if (typeof this.floorplan_fb_setup != 'undefined') this.floorplan_fb_setup();
	else if (debug.logging) debug.log(details.tag, "floorplan fb deleted");
	
	if (typeof this.bookmark_fb_setup != 'undefined') this.bookmark_fb_setup();
	else if (debug.logging) debug.log(details.tag, "bookmark fb deleted");

	if (typeof this.fullsize_fb_setup != 'undefined') this.fullsize_fb_setup();
	else if (debug.logging) debug.log(details.tag, "fullsize fb deleted");
	
	// End of fancy box setups - next is youtube, magnifier and map
	
	if (typeof this.youtube_setup != 'undefined') this.youtube_setup();
	else if (debug.logging) debug.log(details.tag, "youtube deleted");
	
	if (typeof this.magnifier_setup != 'undefined') this.magnifier_setup();
	else if (debug.logging) debug.log(details.tag, "magnifier deleted");
	
	if (typeof this.map_setup != 'undefined') this.map_setup();
	else if (debug.logging) debug.log(details.tag, "map deleted");	
	
	this.extra_setup(details.tag);
}

details.prototype.linkify_setup = function () {	
	$('.tools .links li:has(a span.icon)').each(function() {
		linkify($(this), 'span.icon');
	});
}
	
details.prototype.projlist_fb_setup = function () {
	$('.projlist').fancybox({
		'hideOnOverlayClick': false,
		'hideOnContentClick': false,
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}

details.prototype.emailfriend_fb_setup = function () {
	$("a.emailfriend").fancybox({
		'hideOnOverlayClick': false,
		'hideOnContentClick': false,
		'height': 360,
		'width': 500,
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}

details.prototype.emailcontract_fb_setup = function () {
	$("a.emailcontract").fancybox({
		'hideOnOverlayClick': false,
		'hideOnContentClick': false,
		'height': 290,
		'width': 500,
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}

details.prototype.emailoffice_fb_setup = function () {
	$("a.emailoffice").fancybox({
		'width' : 500,
		'height' : ($("a.emailoffice.multioffice").length>0)?410:380,
		'type' : 'iframe',
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}	

details.prototype.emailagent_fb_setup = function () {
	$("a.emailagent").fancybox({
		'width' : 500,
		'height' : 365,
		'type' : 'iframe',
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}

details.prototype.directions_fb_setup = function () {
	$('a.directions').fancybox({
		'width':855,
		'height':550,
		'centerOnScroll': true,
		'scrolling':'no'
	});
}

details.prototype.floorplan_fb_setup = function () {
		// Removed mozilla only check (confirmed working in chrome)
		$('a.floorplan').fancybox({
			'hideOnOverlayClick': false,
			'hideOnContentClick': false,
			'width': 950,
			'height': 700,
			'centerOnScroll':true
		});
}
details.prototype.bookmark_fb_setup = function () {
	$("a.bookmark").fancybox({'centerOnScroll':true});
}

details.prototype.fullsize_fb_setup = function () {
	$("a.full-size").fancybox({'centerOnScroll':true});
}

details.prototype.youtube_setup = function () {	
	$("#overview a.youtube").click(function() {
		var href;
		if(this.href.search(/watch/) != -1) {
			href = this.href.replace(new RegExp("watch\\?v=", "i"), 'v/');
		}else if(this.href.search(/youtu\.be/) != -1) {
			href = this.href.replace(new RegExp("youtu\.be/", "i"), 'youtube.com/v/');
		}
		$.fancybox({
			'padding'		: 0,
			'autoScale'		: false,
			'transitionIn'	: 'none',
			'transitionOut'	: 'none',
			'title'			: this.title,
			'width'			: 680,
			'height'		: 495,
			'href'			: href,
			'type'			: 'swf',
			'swf'			: {
				'wmode'		: 'transparent',
				'allowfullscreen'	: 'true'
			}
		});
		return false;
	});	
}

details.prototype.magnifier_setup = function () {
	$("span.magnifier").live('click', function() {
		var index = $(this).siblings('img:visible').data('index');
		$("a.full-size").filter(':eq('+index+')').click();
		return false;
	});
}

details.prototype.map_setup = function () {
	if($('.no-photo-map').length > 0) {
		showMap("google-canvas",PropLatlng, PropAddress);
	}
}

details.prototype.adGallery_setup = function() {
	if ($('.ad-gallery').length>0 && start_idx == 0) {
		adGallery($('.ad-gallery'));
	}
}

