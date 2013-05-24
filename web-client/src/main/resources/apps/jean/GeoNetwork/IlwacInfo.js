/*
 * Copyright (C) 2009 GeoNetwork
 *
 * This file is part of GeoNetwork
 *
 * GeoNetwork is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GeoNetwork is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GeoNetwork.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires GeoNetwork/windows/BaseWindow.js
 */ 

Ext.namespace('GeoNetwork');

/**
 * Class: IlwacInfoWindow
 *      Window to display all the ilwac information board on a punctual site (derives from a getFeatureInfo)
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.IlwacInfoWindow
 * Create an instance of GeoNetwork.IlwacInfoWindow
 *
 * Parameters:
 * config - {Object} A config object used to set the ilwacinfowindow
 *     window's properties.
 */
GeoNetwork.IlwacInfoWindow = function(config) {
    Ext.apply(this, config);
    GeoNetwork.IlwacInfoWindow.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.IlwacInfoWindow, GeoNetwork.BaseWindow, {

	control: null,
	contentpanel:null,

	maximizable:true,
	
	config:null,
	tabpanel:null,
	lat:null,
	lon:null,

    /**
     * Method: init
     *     Initialize this component.
     */
    initComponent: function() {
        GeoNetwork.IlwacInfoWindow.superclass.initComponent.call(this);

        this.title = this.title || OpenLayers.i18n("IlwacInfoWindow.windowTitle");

        this.width = 600;
        this.height = 400;
        
        this.config = infosConfig;
        this.loadTabs(this.config); //loads a tabpanel in this.tabpanel. Stores the tabs in this.config
        this.add(this.tabpanel);
        this.doLayout();
    },

    setLonLat: function(lon,lat) {
    	this.lon = lon;
    	this.lat=lat;
    	this.updateContent();
    },
    

    setMap: function(map) {
    },
    
    loadGranularityPanel: function(config, granul) {
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
    },

    loadTreePanel: function(config) {
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
    },

    loadCenterPanel: function(config) {
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
    },
    
    getCheckedGranul: function(page) {
    	if (page.current) { 
    		return page.current.granul;
    	} else {
    		return null;
    	}
    },
    
    getSelectedTreeNode: function(page) {
    	if (page.current) { 
    		return page.current.node;
    	} else if (page.treepanel) { 
    		return page.treepanel.getSelectionModel().getSelectedNode();
    	} else {
    		return null;
    	}
    },
    
    updateContent: function() {
    	var index = this.tabpanel.getActiveTab().initialConfig.tabindex;
    	var activepage = this.config[index];
    	var granul = this.getCheckedGranul(activepage);
    	var node = this.getSelectedTreeNode(activepage);
    	if (!node) {
    		return;
		}
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
    	
    },
    
    loadPanel: function(config, idx) {
    	config.current={};
    	config.index = idx;
    	this.loadTreePanel(config);
    	var sidepanelitems = [config.treepanel];
    	if (config.granularity) {
    		this.loadGranularityPanel(config, config.granularity);
    		sidepanelitems.push(config.granulpanel);
    	}
    	this.loadCenterPanel(config);
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
    },
    
    loadTabs: function() {
    	var tabs=[];
    	for (var i=0 ; i < this.config.length ; i++) {
    		this.loadPanel(this.config[i], i);
    		tabs.push(this.config[i].tabpanel);
    	}
    	this.tabpanel = new Ext.TabPanel({
    		region:'center',
    	    activeTab: 0,
    	    items: tabs
    	});
    }

});
