var createContent = function(params) {
	var centerpanel = Ext.getCmp('centerpanel-tab1');
	centerpanel.body.update("new content");
	var dataurl = 'http://jean.localhost/sigdt-config/ilwac_json_getPunctualData-0.1.php?tables=v_1c4_pop_urb_rur_reg,v_1c4_pop_urb_rur_cer&fields=poprur,popurb&geom_field=the_geom&lon=-2&lat=17';
	var store = new Ext.data.JsonStore({
	    // store configs
	    autoDestroy: true,
	    autoLoad:true,
	    url: dataurl,
	    storeId: 'ilwacinfoStore',
	    // reader configs
	    root: 'features',
	    idProperty: 'id',
	    fields: ['id', 'poprur', 'popurb', 'table']
	});
	centerpanel.removeAll(false);
	centerpanel.add({
        store: store,
        xtype: 'piechart',
        dataField: 'poprur',
        categoryField: 'id',
        //extra styles get applied to the chart defaults
        extraStyle:
        {
            legend:
            {
                display: 'bottom',
                padding: 5,
                font:
                {
                    family: 'Tahoma',
                    size: 13
                }
            }
        }
    });
	centerpanel.doLayout();
	
} ;


Ext.onReady(function(){
	var popup = new Ext.Window({
		title:'Ilwac data center'
		,width:600
		,height:400
		,layout:'border'
		,maximizable:true
	});
	contentpanel = {
		xtype:'tabpanel'
		,region:'center'
    	,id		:'ilwacinfocontentpanel'
    	,activeTab: 0
    	,defaults:{layout:'fit'}
        ,items: [{
            title: 'Données générales'
            ,layout:'border'
            ,items : 
            	[{	
        			region:'west'
    				,width: 150
    				,layout:'border'
					,items :
						[{
							region:'north',
							autoHeight:true,
							id:'rbg-granularity',
						    xtype: 'radiogroup',
						    fieldLabel: 'Single Column',
						    itemCls: 'x-check-group-alt',
						    // Put all controls in a single column with width 100%
						    columns: 1,
						    items: [
						        {boxLabel: 'Régions', name: 'rb-granularity', inputValue: 'reg', checked: true},
				                {boxLabel: 'Cercles', name: 'rb-granularity', inputValue: 'cer'},
				                {boxLabel: 'Communes', name: 'rb-granularity', inputValue: 'com', disabled:true}
						    ]
						},{
					        region: 'center',
					        //title: 'Navigation',
					        xtype: 'treepanel',
					        width: 200,
					        autoScroll: true,
					        split: true,
					        loader: new Ext.tree.TreeLoader(),
					        root: new Ext.tree.AsyncTreeNode({
					            expanded: true,
					            children: [{
					                text: 'all',
					                info_param: {
					                	'granularity' : ['reg','cer', 'com']
					                },
					                leaf: true
					            }, {
					                text: 'regcer', 
					                info_param: {
					                	'granularity' : ['reg','cer']
					                },
					                leaf: true
					            }, {
					                text: 'Regcom',
					                info_param: {
					                	'granularity' : ['reg','com']
					                },
					                leaf: true
					            }]
					        }),
					        rootVisible: false,
					        listeners: {
					            click: function(n) {
					                console.log('Navigation Tree Click', 'You clicked: "' + n.attributes.text + '"');
					                var granul = Ext.getCmp('rbg-granularity');
					                var rbs = granul.items.items;
					                for (var i=0 ; i < rbs.length ; i++) {
					                	if (n.attributes.info_param.granularity.indexOf(rbs[i].inputValue)== -1) {
					                		rbs[i].disable();
					                	} else {
					                		rbs[i].enable();
					                	}
					                }
					                createContent({});
					            }
					        }
					    }]
                	
        		},{	
        			region:'center',
        			id:'centerpanel-tab1',
        			html:"graphiques"
            	
        		}]
        },{
            title: 'Climat'
            ,html: 'Another one'
        },{
            title: 'Eau'
            ,html: 'Another one'
        },{
            title: 'Sols'
            ,html: 'Another one'
        },{
            title: 'Végétation'
            ,html: 'Another one'
        },{
            title: 'Risques'
            ,html: 'Another one'
        }]
    };
	
    popup.add(contentpanel);

	popup.show();
	popup.doLayout();
	

});