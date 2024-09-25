// This overrides file shows the overrides I used to fix the red site
// Several of these involve changing or adding a single line to a function
// In these cases it may still be advisable to put the overridden versions
// of these functions here as it centralises the website specific changes
// (but you can still directly edit the library if preferred)
overrides.tag = "OVERRIDE - ";

function overrides () { }

// Apply changes to page behaviours
overrides.prototype.apply = function () {

windowW = $(window).width();	
	
	delete actions.prototype.footer_slideshow_setup;
	delete actions.prototype.custom_select_setup
	delete actions.prototype.webkit_resize_setup;
	delete home.prototype.featured_property_slideshow_cycle_setup;
	delete home.prototype.quick_search_setup;
	delete profiles.prototype.tab_content_setup;
	delete details.prototype.magnifier_setup;
	//delete details.prototype.map_setup;
	delete listings.prototype.refine_search_setup;

home.prototype.extra.push( function featurePropertySlider() {
	
	var owl = $('#pow, #home-slideshow').owlCarousel({
		navigation: false,
		paginationSpeed: 500,
		autoPlay: 5000,
		pagination: false,
		singleItem: true,
		slideSpeed: 500
	});
	
	$('.custom-navigation').find('.next').click(function(){
			owl.trigger('owl.next');
	});
	$('.custom-navigation').find('.prev').click(function(){
			owl.trigger('owl.prev');
	});
	
});

details.prototype.extra.push( function propertySlider() {
	
	var owl = $('.owl-carousel').owlCarousel({
		navigation: false,
		paginationSpeed: 1000,
		autoPlay: 5000,
		autoHeight : true,
		pagination: false,
		singleItem: true,
		slideSpeed: 1000,
		autoHeight: true
	});
	
	$('.custom-navigation').find('.next').click(function(){
			owl.trigger('owl.next');
	});
	$('.custom-navigation').find('.prev').click(function(){
			owl.trigger('owl.prev');
	});
	
});

// Ensure that the listing info container renders to the same height as
// the listing image container at all times.
listings.prototype.extra.push( function() {
	
	setTimeout ( function() {
		listingContainerResize();
	}, 100);
	
	$(window).resize( function() {
		listingContainerResize();
	});	
	
//	callInfiniteScroller();
});



actions.prototype.extra.push ( function themeBiulder() {
	
	var tb = $('.theme-builder');
	
	tb.find('.theme-builder-btn').click( function() {
		$('.theme-builder-panel').fadeIn();
		return false;
	});
	
});

actions.prototype.extra.push( function jsEnable() {
	
	$('.js-enable').removeClass('show').hide();
	$('.js-disable').removeClass('hidden').show();
	
});



actions.prototype.extra.push( function videosInit() {
    $('.videos .btn-video, .videos .panel-img').fancybox({
        type: 'iframe',
        autoResize: true,
        fitToView: true,
        padding: 0,
        helpers : {
            overlay: {
                locked: false
            },
            title: null
        }
    });
});

// DEFAULT ACTIONS AS PER BASE TEMPLATE
actions.prototype.extra.push ( function () {
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $('.insp-action').click( function() {
        if($(this).hasClass('active')) {
            return false;
        }
    });
    
        
	//	$('.video-play').center();
		
		$('.selectpicker').selectpicker({
			size: 5,
			dropupAuto: false
		});
	
		/* carousel testimony */
		$('#testislider').carousel({
			interval: 6000
		});

		/* scrolltop */
		$('.scroltop').on('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});

		/* modal */
		$('.modal').on('shown.bs.modal', function () {
			var curModal = this;
			$('.modal').each(function(){
				if(this != curModal){
					$(this).modal('hide');
				}
			});
		});

		$('[rel="tooltip"]').tooltip();

		//		Contact forms
		if($('form.form').length > 0){
			
			// All forms except for the footer contact form
			$('form.form').not('.contact-form').submit(function(){

				var form = $(this);
				
				$(form).find('.form-group').removeClass('has-error');
				$(form).find('.alert').addClass('hide');


				var xhr = $.ajax({
					url: form.attr('action'),
					data: $(this).serialize() + '&ajax_post=1',
					type: 'POST',
					dataType: 'json',
					beforeSend: function() {
						$(form).find('input[type="submit"]').attr('disabled', 'disabled').val('Please wait...');
					}
				});
				
				xhr.done(function(data) {

					$(form).find('input[type="submit"]').removeAttr('disabled', 'disabled').val('SUBMIT');
				
					$(document).scrollTo('#scroll-to', 400, { offset: -80 });
					
					var errorMsg = '';
					
					if(data.hasOwnProperty('errors')) {
						errorMsg += '- Please fill in all required fields<br>';
						for(var e = 0; e < data.errors.length; e++) {
							if(data.errors[e].value) {
								if(data.errors[e].key == 'recaptcha') {
									errorMsg += '- ' + data.errors[e].value;
									if(data.errors[e].key == 'recaptcha' && data.errors.length == 1){
										errorMsg = data.errors[e].value;
									}
								}
								$(form).find('#' + data.errors[e].key).closest('.form-group').addClass('has-error');
							}
						}
						$('.alert.alert-danger[data-form="'+$(form).attr('id')+'"]').removeClass('hide').html(errorMsg);
					} else {
						if(data.hasOwnProperty('success')) {
							$('.alert[data-form="'+$(form).attr('id')+'"]').removeClass('hide').removeClass('alert-danger').addClass('alert-success').text(data.success[0].value);
							$(form).remove();
						}						
					}
				});
				return false;
			});
			
			$('form.contact-form').submit(function(){
				
				var form = $(this);
				
				$(form).find('.form-group').removeClass('has-error');
				$(form).find('.alert').addClass('hide');
				
				var xhr = $.ajax({
					url: form.attr('action'),
					data: $(this).serialize() + '&ajax_post=1',
					type: 'POST',
					dataType: 'json',
					beforeSend: function() {
						$(form).find('input[type="submit"]').attr('disabled', 'disabled').val('Please wait...');
					}
				});
				
				var errorMsg = '';
				
				xhr.done(function(data) {
					$(form).find('input[type="submit"]').removeAttr('disabled', 'disabled').val('SUBMIT');
					
					if(data.hasOwnProperty('errors')) {
						errorMsg += '- Please fill in all required fields<br>';
						for(var e = 0; e < data.errors.length; e++) {
							if(data.errors[e].value) {
								if(data.errors[e].key == 'recaptcha') {
									errorMsg += '- ' + data.errors[e].value;

									if(data.errors[e].key == 'recaptcha' && data.errors.length == 1){
										errorMsg = data.errors[e].value;
									}
								}
								$(form).find('#' + data.errors[e].key).closest('.form-group').addClass('has-error');
							}
						}
						$('.alert.alert-danger[data-form="'+$(form).attr('id')+'"]').removeClass('hide').html(errorMsg);
					} else {
						if(data.hasOwnProperty('success')) {
							$('.alert[data-form="'+$(form).attr('id')+'"]').removeClass('hide').removeClass('alert-danger').addClass('alert-success').text(data.success[0].value);
							$(form).remove();
						}						
					}
				});
				
				return false;
			});
			
			
			
		}
});
	

	actions.prototype.extra.push ( function indexPropertyHeight() {
		
		var ary = new Array();
		var elm = $('.index-properties .listing-container .property-content');
		
		$.each( elm, function () {
			ary.push($(this).height());
		});
		
		var heighest = Math.max.apply(Math, ary);
		
		$.each( elm, function () {
			$(this).height(heighest);
		});
		
		$(window).resize( function(){
			
			ary.length = 0;
			
			$.each( elm, function () {
				ary.push($(this).height());
			});
		
			heighest = Math.max.apply(Math, ary);
		
			$.each( elm, function () {
				$(this).height(heighest);
			});
		});
		
	});
	
	
	actions.prototype.extra.push ( function quickSearch() {
	
		if($('#quick_search_form select#qs-type').length > 0) {
            
            selected = $('#qs-type option:selected').data('qstype');
            quickSearchFilter(selected);
            
            $('#qs-type').on('change', function() {
                selected = $('#qs-type option:selected').data('qstype');
                quickSearchFilter(selected);
            });
		}
		
	});
	
    
    

function quickSearchFilter(selected) {

    var filters = $('#quick_search_form select.filter');
    
    $('#quick_search_form').attr('action', SITE_PATH + $('#qs-type option:selected').val());
    
    $.each(filters, function() {
        var options = $(this).find('option');
        $.each(options, function() {
            if(!$(this).hasClass(selected)) {
                $(this).hide();
            } else {
                $(this).show();
                $(this).removeAttr('selected');
            }
        });
        
        $(filters).selectpicker('deselectAll');
        $(filters).selectpicker('refresh');
    });
    $('#quick_search_form .selectpicker').selectpicker('refresh');
}
	
	actions.prototype.extra.push ( function fancyBoxSetup() {
		
		var w = 480;
		
		if(windowW <= 533) {
			w = 320;
		}
		
		$(window).resize( function(){
			if(windowW <= 533) {
				w = 320;
			}
		});
		
		// Bookmark a Property
		$('.bookmark').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 320,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		$('a.dtl-bookmark').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 320,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		$('a.forgot-password').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 320,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		// Email office - Send Enquiry
		$('.enquiry').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 565,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		
		$('a.save-search').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 350,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		$('a.email-contract, a.email-agent').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 565,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		$('a.email-a-friend').fancybox({
			type: 'iframe',
			padding: 0,
			width: w,
			height: 565,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
		$('.gallery-image a.fancybox').fancybox({
			padding: 0,
			fitToView: true,
			autoSize: false,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
		
	});
	
	actions.prototype.extra.push( function initResponsiveMenu() {
		
		// The minimum width of the browser where you want the responsive 
		// attributes to be initialized to the menu
		var widthThreshold = 768;
		
		var nav = $('#navbar-top .navbar-nav');
		var navLi = $(nav).find('li');
	
		
		if(windowW <= widthThreshold) {
			responsiveMenuAttr(nav, navLi);
		} else {
			responsiveMenuAttrRemove(nav, navLi);
		}
		
		$(window).resize( function () {
			windowW = $(window).width();
			if(windowW <= widthThreshold) {
				responsiveMenuAttr(nav, navLi);
			} else {
				responsiveMenuAttrRemove(nav, navLi);
			}
		});
	});

	
	actions.prototype.extra.push ( function liveDOM() {
		
		// var elm = document.getElementsByTagName('nav');
		
		// $.each( elm, function(i, obj) {
		
			// $(this).click( function() {
				// var self = this;
				// var color = prompt('Enter HEX color');
				// if(color != null) {
					// $(self).css({
						// backgroundColor: color
					// });
				// }
			// });
			
		// });
		
	});
	

	details.prototype.extra.push( function detailsFlexslider() {
		$('.details-gallery .details-flexslider').flexslider({
			controlNav: false,
			prevText: '',
			nextText: '',
			animation: 'slide'
		});
		
	});
	
	details.prototype.extra.push ( function tabbedContentInit() {
	
		tooltips();
	
		var video = $('#video iframe').attr('src');
		
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			if(e.target.hash == '#video') {
				$('#video iframe').attr('src',video);
			}

		});
		$('a[href="#map"]').on('shown.bs.tab', function (e) {
			showMap('google-canvas', PropLatlng, PropAddress);
		});
		
	});
	
	details.prototype.extra.push ( function floorplanZoom() {
		$('a[href="#floorplan"]').on('shown.bs.tab', function (e) {
			
			
			
		});
		
		$('.floorplan-slider').flexslider({
			controlNav: false
		});
		$('.floorplan-enlarge').fancybox({
			padding: 0,
			fitToView: true,
			autoSize: true,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
	
	});
	
	details.prototype.extra.push ( function detailsGallery() {
		$('.gallery-image a').fancybox({
			padding: 0,
			helpers : {
				overlay: {
					locked: false
				},
				title: null
			}
		});
	});
	
	
}

/**** ------------- Large Extra Functions ------------- ****/
function listingContainerResize() {
	
	// ltgImage = $('.listview .listing-image .main-image');
	// $.each(ltgImage, function() {
		
		// height = $(this).height();
		
		// if($(this).height() < 174) {
			// height = 174;
		// }
		
		// $(this).closest('.listing-container').find('.listing-info-container').height(height);
	// });	
}

function callInfiniteScroller() {

    // $container = $('.listing-results.listview');
    // $container.infinitescroll({
        // navSelector: '#page-nav', // selector for the paged navigation 
        // nextSelector: '#page-nav a', // selector for the NEXT link (to page 2)
        // itemSelector: '.listview .listing-container', // selector for all items you'll retrieve
        // loading: {
            // msgText: '',
            // finishedMsg: '',
            // img: '../img/spinner.gif',
			// speed: 100,
			// animate: false
        // },
        // maxPage: $('#all_pages').val(),
    // }, function() {
		// setTimeout( function() {
			// listingContainerResize();
			// tooltips();
		// }, 100);
	// });
	
	
	$galleryContainer = $('.listing-results.galleryview .row');
	$galleryContainer.infinitescroll({
        navSelector: '#page-nav', // selector for the paged navigation 
        nextSelector: '#page-nav a', // selector for the NEXT link (to page 2)
        itemSelector: '.galleryview .galleryview-container', // selector for all items you'll retrieve
        loading: {
            msgText: '',
            finishedMsg: '',
            img: '../img/spinner.gif',
			speed: 100,
			animate: false
        },
        maxPage: $('#all_pages').val(),
    });
	
}

function responsiveMenuAttr(nav, navLi) {
	
	$.each(navLi, function(i, obj) {
		if($(obj).hasClass('has-children')) {
			$(obj).addClass('dropdown');
			$(obj).find('ul').addClass('dropdown-menu');
			$(obj).find(' > a ').addClass('dropdown-toggle').attr('data-toggle','dropdown');
		}
	});
		
}

function responsiveMenuAttrRemove(nav, navLi) {
	// $.each(navLi, function(i, obj) {
		// $(obj).removeClass('dropdown');
		// $(obj).find('ul').removeClass('dropdown-menu');
		// $(obj).find(' > a ').removeClass('dropdown-toggle').removeAttr('data-toggle');
	// });
}
/**** ------------  Override Utility Functions  ------------ ****/



/**** ------------  Extra Utility Functions  ------------ ****/

function tooltips() {

	$('.ab-btn, .bookmark, .enquiry').tooltip({
		container: 'body'
	});
}


jQuery.fn.centerHorizontal = function () {
    this.css("position","absolute");
    this.css("left", Math.max(0, (($(this).parent().width() - $(this).outerWidth()) / 2) + 
                                                $(this).parent().scrollLeft() - 5 ) + "px");
    return this;
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(this).parent().height() - $(this).outerHeight()) / 2) + 
                                                $(this).parent().scrollTop()) + "px");
    this.css("left", Math.max(0, (($(this).parent().width() - $(this).outerWidth()) / 2) + 
                                                $(this).parent().scrollLeft()) + "px");
    return this;
}
