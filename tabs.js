tabs.tag = "TABS"
tabs.prototype = new behaviour();

function tabs() {
	if (debug.logging) debug.log(tabs.tag, "loaded");
	
	// Activates the tabs
	if (typeof this.tab_container_setup != 'undefined') this.tab_container_setup();
	else if (debug.logging) debug.log(tabs.tag, "tab container deleted");
	
	this.extra_setup(tabs.tag);
}

tabs.prototype.tab_container_setup = function () {
	$('.tab-container:not(.style-only)').each(function() {
		var tab_container = $(this);
		activate_tab(tab_container);
		if(tab_container.find('.inner-tab-container').length>0) {
			tab_container.find('.inner-tab-container').each(function() {
				var inner_tab_container = $(this);
				activate_inner_tab(inner_tab_container);
			});
		}
	});
}
	

