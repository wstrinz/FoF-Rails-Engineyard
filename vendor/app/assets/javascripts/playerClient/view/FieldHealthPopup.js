/*
 * File: app/view/FieldHealthPopup.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.FieldHealthPopup', {
//------------------------------------------------------------------------------

    extend: 'Ext.window.Window',
    alias: 'widget.fieldHealthPopup',

    height: 130,
    width: 400,
    title: 'Field Changes Over Time',
    resizable: false,
    floating: true,
    titleCollapse: true,

    //--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
				xtype: 'panel',
				padding: 5,
				layout: {
					columns: 3,
					type: 'table'
				},
				bodyPadding: '5 5 8 5',
				items: [{
					xtype: 'checkboxfield',
					itemId: 'soilHealth',
					padding: '0 0 0 20',
					colspan: 1,
					rowspan: 1,
					width: 125,
					hideLabel: true,
					boxLabel: 'Soil health',
					checked: true
				},
				{
					xtype: 'checkboxfield',
					itemId: 'yields',
					padding: '0 0 0 20',
					colspan: 1,
					rowspan: 1,
					width: 125,
					hideLabel: true,
					boxLabel: 'Yields',
					checked: true
				},
				{
					xtype: 'checkboxfield',
					itemId: 'crop',
					colspan: 1,
					rowspan: 1,
					width: 125,
					hideLabel: true,
					boxLabel: 'Crop',
					checked: true
				},
				{
					xtype: 'slider',
					itemId: 'yearSlider',
					padding: '5 15 0 15',
					colspan: 3,
					rowspan: 1,
					width: 320,
					value: 0,
					maxValue: 0,
					minValue: -10
				},
				{
					xtype: 'label',
					itemId: 'prevYearLabel',
					padding: '0 0 0 20',
					text: '< Previous years',
					colspan: 2,
					rowspan: 1
				},
				{
					xtype: 'label',
					itemId: 'nowLabel',
					padding: '0 0 0 25',
					text: 'Now',
					colspan: 1,
					rowspan: 1
				}]
			}]
        });

        me.callParent(arguments);
    },
    
    //--------------------------------------------------------------------------
    setCheckboxCallbacks: function(soilHealthCB, yieldsCB, cropCB, scope) {
    	
    	var panelBody = this.items.items[0];
    	
    	// Soil Health
       	var check = panelBody.getComponent('soilHealth');
       	
    	check.on({
    		change: soilHealthCB,
    		scope: scope
    	});
    	soilHealthCB.call(scope, check, check.getValue());
    	
    	// Yields
    	check = panelBody.getComponent('yields');
    	check.on({
    		change: yieldsCB,
    		scope: scope
    	});
    	yieldsCB.call(scope, check, check.getValue());
    	
    	// Crop
    	check = panelBody.getComponent('crop');
    	check.on({
    		change: cropCB,
    		scope: scope
    	});
    	cropCB.call(scope, check, check.getValue());
    },
    
    //--------------------------------------------------------------------------
    setSliderCallback: function(years, dragCB, changeCB, scope) {
    	
    	var panelBody = this.items.items[0]; 
       	var slider = panelBody.getComponent('yearSlider');

		this.setSliderNumYears(years);
       	
    	slider.on({
    		drag: dragCB,
    		change: changeCB,
    		scope: scope
    	});
    	
    	changeCB.call(scope, slider);
    },
    
    //--------------------------------------------------------------------------
    setSliderNumYears: function(maxYears) {
    	
    	// FIXME: there some kind of recursive 'get child by itemId' call??
    	var panelBody = this.items.items[0]; 
       	var slider = panelBody.getComponent('yearSlider');
       	var label1 = panelBody.getComponent('prevYearLabel');
       	var label2 = panelBody.getComponent('nowLabel');

       	if (typeof slider == 'undefined' || typeof label1 == 'undefined' || 
       		typeof label2 == 'undefined') {
       		return;
       	}
    	
       	if (maxYears <= 1) {
       		slider.hide();
       		label1.hide();
       		label2.hide();
       	}
       	else {
       		slider.show();
       		label1.show();
       		label2.show();
       		slider.setMinValue((maxYears - 1) * -1);
       		slider.setValue(0);
       	}
    }
    
});
