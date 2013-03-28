/*
 * File: BiofuelsModerator/view/CreateGamePopup.js
 */

//
// Sends Events:
//		event: 'validateRoom'
//				roomName: 'name'
//
//		event: 'createRoom'
//				roomName: 'name', password: 'pswd', playerCount: '1'
//
// Receives Events:
//
//		event: 'validateRoom'
//				result: 'true/false'
//
//		event: 'createRoom'
//				result: 'true/false'
//				errorMessage: 'errorMsg'

//------------------------------------------------------------------------------
Ext.define('BiofuelsModerator.view.CreateGamePopup', {
//------------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    requires: [
    	'Ext.window.MessageBox'
    ],

    height: 230,
    width: 360,
    layout: {
        type: 'absolute'
    },
    closable: false,
    modal: true,
    title: 'Biofuels Game Creation',

    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = BiofuelsModerator;

        app.network.registerListener('validateRoom', this.manageLed, this);
        app.network.registerListener('createRoom', this.serverCreateRoomResult, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        this.initNetworkEvents();

        Ext.applyIf(me, {
            items: [{
				xtype: 'textfield',
				itemId: 'name',
				x: 20,
				y: 30,
				fieldLabel: 'Room Name',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				allowBlank: false,
				blankText: 'Required',
				enforceMaxLength: true,
				maxLength: 16,
				validator: Ext.bind(this.dirtyChange, this)
			},
			{
				xtype: 'image',
				itemId: 'roomLed',
				x: 305,
				y: 32,
				height: 20,
				width: 20,
				src: 'app/resources/redLed.png'
			},
			{
				xtype: 'textfield',
				itemId: 'password',
				x: 20,
				y: 60,
				fieldLabel: 'Password',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				enforceMaxLength: true,
				maxLength: 16
			},
			{
				xtype: 'numberfield',
				itemId: 'count',
				x: 20,
				y: 110,
				fieldLabel: 'Max Players',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				allowDecimals: false,
				decimalPrecision: 0,
				maxValue: 48,
				minValue: 1,
				value: 8,
				width: 160
			},
			{
				xtype: 'button',
				x: 100,
				y: 150,
				width: 160,
				scale: 'medium',
				text: 'Create Game',
				scope: this,
				handler: function() {
					this.tryCreateRoom();
				}
			}]
        });

        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    dirtyChange: function(value) {

    	var app = BiofuelsModerator;
 		var output = {
 			event: 'validateRoom',
 			roomName: value
 		};
    	app.network.send(JSON.stringify(output));

    	return true;
    },

    //--------------------------------------------------------------------------
    manageLed: function(json) {

      var led = this.getComponent('roomLed');
      if ((led != null) && json.result) {
    		led.setSrc('app/resources/greenLed.png');
    	}
    	else {
    		led.setSrc('app/resources/redLed.png');
    	}
    },

    // Asks the server to try to create the given room
    //--------------------------------------------------------------------------
    tryCreateRoom: function() {

    	var roomName = this.getComponent('name').value;
    	var password = this.getComponent('password').value;
    	var playerCount = this.getComponent('count').value;

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	password = (typeof password == 'undefined' || password.length < 1) ? '' : password;

    	if (typeof roomName == 'undefined' || roomName.length < 1) {

    		Ext.MessageBox.alert('Data Required', 'A unique room name is required. ' +
    			'The room name also cannot be left empty.');
    		var roomName = this.getComponent('name').focus(true,true);
    		return;
    	}

    	var message = {
    		event: 'createRoom',
    		roomName: roomName,
    		password: password,
    		playerCount: playerCount
    	};
      WsConnection.webSocket.gameChannel = roomName;
      BiofuelsModerator.network.send(JSON.stringify(message));
    },

    //--------------------------------------------------------------------------
    serverCreateRoomResult: function(json) {

     	if (json.result) {
     		this.close();
     	}
     	else {
     		Ext.MessageBox.alert('Create Room Error', json.errorMessage);
     	}
    }

});
