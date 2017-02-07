// ref. http://stackoverflow.com/questions/5347984/letting-users-draw-curved-lines-on-a-google-map

var GmapCubicBezier = (function() {

    // constructor
    var GmapCubicBezier = function(startp, ctl1, ctl2,  endp, options, map) {

	var defaultOpts = {
	    startArrow: false
	    , endArrow: false
	    , step: 0.05
	    , lineopts: {
		geodesic: true
		, strokeOpacity: 1.0
		, strokeColor: '#ff0000'
	    }
	};

	this.startp = startp;
	this.endp = endp;
	this.ctl1 = ctl1;
	this.ctl2 = ctl2;
	this.options = $.extend([], defaultOpts, options);
	this.map = map;

	this.init();
    };

    var p = GmapCubicBezier.prototype;

    p.init = function() {
	this.points = this.calcPoints(this.startp, this.ctl1, this.ctl2,
				      this.endp, this.options.step);
    }

    p.getPoints = function() {
	return this.points;
    }

    p.draw = function() {
	var points = this.points;

	for(var i = 0; i < points.length - 1; i++) {
	    var firstp = (i == 0);
	    var lastp = (i == points.length - 2);
	    var lineopts = $.extend({}, this.options.lineopts);

	    lineopts.path = [
		new google.maps.LatLng(points[i].x, points[i].y)
		, new google.maps.LatLng(points[i+1].x, points[i+1].y)
	    ];

	    if (firstp && this.options.endArrow) {
		lineopts.icons = [{
		    icon: {
			path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
		    }
		    , offset: '0%'
		}];
		
	    }
	    if (lastp && this.options.startArrow) {
		lineopts.icons = [{
                    icon: {
			path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
		    }
		    , offset: '100%'
		}];
	    }
	
            var line = new google.maps.Polyline(lineopts);
	    line.setMap(this.map);
	}
    }

    p.calcPoints = function(startp, ctl1, ctl2, endp, step) {
	var points = [];

	for(var it = 0; it <= 1; it += step) {
            points.push(this.getBezier(
		{x:startp.lat(), y:startp.lng()},
		{x:ctl1.lat(), y:ctl1.lng()},
		{x:ctl2.lat(), y:ctl2.lng()},
		{x:endp.lat(), y:endp.lng()},
		it));
	}
	// add start point at last
	points.push({x: startp.lat(), y:startp.lng()});

	return points;
    };

    // internal methods

    p.B1 = function(t) { return t*t*t; };
    p.B2 = function(t) { return 3*t*t*(1-t); };
    p.B3 = function(t) { return 3*t*(1-t)*(1-t); };
    p.B4 = function(t) { return (1-t)*(1-t)*(1-t); };

    p.getBezier = function(C1,C2,C3,C4, percent) {
        var pos = {};
        pos.x =
	    C1.x * this.B1(percent) +
	    C2.x * this.B2(percent) +
	    C3.x * this.B3(percent) +
	    C4.x * this.B4(percent);
        pos.y =
	    C1.y * this.B1(percent) +
	    C2.y * this.B2(percent) +
	    C3.y * this.B3(percent) +
	    C4.y * this.B4(percent);
        return pos;
    };

    return GmapCubicBezier;
})();


