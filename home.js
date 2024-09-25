home.tag = "HOME"
home.prototype = new behaviour();

function home() {
	if (debug.logging) debug.log(home.tag, "loaded");
	
	if (typeof this.quick_search_setup != 'undefined') this.quick_search_setup.run();
	else if (debug.logging) debug.log(home.tag, "quick search deleted");
    
    if (typeof this.testimonials_slider != 'undefined') this.testimonials_slider();
	else if (debug.logging) debug.log(home.tag, "testimonials_slider deleted");
    
	this.extra_setup(home.tag);
}

home.prototype.testimonials_slider = function() {
    
    var owl = $('#company-testimonials .owl-carousel').owlCarousel({
		navigation: false,
		paginationSpeed: 500,
		autoPlay: 5000,
		pagination: false,
		singleItem: true,
		slideSpeed: 500
	});
	
    var owlWrapperH = $('#company-testimonials .owl-wrapper').height();
    var itemNoImgH = $('#company-testimonials .item.no-img').height();
    
    $('#company-testimonials .item.no-img').css({
        paddingTop: Math.ceil((owlWrapperH - itemNoImgH) / 2)
    });
    
    $(window).resize( function() {
        owlWrapperH = $('#company-testimonials .owl-wrapper').height();
        itemNoImgH = $('#company-testimonials .item.no-img').height();
        $('#company-testimonials .item.no-img').css({
            paddingTop: Math.ceil((owlWrapperH - itemNoImgH) / 2)
        });
    });
    
}
// Mixin quick_search_setup
home.prototype.quick_search_setup = {}
home.prototype.quick_search_setup.name = "quick_search_setup";

	home.prototype.quick_search_setup.select_options = [];
	
	home.prototype.quick_search_setup.init = function() {
	
		var self = this;
		
		var type = $("#quick_search_form .type input:checked").attr('alt');
		
		var min_price = 	self.select_options.filter('.'+type).filter('.min-price');
		var max_price = 	self.select_options.filter('.'+type).filter('.max-price');
		var catg      = 	self.select_options.filter('.'+type).filter('.catg');
		var suburbs   = 	self.select_options.filter('.'+type).filter('.suburbs');
		
		$('.option').remove();

		$('#qs-min-price').append(min_price);
		$('#qs-max-price').append(max_price);
		$('#qs-catg').append(catg);
		$('#qs-suburb').append(suburbs);
		
		if($('#qs-subcatg').length>0) {
			var subcatg = self.select_options.filter('.subcatg');
			$('#qs-subcatg').append(subcatg);
		}

		// reapply checkAll functionality
		$($('#quick_search_form select.styled')).each(function() {
			sel_click($(this));
		});
		
		$('#quick_search_form').trigger("new_options");
	}

	home.prototype.quick_search_setup.run = function () {
		var self = this;
		
		self.select_options = $(".option");
		self.init();
		//quick search form sale type select
		$('#quick_search_form .type input').change(function() { 
			self.init(); 
		});
		
		// apply sel_click (also adds checkAll functionality)
		$($('#quick_search_form select.styled')).each(function() {
			sel_click($(this));
		});
		
		//sub category filter for business search
		if($('#qs-subcatg').length>0) {
			$('#qs-catg').change(function() {
				var subcatg_filter = ($(this).val())?'.catg_'+$(this).val():'';
				var subcatg = select_options.filter('.subcatg'+subcatg_filter);
				$('#qs-subcatg .option').remove();
				$('#qs-subcatg').append(subcatg);
				sel_click($('#qs-subcatg'));
			});
		}

		//quick search form submit
		$('#quick_search_form').submit(function() {
			$(this).attr('action', SITE_PATH+$('.quick-search input:radio:checked').val());
			return true;
		});
	}
// END quick_search_init