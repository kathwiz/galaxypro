forms.tag = "FORMS"
forms.prototype = new behaviour();

function forms() {
	if (debug.logging) debug.log(forms.tag, "loaded");
	
	if (typeof this.error_css_setup != 'undefined') this.error_css_setup();
	else if (debug.logging) debug.log(forms.tag, "error css deleted");
	
	if (typeof this.fancy_form_setup != 'undefined') this.fancy_form_setup();
	else if (debug.logging) debug.log(forms.tag, "fancy form deleted");

	if (typeof this.question_tooltip_setup != 'undefined') this.question_tooltip_setup();
	else if (debug.logging) debug.log(forms.tag, "question tooltip deleted");

	if (typeof this.select_change_setup != 'undefined') this.select_change_setup();
	else if (debug.logging) debug.log(forms.tag, "select change deleted");	
	
	
	this.extra_setup(forms.tag);
}


forms.prototype.error_css_setup = function() {
    if ($('.error').length > 0) {
        $('.error').parent().children('input[type="text"], input[type="password"], select, .sel-box, textarea').css('border', '1px solid #c00');
        if ($('.error').siblings('div.container').length > 0) {
            $('.error').siblings('div.container').css('border', '1px solid #c00');
        }
    }
}

forms.prototype.fancy_form_setup = function() {
	var resize_parent = function(height, duration) {
		parent.$('#fancybox-content').animate({
			height: height
		}, duration);
		parent.$('#fancybox-wrap').animate({
			height: height + 20
		}, duration);
	}
    if ($('#fancyform-height').length > 0) {
        var height;
        var duration = 300;
        if ($('.error_msg').length > 0) {
            height = parseInt($('#fancyform-height').val());
            var offset = $('.error_msg').height() * $('.error_msg').length + 12;
            height += offset;
            resize_parent(height, duration);
        } else if ($('.success_msg').length > 0 && $('body.fancyforms').length > 0) {
            if ($('.success_msg').next().attr('id') == 'fancyform-height') {
                height = $('.success_msg').height() * $('.success_msg').length + 12;
            } else if ($('.success_msg').next().attr('id') != 'fancyform-height') {
                var offset = $('.success_msg').height() * $('.success_msg').length + 12;
                height = parseInt($('#fancyform-height').val()) + offset;
            }
            duration = 500;
            resize_parent(height, duration);
        }
    }
}

forms.prototype.question_tooltip_setup = function () {
    $(".question").tooltip({ position: "top center" });
}

forms.prototype.select_change_setup = function () {
    //show/hide elements after select
    $('form select').change(function() {
        var selected_opt = $(this).children('option:selected');
        if (selected_opt.data('rel')) {
            var commands = selected_opt.data('rel').split('|');
            for (var i in commands) {
                var command = commands[i].split(':');
                var opt = command[0];
                var elements = command[1].split(',');
                for (var j in elements) {
                    eval("$('" + elements[j] + "')." + opt + "()");
                }
            }
        }
    });
}