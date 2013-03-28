/*
 * File: app/view/FieldData.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.SeasonData', {
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
	constructor: function (config) {
	}

});


//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FieldData', {
//------------------------------------------------------------------------------

	// TEMP: Whips up some FAKE data
    //--------------------------------------------------------------------------
	constructor: function (config) {
		this.seasons = new Array();

		// var soilHealth = 0;
		// for (var index = 0; index < 3; index++) {

		// 	var rand = Math.floor(Math.random() * 3);

		// 	var useFertilizer = false;
		// 	if (Math.floor(Math.random() * 3) >= 1) {
		// 		useFertilizer = true;
		// 	};
		// 	var useTill = false;
		// 	if (Math.floor(Math.random() * 2) >= 1) {
		// 		useTill = true;
		// 	};

		// 	if (rand == 0) {
		// 		this.seasons.push({
		// 			crop: 'corn',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth -= 2;

		// 		this.seasons.push({
		// 			crop: 'corn',
		// 			soil: soilHealth,
		// 			fertilizer: useFertilizer,
		// 			till: useTill
		// 		});
		// 		soilHealth -= 2; if (useFertilizer) soilHealth -= 1;

		// 		this.seasons.push({
		// 			crop: 'corn',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth -= 2;

		// 		this.seasons.push({
		// 			crop: 'corn',
		// 			soil: soilHealth,
		// 			fertilizer: useFertilizer,
		// 			till: useTill
		// 		});
		// 		soilHealth -= 2; if (useFertilizer) soilHealth -= 1;
		// 	}
		// 	else if (rand == 1) {
		// 		this.seasons.push({
		// 			crop: 'switchgrass',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth += 1;

		// 		this.seasons.push({
		// 			crop: 'switchgrass',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth += 2;

		// 		this.seasons.push({
		// 			crop: 'switchgrass',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth += 2;

		// 		this.seasons.push({
		// 			crop: 'switchgrass',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth += 1;
		// 	}
		// 	else {
		// 		this.seasons.push({
		// 			crop: 'coverCrop',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: false
		// 		});
		// 		soilHealth += 1;

		// 		this.seasons.push({
		// 			crop: 'coverCrop',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: false
		// 		});
		// 		soilHealth += 1;

		// 		this.seasons.push({
		// 			crop: 'corn',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth -= 2;

		// 		this.seasons.push({
		// 			crop: 'corn',
		// 			soil: soilHealth,
		// 			fertilizer: false,
		// 			till: useTill
		// 		});
		// 		soilHealth -= 2;
		// 	}
		// }
	},

    //--------------------------------------------------------------------------
	getNumSeasons: function() {
		return this.seasons.length;
	},

  loadFromServer: function(serverSeasons){
    this.seasons = new Array();
    for (var i = 0; i < serverSeasons.length; i++) {
      // console.log(serverSeasons[i].crop.toLowerCase())
      var serverCrop = serverSeasons[i].crop.toLowerCase()
      if(serverCrop == "grass"){
        serverCrop = "switchgrass"
      }
      else if(serverCrop == "cover"){
        serverCrop = "coverCrop"
      }
      this.seasons.push({
        crop: serverCrop,
        soil: serverSeasons[i].SOM,
        fertilizer: serverSeasons[i].fertilizer,
        till: serverSeasons[i].till,
      })
    };
    // console.log(this.seasons)
  }

});

