// static tag for this js file, use in debug.log(listings.tag,"something you would like to log");
listings.tag = "LISTINGS";
listings.prototype = new behaviour();

// Listings constructor, tries to load its default components
function listings () {
	if (debug.logging) debug.log(listings.tag, "loaded");
	
	if (typeof this.refine_search_setup != 'undefined') this.refine_search_setup.run();
	else if (debug.logging) debug.log(listings.tag, "refine search deleted");
	
	if (typeof this.refineProcess != 'undefined') this.refineProcess('#refine_search_form');
	else if (debug.logging) debug.log(listings.tag, "refineProcess deleted");
	
	if (typeof this.view_setup != 'undefined') this.view_setup('#view-selectors button');
	else if (debug.logging) debug.log(listings.tag, "view_setup deleted");
	
	if (typeof this.toggle_view != 'undefined') this.toggle_view();
	else if (debug.logging) debug.log(listings.tag, "toggle_view deleted");
	
	if (typeof this.order_by != 'undefined') this.order_by();
	else if (debug.logging) debug.log(listings.tag, "order_by deleted");
	
	this.extra_setup(listings.tag);
}

listings.prototype.refineProcess = function(formId) {
	
	var self = this;
	
	$(formId).submit( function() {
		
		var dataAddOn = '';
		
		if($('#rs-suburb').val() == '' || $('#rs-suburb').val() == 'null' || $('#rs-suburb').val() == null){
			dataAddOn +=  '&sb_filter[]=';
		}
		
		if($('#rs-property-type').val() == "" || $('#rs-property-type').val() == 'null' || $('#rs-property-type').val() == null){
			dataAddOn +=  '&catg[]=';
		}
		
		var xhr = $.ajax({
			url: SITE_PATH + 'system/abajax.php',
			type: 'POST',
			data: $(this).serialize() + dataAddOn,
			async: true,
			beforeSend: function () {
				self.ajax_before_send();
			}
		});
		
		xhr.done( function(data) {
			setTimeout( function() {
				self.ajax_done(data);
			}, 200);
		});
		return false;
	});
	
}

listings.prototype.order_by = function() {
	
	var self = this;
	
	$('.orderby').change(function() {
		var xhr = $.ajax({
			url: SITE_PATH + 'system/abajax.php',
			type: 'GET',
			data: $(this).val(),
			beforeSend: function () {
				self.ajax_before_send();
			}
		});
		xhr.done( function(data) {
			setTimeout( function() {
				self.ajax_done(data);
			}, 200);
		});
	});	
}

listings.prototype.ajax_before_send = function() {
	
	$('.ajax-loader').removeClass('hidden');
	$('.tab-content').html('');
	
}

listings.prototype.ajax_done = function(data) {
    
    //auctions.prototype.auctionLink();
    
	$('.ajax-loader').addClass('hidden');
	$('.tab-content').html(data);
	
	if (typeof history.pushState != "undefined") {
		var post_url = '/'+$('#folder_name').val()+'/'+$('#request_uri').val()+'?sid='+$('#sid, input:hidden[name="sid"]').val()+'&suid='+$('#suid, input:hidden[name="suid"]').val();
		history.pushState({}, document.title, post_url);
	}
    
    if($('#request_uri').val() == 'auctions.php') {
        auctions.prototype.auctionLink();    
    }
    
}

// Mixin SubObject refine_search_setup
listings.prototype.refine_search_setup = {};
	// gets the tab index used in abajax queries
	listings.prototype.refine_search_setup.tab_index = function(tab_container) {
	
		if(tab_container.find('.tabs li a').length>0) {
			var tabs = tab_container.find('.tabs').clone();
			tabs.find('li:not(:has(a))').remove();
			var tab_idx = tabs.find('li.active').index();
			if(tab_container.find('.tabs').length==0 && typeof(start_idx != 'undefined')) {tab_idx = start_idx;}
		}else if(tab_container.find('.tabs select').length>0) {
			var tab_idx = tab_container.find('.tabs select').attr('selectedIndex');
		}
		return tab_idx;
	}
	// callback for the refine search abajax calls
	listings.prototype.refine_search_setup.callback = function(tab_container) {
		var self = this;
		activate_tab(tab_container);
		if(enable_abajax) {
			if(tab_container.find('.order-by').length>0){
				//if(($.browser.msie && ((parseInt($.browser.version)>7))) || !$.browser.msie) {
				//	tab_container.find('select:visible').each(function() {form_inp_sel($(this));});
				//}
				tab_container.find('.order-by select').attr('onchange', '').change(function() {
					var query = $(this).val().replace('/'+$('#folder_name').val()+'/'+$('#request_uri').val()+'?', '')+
						'&folder_name='+$('#folder_name').val()+
						'&request_uri='+$('#request_uri').val();
					abajax('GET', '/system/abajax.php', query, tab_container, self);
				});
			}

			if(tab_container.find('.pagination').length>0) {
				tab_container.find('.pagination a').click(function() {
					var query = $(this).attr('href').replace('/'+$('#folder_name').val()+'/'+$('#request_uri').val()+'?', '')+
						'&folder_name='+$('#folder_name').val()+
						'&request_uri='+$('#request_uri').val();
					abajax('GET', '/system/abajax.php', query, tab_container, self);
					if (typeof history.pushState != "undefined") {
						history.pushState({}, document.title, $(this).attr('href'));
					}
					return false;
				});
			}
		}
		if($('#print_prop_form').length>0 && $('.tab-container').length>0) {
			if($('#print_prop_form .print input').length>0) {
				$('#print_prop_form .print').each(function() {
					var text = $(this).children('input').hide().val();
					var input_link = $('<a/>', {'href':'javascript:;','text':text})
					$(this).append(input_link);
				});
				$('#print_prop_form .print a').on('click', function() {
					$(this).parent('.print').find('input:submit').click();
				});
			}
			$('#print_prop_form').submit(function() {
				$('#print_prop_form .tab-content:hidden').each(function() {
					$(this).find('.print_prop input:checkbox').attr('checked', false);
				});
			});
		}
		$('#tools label:has(a span.icon), .tools ul li:has(a span.icon)').each(function() {
			linkify($(this), 'span.icon');
		});
		
		if(jQuery().lazyload) {
			$('.photo a img:visible, .photo a img:not(:visible):gt(6)').lazyload({
				effect : "fadeIn",
				placeholder:"/img/grey.png"
			});
		}
		
		if(jQuery().fancybox) {
			// $("a.bookmark").fancybox({
				// scrolling : 'no',
				// type : 'iframe',
				// centerOnScroll : true,
				// padding: 0,
				// helpers : {
					// overlay: {
						// locked: false
					// },
					// title: null
				// }
			// });
			$("a.savelist-login").fancybox({
				'height':120,
				'width': 500,
				'scrolling':'no',
				'centerOnScroll':true
			});	
			$("a.savelist").fancybox({
				'height':140,
				'width': 500,
				'type': 'iframe',
				'scrolling':'no',
				'centerOnScroll':true
			});
		}
	}
	
	// initialise the refine search menu, bind change events to selects/checkboxes
	// these events trigger "refine" which is bound to making a abajax call
	listings.prototype.refine_search_setup.init_menu = function() {
	
		var self = this;
		
		if($('#refine_search_form').length > 0) {
			
			self.callback($('.tab-container:eq(0)'));
			
			if(enable_abajax) {
			
				$('#refine_search_form').bind('refine', function( event ) {
					event.stopImmediatePropagation();
					
					var query = $(this).serialize() + 
						'&folder_name='+$('#folder_name').val()+
						'&request_uri='+$('#request_uri').val();
						
					//query = query.replace(/sid=[^&;]*/,'')
					//query = query.replace(/&suid=[^&;]*&/,'');
					
					abajax('POST', '/system/abajax.php', query, $('.tab-container:eq(0)'), self);
					if (typeof history.pushState != "undefined") {
						var post_url = '/'+$('#folder_name').val()+'/'+$('#request_uri').val()+'?sid='+$('#sid, input:hidden[name="sid"]').val()+'&suid='+$('#suid, input:hidden[name="suid"]').val();
						history.pushState({}, document.title, post_url);
					}
					return false;
				});
			}
		//	self.select_change();
		//	self.checkbox_change();
		}
	}
	listings.prototype.refine_search_setup.select_change = function() {
		if(enable_abajax) {
			$('#refine-search select').off("change").on("change", function() {
				$('#refine-search form').trigger('refine');
			});
		}
	}
	listings.prototype.refine_search_setup.checkbox_change = function() {
		if(enable_abajax) {
			$('#refine-search input:checkbox').change(function() {
				$('#refine-search form').trigger('refine');
			});
		}
	}	
	// the run function initially setups up the menu
	// also binds the init_menu function to "new_options"
	// this event should be triggered by any changes that will require 
	// init menu to redo its change bindings.
	listings.prototype.refine_search_setup.run = function () {
		var self = this;
		self.init_menu();
		$('#refine_search_form').bind('new_options', function () { self.init_menu() });
	}
// END refine_search_setup

listings.prototype.view_setup = function(elm) {
	
	var windowW = $(window).width();
	
	viewToggles = elm; // activate our view tabs
	var first = $(elm).first(); // activate first view button
	var target = first.data('target'); // get first view button's target content panel
	
	if(windowW <= 768) {
		if($(target).hasClass('hidden-xs')) {
			$(viewToggles).removeClass('active');
			target = '#galleryview';
		}
	} else {
		first.addClass('active');
	}
	
	// Activate first tab on page load
	first.addClass('active');
	$(target).addClass('active in');
}


listings.prototype.toggle_view = function() {
	
	var self = this;
	
	$(viewToggles).on('show.bs.tab', function(e) {
		$(viewToggles).removeClass('active');
		$(e.target).addClass('active');
	});
	
	$(viewToggles).on('shown.bs.tab', function(e) {
		if($(e.target).data('target') == '#mapview') {
			mapView("mapview-canvas", Listings);
		}
	});
	
	$(window).resize( function() {
		self.view_setup('#view-selectors button');
	});
}