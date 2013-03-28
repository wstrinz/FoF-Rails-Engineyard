/*
 * File: app/view/MainViewport.js
 */

Ext.onReady(function() {
	var createGame = Ext.create('Biofuels.view.JoinGamePopup');
  var connect = Ext.create('Biofuels.view.ConnectWindow');
	connect.show();
});
//------------------------------------------------------------------------------
Ext.define('Biofuels.view.MainViewport', {
//------------------------------------------------------------------------------

	extend: 'Ext.container.Viewport',
    requires: [
        'Biofuels.view.ConnectWindow',
      'Biofuels.view.NetworkLayer',
      'Biofuels.view.JoinGamePopup',
        'Biofuels.view.FarmHolderPanel',
        'Biofuels.view.FieldHealthPopup',
        'Biofuels.view.InformationPanel',
        'Biofuels.view.ContractPanel',
        'Biofuels.view.ContractOfferingPanel',
        'Biofuels.view.SustainabilityPanel',
        'Biofuels.view.ContractHelpWindow',
        'Biofuels.view.ProgressPanel',
    ],

    title: 'My Window',
    autoScroll: true,
    layout: 'fit',

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        Biofuels.network = Ext.create('Biofuels.view.NetworkLayer');
		// 192.168.1.101
        Biofuels.network.openSocket('localhost', 9000, '/BiofuelsGame/serverConnect');
        Biofuels.network.checkModel();

        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					align: 'center'
				},
				bodyStyle: 'background-image: url(resources/site_bg.jpg); background-size: cover; background-repeat: no-repeat; background-attachment: fixed; background-position: center top;',
				items: [{
					xtype: 'panel',
					layout: 'column',
					width: 1100,
					items: [{
						xtype: 'panel',
						columnWidth: 0.45,
						layout: 'fit',
						items: [{
							xtype: 'progressPanel',
							height: 100
						},{
							xtype: 'farmHolderPanel',
							// width: 500,
							height: 700,
							layout: 'fit'
						}]
					},{
						xtype: 'informationPanel',
						columnWidth: 0.55,
						height: 700,
						layout: {
							type: 'accordion',
              titleCollapse: false,
							multi: true
						}
					}]
				}]
			}]
        });

        me.callParent(arguments);
    }

});

