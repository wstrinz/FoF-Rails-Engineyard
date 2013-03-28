/*
 * File: app/view/SustainabilityPanel.js
 */

//------------------------------------------------------------------------------
Ext.define('Biofuels.view.SustainabilityPanel', {
//------------------------------------------------------------------------------

    extend: 'Ext.panel.Panel',
    alias: 'widget.sustainabilityPanel',

	title: 'Rankings',
	titleAlign: 'center',
	bodyStyle: 'background-color: #89a;',
    layout: {
        align: 'stretch',
        padding: '0 0 0 -20',
        type: 'hbox'
    },
	collapsed: false,

	//--------------------------------------------------------------------------
    initComponent: function() {
        var me = this;

		var dataStore = Ext.create('Ext.data.Store', {
			fields: ['name', 'data1', 'data2', 'data3'],
			data: [
				{ 'name': 'Biodiversity',	'data1': 6, 'data2': 12, 'data3': 13},
				{ 'name': 'Emissions',		'data1': 2, 'data2': 8,  'data3': 3 },
				{ 'name': 'Sustainability',	'data1': 10,'data2': 2,  'data3': 7 },
				{ 'name': 'More',			'data1': 4, 'data2': 2,  'data3': 7 },
				{ 'name': 'Other',			'data1': 7, 'data2': 2,  'data3': 7 }
			]
		});

        Ext.applyIf(me, {
            items: [{
				// LINE CHART
				xtype: 'chart',
				height: 250,
				width: 250,
				animate: false,
				insetPadding: 20,
				store: dataStore,
				shadow: false,
				theme:'Category1',
				axes: [{
					type: 'Numeric',
					fields: [
						'data1'
					],
					position: 'left',
					title: 'Ranking',
					grid: true,
					majorTickSteps: 5,
					minorTickSteps: 3
				},
				{
					type: 'Category',
					fields: [
						'name'
					],
					position: 'bottom',
					grid: true,
					label: {
						rotate: {
							degrees: 270
						}
					}
				}],
				series: [{
					type: 'line',
					xField: 'name',
					yField: [
						'data1'
					],
					fill: true,
					smooth: 5,
					hilight: true,
					style: {
						opacity: 0.2,
						'stroke-opacity': 1,
						'stroke-width': 1,
						stroke: '#000'
					},
					markerConfig: {
						radius: 3,
						'fill': '#346',
						'stroke-width': 1
					},
				}]
			},
			{
				// RADAR CHART
				xtype: 'chart',
				maxHeight: 220,
				maxWidth: 260,
				width: 260,
				animate: false,
				theme:'Category1',
				insetPadding: 50,
				store: dataStore,
				axes: [{
					position: 'radial',
					type: 'Radial',
					steps: 5
				}],
				series: [{
					type: 'radar',
					title: 'Radar',
					showMarkers: true,
					markerConfig: {
						radius: 3,
						'fill': '#346',
						'stroke-width': 1
					},
					hilight: true,
					style: {
						opacity: 0.2,
						'stroke-opacity': 1,
						'stroke-width': 1,
						stroke: '#000'
					},
					xField: 'name',
					yField: 'data1'
				}]
			}]
        });

        me.callParent(arguments);
    }

});
