/**
 * Copyright (c) 2012 jean Pommier, jean.pommier@ige.fr
 * 
 * Published under the GPL license
 */

Ext.namespace("GeoNetwork");

GeoNetwork.NDVIPanel = Ext.extend(Ext.Panel, {
	years:null,
	months : null,
	days : null,
	actionsConfig:null,		//actions available config data (left panel). Necessary
	
	panels_center 	: null,
	panels_west		: null,
	panels_options	: null,
	ndviAppState		: {
		buttons			: [],
		lat				: null,
		lon				: null,
		current_index	: null,
		current_button	: null,
		current_config	: null
	},
	
    initComponent: function(){
    	window.ndviapp = this;
        GeoNetwork.NDVIPanel.superclass.initComponent.call(this);
        this.layout = 'border';
    	this.border = false;
    	
    	this.ndviAppState.lat = this.lat;
    	this.ndviAppState.lon = this.lon;
    	
    	this.panels_center = new Ext.Panel({
			region: 'center', 
			layout: 'fit', 
            padding:'5',
			html		: this.text_intro,
            border : false,
            autoScroll:true,
            minWidth: 300
        });

    	this.panels_west = new Ext.Panel({
    		region: 'west',     		
    		layout:'vbox',
            border : false,
            padding:'5',
            align:'stretch',
    		defaults: {margins : '0 0 5 0'},
    		items: this.loadActions(), 
    		plain:true,
    		width:150
		});

        this.add(this.panels_center);
        this.add(this.panels_west);

        this.doLayout();
        
        this.addEvents(
            /** private: event[aftermapmove]
             *  Fires after the map is moved.
             */
           // "aftermapmove"
        );
    },
    
    updateContent: function() {
    	
    },

    loadActions: function() {
    	var ndvipanel = this;
    	var actionCollection = [];
    	Ext.each(this.actionsConfig, function(action, idx, config) {
    		var button = new Ext.Button({
    			text 			: action.text,
    			iconCls 		: action.icon,
    			scale			: 'large',
    			width			:"100%",
    			margins			: '5',
    			toggleGroup		: 'ndvi',
    			enableToggle 	: true,
    			pressed			: false,
    			buttonIdx		: idx, //custom var
    			handler: function(button, event){
    				if (button.pressed) {
    					this.ndviAppState.current_button = button;
        				this.ndviAppState.current_index = idx;
        				this.ndviAppState.current_config = action;
                        this.setMainPanel();
    				} else {
    					this.ndviAppState.current_button = null;
        				this.ndviAppState.current_index = null;
        				this.ndviAppState.current_config = null;
    					this.reset();
    				}
    				
                },
                scope:ndvipanel
    		});
    		this.ndviAppState.buttons.push(button);
    	}, this);
    	return this.ndviAppState.buttons;
    },
    
    setLonLat: function(lon, lat) {
    	this.lat = lat;
    	this.lon = lon;
    	this.ndviAppState.lat = lat;
    	this.ndviAppState.lon = lon;
    	if (this.ndviAppState.current_button === null || 
    			this.ndviAppState.current_button.current_values===undefined) {
    		return false; //if not set, we stop here
    	}
    	switch (this.ndviAppState.current_config.type) {
	    	case 'ndvi_annual':
	    		var values = this.ndviAppState.current_button.current_values;
				this.goNdviYearlyGraph(values.year, 
						this.ndviAppState.current_config, values.divid);
				break;
			case 'ndvi_decade':
	    		var values = this.ndviAppState.current_button.current_values;
				this.goNdviDecadeGraph(values.month, values.day,
						this.ndviAppState.current_config, values.divid);
				break;
			default:
				this.reset();
				break;
    	}
    	return true;
    },
    
    setMainPanel: function() {
    	var button = this.ndviAppState.current_button;
    	var config = this.ndviAppState.current_config;
    	var idx = button.buttonIdx;
    	if (!button.pressed) {
    		this.reset();
    	} else {this.reset();
	    	var chartid = 'ndvi_chart_place_'+idx;
			var tpl = new Ext.XTemplate(
		            '<h1>{text}</h1>',
		            '<p class="text_intro">{text_intro}</p>',
		            '<div id="'+chartid+'"></div>',
		            '<p class="text_body">{text_body}</p>'
		        );
			tpl.overwrite(this.panels_center.body, config);
			
			switch (config.type) {
				case 'ndvi_annual':
					this.loadNdviYearlyElements(config, chartid);
					break;
				case 'ndvi_decade':
					this.loadNdviDecadeElements(config, chartid);
					break;
				default:
					this.reset();
					break;
			}
			//this.loadNdviOptions("ndvi_options_"+idx);
			
			
			/*if (action.chart) {
				var type = action.chart.type;
				switch (type) {
					case "graph":
						break;
					default:
						break;
				}
			}*/
    	}
    },
    
    reset: function() {
    	if (this.panels_west.findById('optionsPanel')!==null) {
        	this.panels_west.remove('optionsPanel');
    	}
    	this.panels_center.update(this.text_intro);
    	this.doLayout();
    },
    
    loadNdviDecadeElements: function(config, id) {
    	var m_store = new Ext.data.ArrayStore({
            id		: 0,
            fields	: ['id','label'],
            data	: this.months
        });
    	var m_combo = new Ext.form.ComboBox({
    		fieldLabel	: 'Mois',
    		//emptyText	: m_store.getAt(0).get('label'),
    		forceSelection:true,
    	    triggerAction: 'all',
    	    lazyRender	:true,
    	    mode		: 'local',
			store		: m_store,
	        valueField	: 'id',
	        displayField: 'label',
	        width		: 80
    	});
    	var d_store = new Ext.data.ArrayStore({
            id		: 0,
            fields	: ['id'],
            data	: this.arrayify(this.days)
        });
    	var d_combo = new Ext.form.ComboBox({
    		fieldLabel	: 'Jour',
    		//emptyText	: d_store.getAt(0).get('id'),
    		forceSelection:true,
    	    triggerAction: 'all',
    	    lazyRender	:true,
    	    mode		: 'local',
			store		: d_store,
	        valueField	: 'id',
	        displayField: 'id',
	        width		: 80
    	});
    	var button = new Ext.Button({
			text 			: 'Appliquer',
			iconCls 		: 'Go',
			//scale			: 'large',
			margins			: '5',
			handler: function(button, event){
				if (m_combo.value==undefined || d_combo.value==undefined) {
					return false;
				}
				if (this.ndviAppState.current_button.current_values ==null ) {
					this.ndviAppState.current_button.current_values = {};
				}
				this.ndviAppState.current_button.current_values.month = m_combo.value;
				this.ndviAppState.current_button.current_values.day = d_combo.value;
				this.ndviAppState.current_button.current_values.divid  = id;
				this.goNdviDecadeGraph(m_combo.value, d_combo.value, config,id);
            },
            scope:this
		});
    	
    	this.panels_options = new Ext.form.FormPanel({
    		//renderTo:id,
    		//baseCls: 'x-plain',
    		id: 'optionsPanel',
    		padding : '5',
    		labelWidth : 40,
    		width	: '100%',
    		defaults: {border:false},
    		labelAlign:'left',
    		buttonAlign : 'right',
    		items 	: [
	      	   	{ 
	      	   		html : '<h3>Déterminer la décade à afficher</h3>',
	      	   		border:false
	      	   	},
	      	   	m_combo,
	      	   	d_combo,
	      	   	button
      	    ]
    	});
    	if (this.panels_west.findById('optionsPanel')===null) {
        	this.panels_west.add(this.panels_options);
    	}
    	this.panels_west.doLayout();
    },
    goNdviDecadeGraph: function(month, day,config,id) {
		if (month!==undefined && day!==undefined) {
			var dataurl = config.chart.url+'&lat='+this.ndviAppState.lat+'&lon='+this.ndviAppState.lon+'&date='+month+day;
			var chart_store = Ext4.create('Ext4.data.JsonStore', {
			    proxy: {
			        type: 'jsonp',
			        url : dataurl,
			        reader: {
			            type: 'json',
			            root: 'data',
		           		idProperty: 'date'
			        }
			    },
			    autoLoad:true,
				fields: [{name:'date', type: 'string'}, {name:'value', type:'int'}]
			});
			var axes, series;
			switch (config.chart.type) {
				case "column": 
					axes = [
					        {
					            type: 'Numeric',
					            position: 'left',
					            fields: ['value'],
					            label: {
					                renderer: Ext4.util.Format.numberRenderer('0,0')
					            },
					            title: 'Indices NDVI',
					            grid: true,
					            minimum: 0,
								maximum : 255
								//,minorTickSteps : 50
					        },
					        {
					            type: 'Category',
					            position: 'bottom',
					            fields: ['date'],
					            title: 'Années',
					            label: {
				                    rotate: {
				                        degrees: 315
				                    }
				                }
					        }
				    ];
					series = [
						        {
						            type: 'column',
						            highlight: true,
						            axis: 'left',
						            xField: 'date',
						            yField: 'value',
						            /*tips: {
						                trackMouse: true,
						                width: 140,
						                height: 28,
						                renderer: function(storeItem, item) {
						                  this.setTitle(storeItem.get('value'));
						                }
						            },*/
						            label: {
						                  display: 'insideEnd',
						                  'text-anchor': 'middle',
						                    field: 'value',
						                    renderer: Ext4.util.Format.numberRenderer('0'),
						                    orientation: 'vertical',
						                    color: '#333'
					                }
						        }
				    ];
					break;
				case "line": 
					axes = [
						        {
						            type: 'Numeric',
						            position: 'left',
						            fields: ['value'],
						            label: {
						                renderer: Ext.util.Format.numberRenderer('0,0')
						            },
						            title: 'Indices NDVI',
						            grid: true,
						            minimum: 0
						        },
						        {
						            type: 'Category',
						            position: 'bottom',
						            fields: ['date'],
						            title: 'Années'
						        }
					    ];
						series = [
							        {
							            type: 'line',
							            highlight: {
							                size: 7,
							                radius: 7
							            },
							            axis: 'left',
							            xField: 'date',
							            yField: 'value',
							            markerConfig: {
							                type: 'cross',
							                size: 4,
							                radius: 4,
							                'stroke-width': 0
							            }
							        }
					    ];
						break;
			}
			Ext.get(id).dom.innerHTML = ""; // clears the div before adding the chart
			Ext4.create('Ext4.chart.Chart', {
			    renderTo: id,
			    width: 400,
			    height: 200,
			    animate: true,
			    store: chart_store,
			    axes: axes,
			    series: series
			});
		}
    },
    
    loadNdviYearlyElements: function(config, id) {
     	var y_store = new Ext.data.ArrayStore({
            id		: 0,
            fields	: ['year'],
            data	: this.arrayify(this.years) //needs array in array structure
        });
    	var y_combo = new Ext.form.ComboBox({
    		fieldLabel	: 'Année',
    		//emptyText	: d_store.getAt(0).get('id'),
    		forceSelection:true,
    	    triggerAction: 'all',
    	    lazyRender	:true,
    	    mode		: 'local',
			store		: y_store,
	        valueField	: 'year',
	        displayField: 'year',
	        width		: 80
    	});
    	var button = new Ext.Button({
			text 			: 'Appliquer',
			iconCls 		: 'Go',
			//scale			: 'large',
			margins			: '5',
			handler: function(button, event){
				if (y_combo.value==undefined) {
					return false;
				}
				if (this.ndviAppState.current_button.current_values ==null ) {
					this.ndviAppState.current_button.current_values = {};
				}
				this.ndviAppState.current_button.current_values.year = y_combo.value;
				this.ndviAppState.current_button.current_values.divid  = id;
				this.goNdviYearlyGraph(y_combo.value, config,id);
			},
			scope:this
    	});
				
    	this.panels_options = new Ext.form.FormPanel({
    		//renderTo:id,
    		//baseCls: 'x-plain',
    		id: 'optionsPanel',
    		padding : '5',
    		labelWidth : 40,
    		width	: '100%',
    		defaults: {border:false},
    		labelAlign:'left',
    		buttonAlign : 'right',
    		items 	: [
	      	   	{ 
	      	   		html : "<h3>Choisir l'année à afficher</h3>",
	      	   		border:false
	      	   	},
	      	   	y_combo,
	      	   	button
      	    ]
    	});
    	if (this.panels_west.findById('optionsPanel')===null) {
        	this.panels_west.add(this.panels_options);
    	}
    	this.panels_west.doLayout();
    },
    goNdviYearlyGraph: function(year, config, id) {
    	if (year!==undefined) {
			var dataurl = config.chart.url+'&lat='+this.ndviAppState.lat+'&lon='+this.ndviAppState.lon+'&year='+year;
			var chart_store = Ext4.create('Ext4.data.Store', {
			    fields: ['date', 'Jour 01', 'Jour 11', 'Jour 21'],
			    proxy: {
			        type: 'jsonp',
			        url : dataurl,
			        reader: {
			            type: 'json',
			            root: 'data'
			        }
			    },
			    autoLoad:true
			});
			var axes, series;
			switch (config.chart.type) {
				case "column": 
					axes = [
					        {
					            type: 'Numeric',
					            position: 'left',
					            fields: ['Jour 01', 'Jour 11', 'Jour 21'],
					            label: {
					                renderer: Ext.util.Format.numberRenderer('0,0')
					            },
					            title: 'Indices NDVI',
					            grid: true,
					            minimum: 0
					        },
					        {
					            type: 'Category',
					            position: 'bottom',
					            fields: ['date'],
					            title: 'Mois'
					        }
				    ];
					series = [
						        {
						            type: 'column',
						            highlight: true,
						            axis: 'left',
						            xField: 'date',
						            yField: ['Jour 01', 'Jour 11', 'Jour 21'],
						            tips: {
						                trackMouse: true,
						                width: 40,
						                height: 28,
						                renderer: function(storeItem, item) {
						                  this.setTitle(item.value[1]);
						                }
						            }/*,
						            label: {
						                  display: 'insideEnd',
						                  'text-anchor': 'middle',
						                    field: 'date',
						                    renderer: Ext.util.Format.numberRenderer('0'),
						                    orientation: 'vertical',
						                    color: '#333'
					                }*/
						        }
				    ];
					Ext.get(id).dom.innerHTML = ""; // clears the div before adding the chart
					Ext4.create('Ext4.chart.Chart', {
					    renderTo: id,
					    width: 400,
					    height: 200,
					    animate: true,
					    store: chart_store,
					    legend: {
				              position: 'right'  
			            },
					    axes: axes,
					    series: series
					});
					break;
				case "line": //marche pas pour l'instant (j'ai dû casser un truc
					axes = [
					        {
					            type: 'Numeric',
					            position: 'left',
					            fields: ['value'],
					            label: {
					                renderer: Ext.util.Format.numberRenderer('0,0')
					            },
					            title: 'Indices NDVI',
					            grid: true,
					            minimum: 0
					        },
					        {
					            type: 'Category',
					            position: 'bottom',
					            fields: ['date'],
					            title: 'Mois'
					        }
				    ];
					series = [
						        {
						            type: 'line',
						            highlight: {
						                size: 7,
						                radius: 7
						            },
						            axis: 'left',
						            xField: 'date',
						            yField: 'value',
						            markerConfig: {
						                type: 'cross',
						                size: 2,
						                radius: 2,
						                'stroke-width': 0
						            }
						        }
				    ];
					Ext.get(id).dom.innerHTML = ""; // clears the div before adding the chart
					Ext4.create('Ext4.chart.Chart', {
					    renderTo: id,
					    width: 300,
					    height: 200,
					    animate: true,
					    store: chart_store,
					    axes: axes,
					    series: series
					});
					break;
				default:
					Ext.get(id).dom.innerHTML = "Erreur de config : type de graphique non pris en charge";
					break;
			}
    	}		
    },
    arrayify: function(src) {
    	var array = [];
    	for (var i=0 ; i < src.length ; i++) {
    		array.push([src[i]]);
    	}
    	return array;
    }
    
    /** private: method[afterRender]
     *  Private method called after the panel has been rendered.
     */
    /*afterRender: function() {
        GeoNetwork.NDVIPanel.superclass.afterRender.apply(this, arguments);
        if(!this.ownerCt) {
            this.renderMap();
        } else {
            this.ownerCt.on("move", this.updateMapSize, this);
            this.ownerCt.on({
                "afterlayout": {
                    fn: this.renderMap,
                    scope: this,
                    single: true
                }
            });
        }
    },*/

   
    
});


/** api: xtype = gx_NDVIPanel */
Ext.reg('gn_ndvipanel', GeoNetwork.NDVIPanel); 
