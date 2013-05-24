var granularity = [{
						code:'reg',
						label:'Régions'
					},{
						code:'cer',
						label:'Cercles'
					},{
						code:'com',
						label:'Communes'
					}];

var config=null;


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

var loadGranularityPanel = function(config, granul) {
	var g_items = [];
	for (var i = 0 ; i< granul.length ; i++) {
		var item = new Ext.form.Radio({
			boxLabel: granul[i].label,
			name: 'rb-granularity',
			inputValue: granul[i].code,
			checked : (i==0)
		});
		g_items.push(item);
	};
	//console.log(g_items);
	var granulPanel = new Ext.Panel({
		region:'north',
		autoHeight:true,
		height:100,
		//id:'rbg-granularity',
	    xtype: 'radiogroup',
	    fieldLabel: 'Single Column',
	    itemCls: 'x-check-group-alt',
	    // Put all controls in a single column with width 100%
	    columns: 1,
	    items: g_items
	});
	config.granulpanel = granulPanel;
};

var loadTreePanel = function(config) {
	var tree = new Ext.tree.TreePanel({
		region: 'center',
        //title: 'Navigation',
        autoScroll: true,
        split: true,
        loader: new Ext.tree.TreeLoader(),
        root: new Ext.tree.AsyncTreeNode({
            expanded: true,
            children: config.children
        }),
        rootVisible: false,
        listeners: {
            click: function(n) {
                //console.log('Navigation Tree Click', 'You clicked: "' + n.attributes.text + '"');
            	this.getSelectionModel().select(n); //if we don't do this, we'll access, in updatecontent function, to the previously selected node....
            	
            	// we enable only the radio buttons available for that given layer, and then
            	// we select the first radio button available (ie not disabled) in granularity panel
            	var checked=false;
                var granul = config.granulpanel;
                if (granul) {
	                var rbs = granul.items.items;
	                for (var i=0 ; i < rbs.length ; i++) {
	                	if (n.attributes.info_param.granularity.indexOf(rbs[i].inputValue)== -1) {
	                		rbs[i].disable();
	                	} else {
	                		rbs[i].enable();
	                		if (!checked) {
	                			rbs[i].setValue(true);
	                			checked=true;
	                		}
	                	}
	                }
                }
                
                //update the content of the center of the window (text, charts)
                updateContent();
                
            }
        }
	});
	config.treepanel = tree;
};

var loadCenterPanel = function(config) {
	var panel = new Ext.Panel({
		region:'center',
		html:'graphiques'
	});
	config.centerpanel = panel;
};

var getCheckedGranul = function(page) {
	if (!page.granulpanel) return null;
	for (i = 0 ; i <page.granulpanel.items.items.length ; i++) {
		var item = page.granulpanel.items.items[i];
		if (item.checked) {
			 return item;
		}
		
	}
	return null;
};

var getSelectedTreeNode = function(page) {
	return page.treepanel.getSelectionModel().getSelectedNode();
};

var updateContent = function() {
	var activepage = this.config[this.tabpanel.getActiveTab().initialConfig.tabindex];
	var granul = getCheckedGranul(activepage);
	var tn = getSelectedTreeNode(activepage);
	var data = tn.attributes.info_param;
	var tpl = new Ext.XTemplate(
            '<h1>'+tn.attributes.text+'</h1>',
            '<p class="texte_intro">{texte_intro}</p>',
            '<div id="chart_place">Le chart ici</div>',
            '<p class="texte_corps">{texte_corps}</p>'
        );
	tpl.overwrite(activepage.centerpanel.body, data);
	
	
	
};

var loadPanel = function(config, idx) {
	loadTreePanel(config);
	var sidepanelitems = [config.treepanel];
	if (config.hasGranularity!==false) {
		loadGranularityPanel(config, granularity);
		sidepanelitems.push(config.granulpanel);
	}
	loadCenterPanel(config);
	var panel = new Ext.Panel({
		title : config.text,
		layout:'border',
		tabindex:idx, //custom. Used to retrieve elements in the this.config object...
        items : 
            	[{	
        			region:'west',
    				width: 150,
    				layout:'border',
    				split:true,
					items :sidepanelitems
                	
        		},
        		config.centerpanel    // region :'center'
        		]
	});
	config.tabpanel = panel;
};

var loadTabs = function() {
	var tabs=[];
	for (var i=0 ; i < this.config.length ; i++) {
		loadPanel(this.config[i], i);
		tabs.push(this.config[i].tabpanel);
	}
	tabpanel = new Ext.TabPanel({
		region:'center',
	    activeTab: 0,
	    items: tabs
	});
};

Ext.onReady(function(){
	var popup = new Ext.Window({
		title:'Ilwac data center'
		,width:600
		,height:400
		,layout:'border'
		,maximizable:true
	});
	//console.log(infosConfig);
	this.config = infosConfig;
	loadTabs(this.config); //loads a tabpanel in this.tabpanel. Stores the tabs in this.config
	/*{
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
    };*/
	
    popup.add(this.tabpanel);

	popup.show();
	popup.doLayout();
	

});