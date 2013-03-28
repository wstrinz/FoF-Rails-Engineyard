/*
 * File: app/view/ProgressPanel.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.ProgressPanel', {
//------------------------------------------------------------------------------

  extend: 'Ext.panel.Panel',
  alias: 'widget.progressPanel',
  requires: [
      'Biofuels.view.RoundStageBar',
      'Biofuels.view.RoundStageMarker',
      'Ext.util.TaskManager'
  ],

  title: 'Round Stage',
  titleAlign: 'center',
  viewbox: true,

  //--------------------------------------------------------------------------
  initNetworkEvents: function() {
      var app = Biofuels;

      app.network.registerListener('changeSettings', this.changeSettings, this);
      app.network.registerListener('advanceStage', this.advanceStage, this);
  },

  //--------------------------------------------------------------------------
  initComponent: function() {
      var me = this;

      this.initNetworkEvents();

      Ext.applyIf(me, {
          items: [{
              xtype: 'draw',
              width: 500,
              height: 80,
              layout: 'absolute',
              items: [{
                  type: 'rect',
                  width: 500,
                  height: 80,
                  fill: '#163020'
              }]
          }]
      });

      me.callParent(arguments);
  },

  // TODO - FIXME: stageBar can't be created until some time after initComponent
  //  has created the draw component (like after some layout process happens?)
  //  So it ended up here as a workaround...since changeSettings typically got called
  //  quite a bit after the layout so the needed drawComp.surface parm was properly set
  //  up by then....
  //--------------------------------------------------------------------------
  changeSettings: function(json) {

      // FIXME: lame workaround for drawComp.surface not being ready to use in
      //    initComponent above...
      if (!this.stageBar) {
          var drawComp = this.child('draw');

          this.stageBar = Ext.create('Biofuels.view.RoundStageBar');
          this.stageBar.addToSurface(drawComp.surface, 60, 35, 380);
      }

      // TEMP - FIXME: labels/stages should probably just be sent by the server??
      // create array:     [{label: 'someLabel', active: true, checked: false},
      //                    {label: 'nextLabel', active: false, checked: false},
      //                      ...]
      var markerData = new Array();

      if (json.contractsOn) {
          markerData.push({label: 'Contract', active: true, checked: false});
          markerData.push({label: 'Plant', active: false, checked: false});
      }
      else{
          markerData.push({label: 'Plant', active: true, checked: false});
      }

      if (json.mgmtOptsOn) {
          markerData.push({label: 'Manage', active: false, checked: false});
      }
      markerData.push({label: 'Grow', active: false, checked: false});
      markerData.push({label: 'Year End', active: false, checked: false});


      this.stageBar.setMarkers(markerData);
  },

  // TODO - FIXME: the year data could maybe be packed into the MarkerData above?
  //--------------------------------------------------------------------------
  setYear: function(year) {

    this.stageBar.setYear(year);
  },

  advanceStage: function(json){
    var prevMarkers = this.stageBar.markers //.markerData
    var newMarkers = new Array();
    this.setYear(json.year)
    for (var i = 0; i < prevMarkers.length; i++) {
      var thisMarker = prevMarkers[i]
      // thisMarker.label =
      if(i==json.stageNumber){

        thisMarker.active = true;
        thisMarker.checked = false;
      }
      else{
        thisMarker.active = false;
        if(i > json.stageNumber)
          thisMarker.checked = false;
        else
          thisMarker.checked = true;
      }
      newMarkers.push(thisMarker)
    };
    this.stageBar.setMarkers(newMarkers)
    // this.stageBar.setStage(json.stageNumber);
  }

});

