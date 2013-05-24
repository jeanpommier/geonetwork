var config=null;
var tabpanel = null;
var lat=17;
var lon=-2;

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
			name: 'rb-granularity-'+config.index,
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
		            			} 
		            			if (node.attributes.info_param.granularity){ //we may only disable nodes with a granularity attribute
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
        rootVisible: false
	});
	tree.on('click', function(n) {
		config.current.node = n;
    	//update the content of the center of the window (text, charts)
        this.updateContent();
    }, this);
	config.treepanel = tree;
};

var loadCenterPanel = function(config) {
	var p_text = "contenu";
	if (config.presentation) {
		p_text = config.presentation;
	}
	var panel = new Ext.Panel({
		region:'center',
		autoScroll:true,
		html:p_text
	});
	config.centerpanel = panel;
};

var getCheckedGranul = function(page) {
	if (page.current) { 
		return page.current.granul;
	} else {
		return null;
	}
};

var getSelectedTreeNode = function(page) {
	if (page.current) { 
		return page.current.node;
	} else if (page.treepanel) { 
		return page.treepanel.getSelectionModel().getSelectedNode();
	} else {
		return null;
	}
};

var updateContent = function() {
	var index = this.tabpanel.getActiveTab().initialConfig.tabindex;
	var activepage = this.config[index];
	var granul = getCheckedGranul(activepage);
	var node = getSelectedTreeNode(activepage);
	var data = node.attributes.info_param;
	var tpl = new Ext.XTemplate(
            '<h1>'+node.attributes.text+'</h1>',
            '<p class="text_intro">{text_intro}</p>',
            '<div id="chart_place_'+index+'" style="float:left;"></div>',
            '<p class="text_body">{text_body}</p>'
        );
	tpl.overwrite(activepage.centerpanel.body, data);
	
	var type = node.attributes.info_param.chartType;
	switch (type) {
		case "pie":
			var dataurl = node.attributes.info_param.dataURL;
			dataurl += 'table='+node.attributes.info_param.dataTablePrefix+granul;
			var p_fields = node.attributes.info_param.dataFields.join(",");
			dataurl += '&fields='+p_fields;
			var geom = node.attributes.info_param.geomField ? node.attributes.info_param.geomField : 'the_geom';
			dataurl += '&geom_field='+geom; //geom field is used in the postgis query to intersect with the point location (lat lon)
			dataurl += '&lon='+this.lon+'&lat='+this.lat;
			console.log(dataurl);
			var store = Ext4.create('Ext4.data.Store', {
			    fields: ['name', 'value'],
			    proxy: {
			        type: 'jsonp',
			        url : dataurl,
			        reader: {
			            type: 'json',
			            root: 'datasets'
			        }
			    },
			    autoLoad:true
			});
			Ext4.create('Ext4.chart.Chart', {
			    renderTo: 'chart_place_'+index,
			    width: 150,
			    height: 150,
			    animate: true,
			    store: store,
			    theme: 'Base:gradients',
			    series: [{
			        type: 'pie',
			        field: 'value',
			        showInLegend: true,
			        tips: {
			            trackMouse: true,
			            width: 140,
			            height: 28,
			            renderer: function(storeItem, item) {
			                // calculate and display percentage on hover
			                var total = 0;
			                store.each(function(rec) {
			                    total += rec.get('value');
			                });
			                this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('value') / total * 100) + '%');
			            }
			        },
			        highlight: {
			            segment: {
			                margin: 10
			            }
			        },
			        legend: {
			            position: 'left'
			        },
			        label: {
			            field: 'name',
			            display: 'rotate',
			            contrast: true,
			            font: '12px Arial'
			        }
			    }]
			});
			break;
		default:
			break;
	}
	
	/*var store = Ext4.create('Ext.data.JsonStore', {
	    fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
	    data: [
	        { 'name': 'metric one',   'data1': 10, 'data2': 12, 'data3': 14, 'data4': 8,  'data5': 13 },
	        { 'name': 'metric two',   'data1': 7,  'data2': 8,  'data3': 16, 'data4': 10, 'data5': 3  },
	        { 'name': 'metric three', 'data1': 5,  'data2': 2,  'data3': 14, 'data4': 12, 'data5': 7  },
	        { 'name': 'metric four',  'data1': 2,  'data2': 14, 'data3': 6,  'data4': 1,  'data5': 23 },
	        { 'name': 'metric five',  'data1': 27, 'data2': 38, 'data3': 36, 'data4': 13, 'data5': 33 }
	    ]
	});

	Ext4.create('Ext.chart.Chart', {
	    renderTo: 'chart_place_'+index,
	    width: 350,
	    height: 250,
	    animate: true,
	    store: store,
	    theme: 'Base:gradients',
	    series: [{
	        type: 'pie',
	        field: 'data1',
	        showInLegend: true,
	        tips: {
	            trackMouse: true,
	            width: 140,
	            height: 28,
	            renderer: function(storeItem, item) {
	                // calculate and display percentage on hover
	                var total = 0;
	                store.each(function(rec) {
	                    total += rec.get('data1');
	                });
	                this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
	            }
	        },
	        highlight: {
	            segment: {
	                margin: 10
	            }
	        },
	        legend: {
	            position: 'left'
	        },
	        label: {
	            field: 'name',
	            display: 'rotate',
	            contrast: true,
	            font: '12px Arial'
	        }
	    }]
	});*/
	
};

var loadPanel = function(config, idx) {
	config.current={};
	config.index = idx;
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
	this.tabpanel = new Ext.TabPanel({
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