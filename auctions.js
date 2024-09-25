auctions.tag = "AUCTIONS"
auctions.prototype = new behaviour();

function auctions() {
	if (debug.logging) debug.log(auctions.tag, "loaded");
	
	if (typeof this.auctionLink != 'undefined') this.auctionLink();
	else if (debug.logging) debug.log(auctions.tag, "auctionLink fb deleted");
	
	this.extra_setup(auctions.tag);
}

auctions.prototype.auctionLink = function () {
    
    $('.auction-content').bind('click', function() {
        window.location = $(this).find('.auction-link').attr('href');
    });
    
}