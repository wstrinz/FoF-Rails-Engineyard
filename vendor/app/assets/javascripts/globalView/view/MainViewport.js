/*
 * File: BiofuelsGlobal/view/MainViewport.js
 */

Ext.onReady(function() {
	// var createGame = Ext.create('BiofuelsGlobal.view.JoinGamePopup');
  var createGame = Ext.create('BiofuelsGlobal.view.ConnectWindow');
	createGame.show();
});

//------------------------------------------------------------------------------
Ext.define('BiofuelsGlobal.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
        'BiofuelsGlobal.view.JoinGamePopup',
    	'BiofuelsGlobal.view.NetworkLayer'
    ],

    title: 'My Window',
    autoScroll: true,
    width: 800,
    height: 600,
//    layout: 'fit',

	//--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = BiofuelsGlobal;

        app.network.registerListener('farmerList', this.updateFarmerList, this);
    },

	//--------------------------------------------------------------------------
    updateFarmerList: function(json) {
      // console.log("updating farmer list");
      // console.log(json)

    	this.farmerListStore.loadRawData(json.Farmers, false);

		// FIXME: not the best place for this...needs to happen after login
    	var roomName = this.getComponent('panel1').getComponent('roomName');
    	var password = this.getComponent('panel1').getComponent('password');

    	roomName.setValue(BiofuelsGlobal.roomInformation.roomName);
    	password.setValue(BiofuelsGlobal.roomInformation.password);
    },

	//--------------------------------------------------------------------------
    configFarmerStore: function() {

    	this.farmerListStore = Ext.create('Ext.data.Store', {
    		storeId:'farmerListStore',
			fields:['name','ready'],
			proxy: {
				type: 'memory',
				reader: {
					type: 'json',
					root: 'farmers'
				}
			}
		});
	},

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        BiofuelsGlobal.network = Ext.create('BiofuelsGlobal.view.NetworkLayer');
		// 192.168.1.101
        BiofuelsGlobal.network.openSocket('localhost', 8080, '/BiofuelsGame/serverConnect');
        BiofuelsGlobal.network.checkModel();


        this.initNetworkEvents();

        this.configFarmerStore();

        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				itemId: 'panel1',
				width: 800,
				height: 600,
				layout: {
					type: 'absolute'
				},
				title: 'BioFarmerVille',
				titleAlign: 'center',
				items: [{
					xtype: 'gridpanel',
					itemId: 'farmerList',
					store:'farmerListStore',
					x: 10,
					y: 10,
					height: 550,
					width: 170,
					title: 'Farmers',
					titleAlign: 'center',
					columns: [{
						xtype: 'gridcolumn',
						width: 120,
						resizable: false,
						dataIndex: 'name',
						hideable: false,
						text: 'Name'
					},
					{
						xtype: 'booleancolumn',
						width: 48,
						resizable: false,
						dataIndex: 'ready',
						hideable: false,
						text: 'Ready',
						falseText: 'no',
						trueText: 'yes'
					}],
					viewConfig: {
					}
				},
				{
          xtype: 'panel',
          id: 'Round Progress',
          x: 190,
          y: 10,
          height: 500,
          width: 440,
          title: 'Round Progress',
          titleAlign: 'center',
          layout: 'fit',

          items: [
          {
            xtype: 'textarea',
            id: 'progressArea',
            fieldLabel: '',
            autoScroll: true,
          }]
        },
    //     {
				// 	xtype: 'button',
    //       x: 100,
    //       y: 100,
    //       width: 160,
    //       scale: 'medium',
    //       text: 'Get Farmers',
    //       scope: this,
    //       handler: function() {
    //         var msg = {
    //          event: 'getFarmerList',
    //         };
    //         BiofuelsGlobal.network.send(JSON.stringify(msg))
    //       }
				// },
				{
					xtype: 'textfield',
					itemId: 'roomName',
					x: 630,
					y: 10,
					width: 160,
					fieldLabel: 'Room',
					labelAlign: 'right',
					labelWidth: 80
				},
				{
					xtype: 'textfield',
					itemId: 'password',
					x: 630,
					y: 40,
					width: 160,
					fieldLabel: 'Password',
					labelAlign: 'right',
					labelWidth: 80
				},
        {
          xtype: 'button',
          x: 720,
          y: 75,
          text: 'Refresh',
          handler: function (){
            BiofuelsGlobal.network.send(JSON.stringify({event:'getFarmerList'}))
          }
        },
        {
          xtype: 'button',
          x: 720,
          y: 100,
          text: 'Clear Log',
          handler: function (){
            Ext.getCmp('progressArea').setValue('');
          }
        },
        ]
			}]
        });

        me.callParent(arguments);
    }

});
