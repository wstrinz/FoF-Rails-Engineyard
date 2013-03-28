/*
 * File: app/view/Field.js
 *
 * Visual representation of a field
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Field', {
//------------------------------------------------------------------------------

	requires: [
		'Biofuels.view.CornPlantSprite',
		'Biofuels.view.CoverCropPlantSprite',
		'Biofuels.view.GrassPlantSprite',
		'Biofuels.view.ToggleSprite'
	],

  //--------------------------------------------------------------------------
	constructor: function (config) {
		this.crop = new Array();
		var farm = Ext.getCmp('Farm')
		if (Biofuels.view.Farm.fieldNum == null) {
			Biofuels.view.Farm.fieldNum = 0
		}
		this.fieldNum = Biofuels.view.Farm.fieldNum
		Biofuels.view.Farm.fieldNum ++
		this.cropType = "none";

    this.fieldHistoryStore = Ext.create('Ext.data.JsonStore', {
      fields: ['year','corn','grass'],
      data: [
        {'year':0, 'corn':1, 'grass':10},
        {'year':1, 'corn':20, 'grass':30},
        {'year':2, 'corn':10, 'grass':50},
        ]
    });

	},

	//--------------------------------------------------------------------------
	attachTo: function(toSurface, atX, atY) {
		var paths = [{
			type: 'rect',
			width: 160,
			height: 120,
			radius: 10,
			x: atX,
			y: atY,
			fill: '#864',
			stroke: '#364',
			'stroke-width': 10
		},
		{
			type: 'image',
			src: 'resources/field_overlay.png',
			x: atX,
			y: atY,
			width: 160,
			height: 120,
		}];

		this.surface = toSurface;
		this.atX = atX;
		this.atY = atY;

		var result = toSurface.add(paths);
		this.sprites = result;
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}

		this.addPlantingIcon(toSurface, atX + 5, atY + 105);
		this.addManagementIcons(toSurface, atX + 55, atY + 105);
	},

	//--------------------------------------------------------------------------
	addManagementIcons: function(surface, atX, atY) {
		var message = {
			event: "setFieldManagement",
			field: this.fieldNum,
			value: true,
		}

		this.fertilizer = Ext.create('Biofuels.view.ToggleSprite');
		// console.log(this.fertilizer.onClick)
		regularclick = this.fertilizer.onClick
		this.fertilizer.onClick = function(){
			regularclick.call(this, arguments);
			message.technique = "fertilizer"
			message.value = (this.stateValue == 1)
			Biofuels.network.send(JSON.stringify(message));
		}
		this.fertilizer.addToSurface(surface, [{
			type: 'image',
			src: 'resources/fertilizer_no_icon.png',
			state: false,
			x: atX,
			y: atY,
			opacity: 1,

			width: 30,
			height: 30,
			zIndex: 1000
		}], 'resources/fertilizer_no_icon.png', 'resources/fertilizer_yes_icon.png');

		this.till = Ext.create('Biofuels.view.ToggleSprite');
		regularclick = this.till.onClick
		this.till.onClick = function(){
			regularclick.call(this, arguments);
			message.technique = "tillage"
			message.value = (this.stateValue == 1)
			Biofuels.network.send(JSON.stringify(message));
		}
		this.till.addToSurface(surface, [{
			type: 'image',
			src: 'resources/till_no_icon.png',
			state: false,
			x: atX + 35,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
		}], 'resources/till_no_icon.png', 'resources/till_yes_icon.png');

		this.pesticide = Ext.create('Biofuels.view.ToggleSprite');
		regularclick = this.pesticide.onClick
		this.pesticide.onClick = function(){
			regularclick.call(this, arguments);
			message.technique = "pesticide"
			message.value = (this.stateValue == 1)
			Biofuels.network.send(JSON.stringify(message));
		}
		this.pesticide.addToSurface(surface, [{
			type: 'image',
			src: 'resources/pesticide_no_icon.png',
			state: false,
			x: atX + 70,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
	 }], 'resources/pesticide_no_icon.png', 'resources/pesticide_yes_icon.png');

	},

	//--------------------------------------------------------------------------
	showManagementIcons: function() {
		this.fertilizer.show();
		this.till.show();
		this.pesticide.show();
	},

	//--------------------------------------------------------------------------
	hideManagementIcons: function() {
		this.fertilizer.hide();
		this.till.hide();
		this.pesticide.hide();
	},

	//--------------------------------------------------------------------------
	showPlantingIcon: function() {
		this.plantingIcon.show();
	},

	//--------------------------------------------------------------------------
	hidePlantingIcon: function() {
		this.plantingIcon.hide();
	},

	//--------------------------------------------------------------------------
	setManagementTechnique: function(technique, state) {
		var targetObj = null;
		if(technique=="fertilizer"){
			var targetObj = this.fertilizer;
		}
		else if(technique=="pesticide"){
			var targetObj = this.pesticide;
		}
		else if(technique=="tillage"){
			var targetObj = this.till;
		}
		// console.log(technique + " " + state + " is " + (targetObj.stateValue == 1))

		if((targetObj.stateValue == 1) != state){
			// console.log("changing")
			targetObj.changeState();
		}
		// console.log(technique + " is " + (targetObj.stateValue == 1))
	},

	//--------------------------------------------------------------------------
	addPlantingIcon: function(surface, atX, atY) {
		var path = [{
			type: 'image',
			src: 'resources/planting_icon.png',
			x: atX,
			y: atY,
			opacity: 1,
			width: 30,
			height: 30,
			zIndex: 1000
		}];

		var result = surface.add(path);
		this.plantingIcon = result[0];

		this.plantingIcon.show(true);
		this.setPlantingIconListeners();

		this.popup = Ext.create('Biofuels.view.PlantPopup');
		this.popup.createForSurface(this.surface, atX, atY);
	},

	//--------------------------------------------------------------------------
	setPlantingIconListeners: function() {
		this.plantingIcon.on({
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut,
			scope: this.plantingIcon
		});

		this.plantingIcon.on({
			click: this.onClick,
			scope: this
		});
	},

	//--------------------------------------------------------------------------
	showPlantingIcon: function() {
		this.plantingIcon.stopAnimation().show(true).animate({
			duration: 100,
			to: {
				opacity: 1
			}
		});

		this.setPlantingIconListeners();
	},

	//--------------------------------------------------------------------------
	hidePlantingIcon: function() {
		this.plantingIcon.stopAnimation().animate({
			duration: 100,
			to: {
				opacity: 0
			},
			callback: this.doHide,
			scope: this.plantingIcon
		});
		this.plantingIcon.clearListeners();
	},

	//--------------------------------------------------------------------------
	doHide: function() {
		this.hide(true);
	},

	//--------------------------------------------------------------------------
	onMouseOver: function(evt, target) {
		this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1.5,
					y: 1.5
				},
				opacity: 1
			}
		});
	},

	//--------------------------------------------------------------------------
	onMouseOut: function(evt, target) {
		this.stopAnimation().animate({
			duration:100,
			to: {
				scale: {
					x: 1,
					y: 1
				},
				opacity: 1
			}
		});
	},

	// cropType: grass, corn, none, cancel
	//--------------------------------------------------------------------------
	onPlantingClickHandler: function(cropType) {
		var msg = {
			event: 'plantField',
			field: this.fieldNum,
			crop: cropType
		};
		Biofuels.network.send(JSON.stringify(msg))
		this.plant(cropType)
		this.fadeCrops()
	},

	//--------------------------------------------------------------------------
  plant: function(cropType){
    if (!cropType.localeCompare("cancel")) {
      return;
    }

    if (this.cropType != cropType) {
      this.removeOldCrop();
      if (!cropType.localeCompare("corn")) {
      	this.plantPatternRows(this.surface, 'Biofuels.view.CornPlantSprite');
      }
      else if (!cropType.localeCompare("grass")) {
        this.plantPatternAlternating(this.surface, 'Biofuels.view.GrassPlantSprite');
      }
      else if (!cropType.localeCompare("cover")) {
        this.plantPatternAlternating(this.surface, 'Biofuels.view.CoverCropPlantSprite');
      }
      this.cropType = cropType;
    }
  },

	//--------------------------------------------------------------------------
	onClick: function(evt, target) {
		this.popup.showPopup(this.onPlantingClickHandler, this);
	},

	//--------------------------------------------------------------------------
	removeOldCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].removeFromSurface();
		}
		this.crop.length = 0;
	},

	//--------------------------------------------------------------------------
	showCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].sprite.show(true);
		}
	},

	//--------------------------------------------------------------------------
	hideCrop: function() {
		for (var index = 0; index < this.crop.length; index++) {
			this.crop[index].sprite.hide(true);
		}
	},

	//--------------------------------------------------------------------------
	plantPatternRows: function(surface, createType) {
		var cx = 0, cy = 0;

		for (var plants = 0; plants < 16; plants++ ) {
			var rAtX = cx + this.atX + 12;
			var rAtY = cy + this.atY - 22;

			var aPlant = Ext.create(createType);
			aPlant.addToSurface(surface, rAtX, rAtY, 1000 + Math.random() * 500);

			cx += 35;
			if (cx >= 120) {
				cx = 0;
				cy += 30;
			}
			this.crop.push(aPlant);
		}
	},

	//--------------------------------------------------------------------------
	plantPatternAlternating: function(surface, createType) {
		var cx = 0, cy = 0;

		for (var plants = 0; plants < 14; plants++ ) {
			var rAtX = cx + this.atX + 12;
			var rAtY = cy + this.atY - 22;

			var aPlant = Ext.create(createType);
			aPlant.addToSurface(surface, rAtX, rAtY, 1200 + Math.random() * 800);

			cx += 35;
			if (cx > 105) {
				cx -= 140;
				cx += (35 / 2);
				cy += 30;
			}
			this.crop.push(aPlant);
		}
	},

	//--------------------------------------------------------------------------
  fadeCrops: function(){
		for (var i = 0; i < this.crop.length; i++) {
			// console.log(this.crop[i])
			this.crop[i].setOpacity(0.4)
			// console.log(this.crop[i])
		};
  },

	//--------------------------------------------------------------------------
  unfadeCrops: function(){
		// console.log("unfading")
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].setOpacity(1)
			// console.log(this.crop[i])
		};
  },

	//--------------------------------------------------------------------------
  growCrops: function(){
		this.unfadeCrops();
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].grow(4000);
		};
  },

	//--------------------------------------------------------------------------
  harvestCrops: function() {
		for (var i = 0; i < this.crop.length; i++) {
			this.crop[i].scheduleHarvest(i*50);
		};
  }

});

