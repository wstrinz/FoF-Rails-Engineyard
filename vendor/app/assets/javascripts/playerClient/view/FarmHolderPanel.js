/*
 * File: app/view/FarmHolderPanel.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FarmHolderPanel', {
//------------------------------------------------------------------------------

	extend: 'Ext.panel.Panel',
    alias: 'widget.farmHolderPanel',

    requires: [
		'Biofuels.view.Field',
		'Biofuels.view.Farm',
		'Biofuels.view.FieldOverlay',
		'Biofuels.view.FieldData'
	],

    frame: false,
    title: 'Your Farm',
    titleAlign: 'center',
    id: 'holderPanel',

 /*   tools:[{
		type:'help',
		qtip: 'Add a field!',
		handler: function(event, target, owner, tool) {

			// UGH: FIXME: seems like there would be an easier way to do this?
			// Owner of this tool is the panel header...
			// So go up from the panel header which gets us to the panel itself...
			// then go back down to get the Farm component on the panel...
//			owner.up().child('Farm').createFields(2);
		}
    }],
   */

   	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;

        app.network.registerListener('joinRoom', this.joinedRoom, this);
        // app.network.registerListener('getFarmInfo', this.loadFarmInfo, this);
    },

    //--------------------------------------------------------------------------
    joinedRoom: function(json) {
      this.userName = json.userName;
    	this.setTitle(json.userName + "'s Farm");
    },

    loadFarmInfo: function(json){
      this.setTitle(this.userName + "'s Farm ($" + json.capital + ")")
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        this.initNetworkEvents();

        Ext.applyIf(me, {
            items: [{
                xtype: 'Farm'
            }]
        });

        me.callParent(arguments);
    }

});
