/*
 * File: app/view/PlantPopup.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.PlantPopup', {
//------------------------------------------------------------------------------

    createForSurface: function(surface, atX, atY) {

    	// Background
    	var popupBackground = [{        
			type: 'circle',
			x: atX + 25,
			y: atY,
			radius: 30,
			fill: '#000',
			opacity: 0.2,
			zIndex: 1800
		},{        
			type: 'circle',
			x: atX + 25,
			y: atY,
			radius: 50,
			fill: '#000',
			opacity: 0.15,
			zIndex: 1900
		},{        
			type: 'circle',
			x: atX + 25,
			y: atY,
			radius: 80,
			fill: '#000',
			opacity: 0.15,
			zIndex: 2000
		}];

    	// Switchgrass
    	var switchGrass = [{        
			type: 'image',
			src: 'resources/grass_icon.png',
			x: atX - 25,
			y: atY - 40,
			width: 50,
			height: 50,
			opacity: 0.5,
			zIndex: 3000
		}];

    	// corn
    	var corn = [{        
			type: 'image',
			src: 'resources/corn_icon.png',
			x: atX + 25,
			y: atY - 40,
			width: 50,
			height: 50,
			opacity: 0.5,
			zIndex: 3000
		}];

    	// Cover Crop
    	var coverCrop = [{        
			type: 'image',
			src: 'resources/cover_crop_icon.png',
			x: atX,
			y: atY,
			width: 50,
			height: 50,
			opacity: 0.5,
			zIndex: 3000
		}];
		
  		this.bg = surface.add(popupBackground);
  		this.coverCrop = surface.add(coverCrop);
  		this.grass = surface.add(switchGrass);
  		this.corn = surface.add(corn);
    },

    //--------------------------------------------------------------------------
    showPopup: function(clickResponder, scope) {
    	
    	this.plantingClickResponder = clickResponder;
    	this.plantingClickResponderScope = scope;
    	
    	var baseInit = function(sprite, functionScope, clickValue) {
			sprite.show(true);
			sprite.cropTypeClickValue = clickValue;
			
			// scope is sprite so that the event will animate that given sprite
			sprite.on({
					mouseover: functionScope.onMouseOver,
					mouseout: functionScope.onMouseOut,
					scope: sprite
			});
			sprite.on({
					click: functionScope.onClick,
					scope: functionScope
			});
			sprite.setAttributes({
					scale: {
						x: 1,
						y: 1
					},
					opacity: 0.5
			}, true);
		}

		// show and set up all the events
		this.bg[0].show(true);
		this.bg[1].show(true);
    	this.bg[2].show(true);
    	this.bg[2].cropTypeClickValue = "cancel";
		this.bg[2].on({
				mouseout: this.onPopupMouseOut,
				click: this.onClick,
				scope: this});
		
		baseInit(this.coverCrop[0], this, "cover");
		baseInit(this.grass[0], this, "grass");
		baseInit(this.corn[0], this, "corn");
    },    
    
    //--------------------------------------------------------------------------
    hidePopup: function() {
    	// hide all sprites and clear the listen events
    	this.bg[0].hide(true);
    	this.bg[1].hide(true);
    	this.bg[2].hide(true).clearListeners();
    	this.coverCrop[0].hide(true).clearListeners();
    	this.grass[0].hide(true).clearListeners();
    	this.corn[0].hide(true).clearListeners();
    },
    
    //--------------------------------------------------------------------------
    onMouseOver: function(evt, target) {
    	this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1.1,
					y: 1.1
				},
				opacity: 1
			}
    	});
	},

    //--------------------------------------------------------------------------
    onMouseOut: function(evt, target) {
    	this.stopAnimation().animate({
			duration:60,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 0.5
			}
    	});
	},

    //--------------------------------------------------------------------------
	onPopupMouseOut: function(evt, target) {
		this.plantingClickResponder.call(this.plantingClickResponderScope, 'cancel');
		this.hidePopup();
	},
	
    //--------------------------------------------------------------------------
	onClick: function(evt, target) {
		this.plantingClickResponder.call(this.plantingClickResponderScope, evt.cropTypeClickValue);
		this.hidePopup();
	},
	
});

