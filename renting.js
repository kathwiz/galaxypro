renting.tag = "RENTING";
renting.prototype = new behaviour();

function renting () {
	if (debug.logging) debug.log(renting.tag, "loaded");	
	
	if (typeof this.init_accordian != 'undefined') this.init_accordian();
	else if (debug.logging) debug.log(renting.tag, "init_accordian deleted");
	
	if (typeof this.init_forms != 'undefined') this.init_forms();
	else if (debug.logging) debug.log(renting.tag, "init_forms deleted");
	
	if (typeof this.display_errors != 'undefined') ''; // No need to run on page load
	else if (debug.logging) debug.log(renting.tag, "display_errors deleted");
	
	if (typeof this.reset_errors != 'undefined') ''; // No need to run on page load
	else if (debug.logging) debug.log(renting.tag, "reset_errors deleted");
	
	this.extra_setup(renting.tag);
	
}

// Adds and removes + and - icons from accordian heading
renting.prototype.init_accordian = function () {

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

// Process all forms
renting.prototype.init_forms = function () {
	
	var self = this;

	$('.tenant-form').find('input[type="reset"]').click(self.reset_errors, self.reset_errors);
	
	$('.tenant-form').submit( function() {
		self.reset_errors();
		var form = $(this);
		var url = $(this).attr('action');
		
		var xhr = $.ajax({
			url: url,
			data: form.serialize(),
			dataType: 'json',
			type: 'POST',
			beforeSend: function() {
				$(form).find('input[type="submit"]').attr({value: 'Please wait...', disabled: 'disabled'});
			}
		});
		
		xhr.done( function(data) {
			form.find('input[type="submit"]').attr('value', 'SUBMIT').removeAttr('disabled');
			if(data.hasOwnProperty('errors')) {
				self.display_errors(data.errors, form);
			}
			if(data.hasOwnProperty('success')) {
				self.display_success(data.success, form);
				self.reset_form(form);
				form.hide();
				$('.alert-success').on('closed.bs.alert', function() {
					form.show();
				});
			}
		});
		return false;
	});
	
}

renting.prototype.display_errors = function(errors, form) {
	if(errors.length > 0) { // Make sure we have some errors
		for(var e = 0; e < errors.length; e++) {
			if($(form).find('#' + errors[e].key).length > 0) {
				if($(form).find('#' + errors[e].key).hasClass('radio-label')) {
					$(form).find('#' + errors[e].key).closest('.form-group').addClass('has-error').find('label:eq(0)').append('<span class="error-msg">' + errors[e].value + '</span>');
				} else {
					$(form).find('label[for="'+errors[e].key+'"]').append('<span class="error-msg">' + errors[e].value + '</span>');
					$(form).find('#' + errors[e].key).closest('.form-group').addClass('has-error');
				}
			}
		}
	}
}

renting.prototype.display_success = function(success, form) {
	if(success.length > 0) {
		$(form).closest('.panel-collapse').find('.alert-success').removeClass('hidden').find('span[class="alert-msg"]').append(success[0].value);
	}
}

renting.prototype.reset_form = function(form) {
	$(form).find('.form-control').val('');
}

renting.prototype.reset_errors = function() {
	$('.error-msg').remove();
	$('.form-group').removeClass('has-error');
}