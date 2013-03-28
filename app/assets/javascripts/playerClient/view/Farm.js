/*
 * File: app/view/Farm.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.Farm', {
//------------------------------------------------------------------------------

    extend: 'Ext.draw.Component',
    alias: 'widget.Farm',
    renderTo: Ext.getBody(),

    // Some basic constants
	//--------------------------------------------------------------------------
    FARM_WIDTH: 445,
	FARM_HEIGHT: 600,

	MAX_FIELDS: 6,
	MAX_FIELDS_PER_ROW: 2,

	FIELD_START_X: 40,
	FIELD_START_Y: 30,

	FIELD_SPACE_X: 200,
	FIELD_SPACE_Y: 160,

	HEALTH_ICON_SIZE: 50,

	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;

        app.network.registerListener('changeSettings', this.changeSettings, this);
        app.network.registerListener('advanceStage', this.advanceStage, this);
        app.network.registerListener('loadFromServer', this.loadFromServer, this);
        app.network.registerListener('getFarmInfo', this.loadFarmInfo, this);
        app.network.registerListener('getFarmHistory', this.refreshHistory, this);
        app.network.registerListener('getLatestFieldHistory', this.updateFieldHistory, this);
    },

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        this.store1 = Ext.create('Ext.data.JsonStore', {
            storeId: 'loadStore',
            fields: ['plantStage'],
            data: [
              {'plantStage':false}
            ]
        });

        this.initNetworkEvents();

        // specifies the location as the center of the icon
        // NOTE: here because relies on this.vars being fully init'd?
        this.HEALTH_ICON_X = this.FARM_WIDTH / 2;
        this.HEALTH_ICON_Y = this.FARM_HEIGHT - 105;

        Ext.applyIf(me, {
            items: [{
				type: 'rect',
				width: this.FARM_WIDTH,
				height: this.FARM_HEIGHT,
				fill: '#385'
			}],
		});

        me.callParent(arguments);

        this.fields = new Array();
    },

	//--------------------------------------------------------------------------
    changeSettings: function(json) {

    	var count = json.fieldCount - this.fields.length;
		this.createFields(count);

		// TODO: proper management icon state management
    // console.log("farmSettings " + json.mgmtOptsOn)
		if (json.mgmtOptsOn) {
			this.showFieldManagementIcons();
		}
		else {
			this.hideFieldManagementIcons();
		}
    },

	//--------------------------------------------------------------------------
	createFields: function(num) {

		var count = num;

		if (this.fields.length <= 0) {
			this.addFarmHealthIcon(this.HEALTH_ICON_X, this.HEALTH_ICON_Y,
									this.HEALTH_ICON_SIZE);
		}

		if (this.fields.length < this.MAX_FIELDS) {
			if (this.fields.length + count > this.MAX_FIELDS) {
				count = this.MAX_FIELDS - this.fields.length;
			}

			var atX = 0;
			var atY = 0;
			// bah, space out
			for (var index = 0; index < this.fields.length; index++ ) {
				atX++;
				if (atX >= this.MAX_FIELDS_PER_ROW) {
					atX = 0;
					atY++;
				}
			}

			for (var index = 0; index < count; index++ )
			{
				var field = this.addField(atX * this.FIELD_SPACE_X + this.FIELD_START_X,
										atY * this.FIELD_SPACE_Y + this.FIELD_START_Y);
				atX++;
				if (atX >= this.MAX_FIELDS_PER_ROW) {
					atX = 0;
					atY++;
				}
			}
		}
    },

  //Load farm data from server
  loadFromServer: function(json){
    var newFields = json.fields //.substring(1, json.fields.length - 1).split(",");
    // var arr = Ext.decode(newFields)
    for(var i = 0;i < newFields.length; i++){
      var crop = newFields[i].crop.toLowerCase();
      if (this.fields.length > i) {
        this.fields[i].fieldVisuals.plant(crop);
        this.fields[i].fieldVisuals.setManagementTechnique("pesticide", newFields[i].pesticide)
        this.fields[i].fieldVisuals.setManagementTechnique("fertilizer", newFields[i].fertilizer)
        this.fields[i].fieldVisuals.setManagementTechnique("tillage", newFields[i].tillage)
      }
      else{
        this.createFields(1);
        this.fields[i].fieldVisuals.plant(crop);
      }
    }
  },

  advanceStage: function(json){
    if(json.stageName == "Plant"){
      //reload field data for testing purposes
      this.grown = false;
      this.wrappedup = false;
      for (var i = 0; i < this.fields.length; i++) {

        this.fields[i].fieldVisuals.showPlantingIcon();
      };

      // this.store1.getAt(0).set('plantStage',true)
    }
    else{
      for (var i = 0; i < this.fields.length; i++) {
        this.fields[i].fieldVisuals.hidePlantingIcon();
      };
    }

    if(json.stageName == "Manage"){
      this.showFieldManagementIcons()
    }
    else{
      this.hideFieldManagementIcons()
      // for (var i = 0; i < this.fields.length; i++) {
      //   this.fields[i].fieldVisuals.hideManagementIcons()
      // };
    }

    if(json.stageName == "Grow"){
      if (!this.grown){
            for (var i = 0; i < this.fields.length; i++) {
              // this.fields[i].fieldVisuals.unfadeCrops();
              this.fields[i].fieldVisuals.growCrops();
            };

          }
          this.grown = true;
        }

    if(json.stageName == "Round Wrap Up"){
      if(!this.wrappedup){
            var msg = {
              event: "getFarmInfo"
            }
            Biofuels.network.send(JSON.stringify(msg));

            /*var msg = {
              event: "getFarmHistory"
            }*/

            var msg = {
              event: "getLatestFieldHistory",
            }
            Biofuels.network.send(JSON.stringify(msg));

            /*var msg = {
              event: "getFarmerHistory"
            }*/
            var msg = {
              event: "getLatestFarmerHistory"
            }
            Biofuels.network.send(JSON.stringify(msg));

            for (var i = 0; i < this.fields.length; i++) {
              this.fields[i].fieldVisuals.harvestCrops();
            };
            this.wrappedup = true;
          }
    }
  },


  loadFarmInfo: function(json){
    this.phosphorous = json.phosphorous
  },

  updateFieldHistory: function(json){
    for (var i = 0; i < json.fields.length; i++) {
      // yieldPanelString += "<p> Field " + i + "</p>"
      var thisYear = json.fields[i]
      var fieldsStore = this.fields[i].fieldChart.fieldHistoryStore

      // console.log(fieldsStore)

        if (thisYear.crop == "CORN"){
           var dataPoint = {
              "year": thisYear.year,
              "corn": thisYear.yield,
           }
        }
        else if(thisYear.crop == "GRASS"){
          var dataPoint = {
              "year": thisYear.year,
              "grass": thisYear.yield,
          }
        }
        else{
          var dataPoint = {
              "year": thisYear.year,
          }
        }
         fieldsStore.loadRawData(dataPoint, true)
     };
  },

  refreshHistory: function(json){
    var yieldPanel = Ext.getCmp("yieldsPanel")
    var logPanel = Ext.getCmp("LogPanel")
    var yieldPanelString = ""

    // var histStore1 = Ext.data.StoreManager.lookup('historyStore')
    // histStore1.removeAll();
    // // histStore1.loadData([],false);
    // var histStore2 = Ext.data.StoreManager.lookup('historyStore2')
    // histStore2.removeAll();
    // // histStore2.loadData([],false);

    // var histStores = [histStore1, histStore2];


    for (var i = 0; i < json.fields.length; i++) {
      yieldPanelString += "<p> Field " + i + "</p>"
      var thisFieldHistory = json.fields[i]
      var fieldsStore = this.fields[i].fieldChart.fieldHistoryStore
      fieldsStore.removeAll();
      // console.log(fieldsStore)
      for (var j = 0; j < thisFieldHistory.length; j++) {
        var thisYear = thisFieldHistory[j]

        if (thisYear.crop == "CORN"){
           var dataPoint = {
              "year": j,
              "corn": thisYear.yield,
           }
        }
        else if(thisYear.crop == "GRASS"){
          var dataPoint = {
              "year": j,
              "grass": thisYear.yield,
          }
        }
        else{
          var dataPoint = {
              "year": j,
          }
        }
         fieldsStore.loadRawData(dataPoint, true)
       };
       yieldPanelString += "\n"
    };

    yieldPanelString += "<p> Phosphorous: " + this.phosphorous + "</p>"
    for (var i = 0; i < json.fields.length; i++) {
      yieldPanelString += "<p> Field " + i + "</p>"
      var thisFieldHistory = json.fields[i]
      for (var j = 0; j < thisFieldHistory.length; j++) {
         var thisYear = thisFieldHistory[j]
         yieldPanelString += "<p> Crop: " + thisYear.crop + "\t Yield: " + thisYear.yield +
         "\t SOC: " + thisYear.SOM + "</p>"
       };
       yieldPanelString += "\n"
    };
    // console.log(logPanel)
    logPanel.update(yieldPanelString)

    for (var i = this.fields.length - 1; i >= 0; i--) {
      this.fields[i].fieldData.loadFromServer(json.fields[i]);
    };



  },

    // Create a new field object (visual representation + underlying data) then
    //	attach it to the farm draw surface
	//--------------------------------------------------------------------------
	addField: function(atX, atY) {

		var aField = {
			fieldVisuals: Ext.create('Biofuels.view.Field'),
			fieldData: Ext.create('Biofuels.view.FieldData'),
			fieldChart: Ext.create('Biofuels.view.FieldOverlay')
		};
		aField.fieldVisuals.attachTo(this.surface, atX, atY);
		aField.fieldChart.attachTo(aField.fieldData, this.surface, atX, atY);

		this.fields.push(aField);

		return aField;
	},

	// place centered at atX, atY
	//-----------------------------------------------------------------------
    addFarmHealthIcon: function(atX, atY, radius) {

    	var path = [{
			type: 'image',
			src: 'resources/field_health_icon.png',
			x: atX - radius / 2,
			y: atY - radius / 2,
			opacity: 0.5,
			width: radius,
			height: radius,
			zIndex: 1000
    	}];

  		var result = this.surface.add(path);
		for (var index = 0; index < result.length; index++) {
			result[index].show(true);
		}

		// Hrm, I guess must add the event on the topmost sprite element?
		result[0].on({
				mouseover: this.onMouseOver,
				mouseout: this.onMouseOut,
				scope: result[0]
		});
		result[0].on({
				click: this.onClick,
				scope: this
		});

		this.healthIcon = result[0];
    },

    //-----------------------------------------------------------------------
    onMouseOver: function(evt, target) {

    	this.stopAnimation().animate({
			duration: 100,
			to: {
				scale: {
					x: 1.1,
					y: 1.1
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
				opacity: 0.5
			}
    	});
	},

    //-----------------------------------------------------------------------
    onClick: function(evt, target) {

    	var years = this.getNumberSeasons();

    	if (!this.popupWindow) {
    		this.hideCrops();
    		this.hideFieldManagementIcons();
    		this.popupWindow = Ext.create('Biofuels.view.FieldHealthPopup');
    		this.popupWindow.setSliderCallback(years, this.onDrag, this.onChange, this);
    		this.popupWindow.setCheckboxCallbacks(this.soilHealthChanged,
    							this.yieldsChanged,
    							this.showCropsChanged, this);

    		this.popupWindow.on({
				close: function(window, eOpts) {
					this.showCrops();
					this.showFieldManagementIcons();
					this.popupWindow = null;
					this.healthIcon.show(true);
					this.hideFieldHealth();
				},
				scope: this
    		});

    		this.healthIcon.hide();
    		this.popupWindow.show();

    		var x = target.getX();
    		var y = target.getY();

    		x -= (this.popupWindow.getWidth() * 0.5);
    		y -= (this.popupWindow.getHeight() * 0.5);
    		this.popupWindow.setPosition(x, y);
    		this.setFieldSeason(0);
    	}
	},

    //-----------------------------------------------------------------------
	soilHealthChanged: function(self, newValue, oldValue, eOpts) {

		for (var index = 0; index < this.fields.length; index++ ) {
			if (newValue == true) {
				this.fields[index].fieldChart.showSoilHealth();
			}
			else {
				this.fields[index].fieldChart.hideSoilHealth();
			}
		}
	},

    //-----------------------------------------------------------------------
	yieldsChanged: function(self, newValue, oldValue, eOpts) {
		for (var index = 0; index < this.fields.length; index++ ) {
			if (newValue == true) {
				this.fields[index].fieldChart.showYields();
			}
			else {
				this.fields[index].fieldChart.hideYields();
			}
		}
	},

    //-----------------------------------------------------------------------
    showCropsChanged: function(self, newValue, oldValue, eOpts) {
		for (var index = 0; index < this.fields.length; index++ ) {
			if (newValue == true) {
				this.fields[index].fieldChart.showCrop();
			}
			else {
				this.fields[index].fieldChart.hideCrop();
			}
		}
    },

    //-----------------------------------------------------------------------
	showFieldHealth: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
//			this.fields[index].fieldVisuals.showUnderlay();
		}
	},

	//-----------------------------------------------------------------------
	hideFieldHealth: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			this.fields[index].fieldChart.hide();
		}
	},

	//-----------------------------------------------------------------------
	showCrops: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			var field = this.fields[index].fieldVisuals;
			field.showPlantingIcon();
			field.showCrop();
		}
	},

	//-----------------------------------------------------------------------
	hideCrops: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			var field = this.fields[index].fieldVisuals;
			field.hidePlantingIcon();
			field.hideCrop();
		}
	},

	//-----------------------------------------------------------------------
	showFieldManagementIcons: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			var field = this.fields[index].fieldVisuals;
			field.showManagementIcons();
		}
	},

	//-----------------------------------------------------------------------
	hideFieldManagementIcons: function() {

		for (var index = 0; index < this.fields.length; index++ ) {
			var field = this.fields[index].fieldVisuals;
			field.hideManagementIcons();
		}
	},

	//-----------------------------------------------------------------------
	onDrag: function(slider) {
		this.setFieldSeason(slider.getValue());
	},
	onChange: function(slider) {
		this.setFieldSeason(slider.getValue());
	},

	//-----------------------------------------------------------------------
	getNumberSeasons: function() {

		if (this.fields.length <= 0) {
			return 1;
		}
		else {
			return this.fields[0].fieldData.getNumSeasons();
		}
	},

	//-----------------------------------------------------------------------
	setFieldSeason: function(newYear) {

		for (var index = 0; index < this.fields.length; index++ ) {
			this.fields[index].fieldChart.setCurrentSeason(newYear);
		}
	}

});
