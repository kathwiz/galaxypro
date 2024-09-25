profiles.tag = "PROFILES"
profiles.prototype = new behaviour();

function profiles() {
	if (debug.logging) debug.log(profiles.tag, "loaded");
	
	if (typeof this.emailagent_fb_setup != 'undefined') this.emailagent_fb_setup();
	else if (debug.logging) debug.log(profiles.tag, "emailagent fb deleted");
	
	if (typeof this.tab_content_setup != 'undefined') this.tab_content_setup();
	else if (debug.logging) debug.log(profiles.tag, "tab content deleted");
	
	if (typeof this.tabContentSetup != 'undefined') this.tabContentSetup();
	else if (debug.logging) debug.log(profiles.tag, "tabContentSetup deleted");
	
	if (typeof this.tabActiveCookie != 'undefined') this.tabActiveCookie();
	else if (debug.logging) debug.log(profiles.tag, "tabActiveCookie deleted");
	
	if (typeof this.listingsPaginator != 'undefined') this.listingsPaginator();
	else if (debug.logging) debug.log(profiles.tag, "listingsPaginator deleted");
	
	if (typeof this.profileInfiniteScroller != 'undefined') '';
	else if (debug.logging) debug.log(profiles.tag, "profileInfiniteScroller deleted");
	
	this.extra_setup(profiles.tag);
}

profiles.prototype.emailagent_fb_setup = function () {
	$("a.emailagent").fancybox({
		'width' : 500,
		'height' : 400,
		'type' : 'iframe',
		'scrolling' : 'no',
		'centerOnScroll':true
	});
}
	
profiles.prototype.tab_content_setup = function () {
	var self = this;
	if(enable_abajax) {
		if($('.tabs').length>0) {
			var tab_content = $('.tabs').next('.tab-content');
			$('.tabs a').click(function() {
				var prev_class = $('.tabs .active a').attr('rel');
				$(this).parent().addClass('active').siblings().removeClass('active');
				var url = $(this).attr('href').split('?');
				var query = url[1];
				var id = $(this).attr('rev');
				var content_class = $(this).attr('rel');
				if(tab_content.attr('id') != id) {
					tab_content.removeClass(prev_class).addClass(content_class).attr('id', id);
					abajax('GET', '/system/abajax.php', query, tab_content, self);
				}
				return false;
			});
			self.callback(tab_content);
		}
	}else {
		$("a.bookmark").fancybox({
			'scrolling':'no',
			'centerOnScroll':true
		});
	}
}

// Check if a cookie is set for the previously selected tabs.
// Initiate the previously selected tab on page refresh.
// profiles.prototype.tabActiveCookie = function() {
	// if($.cookie()) {
		// var cookieVal = $.cookie('tab_a');
		// if(typeof cookieVal != 'undefined' || cookieVal != '') {
			// $('.staff-tabs .tabs a[rev='+cookieVal+']').click();
		// }
	// }
// }

// ReWritten with hopefully a little less pain
profiles.prototype.tabContentSetup = function() {
	
	var self = this;
	
	ajaxLoader = '<div class="container text-center v-offset-top-35"><img width="96" src="'+ SITE_PATH +'img/spinner.gif"></div>';
	
	// On Page Load
	var curActive = $('.nav-tabs li[class="active"] a');
	var target = curActive.data('target');
	var url    = curActive.attr('href').split('?');
	
	var xhr = $.ajax({
		url: SITE_PATH + 'system/abajax.php?' + url[1],
		data: {
			ajax_post: 1
		},
		dataType: 'html',
		timeout: 5000
	}).done( function(data) {
		$(target).html(data);
		$(target).addClass('active');
		self.listingsPaginator(target); // Setup listings pagination function - pass in the current active target container.
		
	});
	
	
	$('.staff-tab').on('show.bs.tab', function() {
		target = $(this).data('target');
		url = $(this).attr('href').split('?');
		
		xhr = $.ajax({
			url: SITE_PATH + 'system/abajax.php?' + url[1],
			data: {
				ajax_post: 1
			},
			beforeSend: function() {
				$(target).html(ajaxLoader);
			},
			timeout: 5000,
			dataType: 'html'
		}).done( function(data) {
			setTimeout( function() {
				$(target).html(data);
				$(target).tab('show');
				self.listingsPaginator(target); // Setup listings pagination function - pass in the current active target container.
			}, 300);
		});

	});
	
}


profiles.prototype.callback = function callback(tab_content) {
	var self = this;
	if($('.pagination').length>0) {
		$('.pagination a').click(function() {
			var url = $(this).attr('href').split('?');
			var query = url[1];
			abajax('GET', '/system/abajax.php', query, tab_content, self);
			return false;
		})
	}
	$(".tab-content a.emailagent").fancybox({
		'width' : 500,
		'height' : 400,
		'type' : 'iframe',
		'scrolling' : 'no',
		'centerOnScroll':true
	});
	$("a.bookmark").fancybox({
		'scrolling':'no',
		'centerOnScroll':true
	});
}

profiles.prototype.profileInfiniteScroller = function(ctn, target) {
	
	$container = $(target).find(ctn).find('.col-md-12').find('.row');
		$container.infinitescroll({
			navSelector: target + '-nav',
			nextSelector: target + '-nav a',
			itemSelector: '.listing-results .col-md-3',
			loading: {
				msgText: '',
				finishedMsg: '',
				speed: 100,
				animate: true
			},
			maxPage: 3
		});
	
	
	
    // $container.infinitescroll({
        // navSelector: '#page-nav', // selector for the paged navigation 
        // nextSelector: '#page-nav a', // selector for the NEXT link (to page 2)
        // itemSelector: '.listing-results .listing-container', // selector for all items you'll retrieve
        // loading: {
            // msgText: '',
            // finishedMsg: '<strong>No more properties to load.</strong>',
            // img: '../img/spinner.gif',
			// speed: 100,
			// animate: false
        // },
        // maxPage: $('#all_pages').val(),
    // }, function() {
		// setTimeout( function() {
			// listingContainerResize();
		// }, 100);
	// });
}

profiles.prototype.listingsPaginator = function(target) {
	
	var self = this;
	
	$('.pagination li a').on('click', function() {
		var xhr = $.ajax({
			url: $(this).attr('href'),
			dataType: 'html',
			type: 'GET'
		}).done( function(data) {
			$(target).html(data);
			$(window).scrollTo('.staff-tabs', 800, {offset: -150, easing: 'easeOutQuart'});
			self.listingsPaginator(target); // Call this function again to activate on new request.
		});
	
		return false;
	});
}