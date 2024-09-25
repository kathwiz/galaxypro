alerts.tag = "alerts"
alerts.prototype = new behaviour();

function alerts() {
	if (debug.logging) debug.log(alerts.tag, "loaded");
	
	if (typeof this.init_accordian != 'undefined') this.init_accordian();
	else if (debug.logging) debug.log(alerts.tag, "init_accordian deleted");
	
	if (typeof this.forgot_password_setup != 'undefined') this.forgot_password_setup();
	else if (debug.logging) debug.log(alerts.tag, "forgot password deleted");

	if (typeof this.bootstrap_switch != 'undefined') this.bootstrap_switch();
	else if (debug.logging) debug.log(alerts.tag, "bootstrap_switch deleted");
	
	if (typeof this.step1_setup != 'undefined') this.step1_setup();
	else if (debug.logging) debug.log(alerts.tag, "step1 deleted");
	
	if (typeof this.suburbs_setup != 'undefined') '';
	else if (debug.logging) debug.log(alerts.tag, "suburbs deleted");
	
	if (typeof this.profile_suburb_search != 'undefined') this.profile_suburb_search('f_Suburb');
	else if (debug.logging) debug.log(alerts.tag, "profile_suburb_search deleted");
	
	if (typeof this.profile_suburb_select != 'undefined') '';
	else if (debug.logging) debug.log(alerts.tag, "profile_suburb_select deleted");
	
	if (typeof this.suburbs_magicsuggest != 'undefined') this.suburbs_magicsuggest();
	else if (debug.logging) debug.log(alerts.tag, "suburbs_magicsuggest deleted");
	
	if (typeof this.bbc_counter != 'undefined') this.bbc_counter();
	else if (debug.logging) debug.log(alerts.tag, "bbc_counter deleted");
	
	if (typeof this.step2_setup != 'undefined') this.step2_setup.run();
	else if (debug.logging) debug.log(alerts.tag, "step2 deleted");
	
	if (typeof this.delete_search_setup != 'undefined') this.delete_search_setup();
	else if (debug.logging) debug.log(alerts.tag, "delete search deleted");
	
	if (typeof this.suburbs_selector != 'undefined') this.suburbs_selector();
	else if (debug.logging) debug.log(alerts.tag, "suburbs_selector deleted");
	
	if (typeof this.toggle_content != 'undefined') this.toggle_content();
	else if (debug.logging) debug.log(alerts.tag, "toggle_content deleted");
	
	if (typeof this.update_profile != 'undefined') this.update_profile('#profile-form');
	else if (debug.logging) debug.log(alerts.tag, "update_profile deleted");
	
	if (typeof this.trash_bookmark != 'undefined') this.trash_bookmark('.trash-bookmark');
	else if (debug.logging) debug.log(alerts.tag, "trash_bookmark deleted");
	
	if (typeof this.trash_search != 'undefined') this.trash_search('.trash-search');
	else if (debug.logging) debug.log(alerts.tag, "trash_search deleted");
	
	if (typeof this.save_reqs != 'undefined') this.save_reqs();
	else if (debug.logging) debug.log(alerts.tag, "save_reqs deleted");
	
	if (typeof this.update_req != 'undefined') this.update_req();
	else if (debug.logging) debug.log(alerts.tag, "update_req deleted");
	
	if (typeof this.req_message != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "req_message deleted");
	
	if (typeof this.process_reqs != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "process_reqs deleted");
	
	if (typeof this.req_overlay != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "req_overlay deleted");
	
	if (typeof this.form_overlay != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "form_overlay deleted");
	
	if (typeof this.profile_overlay != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "profile_overlay deleted");
	
	if (typeof this.trash_req != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "trash_req deleted");
	
	if (typeof this.edit_req != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "edit_req deleted");
	
	if (typeof this.load_req_form != 'undefined') ''; // Do not want to run on page load
	else if (debug.logging) debug.log(alerts.tag, "load_req_form deleted");
	
	if (typeof this.reset_form != 'undefined') '';
	else if (debug.logging) debug.log(alerts.tag, "reset_form deleted");
	
	if (typeof this.edit_notifications != 'undefined') this.edit_notifications('#notifications-form');
	else if (debug.logging) debug.log(alerts.tag, "edit_notifications deleted");
		
	if (typeof this.filter_price != 'undefined') this.filter_price();
	else if (debug.logging) debug.log(alerts.tag, "filter_price deleted");	
		
	if (typeof this.load_reqs != 'undefined') this.load_reqs();
	else if (debug.logging) debug.log(alerts.tag, "load_reqs deleted");
	
	this.extra_setup(alerts.tag);
}

alerts.prototype.forgot_password_setup = function forgot_password_setup() {
	//login forgot password
	
}
	
alerts.prototype.step1_setup = function step1_setup() {
	//step 1 change new password
	if($('#new_passwd').length>0) {
		function new_passwd(target) {
			if(target.attr("checked")) {
				$('#new_passwd_div').show();
			}else {
				$('#new_passwd_div').hide();
			}	
		}
		new_passwd($('#new_passwd'));
		$('#new_passwd').change(function() {
			new_passwd($(this));
		});
	}
}

// alerts.prototype.suburbs_setup = function () {
	// //suburbs
	// if($('#Suburb').length>0) {
		// var option = {
			// serviceUrl:'/system/sbsearch.php',
			// minChars:3, 
			// maxHeight:200,
			// width:250,
			// deferRequestBy: 1, //miliseconds
			// noCache: true, //default is false, set to true to disable caching
			// // callback function:
			// onSelect: function(value, data){ $('#f_SuburbId').val(data); }
		// };
		// $('#Suburb').autocomplete(option);
	// }
// }	

alerts.prototype.step2_setup = {};
	alerts.prototype.step2_setup.catg = [];
	alerts.prototype.step2_setup.price = [];
	
	alerts.prototype.step2_setup.run = function () {
		var self = this;
		//step 2
		if($('#step2').length>0) {
			$('#Suburb').focus(function() {$(this).val('')});
			$('#Suburb').blur(function() {if(!$(this).val()) {$(this).val($(this).attr('title'));}});
			//display property types
			self.catg = $('.option');
			
			if($('#catg').val()) {
				var checked_catg = $('#catg').val();
				$(checked_catg).attr("checked", true);
			}
			$('#f_TradeType').change(function() {
				var catg_id = $(this).val();
				$('.option').remove();
				target_options = self.catg.filter('.catg'+catg_id);
				$('#f_TradeType').parents().find('.container:eq(0)').append(target_options);
				if(catg_id == 2 || catg_id == 4){
					$('#build').show();
					$('#bbc').hide();
				}else{
					$('#build').hide();
					$('#bbc').show();
				}
			});
			$('#f_TradeType').change();
			
			$('#add-suburb').click(function() {
				if($('#f_SuburbId').val()) {
					var suburb_to_add = $('<p><label><input type="checkbox" /> </label></p>');
					suburb_to_add.children('label').append($('#Suburb').val());
					suburb_to_add.children('label').children('input:checkbox').attr('checked', true).attr('name', 'f_Suburbs[]').val($('#f_SuburbId').val());
					$(this).parents().find('.container:eq(1)').append(suburb_to_add);
				}
			});
			//display rent/buy prices
			self.price = $('.select');
			$('.tab-content input:radio').change(function() {
				var search_type = $(this).val();
				var target_select = self.price.filter('.'+search_type);
				$('.select').remove();
				$('#f_PriceFrom').append(target_select.filter('.PriceFrom'));
				$('#f_PriceTo').append(target_select.filter('.PriceTo'));
			});
			$('.tab-content input:radio:checked').change();
		}
	}
	
alerts.prototype.delete_search_setup = function () {
	
	var trigger = $('a.remove');
	
	trigger.fancybox({
		type : 'iframe',
		padding: 0,
		width: 300,
		height: 150,
		fitToView: true,
		autoSize: false,
		helpers : {
			overlay: {
				locked: false
			},
			title: null
		},
		afterClose: function() {
			  trigger.closest('.bookmark-container').fadeOut('fast', function() {
				$(this).remove();
				
				if($('.bookmark-container').length < 1) {
					$('#bookmarks .panel-body > div').html('<div class="alert alert-info">You currently have no bookmarked properties.</div>');
				}
			  });
		}
	});
	
}

alerts.prototype.init_accordian = function () {
	
	setTimeout( function() {
		$('#f_State').selectpicker('val', $('#f_StateId').val());
		$('#f_State').selectpicker('refresh');
	}, 200);
	
	var panels = $('.panel-collapse');
	$.each(panels, function() {
		if($(this).hasClass('in')) {
			$('.panel-heading .panel-title a[href="#'+ $(this).attr('id') +'"] .fa').removeClass('fa-plus').addClass('fa-minus');
		} else {
			$('.panel-heading .panel-title a[href="#'+ $(this).attr('id') +'"] .fa').removeClass('fa-minus').addClass('fa-plus');
			$('.panel-heading .panel-title a[href="#'+ $(this).attr('id') +'"]').addClass('collapsed');
		}
	
		$(this).on('hide.bs.collapse', function(e) {
			$('.panel-heading .panel-title a[href="#'+ e.target.id +'"] .fa').removeClass('fa-minus').addClass('fa-plus');
		});
		$(this).on('show.bs.collapse', function(e) {
			$('.panel-heading .panel-title a[href="#'+ e.target.id +'"] .fa').removeClass('fa-plus').addClass('fa-minus');
		});
	});
}

alerts.prototype.bootstrap_switch = function () {
	
	$('input[type="checkbox"]').bootstrapSwitch({
		onText: 'YES',
		offText: 'NO',
		size: 'small'
	});
	
}

alerts.prototype.bbc_counter = function () {
	
	var minus = $('.bbc-selector .btn.minus');
	var plus  = $('.bbc-selector .btn.plus');
	
	$.each(minus, function() {
		$(this).click(function() {
			var input = $(this).closest('.bbc-selector').find('input');
			var curVal = input.val().replace('+','');
			if(curVal > 0) {
				
				input.val(--curVal + ' +');
				
				if(curVal == 0) {
					input.val(curVal);
				}
				
			}
		});
	});
	
	$.each(plus, function() {
		$(this).click(function() {
			var input = $(this).closest('.bbc-selector').find('input');
			var curVal = input.val().replace('+','');
			if(curVal <= 4) {
				input.val(++curVal + ' +');
			}
		});
	});
}

alerts.prototype.toggle_content = function() {
	
	// Trade Type
	var f_TradeType = $('select[name="f_TradeType"]');
	var bbcContainer = $('.bbc-container');
	var buildSize = $('.build-size');
	
	f_TradeType.on('change', function() {
		if($(this).val() == 2 /* Commercial */ ) {
			buildSize.removeClass('hidden');
			bbcContainer.addClass('hidden');
		} else {
			buildSize.addClass('hidden');
			bbcContainer.removeClass('hidden');
		}
	});
	
	// Property Types - f_Catg
	propTypes = $('#f_Catg option'); // Store all options in global array
	
	f_TradeType.on('change', function() { // Detect change event on trade type select
		$('#f_Catg').selectpicker('val', ''); // Need to unselect previously selected stuff when changeing for some reason
		filtered = propTypes.filter('.catg' + $(this).val()); // Get the value of trade type and store all filtered catg options 
		propTypes.remove(); // Remove all options from f_Catg select 
		$('#f_Catg').append(filtered); // Append filtered options back into f_Catg
		$('.selectpicker').selectpicker('refresh'); // Refresh selectpicker for changes to take affect.
		if(navigator.appVersion.indexOf("MSIE")!=-1 || navigator.appVersion.indexOf("Trident")!=-1){
			setTimeout(function(){
				var i = 0;
				$('select#f_Catg').next('.bootstrap-select').find('div.dropdown-menu ul li').each(function(){
					$(this).attr("data-original-index", i);
					i = i + 1;
				});
			}, 100);
		}
	});
	
	// Run a change event of f_TradeType on page load, so that the above event listener runs
	f_TradeType.change();
	
}

alerts.prototype.suburbs_magicsuggest = function() {

	sb = $('.magic-suburbs').magicSuggest({
			data: SITE_PATH + 'system/sbsearch.php',
			method: 'GET',
			minChars: 3,
			displayField: 'text',
			valueField: 'value',
			hideTrigger: true,
			useZebraStyle: true,
			selectionCls: 'nav-pills',
			dataUrlParams: {
				rto: 1,
				ajax_post: true
			}
	});
		
	$(sb).on('beforeload', function() {
		$('.ms-helper').text('Searching...').show();
	});
	$(sb).on('load', function() {
		$('.ms-helper').hide();
	});
}

alerts.prototype.suburbs_setup = function () {
	
	$('#f_SuburbSearch').typeahead({
		onSelect: function(item) {
			console.log(item);
		},
		ajax: {
			url: SITE_PATH + 'system/sbsearch.php',
			method: 'GET',
			triggerLength: 3,
			displayField: 'text',
			
			valueField: 'value',
			
			preDispatch: function(query) {
				
				// Build our query string params
				return {
					rto: 1, // We need this so that we get a proper formatted json array back from sbsearch
					query: query
				}
			},
			preProcess: function(data) {
				if(data.success === false) {
					return false;
				}
				return data.suburbs;
			}
		}
	});
	
}

alerts.prototype.load_reqs = function() {
	
	var self = this;
	
	var url = SITE_PATH + 'buying/property-alert.php';
	
	var ajax = $.ajax({
		url: url,
		data: {
			load_reqs: true,
			ajax_post: true
		},
		beforeSend: function() {
			self.profile_overlay('requirements', 'alert-info', 'Fetching requirements, please wait...');
		},
		async: true,
		dataType: 'json',
		type: 'POST'
	});
	
	ajax.done( function(data) {
		self.process_reqs(data);
		self.overlay_out('requirements');
	});
	
}

alerts.prototype.process_reqs = function(data) {
	
	var self = this;
	
	var list = $('#req-list');
	
	if(data.hasOwnProperty('noReq')) {
		
		list.html('<div class="alert alert-info">You currently have no requirements saved.</div>');
		
	} else {
		if(data.hasOwnProperty('length')) {
		
			var l = data.length;
			
			var html = '';
			
			for(i = 0; i < l; i++) {
				html += '<div class="panel panel-default req-panel">';
					html +=	'<div role="tab" class="panel-heading clearfix">';
					html += '<span>' + data[i].csrName + '</span>';
					html += '<div class="btn-group pull-right" role="group">';
						html += '<button type="button" class="btn btn-default edit-req" data-edit="' + data[i].csrID + '"><i class="fa fa-edit"></i></button>';
						html += '<button type="button" class="btn btn-default trash-req" data-trash="' + data[i].csrID + '"><i class="fa fa-trash"></i></button>';
						html += '<button type="button" data-target="#csr_' + data[i].csrID + '" data-toggle="collapse" class="btn btn-default"><i class="fa fa-plus"></i></button>';
					html += '</div>';
					html += '</div>';
					
					html += '<div class="panel-collapse collapse" role="tabpanel" id="csr_' + data[i].csrID + '">';
						html += '<div class="panel-body"><ul class="list-group">';
							html += '<li>Method: <strong>' +  data[i].saleType + '</strong></li>';
							html += '<li>Category: <strong>' +  data[i].catg + '</strong></li>';
							html += '<li>Property Type(s): <strong>' +  data[i].propType + '</strong></li>';
							html += '<li>Suburb(s): <strong>' +  data[i].suburbs + '</strong></li>';
							
							// BBC
							html += '<li class="bbc">';
							if(data[i].beds > 0) {
								html +=	'<span class="ab-bbc ab-bed">' + data[i].beds + '</span> ';	
							}
							if(data[i].baths > 0) {
								html +=	'<span class="ab-bbc ab-bath">' + data[i].baths + '</span> ';
							}
							if(data[i].cars > 0) {
								html +=	'<span class="ab-bbc ab-car">' + data[i].cars + '</span> ';
							}
							html += '</li>';
							
							// Building Size
							if(data[i].hasOwnProperty('buildSize')) {
								html += '<li>Building Size: <strong>' +  data[i].buildSize + '</strong></li>';
							}
							// Land Size
							if(data[i].hasOwnProperty('landSize')) {
								html += '<li>Land Size: <strong>' +  data[i].landSize + '</strong></li>';
							}
							// Price 
							if(data[i].hasOwnProperty('price')) {
								html += '<li>Price: <strong>' +  data[i].price + '</strong></li>';
							}
							
						html += '</ul></div>';
					html += '</div>';
				html += '</div>';
			}
			
			$(list).html(html);
			
			self.edit_req();
			self.trash_req();
		}
	}
	
}

alerts.prototype.trash_req = function() {

	var self = this;
	var trash = $('.trash-req');	
	var url = SITE_PATH + 'buying/property-alert.php';
	
	$.each(trash, function() {
	
		$(this).on('click', function() {
		
			self.profile_overlay('requirements', 'alert-info', 'Deleting requirement, please wait...');
			
			var trashAjax = $.ajax({
				url: url,
				type: 'POST',
				data: {
					trash_req: true,
					ajax_post: true,
					csrID: $(this).data('trash')
				},
				dataType: 'json'
			});
			
			trashAjax.done( function(data) {
				if(data.hasOwnProperty('success')) {
					if(data.success == true) {
						self.profile_overlay('requirements', 'alert-success', 'Requirement Successfully Deleted!', 2000);
						setTimeout( function() {
							self.load_reqs();
							self.reset_form();
						}, 1000);
					}
				}
			});
		});
	});
	
}

alerts.prototype.edit_req = function() {
	
	var self = this;
	var edit = $('.edit-req');	
	var url = SITE_PATH + 'buying/property-alert.php';
	
	$.each(edit, function() {
	
		$(this).on('click', function() {
			
			$('#requirements-form').append('<input type="hidden" id="f_UpdateReq" name="f_UpdateReq" value="' + $(this).data('edit') + '">');
			
			var editAjax = $.ajax({
				url: url,
				type: 'POST',
				beforeSend: function() {
					self.profile_overlay('requirements', 'alert-info', 'Loading requirement, please wait...');
				},
				data: {
					edit_req: true,
					ajax_post: true,
					csrID: $(this).data('edit')
				},
				dataType: 'json'
			});
			
			editAjax.done( function(data) {
				self.load_req_form(data);
				self.overlay_out('requirements');
			});
		});
	});	
}

alerts.prototype.form_overlay = function(msg) {
	$('#form-overlay').fadeIn();
	$('#form-overlay-message').html(msg);	
	setTimeout( function() {
		$('#form-overlay').fadeOut();
	}, 2000);
}

alerts.prototype.load_req_form = function(data) {
	
	var self = this;
	
	self.filter_price();
	
	if(data.hasOwnProperty('csrID')) {
		
		if(data.hasOwnProperty('csrName')) {
			$('input[name="f_ReqName"]').val(data.csrName);
		}
		
		if(data.hasOwnProperty('saleType')) {
			var sale_type = (data.saleType == 2) ? 'rent' : 'buy';
			$('#f_SearchType').selectpicker('val', sale_type);
			$('#f_SearchType').selectpicker('refresh');
		}
		
		if(data.hasOwnProperty('f_TradeType')) {
			$('#f_TradeType').selectpicker('val', data.f_TradeType);
			$('#f_TradeType').change();
			$('#f_TradeType').selectpicker('refresh');
		}
		if(data.hasOwnProperty('catg_set')) {
			var catg_len = data.catg_set.length;
			$('#f_Catg').selectpicker('val', data.catg_set);
			$('#f_Catg').selectpicker('refresh');
		}
		if(data.hasOwnProperty('suburbs')) {
			sb.setSelection(data.suburbs);
		}
		if(data.hasOwnProperty('f_BedroomNo')) {
			$('#f_BedroomNo').val(data.f_BedroomNo);
		}
		if(data.hasOwnProperty('f_BathroomNo')) {
			$('#f_BathroomNo').val(data.f_BathroomNo);
		}
		if(data.hasOwnProperty('f_ParkingNo')) {
			$('#f_ParkingNo').val(data.f_ParkingNo);
		}
		if(data.hasOwnProperty('f_MinSize')) {
			$('#f_MinSize').selectpicker('val', data.f_MinSize);
			$('#f_MinSize').selectpicker('refresh');
		}
		if(data.hasOwnProperty('f_MaxSize')) {
			$('#f_MaxSize').selectpicker('val', data.f_MaxSize);
			$('#f_MaxSize').selectpicker('refresh');
		}
		if(data.hasOwnProperty('f_MinBuild')) {
			$('#f_MinBuild').selectpicker('val', data.f_MinBuild);
			$('#f_MinBuild').selectpicker('refresh');
		}
		if(data.hasOwnProperty('f_MaxBuild')) {
			$('#f_MaxBuild').selectpicker('val', data.f_MaxBuild);
			$('#f_MaxBuild').selectpicker('refresh');
		}
		if(data.hasOwnProperty('f_PriceFrom')) {
			$('#f_PriceFrom').selectpicker('val', data.f_PriceFrom);
			$('#f_PriceFrom').selectpicker('refresh');
		}
		if(data.hasOwnProperty('f_PriceTo')) {
			$('#f_PriceTo').selectpicker('val', data.f_PriceTo);
			$('#f_PriceTo').selectpicker('refresh');
		}
		
		$('#f_SaveReq').remove();
		$('.alert-danger').addClass('hidden');
		$('.form-group').removeClass('has-error');
		
	} else {
		self.form_overlay('<div class="alert alert-info">Sorry, we could not load this requirement</span>');
	}
	
}

alerts.prototype.save_reqs = function () {
	
	var self = this;
	var form = $('#requirements-form');
	
	// Remove input hidden normal. This is just a fallback incase JS is not on in the browser.
	$('#normal').remove();
	
	if(form.find('#ajax_post').length == 0){
		form.append('<input type="hidden" value="1" name="ajax_post" id="ajax_post">');
	}
					
	form.submit( function() {
		
		self.reset_errors();
		var url = SITE_PATH + 'buying/property-alert.php';
		
		var ajax = $.ajax({
			url: url,
			type: 'POST',
			data: $(this).serialize(),
			dataType: 'json',
			beforeSend: function() {
				self.profile_overlay('requirements', 'alert-info', 'Saving requirement, please wait...');
				$('input[type="submit"]').attr('disabled','disabled');
			}
		});
		
		ajax.done( function(data) {
			$('input[type="submit"]').removeAttr('disabled');
			if(data.hasOwnProperty('errors')) {
				self.profile_overlay('requirements', 'alert-danger', 'Please fill in the required fields.', 1500);
				self.display_errors(data.errors, 'f_ReqName');
			} else {
				$('input[name="f_ReqName"]').val('');
				$('select.refresh').each( function() {
					this_select = $(this);
					this_select.find('option').each(function(){
						$(this).show();
						$(this).removeAttr('selected');
						
					});
					$(this_select).selectpicker('deselectAll');
					$(this_select).selectpicker('refresh');
				});
				if(data.hasOwnProperty('updated')) {
					if(data.updated == 1) {
						self.profile_overlay('requirements', 'alert-success', 'Requirement Saved Successfully!', 1500);
						self.load_reqs('Refreshing your requirements...');
						self.reset_form();
						sb.clear(); // Clear suburbs from magicSuggest
					}
				}
			}
		});
		return false;
	});
}

alerts.prototype.update_profile = function (formID) {
	
	var form = $(formID);
	var self = this;
	
	if(form.find('#ajax_post').length == 0){
		form.append('<input type="hidden" value="1" name="ajax_post" id="ajax_post">');
	}
	
	form.submit( function() {
		
		self.reset_errors();
		
		var url = SITE_PATH + 'buying/property-alert.php';
		
		var ajax = $.ajax({
			url: url,
			type: 'POST',
			data: $(this).serialize(),
			dataType: 'json',
			beforeSend: function() {
				self.profile_overlay('profile', 'alert-info', 'Updating your details, please wait...');
				$('input[type="submit"]').attr('disabled','disabled');
			}
		});
		
		ajax.done( function(data) {
			$('input[type="submit"]').removeAttr('disabled');
			if(data.hasOwnProperty('updated')) {
				if(data.updated == 1) {
					self.profile_overlay('profile', 'alert-success', 'Updated successfully!', 1500);
				}
				if(data.updated == 0) {
					self.profile_overlay('profile', 'alert-danger', 'Please fill in all required fields!', 1500);
					self.display_errors(data.errors);
				}
			}
		});
		return false;
	});
}

alerts.prototype.profile_suburb_search = function (elm) {

	var xhr;
	var input = $('#' + elm);
	var self = this;
	
	$(input).on('keyup', function() {
		var val = $(this).val();
		$('#' + elm + '_results a').remove();
		$('.sb-status').remove();
		
		if(val.length >= 3) {
		
			if(xhr != null) xhr.abort();
			
			xhr = $.ajax({
				url: SITE_PATH + 'system/sbsearch.php',
				type: 'GET',
				beforeSend: function() {
					$('label[for="' + elm + '"]').closest('label').append('<span class="sb-status fa fa-spinner fa-spin"></span>');
				},
				data: {
					query: val,
					ajax_post: 1,
					rto: 1,
					form: $('input[name="f_Form"]').val()
				},
				dataType: 'json'
				
			}).done(function(data) {
				$('.sb-status').remove();
				if(data.hasOwnProperty('length')) {
					var list = '';
					for(var i = 0; i < data.length; i++) {
						list += '<a href="#" class="list-group-item" data-regid="' + data[i].regionID + '" data-subid="' + data[i].suburbID + '" data-input="#'+elm+'" data-suburb="'+ data[i].suburb +'" data-pcode="' + data[i].postcode + '" data-state="' + data[i].state + '" data-stateid = "'+ data[i].stateID +'" data-text="' + data[i].text + '">' + data[i].text + '</a>';
					}
					$('#' + elm + '_results').append(list).show();
					
					self.profile_suburb_select('#' + elm + '_results');
				}
			});
		}
	});
}

alerts.prototype.profile_suburb_select = function (list) {
	
	$.each($(list + ' .list-group-item'), function() {
		$(this).on('click', function() {
			$('#f_Postcode').val($(this).data('pcode'));
			$('#f_RegionId').val($(this).data('regid'));
			$($(this).data('input')).val($(this).data('suburb'));
			$('#f_SuburbId').val($(this).data('subid'));
			$('#f_State').val($(this).data('state'));
			$('#f_StateId').val($(this).data('stateid'));
			$(list).hide();
			return false;
		});
	});
	
}

alerts.prototype.profile_overlay = function (elm, type, msg, timeout) {
	
	if(typeof(timeout) == 'undefined') {
		timeout = 0;
	}
	
	$('#' + elm + '-overlay').removeClass('hidden').fadeIn('fast');
	$('#' + elm + '-message').removeAttr('class');
	
	if(!timeout) {
		$('#' + elm + '-message').text(msg).addClass('alert').addClass(type);
	} else {
		$('#' + elm + '-message').text(msg).addClass('alert').addClass(type);
		setTimeout( function() {
			$('#' + elm + '-overlay').fadeOut( function() {
				$(this).addClass('hidden');
			});
		}, timeout);
	}
}

alerts.prototype.overlay_out = function (elm) {
	$('#' + elm + '-overlay').fadeOut();
}

alerts.prototype.edit_notifications = function(formId) {
	
	var self = this;
	var form = $(formId);
	
	var url = SITE_PATH + 'buying/property-alert.php';
	
	if(form.find('#ajax_post').length == 0){
		form.append('<input type="hidden" value="1" name="ajax_post" id="ajax_post">');
	}
	
	form.submit( function() {
		var ajax = $.ajax({
			url: url,
			type: 'POST',
			data: $(this).serialize(),
			dataType: 'json',
			beforeSend: function() {
				self.profile_overlay('notifications', 'alert-info', 'Updating notifications, please wait...');		
				$('input[type="submit"]').attr('disabled','disabled');
			}
		});
		
		ajax.done( function(data) {
			$('input[type="submit"]').removeAttr('disabled');
			if(data.hasOwnProperty('updated')) {
				if(data.updated == 1) {
					self.profile_overlay('notifications', 'alert-success', 'Updated successfully!', 1500);
				}
			}
		});
		return false;
	});
}

alerts.prototype.trash_bookmark = function(btn) {
	
	var self = this;
	var url = SITE_PATH + 'buying/property-alert.php';
	
	$(btn).on('click', function() {
		$('#account-modal').on('show.bs.modal', function(e) {
			var modal = this;
			$(modal).find('.modal-title').text('Are you sure?');
			$(modal).find('.modal-body').remove();
			
			var button = $(e.relatedTarget);
			
			$(modal).find('#modal-confirm').on('click', function() {
				$(modal).modal('hide');
				
				var ajax = $.ajax({
					url: url,
					type: 'POST',
					data: {
						f_Bookmark: 1,
						uid: button.data('uid'),
						ajax_post: 1
					},
					dataType: 'json',
					beforeSend: function() {
						self.profile_overlay('bookmarks', 'alert-info', 'Deleting bookmark, please wait...');
					}
				});
				ajax.done( function(data) {
					$('input[type="submit"]').removeAttr('disabled');
					if(data.hasOwnProperty('updated')) {
						if(data.updated == 1) {
							self.profile_overlay('bookmarks', 'alert-success', 'Deleted successfully!', 1500);
							setTimeout( function() {
								$(button).closest('.bookmark-container').fadeOut( function() {
									$(this).remove();
									if(data.hasOwnProperty('count')) {
										if(data.count == 0) {
											$('.no-bookmarks').removeClass('hidden');
										}
									}
								});
							}, 1500);
						}
					}
				});
			});
		});
	});	
}

alerts.prototype.trash_search = function(btn) {
	
	var self = this;
	var url = SITE_PATH + 'buying/property-alert.php';
	
	$(btn).on('click', function() {
	
		$('#account-modal').on('show.bs.modal', function(e) {
			var modal = this;
			$(modal).find('.modal-title').text('Are you sure?');
			$(modal).find('.modal-body').remove();
			
			var button = $(e.relatedTarget);
			
			$(modal).find('#modal-confirm').on('click', function() {
				$(modal).modal('hide');
				
				var ajax = $.ajax({
					url: url,
					type: 'POST',
					data: {
						f_SavedSearch: 1,
						suid: button.data('suid'),
						sid: button.data('sid'),
						ajax_post: 1
					},
					dataType: 'json',
					beforeSend: function() {
						self.profile_overlay('saved-searches', 'alert-info', 'Deleting saved search, please wait...');
					}
				});
				ajax.done( function(data) {
					$('input[type="submit"]').removeAttr('disabled');
					if(data.hasOwnProperty('updated')) {
						if(data.updated == 1) {
							self.profile_overlay('saved-searches', 'alert-success', 'Deleted successfully!', 1500);
							setTimeout( function() {
								$(button).closest('.search-container').fadeOut( function() {
									$(this).remove();
									if(data.hasOwnProperty('count')) {
										if(data.count == 0) {
											$('.no-searches').removeClass('hidden');
										}
									}
								});
							}, 1500);
						}
					}
				});
			});
		});
	});	
}


alerts.prototype.display_errors = function(errors, elm) {
	for(var i = 0; i < errors.length; i++) {
		
		if(typeof(elm) != 'undefined' && elm == errors[i].key) {
			$('label[for="'+errors[i].key+'"]').append('<span class="error-msg">' + errors[i].value + '</span>');
			$('#' + errors[i].key).closest('.form-group').addClass('has-error');
		} else {
			$('#' + errors[i].key).closest('.form-group').addClass('has-error');
			$('label[for="'+errors[i].key+'"]').append('<span class="error-msg">Required</span>');
		}		
	}
}

alerts.prototype.reset_errors = function() {
	$('.form-group').removeClass('has-error');
	$('.alert-danger').remove();
}

alerts.prototype.reset_form = function () {
	$('#requirements-form').append('<input type="hidden" name="f_SaveReq" id="f_SaveReq" value="1">');
	$('#f_UpdateReq').remove();
	
	$('.bbc-selector').find('input').val(0);
	
	$('.selectpicker').each( function() {
		$(this).selectpicker('val','');
	});	
}

alerts.prototype.filter_price = function() {
	
	$('#f_SearchType').bind('change', function() {
		
		var curValue = $(this).val();
		$('select.refresh').each(function() {
			var curSelect = $(this);
			curSelect.find('option').each( function() {
				$(this).removeAttr('selected');
				if(curSelect.hasClass('price_sel')) {
					$(this).show();
					if(!$(this).hasClass(curValue)) {
						$(this).hide();
					}
				}
			});
			$(curSelect).selectpicker('refresh');
		});
	});
	
	$('#f_SearchType').change();
	
}