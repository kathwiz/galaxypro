var australiaCoor = new google.maps.LatLng(-29.509726, 135.625);
var geocoder;
var map;
var directionDisplay;
var directionsService;

var marker_icon = new google.maps.MarkerImage(SITE_PATH+'img/google_pin.png',
    new google.maps.Size(23, 30),
    new google.maps.Point(0,0),
    new google.maps.Point(12, 30));
var marker_shadow = new google.maps.MarkerImage(SITE_PATH+'img/icon_shadow.png',
    new google.maps.Size(39, 30),
    new google.maps.Point(0,0),
    new google.maps.Point(12, 30));
var marker_icon_ex = new google.maps.MarkerImage(SITE_PATH+'img/google_pin_ex.png',
    new google.maps.Size(23, 30),
    new google.maps.Point(0,0),
    new google.maps.Point(12, 30));
var marker_shadow_ex = new google.maps.MarkerImage(SITE_PATH+'img/icon_shadow_ex.png',
    new google.maps.Size(39, 30),
    new google.maps.Point(0,0),
    new google.maps.Point(12, 30));



var streetViewOptimized = (function(){
    var latlng,
        driv_des_latlng,//Driving Method
        map_canvas,
        distance=50,
        maps = {};
    function acos(arg) {
        return (Math.abs(Math.abs(arg) - 1) < 0.0000000001)
            ? Math.round(Math.acos(arg)) : Math.acos(arg);
    }
    function sin(arg) { return Math.sin(arg); }
    function cos(arg) { return Math.cos(arg); }
    function abs(arg) { return Math.abs(arg); }
    function deg2rad(arg) { return arg * Math.PI / 180; }
    function rad2deg(arg) { return arg * 180 / Math.PI; }
    function sin2(what) { return Math.sin(what * Math.PI / 180); }
    function get_roll(){
        var roll = 0;
        if(typeof maps.panorama.getPhotographerPov()!='undefined'){
            var pov = maps.panorama.getPhotographerPov(),
                clientHeading = maps.panorama.getPov().heading;
            while (clientHeading < 0) clientHeading += 360;
            while (clientHeading > 360) clientHeading -= 360;
            var a1 = deg2rad(abs(pov.pitch)),
            a2 = deg2rad(90),
            yaw = deg2rad((pov.heading < 0 ? pov.heading + 360 : pov.heading) - clientHeading),
            b1 = acos((cos(a1) * cos(a2)) + (sin(a1) * sin(a2) * cos(yaw)));
            if (sin(a1) * sin(a2) * sin(b1) !== 0) {
                roll = acos((cos(a1) - (cos(a2) * cos(b1))) / (sin(a2) * sin(b1))),
                direction = pov.heading - clientHeading;
                if (direction < 0) direction += 360;
                if (pov.pitch < 0)
                    roll = (direction < 180) ? rad2deg(roll) * -1 : rad2deg(roll);
                else
                    roll = (direction > 180) ? rad2deg(roll) * -1 : rad2deg(roll);
        }else{
                var yaw = pov.heading - 90;
                if (yaw < 0) yaw += 360;
                var scale = ((abs(clientHeading - yaw) / 90) - 1) * -1;
                roll = pov.pitch * scale;
                if (abs(roll) > abs(pov.pitch)) {
                    var diff = (abs(roll) - abs(pov.pitch)) * 2;
                    roll = (roll < 0) ? roll + diff : roll - diff;
                }
            }
        }
        return roll;
    }

    function stopRoll(){
        if (maps.tilesLoaded) clearInterval(maps.tilesLoaded);
        if (maps.canvas)
            for (var i in maps.canvas) maps.canvas[i].removeAttribute('style');
        delete maps.canvas;
        delete maps.tilesLoaded;
        maps.panorama.setZoom(1);
    }

    function rotate(){
        var vendorTransforms = ['transform', 'mozTransform', 'webkitTransform', 'oTransform', 'msTransform'],
            modX = maps.growX, // defined in getHeading()
            modY = maps.growY;
        for (var i=0; i<vendorTransforms.length; i++) {
            if (typeof document.body.style[vendorTransforms[i]] != 'undefined') {
                vendorTransform = vendorTransforms[i];
                break;
            }
        }
        maps.panorama.setZoom((maps.panorama.getZoom() || 1) * 1.0 - Math.round(modY / 3) / 100);
        if(!maps.tilesLoaded) maps.tilesLoaded = setInterval(function(){

            if (!maps.panorama.getVisible()) {
                return stopRoll();
            }
            var roll = get_roll();
            maps.canvas = {};
            // Firefox and IE
            var tiles = map_canvas.getElementsByTagName('img');
            for (var i=0; i<tiles.length; i++) {
                if (tiles[i].src.indexOf(maps.panorama.getPano()) > -1)
                    maps.canvas.div = tiles[i].parentNode.parentNode;
            }
            // Google Chrome
            var tiles = map_canvas.getElementsByTagName('canvas');
            if (tiles.length)
                maps.canvas.canvas = tiles[tiles.length - 1];

            for (var i in maps.canvas) {
                with (maps.canvas[i]) {
                    style[vendorTransform] = 'rotate(' + roll + 'deg)';
                    style.margin = '-' + modY + 'px ' + modX + 'px ' + modY + 'px -' + modX + 'px';
                    style.width = map_canvas.clientWidth + (modX * 2) + 'px';
                    style.height = map_canvas.clientHeight + (modY * 2) + 'px';
                }
            }
        },80);
    }

    function getHeading(){
        var service = new google.maps.StreetViewService;
        service.getPanoramaByLocation(driv_des_latlng,distance,function (camera) {
                if (camera) {
                    maps.heading = google.maps.geometry.spherical.computeHeading(camera.location.latLng, latlng);
                    maps.camera = camera.location.latLng;
                    maps.originPitch = camera.tiles.originPitch;
                    maps.originYaw = camera.tiles.originPitchYaw;
                    // The optimal height is L * sin(t) + H * sin(90 – t)
                    // http://polymathprogrammer.com/tag/image-rotation/
                    // Desired width is proportional.
                    var W = map_canvas.clientWidth,
                        H = map_canvas.clientHeight,
                        Rot = Math.abs(maps.originPitch);
                    newHeight = W * sin2(Rot) + H * sin2(90 - Rot);
                    maps.growY = Math.round((newHeight - H) / 2);
                    maps.growX = Math.round(((newHeight * W / H) - W) / 2);
                    streetView();
                } else {
                    if(distance<400) {
                        distance *= 2;
                        getHeading();
                    }else {
                        maps.info = new google.maps.InfoWindow({
                            content: '<div class="infoWindow">Street View unavailable for current location</div>'
                        });
                        maps.info.open(maps.map);
                    }
                }
        });
    }

    function streetView(){
        for (var i in ['canvas','tilesLoaded']) delete maps[i];
        maps.panorama = maps.map.getStreetView();
        maps.panorama.setOptions({
            linksControl: true,
            panControl: false,
            zoomControl: false,
            addressControl: false,
            visible: true,
            position: maps.camera,
            pov: {
                heading: maps.heading,
                pitch: 0,
                zoom: 1
            }
        });
        rotate();
        if (maps.info && maps.info.getContent())
            maps.info.open(maps.panorama, maps.marker);
    }

    function init(lat_lng_obj,property_lat_lng_obj,canvas_id){
        map_canvas =document.getElementById(canvas_id);
        latlng = property_lat_lng_obj;
        driv_des_latlng = lat_lng_obj;
        maps.map = new google.maps.Map(map_canvas,{
            center: latlng,
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false
        });

        if(typeof(hideAdress)!='undefined'&& hideAddress){
            maps.info = new google.maps.InfoWindow({
                content: '<div class="infoWindow">Street View is hidden.</div>',
                disableAutoPan : true
            });
            maps.info.open(maps.map);
            return false;
        }

        maps.marker = new google.maps.Marker({
            position: latlng,
            map: maps.map,
            title: 'Click for street view',
            draggable: false
        });
        google.maps.event.addDomListener(maps.marker, 'click', streetView);
        getHeading();
    }

    return {
        init : init
    };
}());


function showMap(canvas) {
    if(typeof(PropLatlng) != "undefined" && (PropLatlng.lat() != 0 && PropLatlng.lng() != 0)) {
        if(parseInt(PropLatlng.lat()) == 0 || parseInt(PropLatlng.lng()) == 0 || parseInt(PropLatlng.lat()) == 1 || parseInt(PropLatlng.lng()) == 1) {
           codeAddress("google-canvas", PropAddress);
        }else {
            codeCoord(canvas, PropLatlng, PropAddress);
        }
    }else {
       codeAddress("google-canvas", PropAddress);
    }
}

function mapView(canvas, PropertyList) {
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    var myOptions = {
        streetViewControl: true,
        scrollwheel: true,
        zoom: 5,
        maxZoom:20,
        center: australiaCoor,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById(canvas), myOptions);

    var infowindow = new google.maps.InfoWindow();
    var infowindow_size = new google.maps.Size(320,120);
    var marker, i;
    var message = new Array();
    for (var i in PropertyList['full_address']) {
        propCoor = null;
        if(parseFloat(PropertyList['lt_lat'][i]) === 0 || parseFloat(PropertyList['lt_log'][i]) === 0 || parseFloat(PropertyList['lt_lat'][i]) === 1 || parseFloat(PropertyList['lt_log'][i]) === 1) {
            continue;
        }else {
            if(PropertyList['no_record'][1]) {
                geocoder = new google.maps.Geocoder();
                message[i] = "<div id='property-baloon' style='width: 320px; height: 95px;'><h1>"+PropertyList['office_name'][1]+"</h1><h2>"+PropertyList['full_address'][1]+"</h2><p>No property can be shown on the map because property addresses are hidden.</p></div>";
                propCoor = australiaCoor;
                geocoder.geocode( { 'address': PropertyList['full_address'][1]}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        propCoor = results[0].geometry.location;
                        marker = new google.maps.Marker({
                            icon: marker_icon,
                            shadow: marker_shadow,
                            position: propCoor,
                            map: map
                        });
                        infowindow.setContent(message[i]);
                        infowindow.setSize(infowindow_size);
                        infowindow.open(map, marker);
                        bounds.extend(marker.position);
                        map.fitBounds(bounds);
                    }
                });
            } else {
                bookmark = (typeof(PropertyList['pj_listings']) != 'undefined')?'':'<!--<li><a href="'+PropertyList['BookmarkLink'][i]+'" title="bookmark property" class="bookmark"><span class="icon bookmark"></span></a></li>-->';
                message[i] = '<div id="property-baloon" style="width:320px;min-height:150px;overflow:hidden;"><h1>'+PropertyList['address'][i]+', <span>'+PropertyList['suburb'][i]+'</span></h1><div class="photo"><a href="'+PropertyList['DetailsLink'][i]+'"><img src="'+PropertyList['photo'][i]+'" /></a></div><div class="info"><div class="basic"><h2>'+PropertyList['price'][i]+'</h2><!--<p>'+PropertyList['headline'][i]+'</p>--></div><div class="tools"><p class="bbc">'+PropertyList['bbc'][i]+'</p><ul>'+bookmark+'<li><a href="'+PropertyList['DetailsLink'][i]+'" title="view details"><!--<span class="icon view"></span>-->View Property &raquo;</a></li></ul></div></div><!--<script type="text/javascript">$("#property-baloon a.bookmark").fancybox({\'centerOnScroll\':true,\'titleShow\':false});</script>--><div style="clear:both"></div></div>';
                propCoor = new google.maps.LatLng(PropertyList['lt_lat'][i],PropertyList['lt_log'][i]);
				
				if(typeof(useMapPinIcons) != 'undefined' && useMapPinIcons) {
					var marker = new Marker({
						map: map,
						title: 'Map Icons',
						position: coord,
						zIndex: 9,
						icon: {
							path: MAP_PIN,
							fillColor: mapPinColor,
							fillOpacity: 1,
							strokeColor: '',
							strokeWeight: 0
						},
						map_icon_label: '<span class="map-icon-circle map-icon"></span>'
					});
				} else {
					   marker = new google.maps.Marker({
							icon: marker_icon,
							shadow: marker_shadow,
							position: propCoor,
							map: map
						});
				}
				
         
                if(typeof(PropertyList['sale_type']) != 'undefined' && PropertyList['sale_type'][i] == 'rent') {
                    marker.setIcon(marker_icon_ex);
                }
                bounds.extend(marker.position);
                map.fitBounds(bounds);

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(message[i]);
                        infowindow.setSize(infowindow_size);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
        }
    }
}

function officeMapView(canvas, PropertyList) {
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    var myOptions = {
        streetViewControl: true,
        scrollwheel: false,
        zoom: 5,
        maxZoom:20,
        center: australiaCoor,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById(canvas), myOptions);
    var infowindow = new google.maps.InfoWindow();
    var infowindow_size = new google.maps.Size(320,120);
    var marker, i;
    var message = new Array();
    geocoder = new google.maps.Geocoder();

    for (var i in PropertyList['office_address']) {
        propCoor = null;
        message[i] = '<div id="property-baloon" style="width: 320px; height: 100px;"><p>'+PropertyList['office_name'][i]+'</p><p>'+PropertyList['office_address'][i]+'</p></div>';
        propCoor = new google.maps.LatLng(PropertyList['ofc_lat'][i],PropertyList['ofc_log'][i]);
        marker = new google.maps.Marker({
            icon: marker_icon,
            shadow: marker_shadow,
            position: propCoor,
            map: map
        });
        bounds.extend(marker.position);
        map.fitBounds(bounds);
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(message[i]);
                infowindow.setSize(infowindow_size);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

function codeCoord(canvas, PropLatlng, PropAddress) {
    var contentString = '<br /><p>'+PropAddress+'</p>'
    var marker = displayPin(canvas, PropLatlng);
    bindInfo(marker, map, contentString, '');
}

function shopMapByLatLog(canvas, PropLatlng) {
	 codeCoord(canvas, PropLatlng);
	 var marker = displayPin(canvas, PropLatlng);
}

function codeAddress(canvas, PropAddress) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': PropAddress}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if(typeof(hideAddress) == 'undefined' || !hideAddress) {
                var contentString = '<br /><p>'+PropAddress+'</p>';
                var marker = displayPin(canvas, results[0].geometry.location, map);
                bindInfo(marker, map, contentString, '');
            }else {
                if(hideAddress) {
                    displayPin(canvas, results[0].geometry.location, map, true);
                }
            }
        } else {
            alert("Property map can not be retrieved by the following reason: " + status);
        }
    });
}

function displayPin(canvas, coord, target_map, map_only) {
    if(typeof(map) == 'undefined') {
        var myOptions = {
            streetViewControl: true,
            scrollwheel: false,
            zoom: 15,
            center: coord,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        if (typeof(forceOptions) != 'undefined') {
            $.each(forceOptions, function(name, val) {
                myOptions[name] = val;
            });
        }
        map = new google.maps.Map(document.getElementById(canvas), myOptions);
    }else {
        map = target_map;
    }
    if(typeof(map_only) == 'undefined' || !map_only) {
		
		if(typeof(useMapPinIcons) != 'undefined' && useMapPinIcons) {
			var marker = new Marker({
				map: map,
				title: 'Map Icons',
				position: coord,
				zIndex: 9,
				icon: {
					path: MAP_PIN,
					fillColor: mapPinColor,
					fillOpacity: 1,
					strokeColor: '',
					strokeWeight: 0
				},
				map_icon_label: '<span class="map-icon-circle map-icon"></span>'
			});
		} else {
			var marker = new google.maps.Marker({
				icon: marker_icon,
				shadow: marker_shadow,
				position:coord,
				map: map
			});
		}
    }
    return marker;
}



function bindInfo(marker, map, content, size, target_iw) {
    if(typeof(infoWindow) == 'undefined') {
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
    }else {
        var infowindow = target_iw;
    }
    if(size != '') {infowindow.setSize(size);}
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });
}

function streetView(canvas,PropNum,PropAddress) {
    var panoramaOptions;
    var hiddenFlag;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': PropNum +' '+PropAddress}, function(results, status) {
        var $this = $(this),
            _lat = results[0].geometry.location.lat(),
            _lng = results[0].geometry.location.lng(),
            streetViewMaxDistance = 50;

        var point = new google.maps.LatLng(_lat,_lng);
      // attempt to cross street via car
        var PropNumIntNextDoor = parseInt(PropNum);
        if(isNaN(PropNumIntNextDoor)){
            PropNumIntNextDoor = 1;
        }
        PropNumIntNextDoor>1?PropNumIntNextDoor--:PropNumIntNextDoor++;
        var oa = PropNumIntNextDoor+' '+PropAddress;

        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin:oa,
            destination:PropNum+' '+PropAddress,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            var street_point = point;
            if (status == google.maps.DirectionsStatus.OK) {
                street_point=response.routes[0].legs[0].end_location;
            }

            streetViewOptimized.init(street_point,point,canvas);

        });
    });
}

function showDirections(canvas, panel, ToAddress) {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    var default_coor;
    geocoder.geocode({'address': ToAddress}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            default_coor = results[0].geometry.location;
            var myOptions = {
                zoom: 15,
                center: default_coor,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById(canvas), myOptions);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById(panel));
            if(!getDirection) {
                var marker = new google.maps.Marker({
                    position:results[0].geometry.location,
                    map: map
                });
            }
        }
    });
}

function calcRoute(start, end) {
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}