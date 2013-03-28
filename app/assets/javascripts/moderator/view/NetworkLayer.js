/*
 * File: NetworkLayer.js
 */

 // TODO: would be nice if this could be shared between: player, moderator, global projects?
Ext.define('BiofuelsModerator.view.NetworkLayer', {


    //--------------------------------------------------------------------------
    constructor: function() {
      this.networkEvents = new Array();

      /*var channel = webSocket.subscribe('bla');

      channel.bind('event', function(message){
        console.log('blatest success')
      });*/
    },

    /*receiveEvent: function(message){
      var self = this;
      console.log('receive ' + message)
      console.log(this)
      var json = JSON.parse(message);
      var index;
      for (index = 0; index < this.networkEvents.length; index++) {
        var ne = this.networkEvents[index];
        if (!json.event.localeCompare(ne.name)) {
          ne.processor.call(ne.scope, json);
        }
      }
    },*/
    //--------------------------------------------------------------------------
    registerListener: function(eventName, eventProcessor, scope) {
    	var event = {
    		name: eventName,
    		processor: eventProcessor,
    		scope: scope
    	};

    	this.networkEvents.push(event);
    },

    //--------------------------------------------------------------------------
	openSocket: function(ipAddr,port,url) {

    WsConnection.webSocket = new WebSocketRails('107.20.243.230:3001/websocket');
   // WsConnection.webSocket = new WebSocketRails('localhost:3000/websocket');
   // WsConnection.webSocket = new WebSocketRails('localhost:80/websocket', false);

		var self = this;
    WsConnection.webSocket.on_open = function() {
      console.log('the sockets are open')
      Ext.getCmp('connectWindow').incCounter()
    };
    WsConnection.webSocket.on_close = function() {
      console.log('WsConnection.websocket onClose!!');
    };
    WsConnection.webSocket.on_message = function(message) {

      // var json = JSON.parse(message.data);
      // var index;
      // for (index = 0; index < self.networkEvents.length; index++) {
      //   var ne = self.networkEvents[index];
      //   if (!json.event.localeCompare(ne.name)) {
      //     ne.processor.call(ne.scope, json);
      //   }
      // }
    };
    WsConnection.webSocket.on_error = function() {
      console.log('websocket onError!!');
    };


    var success = function(channelID) {
      console.log('assigned id '+ channelID);
      Ext.getCmp('connectWindow').incCounter()

      WsConnection.webSocket.id = channelID.toString();
      var channel = WsConnection.webSocket.subscribe(channelID.toString());

      channel.bind('event', function(message){
        // console.log(self.networkEvents)

        var json = JSON.parse(message);
        var index;
        for (index = 0; index < self.networkEvents.length; index++) {
          var ne = self.networkEvents[index];
          if (!json.event.localeCompare(ne.name)) {
            ne.processor.call(ne.scope, json);
          }
        }
      });
    }

    WsConnection.webSocket.trigger('get_new_id', 'blank', success);

  //   var webSocket = new WebSocketRails('localhost:3000/websocket');

    /*webSocket.on_open = function() {
      console.log('the sockets are open')
    };
    webSocket.on_close = function() {
      console.log('websocket onClose!!');
    };
    webSocket.on_message = function(message) {

      var json = JSON.parse(message.data);
      var index;
      for (index = 0; index < self.networkEvents.length; index++) {
        var ne = self.networkEvents[index];
        if (!json.event.localeCompare(ne.name)) {
          ne.processor.call(ne.scope, json);
        }
      }
    };
    webSocket.on_error = function() {
      console.log('websocket onError!!');
    };*/

		/*this.webSocket = new WS('ws://' + ipAddr + ':' + port + url);

    this.webSocket.onopen = function() {
		};
		this.webSocket.onclose = function() {
			console.log('websocket onClose!!');
		};
		this.webSocket.onmessage = function(message) {

			var json = JSON.parse(message.data);
			var index;
			for (index = 0; index < self.networkEvents.length; index++) {
				var ne = self.networkEvents[index];
				if (!json.event.localeCompare(ne.name)) {
					ne.processor.call(ne.scope, json);
				}
			}
		};
		this.webSocket.onerror = function() {
			console.log('websocket onError!!');
		};*/
	},

   subscribe: function(channel){
    self = this;
    WsConnection.webSocket.subscribe(channel).bind('event', function(message){
        // console.log('receive ' + message)
        // console.log(self.networkEvents)

        var json = JSON.parse(message);
        var index;
        for (index = 0; index < self.networkEvents.length; index++) {
          var ne = self.networkEvents[index];
          if (!json.event.localeCompare(ne.name)) {
            ne.processor.call(ne.scope, json);
          }
        }
      });
  },

  checkModel: function(){
    // console.log("checkModel");
    var success = function(){
      Ext.getCmp('connectWindow').incCounter();
    }
    WsConnection.webSocket.trigger('check_model', 'blank', success)
  },

    //--------------------------------------------------------------------------
	send: function(json) {
    var sendArray = new Array();
    sendArray.push(WsConnection.webSocket.id);
    sendArray.push(WsConnection.webSocket.gameChannel);
    sendArray.push(json);
    // console.log('sending')
		WsConnection.webSocket.trigger('receive_event', sendArray);
	}

});
