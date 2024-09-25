/****------------------------------------------------------------------------------------ ACTIONS.JS ------------------------------------------------------------------------------------------------------****/

// Resize text boxes and textareas for webkit browsers
function webkit_resize() {
	if($.browser.safari) {
		if($('textarea').length>0) {
			$('textarea').each(function() {$(this).width($(this).width()-4);});
		}
		if(IOS) {
			$('input[type="text"]').not('input.IOS').each(function() {$(this).width($(this).width()-10);})
		}
	}
}

// Decorate select inputs and apply click/hover functionality
function form_inp_sel(sel_elem) {
	var width = sel_elem.outerWidth()-2;
	var height = sel_elem.outerHeight()-2;
	var margin_t = sel_elem.css('margin-top');
	var margin_b = sel_elem.css('margin-bottom');
	var margin_l = sel_elem.css('margin-left');
	var margin_r = sel_elem.css('margin-right');
	var background = sel_elem.css('background-color');
	var font_size = sel_elem.css('font-size');
	sel_elem.hide().wrap('<div class="sel-box curvy-all" />');//round corners optional
	var sel_box = sel_elem.parent();
	var sel_text = (sel_elem.hasClass('multi'))?sel_elem.children('option:eq(0)').text():sel_elem.find(':selected').text();
	//tab index
	var tab_index = '';
	if(sel_elem.attr('tabindex')) {tab_index = ' tabindex="'+sel_elem.attr('tabindex')+'"';}
	//IOS safari
	var sel_txt_wd_offset = (IOS)?37:29;
	var sel_txt_class = (IOS)?' IOS':'';
	sel_box.width(width).height(height).css('background-color', background).css('margin-top',margin_t).css('margin-bottom',margin_b).css('margin-left',margin_l).css('margin-right',margin_r).append('<a class="arr-box" style="height:'+height+'px;"></a><input type="text" readonly="readonly" class="sel-text'+sel_txt_class+'" style="border:none;width:'+(width-sel_txt_wd_offset)+'px;font-size:'+font_size+';" value="'+sel_text+'" '+tab_index+' /><ul class="dropdown_ul curvy-bottom" style="margin:-2px 0 0 -1px;top:'+height+'px;left:0;padding-bottom:4px;"></ul>').children('ul').hide();
	var sel_txt = sel_box.find('input:text.sel-text');
	var sel_txt_mt = (height-sel_txt.outerHeight())/2;
	sel_txt.css('margin-top', sel_txt_mt+'px');
	
	form_insp_sel_toggle(sel_elem)
	sel_click(sel_elem);
	
	var txt_width = sel_box.children('ul.dropdown_ul').width();
	if(txt_width < width) {sel_box.children('ul.dropdown_ul').width(width)}
}

// apply click and hover functions to .arr-box and .sel-text (the whole input)
function form_insp_sel_toggle (sel_elem) {
	sel_elem.siblings('.arr-box, .sel-text').click(function(){
		if($(this).hasClass('arr-box')) {$(this).siblings('.sel-text').focus();}else {$(this).focus();}
		$(this).siblings('ul.dropdown_ul').slideToggle(100);
	}).siblings('ul.dropdown_ul').hover(function() {
		mouse_on_dropdown = true;}, function() {
		mouse_on_dropdown = false;
	});
}

// apply click functions to the options that make up the selects (each option)
function sel_click(elem) {
	elem.siblings('ul.dropdown_ul').html('');
	var sel_box = elem.parent();
	var opt = elem.children('option');
	opt.each(function(){
		if(elem.hasClass('multi')) {
			if(opt.index($(this))>0) {
				var checkAll = ($(this).val() == '' || $(this).val() == 'any')?' class="checkAll"':'';
				var checked = ($(this).hasClass('checked'))?'checked="checked"':'';
				sel_box.children('ul.dropdown_ul').append('<li class="dropdown_li" rel="'+opt.eq(opt.index(this)).val()+'"><label title="'+$(this).text()+'"><input '+checkAll+' type="checkbox" value="'+$(this).val()+'" name="'+elem.attr('name')+'[]" '+checked+' /> '+($(this).text())+'</label></li>');
			}
		}else {
			var selected = ($(this).text() == elem.find(':selected').text())?' selected':'';
			sel_box.children('ul.dropdown_ul').append('<li class="dropdown_li'+selected+'" rel="'+$(this).val()+'">'+($(this).text())+'</li>');
		}
	});
	if(elem.hasClass('multi')) {
		sel_click_multi(elem, sel_box);
	}else {
		sel_click_single(elem, sel_box);
	}	
}
// add the change events to the checkboxes representing a decorated multi select
function sel_click_multi (elem, sel_box) {
		var checkboxes = elem.siblings('ul.dropdown_ul').find('input:checkbox');
		checkboxes.change(function() {
			elem.siblings('.sel-text').focus();
			
			if($(this).hasClass('checkAll')) {
				checkboxes.not('.checkAll').attr('checked', false);
			}else {
				checkboxes.filter('.checkAll').attr('checked', false);
			}
			if(checkboxes.filter(':checked').length==0) {
				checkboxes.filter('.checkAll').attr('checked', true);
			}
		});	
}
// add on click events to the list elements representing a decorated single select
function sel_click_single (elem, sel_box) {
		sel_box.find('ul.dropdown_ul li').click(function(){
			var idx = sel_box.find('ul.dropdown_ul li').index($(this));
			sel_box.find('ul.dropdown_ul li').removeClass('selected');
			$(this).addClass('selected');
			$(this).parents().siblings('input.sel-text').val($(this).text());
			elem.children('option:eq('+idx+')').attr('selected', true);
			elem.change();
			$('ul.dropdown_ul:visible').slideUp(100);
		});
}

function abajax(type, url, query, container, source) {
	if(enable_abajax) {
		var load_html = $('<p/>', {'class':'loading','style':'text-align:center'}).append($('<img/>', {'src':'/img/spinner.gif','alt':'loading...', 'width' : '68px'}));
		container.html(load_html);
		$.ajax({
			type:type,
			url:url,
			data:query,
			success:function(html) {
				//console.log(html);
				container.html(html);
			},
			complete:function(jqXHR, status) {
				if(status == 'success' && typeof source != 'undefined' && typeof source.callback != 'undefined') {
					source.callback(container);
					
					var curActive = $('.nav-tabs').find('li.active').find('span').data('target');
					$('.listing-results').removeClass('active in');
					$(curActive).addClass('active in');
					
					if(curActive == '#mapview') {
						mapView('mapview-canvas', Listings);
					}
					
					$('#total-rec').text($('#lt_total_rec').val());
					$('select').selectpicker('refresh');
					callInfiniteScroller();
				}
			}
		})
	}
}

// new from red
function convert_video_url(vid_url, type) {
	var converted_url = '';
	switch(type) {
		case 'youtube':
			if(vid_url.search(/v=/)>0) {
				var url = vid_url.split('?');
				var query = url[1].split('&');
				for(p in query) {
					if(query[p].substring(0,2) == 'v=') {
						converted_url = query[p].replace('v=', '')+'?';
					}
				}
			}else if(vid_url.search(/\.be/)>0) {
				var url = vid_url.split('?');
				var query = url[0].split('be/');
				converted_url = query[1]+'?';
			}else if(vid_url.search(/#/)>0) {
				var url = vid_url.split('#');
				var query = url[1].split('/');
				for(p in query) {
					if(query[p].length == 11) {
						converted_url = query[p]+'?';
					}
				}
			}else if(vid_url.search(/p=/)>0 || vid_url.search(/list=/)>0) {
				var url = vid_url.split('?');
				var query = (vid_url.search(/list=/)>0)?url[1].replace('list=', ''):url[1].replace('p=', '');
				converted_url = '?list='+query;
			}
			converted_url = '//www.youtube.com/embed/'+converted_url;
			if(vid_url.search('embed')>0) {
				converted_url = vid_url+'?';
			}
			break;
		case 'vimeo':
			if(vid_url.search(/vimeo.com\//)) {
				var url = vid_url.split('vimeo.com/');
				var converted_url = 'http://player.vimeo.com/video/'+url[1]+'?';
			}
			break;
	}
	return converted_url;
}

//TODO check against cunninghams
function embed_yt_player(container, vid_url, width, height, autoplay) {
	if(typeof(width) == 'undifned') {width = 402;}
	if(typeof(height) == 'undifned') {height = 268;}
	var vid = '';
	if(vid_url.search(/v=/)>0) {
		var url = vid_url.split('?');
		var query = url[1].split('&');
		for(p in query) {
			if(query[p].substring(0,2) == 'v=') {
				vid = 'v/'+query[p].replace('v=', '')+'?';
			}
		}
	}else if(vid_url.search(/\.be/)>0) {
		var url = vid_url.split('?');
		var query = url[0].split('be/');
		vid = 'v/'+query[1]+'?';
	}else if(vid_url.search(/#/)>0) {

		var url = vid_url.split('#');
		var query = url[1].split('/');
		for(p in query) {
			if(query[p].length == 11) {
				vid = 'v/'+query[p]+'?';
			}
		}
	}else if(vid_url.search(/p=/)>0 || vid_url.search(/list=/)>0) {
		var url = vid_url.split('?');
		var query = (vid_url.search(/list=/)>0)?url[1].replace('list=', ''):url[1].replace('p=', '');
		vid = 'p/'+query+'?hl=en_US';
	}
	vid += (typeof(autoplay) != 'undefined' && autoplay == false)?'&amp;autoplay=0':'&amp;autoplay=1';
	
	container.html('<object type="application/x-shockwave-flash" style="width:'+width+'px; height:'+height+'px;" data="http://www.youtube.com/'+vid+'&amp;showsearch=0&amp;fs=1"><param name="movie" value="http://www.youtube.com/'+vid+'&amp;showsearch=0&amp;fs=1" /><param name="allowFullScreen" value="true" /><param name="wmode" value="transparent" /></object>');

}

//TODO check against belle
function embed_vimeo_player(container, vid_url, width, height, autoplay) {
	if(typeof(width) == 'undifned') {width = 698;}
	if(typeof(height) == 'undifned') {height = 460;}
	var vid = convert_video_url(vid_url, 'vimeo');
	vid += (typeof(autoplay) != 'undefined' && autoplay == false)?'&autoplay=0':'&autoplay=1';
	var $vimeo_player = $('<iframe/>', {
		'src': vid,
		'width': width,
		'height': height,
		'frameborder': 0,
		'webkitAllowFullScreen': 'true',
		'mozallowfullscreen': 'true',
		'allowFullScreen': 'true'
	});
	container.html($vimeo_player);
}

function linkify(elem, item_to_link) {
	var items = elem.find(item_to_link).remove();
	var a_link = elem.find('a').remove();
	items.each(function() {
		var a = a_link.clone().html($(this));
		elem.append(a);
	});
	elem.append(a_link);
}

// needs to be correctly verified against site5/tabs.js

function activate_tab(tab_container) {
	var idx = (typeof(start_idx) != 'undefined')?start_idx:0;
	if(tab_container.find('.tab-content .inner-tab-content>input:hidden.start_idx').length>0) {
		var tab_content = tab_container.find('.tab-content');
		idx = tab_content.index(tab_content.filter(':has(input:hidden.start_idx)'));
	}else if(tab_container.find('.tab-content>input:hidden.start_idx').length>0) {
		idx = tab_container.find('.tab-content input:hidden.start_idx').val();
	}
	idx = (typeof(idx) != 'undefined')?idx:0;
	if(tab_container.find('.tabs li a').length>0) {
		tab_container.find('.tabs li:has(a)').removeClass('active');
		tab_container.find('.tabs li a:eq('+idx+')').parent('li:has(a)').addClass('active');
		show_tab(idx, tab_container, '.tab-content', tab_container.find('.tabs li.active a'), 'data-rel');
		var tab_links = tab_container.find('.tabs>li a:not(.external)');
		tab_links.click(function(){
			if(!$(this).parent('li:has(a)').hasClass('active')) {
				var idx = tab_links.index(this);
				tab_container.find('.tabs>li:has(a)').removeClass('active');
				$(this).parent('li:has(a)').addClass('active');
				show_tab(idx, tab_container, '.tab-content', $(this), 'data-rel');
			}
			return false;
		});
	}else if(tab_container.find('.tabs select').length>0) {
		tab_container.find('.tabs select').val(tab_container.find('.tabs select option:eq('+idx+')').val());
		if(tab_container.find('.tabs select').is(':hidden')) {
			tab_container.find('.tabs select').siblings('.sel-text').val(tab_container.find('.tabs select option:selected').text());
		}
		show_tab(idx, tab_container, '.tab-content', tab_container.find('.tabs select option:selected'), 'data-rel');
		tab_container.find('.tabs select').change(function(){
			var idx = $(this).prop('selectedIndex');
			show_tab(idx, tab_container, '.tab-content', $(this).children('option:eq('+idx+')'), 'data-rel');
		});
	}
}

function activate_inner_tab(inner_tab_container) {
	var idx = (typeof(start_idx) != 'undefined')?start_idx:0;
	if(inner_tab_container.find('.inner-tab-content input:hidden.start_idx').length>0) {
		idx = inner_tab_container.find('.inner-tab-content input:hidden.start_idx').val();
	}
	inner_tab_container.find('.inner-tabs li:has(a)').removeClass('active');
	inner_tab_container.find('.inner-tabs li a:eq('+idx+')').parent('li:has(a)').addClass('active');
	show_tab(idx, inner_tab_container, '.inner-tab-content', inner_tab_container.find('.inner-tabs>li.active a'), 'data-rel');
	var inner_tab_links = inner_tab_container.find('.inner-tabs>li a:not(.external)');
	inner_tab_links.click(function(){
		if(!$(this).parent('li:has(a)').hasClass('active')) {
			var idx = inner_tab_links.index(this);
			inner_tab_container.find('.inner-tabs>li:has(a)').removeClass('active');
			$(this).parent('li:has(a)').addClass('active');
			show_tab(idx, inner_tab_container, '.inner-tab-content', $(this), 'data-rel');
		}
		return false;
	});
}

function show_tab(idx, tab_container, tab_content, elem, ex) {
	if(tab_container.is(':visible')) {
		tab_container.find(tab_content+':eq('+idx+')').fadeIn();
		tab_container.find(tab_content).not(tab_content+':eq('+idx+')').css('display', 'none');
		tab_callback(elem, ex);
	}
}

function tab_callback(elem, ex) {
	var type = elem.attr(ex);
	var name = (elem.is('option'))?elem.val():elem.attr('name');
	if($('#'+name+'-canvas').html() == '') {$('#'+name+'-canvas').html('');}
	if(typeof type != 'undefined' && type != null) { //for ie7
		call_by_type(type, name, elem);
		if(type.indexOf('|') > -1) {
			var commands = type.split('|');
		}else {
			var commands = [type];
		}
		for(var i in commands) {
			var EleArray = commands[i].split(':');
			if(EleArray.length>1) {
				var Elements = EleArray[1].split(',');
			}
			if(EleArray[0] == 'hide') {
				for(i=0;i<Elements.length;i++) {
					if($(Elements[i]).is(':visible')) {
						$(Elements[i]).hide();
					}
				}
			}else if(EleArray[0] == 'show') {
				for(i=0;i<Elements.length;i++) {
					if($(Elements[i]).is(':hidden')) {
						$(Elements[i]).fadeIn();
					}
				}
			}else if(EleArray[0] == 'action') {
				call_by_type(EleArray[1], name, elem);
			}
		}
	}
	return false;
}

function call_by_type(type, name, elem) {
	switch(type){
		case 'google':
			showMap(name+'-canvas');
		break;
		case 'streetview':
			streetView(name+'-canvas', processedPropStreetNum,leftPropString);
		break;
		case 'walkscore':
			if(elem.is('option')) {
				var size = elem.attr('id').replace('size-', '').split('x');
			}else {
				var size = elem.attr('rev').split('x');
			}
			var wk_width = size[0];//elem.attr('width');
			var wk_height = size[1];//elem.attr('height');
			if($('#'+name+'-canvas').html() == '') {
				$('#'+name+'-canvas').html(call_walkscore(PropAddress, wk_width, wk_height));
			}
		break;
		case 'ad-gallery':
			if ($('.ad-gallery').length>0 && start_idx != 0) {
				start_idx = 0;
				adGallery($('.ad-gallery'));
			}
		break;
		case 'mapView':
			mapView(name+'-canvas', Listings);
		break;
	}
}

function adGallery(container) {
	var galleries = container.adGallery({
		loader_image: SITE_PATH + 'img/loader.gif',
		thumb_opacity: 1,
		animate_first_image: true,
		width: 561,
		height: 374,
		animation_speed: 400,
		display_next_and_prev: display_next_and_prev,
		display_back_and_forward: display_back_and_forward,
		slideshow: {
			enable: true,
			autostart: autostart,
			speed: 5000,
			start_label: 'Start',
			stop_label: 'Stop',
			stop_on_scroll: false,
			countdown_prefix: '(',
			countdown_sufix: ')',
			onStart: function () {},
			onStop: function () {}
		},
		player_path: SITE_PATH + 'flash/',
		effect: 'fade',
		cycle: true
	});
}

function contact_form_submit(url, form_data, form, submit_btn){
	
	$.ajax({
		type: "POST",
		url: url,
		data: form_data,
		dataType: 'json'
	}).done(function(result){
		
		//Resetting Styles
		form.find('.form-group').each(function(){
			if($(this).hasClass('has-error')){
				$(this).removeClass('has-error');
			}
		});
		
		if (result.rsc) {
				
			if(result.msg && $('.form_msg').length > 0){
				form.find('.form_msg').html('').html(result.msg);
			}
			
			$.each(result.rsc, function(key, value) {
				form.find('input[name="' + key + '"], textarea[name="' + key + '"], select[name="' + key + '"]').parent('.form-group').addClass('has-error');
			});
			
		}else{
			
			form.children().fadeOut(300, function(){
				form.html('').show().html(result.msg);
			});
			
		}
		
	});
	
}

// Quick new function that sets an li (parent) as active on <a> click.
function tabActivate(tabs, selected) {
	$.each(tabs, function() {
		$(this).parent().removeClass('active');
	});
	selected.parent().addClass('active');
	
	// if($.cookie()) {
		// $.cookie('tab_a', selected.attr('rev'));
	// }
}