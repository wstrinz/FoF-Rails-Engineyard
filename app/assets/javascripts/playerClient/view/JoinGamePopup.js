/*
 * File: Biofuels/view/JoinGamePopup.js
 */

//
// Sends Events:
//		event: 'validateUserName'
//				roomName: 'name', password: 'pswd', userName: 'name'
//
// Receives Events:
//
//		event: 'validateUserName'
//				roomResult: 'true/false', needsPassword: 'true/false',
//				passwordResult: 'true/false', userNameResult: 'true/false'
//
//		event: 'joinRoom'
//				result: 'true/false'
//				errorMessage: 'errorMsg'

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.JoinGamePopup', {
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
    title: 'Join A Biofuels Game',

    //--------------------------------------------------------------------------
    initNetworkEvents: function() {
    	var app = Biofuels;

        app.network.registerListener('validateUserName', this.manageLeds, this);
        app.network.registerListener('joinRoom', this.serverJoinRoomResult, this);
    },

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        this.initNetworkEvents();

        Ext.applyIf(me, {
            items: [{
				xtype: 'textfield',
				itemId: 'roomName',
				x: 20,
				y: 30,
				fieldLabel: 'Room Name',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				allowBlank: false,
				blankText: 'Required',
				enforceMaxLength: true,
        hasfocus:true,
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
				src: 'resources/redLed.png'
			},
			{
				xtype: 'textfield',
				itemId: 'password',
				x: 20,
				y: 60,
				disabled: true,
				fieldLabel: 'Password',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				enforceMaxLength: true,
				maxLength: 16,
				validator: Ext.bind(this.dirtyChange, this)
			},
			{
				xtype: 'image',
				itemId: 'passwordLed',
				x: 305,
				y: 62,
				hidden: true,
				height: 20,
				width: 20,
				src: 'resources/redLed.png'
			},
			{
				xtype: 'textfield',
				itemId: 'userName',
				x: 20,
				y: 100,
				fieldLabel: 'Farmer Name',
				labelPad: 5,
				labelWidth: 100,
				labelAlign: 'right',
				enforceMaxLength: true,
				maxLength: 16,
				validator: Ext.bind(this.dirtyChange, this)
			},
			{
				xtype: 'image',
				itemId: 'userNameLed',
				x: 305,
				y: 102,
				height: 20,
				width: 20,
				src: 'resources/redLed.png'
			},
			{
				xtype: 'button',
				x: 100,
				y: 150,
				width: 160,
				scale: 'medium',
				text: 'Join Game',
				enabled: false,
				scope: this,
				handler: function() {
					this.tryJoinRoom();
				}
			}]
        });

        me.callParent(arguments);
    },

    //--------------------------------------------------------------------------
    dirtyChange: function(value) {

    	var roomName = this.getComponent('roomName').value;
    	var password = this.getComponent('password').value;
    	var userName = this.getComponent('userName').value;

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	password = (typeof password == 'undefined' || password.length < 1) ? '' : password;
    	userName = (typeof userName == 'undefined' || userName.length < 1) ? '' : userName;

    	var app = Biofuels;
 		var output = {
 			event: 'validateUserName',
 			roomName: roomName,
 			password: password,
 			userName: userName
 		};
    	app.network.send(JSON.stringify(output));

    	return true;
    },

    //--------------------------------------------------------------------------
    manageLeds: function(json) {

    	// -- Room
    	var led = this.getComponent('roomLed');
      if (led == null)
        return
    	var roomMatched = json.roomResult;
    	if (roomMatched) {
    		led.setSrc('resources/greenLed.png');
    	}
    	else {
    		led.setSrc('resources/redLed.png');
    	}

    	// -- Password
    	led = this.getComponent('passwordLed');
    	password = this.getComponent('password');
    	var passwordResult = json.passwordResult;
    	if (!roomMatched || !json.needsPassword) {
    		password.setDisabled(true);
    		led.setVisible(false);
    	}
    	else {
    		password.setDisabled(false);
    		led.setVisible(true);
    	}

    	if (passwordResult && roomMatched) {
    		led.setSrc('resources/greenLed.png');
    	}
    	else {
    		led.setSrc('resources/redLed.png');
    	}

    	// -- User Name
    	led = this.getComponent('userNameLed');
    	if (json.userNameResult) {
    		led.setSrc('resources/greenLed.png');
    	}
    	else {
    		led.setSrc('resources/redLed.png');
    	}
    },

    // Asks the server to try to join the given room
    //--------------------------------------------------------------------------
    tryJoinRoom: function() {

    	var roomName = this.getComponent('roomName').value;
    	var password = this.getComponent('password').value;
    	var userName = this.getComponent('userName').value;

    	if (typeof roomName == 'undefined' || typeof userName == 'undefined') {

    		Ext.MessageBox.alert('Data Required', 'A valid room name and farmer name are required.');
    		var roomName = this.getComponent('roomName').focus(true,true);
    		return;
    	}

    	roomName = (typeof roomName == 'undefined' || roomName.length < 1) ? '' : roomName;
    	password = (typeof password == 'undefined' || password.length < 1) ? '' : password;
    	userName = (typeof userName == 'undefined' || userName.length < 1) ? '' : userName;

		// derp, save here for display...
		Biofuels.farmerName = userName;

    	var message = {
    		event: 'joinRoom',
    		roomName: roomName,
    		password: password,
    		userName: userName
    	};
    	// console.log('Trying to join the room!');
    	WsConnection.webSocket.gameChannel = roomName
    	Biofuels.network.send(JSON.stringify(message));
    },

    //--------------------------------------------------------------------------
    serverJoinRoomResult: function(json) {

    	// console.log('server join room result called!');
     	if (json.result) {
        Biofuels.network.subscribe(json.roomName);

        var message = {
          event: 'loadFromServer',
          roomName: json.roomName
        };

        Biofuels.network.send(JSON.stringify(message));

        var msg = {
          event: "getFarmerHistory"
        }
        Biofuels.network.send(JSON.stringify(msg));

        var msg = {
          event: "getFarmHistory"
        }
        Biofuels.network.send(JSON.stringify(msg));
     		// Ext.ComponentQuery.query('Farm')[0].loadGameInfo();
        this.close();
     	}
     	else {
     		Ext.MessageBox.alert('Join Room Error', json.errorMessage);
     	}
    }

});
