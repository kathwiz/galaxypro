contact_us.tag = "CONTACT_US"
contact_us.prototype = new behaviour();

function contact_us() {
	if (debug.logging) debug.log(contact_us.tag, "loaded");
	
	if (typeof this.map_setup != 'undefined') this.map_setup();
	else if (debug.logging) debug.log(home.tag, "map_setup deleted");
	
	this.extra_setup(contact_us.tag);
}
contact_us.prototype.map_setup = function () {
	if(PropLatlng){
		showMap("google-canvas", PropLatlng);
	}
}