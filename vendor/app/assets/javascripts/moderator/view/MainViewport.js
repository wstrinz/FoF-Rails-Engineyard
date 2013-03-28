/*
 * File: BiofuelsModerator/view/MainViewport.js
 */

Ext.onReady(function() {
  // var createGame = Ext.create('BiofuelsModerator.view.CreateGamePopup');
	var createGame = Ext.create('BiofuelsModerator.view.ConnectWindow');
	createGame.show();
});

//------------------------------------------------------------------------------
Ext.define('BiofuelsModerator.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
        'BiofuelsModerator.view.CreateGamePopup',
    	'BiofuelsModerator.view.NetworkLayer'
    ],

    title: 'My Window',
    autoScroll: true,
    layout: 'fit',

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        BiofuelsModerator.network = Ext.create('BiofuelsModerator.view.NetworkLayer');
		// 192.168.1.101
        BiofuelsModerator.network.openSocket('localhost', 80, '/BiofuelsGame/serverConnect');
        BiofuelsModerator.network.checkModel();


        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				itemId: 'panel1',
				layout: {
					type: 'vbox',
					align: 'center'
				},
				items: [{
                    xtype: 'panel',
                    itemId: 'panel2',
                    height: 480,
                    width: 320,
                    layout: {
                        type: 'absolute'
                    },
                    title: 'Game Settings',
                    titleAlign: 'center',
                    items: [{
						xtype: 'numberfield',
						itemId: 'fieldCount',
						x: 20,
						y: 20,
						value: 2,
						fieldLabel: '# of Fields',
						labelAlign: 'right',
						labelWidth: 125,
						allowBlank: false,
						allowDecimals: false,
						maxValue: 6,
						minValue: 2,
						step: 2,
						width: 225
					},
					{
						xtype: 'checkboxfield',
						itemId: 'contracts',
						x: 20,
						y: 50,
						fieldLabel: 'Contracts Enabled',
						labelAlign: 'right',
						labelWidth: 125
					},
					{
						xtype: 'checkboxfield',
						itemId: 'managementOptions',
						x: 20,
						y: 80,
						fieldLabel: 'Management Options Enabled',
						labelAlign: 'right',
						labelWidth: 125
					},
					{
            xtype: 'button',
            x: 30,
            y: 170,
            scale: 'medium',
            width: 260,
            text: 'Apply Settings!',
            scope: this,
            handler: function() {
              this.applySettingsChange();
            }
          },
          {
						xtype: 'button',
						x: 30,
						y: 285,
						scale: 'medium',
						width: 260,
						text: 'Next Stage',
						scope: this,
						handler: function() {
							this.advanceStage();
						}
					},
					{
						xtype: 'button',
						x: 80,
						y: 220,
						enableToggle: true,
						scale: 'large',
						text: 'Pause'
					},
					{
						xtype: 'button',
						x: 140,
						y: 220,
						enableToggle: true,
						scale: 'large',
						text: 'Final Round'
					}]
				}]
			}]
        });

        me.callParent(arguments);
    },

 	//--------------------------------------------------------------------------
 	applySettingsChange: function() {

 		var container = this.getComponent('panel1').getComponent('panel2');
 		var fieldCount = container.getComponent('fieldCount').value;
 		var contractsOn = container.getComponent('contracts').value;
 		var mgmtOptsOn = container.getComponent('managementOptions').value;
    var roomName = WsConnection.webSocket.gameChannel;

 		var message = {
    		event: 'changeSettings',
        roomName: roomName,
        fieldCount: fieldCount,
        contractsOn: contractsOn,
        mgmtOptsOn: mgmtOptsOn
    	};
      console.log(message);
    	BiofuelsModerator.network.send(JSON.stringify(message));
 	},

  advanceStage: function(){
    var message = {
      event: "advanceStage"
    };

      BiofuelsModerator.network.send(JSON.stringify(message));

  }

});
