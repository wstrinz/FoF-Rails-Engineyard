/*
 * File: app/view/ToggleSprite.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ToggleSprite', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    addToSurface: function(surface, config, off, on, startShown) {

    	this.stateImages = new Array();
    	this.stateImages.push(off);
    	this.stateImages.push(on);
    	this.stateValue = 0;

  		var result = surface.add(config);
  		this.sprite = result[0];
  		
  		if (typeof startShown != 'undefined' && startShown) { 
  			this.sprite.show(true);
  			this.setListeners();
  		}
  		else {
  			this.sprite.show(false);
  		}
    },

    //-----------------------------------------------------------------------
    setListeners: function() {

		this.sprite.on({
				mouseover: this.onMouseOver,
				mouseout: this.onMouseOut,
				scope: this.sprite
		});
		this.sprite.on({
				click: this.onClick,
				scope: this
		});
    },

    //-----------------------------------------------------------------------
    show: function() {
    	this.sprite.stopAnimation().show(true).animate({
    		duration: 100,
    		to: {
    			opacity: 1
    		}
    	});
    	this.setListeners();
    },

    //-----------------------------------------------------------------------
    hide: function() {
    	if (this.sprite.attr.hidden) {
    		return;
    	}
    	this.sprite.stopAnimation().animate({
    		duration: 100,
    		callback: this.doHide,
    		scope: this.sprite,
    		to: {
    			opacity: 0
    		}
    	});
    	this.sprite.clearListeners();
    },

    //-----------------------------------------------------------------------
    doHide: function() {
      // this.sprite.hide(true);
    	this.hide(true);
    },

    //-----------------------------------------------------------------------
    onMouseOver: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1.5,
					y: 1.5
				},
				opacity: 1
			}
    	});
	},

    //-----------------------------------------------------------------------
    onMouseOut: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 1
			}
    	});
	},

    //-----------------------------------------------------------------------
    onClick: function(evt, target) {
      this.changeState()
      // this.stateValue++; if (this.stateValue > 1) this.stateValue = 0;
      // this.sprite.setAttributes({
      //    src: this.stateImages[this.stateValue]
      // }, true);
   },

   changeState: function() {
      // console.log("click")
     this.stateValue++; if (this.stateValue > 1) this.stateValue = 0;
     // changing state of hidden sprites is fine, but don't force show a hidden sprite
      this.sprite.setAttributes({
          src: this.stateImages[this.stateValue]
      }, this.sprite.attr.hidden);
   }


});
