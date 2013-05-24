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
			checked : (i==0),
			listeners: {
	            'check': function(radio, checked) {
	            	if (checked) {
		            	config.current.granul  = radio.inputValue;
		            	if (config.treepanel) {
		            		var checkEnable = function(node, index) {
		            			if (node.hasChildNodes()) {
		            				node.eachChild(checkEnable, this);
		            			} else { //we may only disable leaf nodes
			            			if (node.attributes.info_param.granularity.indexOf(radio.inputValue)== -1) {
			            				node.disable();
			            			} else {
			            				node.enable();
			            			}
		            			}
		            		};
		            		config.treepanel.root.eachChild(checkEnable, this);
		            	}
	            	}
	            }
		    }
		});
		g_items.push(item);
	};
	config.current.granul  = granul[0].code;
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
            	//this.getSelectionModel().select(n); //if we don't do this, we'll access, in updatecontent function, to the previously selected node....
            	
                //update the content of the center of the window (text, charts)
                updateContent(n);
                
            }
        }
	});
	config.treepanel = tree;
};

var loadCenterPanel = function(config) {
	var p_text = "contenu";
	if (config.presentation) {
		p_text = config.presentation;
	}
	var panel = new Ext.Panel({
		region:'center',
		html:p_text
	});
	config.centerpanel = panel;
};

var getCheckedGranul = function(page) {
	if (config.current) { 
		return config.current.granul;
	} else {
		return null;
	}
};

var getSelectedTreeNode = function(page) {
	if (page.treepanel) { 
		return page.treepanel.getSelectionModel().getSelectedNode();
	} else {
		return null;
	}
};

var updateContent = function(node) {
	var index = this.tabpanel.getActiveTab().initialConfig.tabindex;
	var activepage = this.config[index];
	var granul = getCheckedGranul(activepage);
	var data = node.attributes.info_param;
	var tpl = new Ext.XTemplate(
            '<h1>'+node.attributes.text+'</h1>',
            '<p class="texte_intro">{texte_intro}</p>',
            '<div id="chart_place_'+index+'">Le chart ici</div>',
            '<p class="texte_corps">{texte_corps}</p>'
        );
	tpl.overwrite(activepage.centerpanel.body, data);
	
	
	
};

var loadPanel = function(config, idx) {
	config.current={};
	loadTreePanel(config);
	var sidepanelitems = [config.treepanel];
	if (config.granularity) {
		loadGranularityPanel(config, config.granularity);
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
	
	
    popup.add(this.tabpanel);

	popup.show();
	popup.doLayout();
	

});