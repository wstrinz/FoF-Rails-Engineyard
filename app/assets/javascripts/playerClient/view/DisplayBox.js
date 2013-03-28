Ext.define('Biofuels.view.DisplayBox', {
  extend: 'Ext.container.Container',
  alias : 'widget.dispbox',
  border: 1,
  height: 35,
  width: 60,
  blable: 'defal',
  btip: '',

  layout: {
      type: 'absolute'
  },


  initComponent: function() {
    var me = this;


    Ext.applyIf(me, {
    items: [
    {
      xtype: 'panel',
      x: 0,
      y: 0,
      height: 20,
      width: me.width,
      header: false,
      title: 'My Panel',

      items: [
          {
              xtype: 'label',
              height: 14,
              width: 40,
              text: me.blable,
          }
      ]
    },
    {
      xtype: 'button',
      padding: '0 0 0 0',
      x: 0,
      y: 19,
      height: 15,
      width: me.width,
      text: me.blable,
      tooltip: me.btip,
      style: {
        background: 'transparent',
      },
      handler: function(){
        // console.log(this)
        this.el.setStyle({
           background: 'transparent'
        })
        // this.setTooltip('asdf');
        // Ext.getCmp('theLabel').setText('bla')
      }
    }
    ],
    })
    me.callParent(arguments)
  },

  setText: function(text){
    this.items.items[0].items.items[0].setText(text)
  }

});