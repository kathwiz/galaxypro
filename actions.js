actions.tag = "ACTIONS";
actions.prototype = new behaviour();

function actions () {

	if (debug.logging) debug.log(actions.tag, "loaded");
	
	if (typeof this.fast_search_setup != 'undefined') this.fast_search_setup();
	else if (debug.logging) debug.log(actions.tag, "fast search deleted");
	
	if (typeof this.suburbProfileFlexslider != 'undefined') this.suburbProfileFlexslider();
	else if (debug.logging) debug.log(actions.tag, "suburbProfileFlexslider search deleted");

	if (typeof this.facebookSharer != 'undefined') this.facebookSharer();
	else if (debug.logging) debug.log(actions.tag, "facebookSharer search deleted");
	
	if (typeof this.suburbProfileTabs != 'undefined') this.suburbProfileTabs();
	else if (debug.logging) debug.log(actions.tag, "suburbProfileTabs search deleted");
	
	if (typeof this.footer_slideshow_setup != 'undefined') this.footer_slideshow_setup();
	else if (debug.logging) debug.log(actions.tag, "footer slideshow deleted");
	
	if (typeof this.footer_seo_setup != 'undefined') this.footer_seo_setup();
	else if (debug.logging) debug.log(actions.tag, "footer seo deleted");
	
	if (typeof this.webkit_resize_setup != 'undefined') this.webkit_resize_setup();
	else if (debug.logging) debug.log(actions.tag, "webkit resize deleted");
	
	// if (typeof this.init_responsive_menu != 'undefined') this.init_responsive_menu();
	// else if (debug.logging) debug.log(actions.tag, "init_responsive_menu deleted");
	
	if (typeof this.custom_select_setup != 'undefined') this.custom_select_setup();
	else if (debug.logging) debug.log(actions.tag, "custom select deleted");
	
	if (typeof this.nav_menu_setup != 'undefined') this.nav_menu_setup();
	else if (debug.logging) debug.log(actions.tag, "nav menu deleted");
	
	if (typeof this.forgot_password_setup != 'undefined') this.forgot_password_setup();
	else if (debug.logging) debug.log(actions.tag, "forgot_password_setup deleted");
	
	if (typeof this.suburb_profiles_init != 'undefined') this.suburb_profiles_init();
	else if (debug.logging) debug.log(actions.tag, "suburb_profiles_init deleted");

	
if (typeof this.free_text_img != 'undefined') this.free_text_img();
	else if (debug.logging) debug.log(cms.tag, "free_text_img deleted");
	
	//back to top
	if(typeof $().UItoTop != 'undefined') {
		console.log("lets go");
		$().UItoTop({
			scrollSpeed: 500,
			easingType: 'swing'
		});
	} else if (debug.logging) {
		debug.log(actions.tag, "UItoTop not loaded");
	}
	
	this.extra_setup(actions.tag);
}

actions.prototype.forgot_password_setup = function() {
	//login forgot password
	$('#forgot-password a').fancybox({
		height: 245,
		width: 500,
		autoSize: false,
		href : SITE_PATH + 'system/forgot-password.php',
		type : 'iframe',
		scrolling: 'no',
		padding: 0,
		helpers : {
			overlay: {
				locked: true
			},
			title: null
		}
	});
}

actions.prototype.fast_search_setup = function () {
    
    var toggle = $('button[data-toggle="fsearch"]');
    var fsearchW = $('#fast_search_form').width();
    var fsearchInputW = $('#fsearch').outerWidth();
    
    $(toggle).bind('click' , function() {
        
        var target = $(this).data('target');
        
        if($(target).hasClass('closed')) {
            $(target).animate({
               width: fsearchW 
            }, 200, function() {
                $(target).removeClass('closed').addClass('opened');
            });
            $(toggle).addClass('full-opacity');
            $(toggle).find('.glyphicon').removeClass('glyphicon-search').addClass('glyphicon-remove');
        } else {
            
            if($(target).hasClass('opened')) {
                $(target).animate({
                   width: 0
                }, 200, function() {
                    $(target).removeClass('opened').addClass('closed');    
                });
                $(toggle).removeClass('full-opacity');
                $(toggle).find('.glyphicon').removeClass('glyphicon-remove').addClass('glyphicon-search');
            }    
        }
    });
    
	if($('#fast_search').length>0) {

		var org_val = "";
		if($('#fast_search_form .fs_type').length > 0){
			$('#fast_search_form .fs_type').click(function(){
				var type = $(this);
				$('#fast_search_form .fs_type').removeClass('active');
				var action = type.data('action');
				type.addClass('active');
				$('#fast_search_form').attr("action", action);
			});
			$('#fast_search_form .fs_submit').click(function(){
				if($('#fast_search_form').find('#suburb_id').val().trim() == "" || !$('#fast_search_form').find('#suburb_id').val()){
					$('#fast_search_form').find('#fsearch').attr("name", "street");
				}
				$('#fast_search_form').submit();
				return false;
			});
			$('#fast_search_form #fsearch').change(function(){
				if($(this).val().trim() == '' || $(this).val().trim() != org_val){
					$('#fast_search_form #suburb_id').val("");
				}
			});
		}

		//fast search autocomplete
		options = { serviceUrl: SITE_PATH+'system/fsbsearch.php',
				minChars: 3,
				delimiter: /(,|;)\s*/,
				maxHeight: 200,
				width: fsearchInputW,
				zIndex: 100000,
				deferRequestBy: 0,
				noCache: true,
                dataType: 'json',
                onSearchComplete: function(query, suggestions) {
                        
                },
				onSelect: function(value, data){
					$('#suburb_id').val(data);
					org_val = $('#fast_search_form #fsearch').val();
				},
                forceFixPosition: true,
                appendTo: '#fast_search'
		};
		if (site_func.fast_find_autocomplete) {
			$('#fsearch').autocomplete(options);
		};
	}
}

actions.prototype.footer_slideshow_setup = function () {
	//footer testimonials slideshow
	$('.footer-wrap .testimonials ul li:gt(0)').css('opacity',0);
	$('.footer-wrap .testimonials ul').cycle({fx: 'fade', timeout: 10000});
	
}

actions.prototype.footer_seo_setup = function () {
	//footer suburb seo link behaviour
	if($('footer #suburbs li').length>max_suburbs) {
		var rows = $('footer #suburbs li.right-column+li').length+1;
		var columns = ($('footer #suburbs li.right-column').length)?$('footer #suburbs li').index($('.right-column:first'))+1:$('footer #suburbs li').length+1;
		var suburb_h = $('footer #suburbs ul').height();
		var max_h = $('footer #suburbs li').outerHeight()*Math.round(max_suburbs/columns);
		$('footer #suburbs ul').height(max_h);
		$('footer #suburbs p .hide').addClass('hidden');
		$('footer #suburbs p a').show().click(function() {
			$('footer #suburbs p span').toggleClass('hidden');
			var h_offset = ($('footer #suburbs p span:visible').hasClass('hide'))?suburb_h:max_h;
			$('footer #suburbs ul').stop().animate({'height':h_offset}, 500, 'swing');
		});
	}
}

actions.prototype.webkit_resize_setup = function () {
	//text boxes and textareas resize for webkit browsers
	webkit_resize();
}

actions.prototype.custom_select_setup = function () {
	//customised select box in non-ie7 browsers
	if(($.browser.msie && ((parseInt($.browser.version)>7))) || !$.browser.msie) {
		if($('select').length>0) {
			$('select:not(body.property-alert .tab-container select)').each(function() {form_inp_sel($(this));});
			$('.sel-text').blur(function() {
				if(!mouse_on_dropdown) { $('ul.dropdown_ul:visible').slideUp(100);}
			});
		}
	}
}

actions.prototype.nav_menu_setup = function () {
	//nav menu highlight
	if($('#nav_active').val()) {
		$('nav ul li.'+$('#nav_active').val()).addClass('active');
	}else {
		$('nav ul li.home').addClass('');
	}
}


actions.prototype.suburbProfileFlexslider = function() {

	if($('.flexslider-suburb-profiles').length > 0) {
		$('.flexslider-suburb-profiles').flexslider({
			nextText: '',
			prevText: '',
			controlNav: false
		});
	}
}

actions.prototype.facebookSharer = function() {
	
	$('.fb-sharer').click( function() {
		
		winHeight = 800;
		winWidth = 800;
		
		var winTop = ($(window).height / 2) - (winHeight / 2);
		var winLeft = ($(window).width / 2) - (winWidth / 2);
		
		var title = $(this).data('title');
		var descr = $(this).data('descr');
		var url = $(this).data('url');
		var image = $(this).data('image');
		
		window.open('http://www.facebook.com/sharer/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=50,right=200,toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
	
		return false;
	});
	
}

actions.prototype.suburb_profiles_init = function() {
	
	$('.suburb-profiles a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		
		var src = '';
		
		// Video Init
		if($(e.target).attr('href') == '#video') {
			src = $(e.target).data('src');
			
			if(src != '') {				
				var player = $('<iframe>', {
					src: src,
					frameborder: 0,
					allowfullscreen: false
				});
				
				$('#video').html(player);
			}
			
		}
		
		if($(e.target).attr('href') == '#map') {
			
			showMap('map', PropLatlng, PropAddress);
			
		}
	});
}
actions.prototype.free_text_img = function() {
	
	// need to get all free-text img initial width (usually set by client in CMS).
	var imgs = $('.free-text img').not('.staffcategory img').not('.owl-carousel img');
	var imgWidths = new Array();
	
	$.each(imgs, function() {
		imgWidths.push($(this).attr('width'));
	});
	
	// If window size is less than or equal to 768, set img width to 100% of screen
	if(windowW <= 768) {
		$('.free-text img, #free-text img').css({
			width: '100%'
		}).removeAttr('height');
		
		$.each(imgs, function(i, obj) {
		
			$(this).css({
				paddingBottom: 15
			});
		
			if($(this).css('float') == 'left') {
				$(this).css({
					paddingRight: 0,
				});
			}
		});
		
	} else {
	// If window size is greater than 768, set it back to its original width.
		$.each(imgs, function(i, obj) {
			$(this).width(imgWidths[i]).removeAttr('height');
			if($(this).css('float') == 'left') {
				$(this).css({
					paddingRight: 25
				});
			}
		}); 
	}
	
	$(window).resize( function () {
	
		// If window size is less than or equal to 768, set img width to 100% of screen
		if(windowW <= 768) {
			$('.free-text img, #free-text img').css({
				width: '100%'
			});
			$.each(imgs, function(i, obj) {
				if($(this).css('float') == 'left') {
					$(this).css({
						paddingRight: 0,
						paddingBottom: 15
					});
				}
			});
		} else {
		// If window size is greater than 768, set it back to its original width.
			$.each(imgs, function(i, obj) {
				$(this).width(imgWidths[i]).removeAttr('height');
				if($(this).css('float') == 'left') {
					$(this).css({
						paddingRight: 25
					});
				}
			}); 
		}
		
	});
	
}