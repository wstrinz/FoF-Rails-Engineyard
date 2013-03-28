/*
 * File: app/view/FieldOverlay.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FieldOverlay', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    attachTo: function(fieldData, surface, atX, atY) {
    	this.surface = surface;
    	this.fieldData = fieldData;

    	this.atX = atX;
    	this.atY = atY;

    	this.yieldPos = {
    		x: atX + 20,
    		y: atY + 55
    	};

    	// Soil 'health' color layer
  	this.underlay = surface.add([{
			type: 'rect',
			width: 160,
			height: 120,
			radius: 10,
			x: atX,
			y: atY,
			fill: '#ff0',
			opacity: 0.5,
			zIndex: 500
		}]);

		this.cropSprites = {
			corn: 'resources/corn_icon.png',
			switchgrass: 'resources/grass_icon.png',
      coverCrop: 'resources/cover_crop_icon.png',
			fallow: 'resources/cover_crop_icon.png'
		};

		this.cropSprite = surface.add([{
			type: 'image',
			src: 'resources/corn_icon.png',
			x: atX-15,
			y: atY-15,
			width: 40,
			height: 40,
			zIndex: 3000
		}]);

		this.fertilizerSprite = surface.add([{
			type: 'image',
			src: 'resources/fertilizer_yes_icon.png',
			x: atX-10,
			y: atY+25,
			width: 30,
			height: 30,
			zIndex: 3000
		}]);

		this.tillSprite = surface.add([{
			type: 'image',
			src: 'resources/till_yes_icon.png',
			x: atX-10,
			y: atY+55,
			width: 30,
			height: 30,
			zIndex: 3000
		}]);

		this.fieldHistoryStore = Ext.create('Ext.data.JsonStore', {
				fields: ['year','corn','grass'],
/*				data: [
					{'year':0, 'corn':50, 'grass':50},
					{'year':1, 'corn':20, 'grass':30},
					{'year':2, 'corn':10, 'grass':50},
				]*/
					// {
					//   x: [0,1,2,3,4],
					// },
					// {
					//   grass: [0, 10, 20, 30],
					// },
					// {
					//   corn: [30, 20, 10, 10]
					// },
		});

		this.chart = Ext.create('Ext.chart.Chart',
		{
				// FIXME: yeah, basically render it to the FarmHolderPanel...
				renderTo: surface.el.dom.parentElement.parentElement,
				animate: true,
				height: 135,
				width: 160,
				// Overlay magic starts here...float, no shadow, place at x, y, etc
				floating: true,
				shadow: false,
				x: atX * 1.1124 + 5,
        y: atY * 1.1217 + 5,
				store: this.fieldHistoryStore,
				insetPadding: 1,
				axes: [{
						type: 'Category',
						fields: ['year'],
						position: 'bottom',
						title: 'Year',
						label: {
							padding: 0 // only helps a bit with getting title up closer to the year #'s
						}
				},
				{
					type: 'Numeric',
						fields: ['corn','grass'],
						position: 'left',
						title: 'yield'
				}],
				series: [{
					type: 'line',
					highlight: {
						 size: 4,
						 radius: 6
					},
					tips: {
						trackMouse: true,
						width: 90,
						height: 55,
						layout: 'fit',
						renderer: function(storeItem, item) {
							this.setTitle("year: " + storeItem.get("year") + " yield: " + storeItem.get("corn"));
						},
					},
					axis: 'left',
					xField: 'year',
					yField: 'corn',
					title: 'corn',
					style: {
						fill: "#F9EA01",
						stroke: "#F9EA01"
					},
					smooth: 3
				},
				{
					type: 'line',
					highlight: {
						 size: 4,
						 radius: 6
					},
					tips: {
						trackMouse: true,
						width: 90,
						height: 55,
						layout: 'fit',
						renderer: function(storeItem, item) {
							this.setTitle("year: " + storeItem.get("year") + " yield: " + storeItem.get("grass"));
						},
					},
					axis: 'left',
					xField: 'year',
					yField: 'grass',
					title: 'grass',
					style: {
						fill: "#008000",
						stroke: "#008000"
					},
					smooth: 3
				}]
			});
			this.chart.hide();
    },

    //--------------------------------------------------------------------------
    animateShow: function(object, duration, opacity) {

    	object.stopAnimation().show(true).animate({
    		duration: duration,
    		to: {
    			opacity: opacity
    		}
    	});
    },

    //--------------------------------------------------------------------------
    doHide: function() {

    	this.hide(true);
    },

    //--------------------------------------------------------------------------
    animateHide: function(object) {

    	object.stopAnimation().animate({
			duration: 100,
			to: {
				opacity: 0
			},
			callback: this.doHide,
			scope: object
    	});
    },

    //--------------------------------------------------------------------------
    showYields: function() {
    	this.chart.show();
    },

    //--------------------------------------------------------------------------
    hideYields: function() {
    	this.chart.hide();
    },

    //--------------------------------------------------------------------------
    showSoilHealth: function() {

    	this.animateShow(this.underlay[0], 100, 0.5);
    },

    //--------------------------------------------------------------------------
    hideSoilHealth: function() {

    	this.animateHide(this.underlay[0]);
    },

    //--------------------------------------------------------------------------
    showCrop: function() {

    	this.animateShow(this.cropSprite[0], 200, 1);
    	this.animateShow(this.fertilizerSprite[0], 200, 1);
    	this.animateShow(this.tillSprite[0], 200, 1);
    },

    //--------------------------------------------------------------------------
    hideCrop: function() {

    	this.animateHide(this.cropSprite[0]);
    	this.animateHide(this.fertilizerSprite[0]);
    	this.animateHide(this.tillSprite[0]);
    },

    //--------------------------------------------------------------------------
    show: function(year) {

    	this.showSoilHealth();
    	this.showCrop();
    	this.showYields();
    },

    //--------------------------------------------------------------------------
    hide: function() {

    	this.hideSoilHealth();
    	this.hideCrop();
    	this.hideYields();
    },

    //--------------------------------------------------------------------------
    animateTo: function(item, opacity, fill, time) {

    	var config;

    	if (time && typeof time != 'undefined') {
    		config.duration = time;
    	}
    	else {
    		config.duration = 100;
    	}

    	if (opacity) {
    		config.to.opacity = opacity;
    	}
    	if (fill) {
    		config.to.fill = fill;
    	}

    	item.stopAnimation().animate(config);
    },

    //--------------------------------------------------------------------------
    setCurrentSeason: function(year) {
      if (this.fieldData.seasons.length == 0){
        // console.log("no seasons!")
        return;
      }

    	var newYear = (this.fieldData.seasons.length - 1) + year;
    	var season = this.fieldData.seasons[newYear];

    	var fillColor = '#ff0';

    	if (season.soil <= 30) {
    		fillColor = '#f00';
    	}
    	else if (season.soil >= 100) {
    		fillColor = '#0f0';
    	}
    	else if (season.soil < 50) {
    		fillColor = 'rgb(255,' + (255 + season.soil * 25) + ',0)';
    	}
    	else if (season.soil > 50) {
    		fillColor = 'rgb(' + (255 - season.soil * 25) + ',255,0)';
    	}

    	this.underlay[0].stopAnimation().animate({
			duration: 200,
			to: {
				fill: fillColor,
				opacity: 0.5
			}
    	});

    	this.cropSprite[0].setAttributes({
    			src: this.cropSprites[season.crop]
    		}, true);

		// fertilizer
    	var targetOpacity = 0;
    	if (season.fertilizer) {
    		targetOpacity = 1;
    	}
    	this.fertilizerSprite[0].stopAnimation().animate({
    		duration: 200,
    		to: {
    			opacity: targetOpacity
    		}
    	});

    	// till
    	targetOpacity = 0;
    	if (season.till) {
    		targetOpacity = 1;
    	}
    	this.tillSprite[0].stopAnimation().animate({
    		duration: 200,
    		to: {
    			opacity: targetOpacity
    		}
    	});
    }

});

