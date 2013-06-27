/**
 * Copyright (c) 2012 jean Pommier, jean.pommier@ige.fr
 * 
 * Published under the GPL license
 */

Ext.namespace("GeoNetwork");

GeoNetwork.NDVIPanel = Ext.extend(Ext.Panel, {
    /** private: method[constructor]
     *  Construct the component.
     */
    constructor: function(config) {
    	GeoNetwork.NDVIPanel.superclass.constructor.call(this, config);
    },
    
    initComponent: function(){
        GeoNetwork.NDVIPanel.superclass.initComponent.call(this);
    	years=null;
    	months = null;
    	days = null;
    	actionsConfig=null;		//actions available config data (left panel). Necessary
    	
    	panels_center 	= null;
    	panels_west		= null;
    	panels_options	= null;
    	
    	
        this.ndviAppState= {
    		buttons			: [],
    		lat				: null,
    		lon				: null,
    		current_index	: null,
    		current_button	: null,
    		current_config	: null
    	};
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

    	//looks like part of the object is shared between instances (don't understand why), and this leads to nice bugs...
    	//console.log(this.ndviAppState.buttons.length);
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
    			toggleGroup		: this.title,
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
	    	var chartid = 'd3_ndvi_chart_place_'+idx;
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
    		fieldLabel	: OpenLayers.i18n('month'),
    		//emptyText	: m_store.getAt(0).get('label'),
    		forceSelection:true,
    	    triggerAction: 'all',
    	    lazyRender	:true,
    	    mode		: 'local',
			store		: m_store,
	        valueField	: 'id',
	        displayField: 'id',
	        width		: 80
    	});
    	var d_store = new Ext.data.ArrayStore({
            id		: 0,
            fields	: ['id'],
            data	: this.arrayify(this.days)
        });
    	var d_combo = new Ext.form.ComboBox({
    		fieldLabel	: OpenLayers.i18n('day'),
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
			text 			: OpenLayers.i18n('apply'),
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
	      	   		html : '<h3>'+OpenLayers.i18n('dash_ChooseDecade')+'</h3>',
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
			var dataurl = OpenLayers.ProxyHostURL+encodeURIComponent(config.chart.url+'&lat='+this.ndviAppState.lat+'&lon='+this.ndviAppState.lon+'&date='+month+day);
		}
		//var dataurl = config.chart.url;
    	//console.log(config.chart.url+'&lat='+this.ndviAppState.lat+'&lon='+this.ndviAppState.lon+'&date='+month+day);
    	//console.log(dataurl);
    	
    	//we remove the element if already there (ie already created, and we APPEND the element...
    	if (d3.select("#"+id).select("svg")) {d3.select("#"+id).select("svg").remove();}
    	
    	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

	    var svg = d3.select("#"+this.id+" #"+id).append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	      .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	    
	    var x = d3.scale.ordinal()
	        .rangeRoundBands([0, width], 0.1);
	
	    var y = d3.scale.linear()
	        .range([height, 0]);
	        
	    var xAxis = d3.svg.axis()
	        .scale(x)
	        .orient("bottom");
	
	    var yAxis = d3.svg.axis()
	        .scale(y)
	        .orient("left");
	
	    d3.tsv(dataurl, function(error, data) {
	      data.forEach(function(d) {
		        d.value = +d.value;
	      });
	      
	      x.domain(data.map(function(d) { return d.year; }));
	    //  y.domain([0, d3.max(data, function(d) { return d.decade1; })]);
	      y.domain([0, 255 ]);
	
	      svg.append("g")
	          .attr("class", "x d3_axis")
	          .attr("transform", "translate(0," + height + ")")
	          .call(xAxis)
	          .selectAll("text") 
	            .style("text-anchor", "end")
	            .attr("dx", "-3")
	            .attr("dy", ".35em")
	            .attr("transform", function(d) {
	                return "rotate(-65)" 
	                });
		
	      svg.append("g")
	          .attr("class", "y d3_axis")
	          .call(yAxis)
	        /*.append("text")
	          .attr("transform", "rotate(-90)")
	          .attr("y", 6)
	          .attr("dy", ".71em")
	          .style("text-anchor", "middle")
	          .text("NDVI")*/;
	      svg.selectAll(".d3_bar")
	          .data(data)
	        .enter().append("rect")
	          .attr("class", "d3_bar")
	          .attr("x", function(d) { return x(d.year); })
	          .attr("width", x.rangeBand())
	          .attr("y", function(d) {return y(d.value); })
	          .attr("height", function(d) { return height - y(d.value); })
	    	.text(function(d) { return d.value; });
	    });
    },
    
    loadNdviYearlyElements: function(config, id) {
     	var y_store = new Ext.data.ArrayStore({
            id		: 0,
            fields	: ['year'],
            data	: this.arrayify(this.years) //needs array in array structure
        });
    	var y_combo = new Ext.form.ComboBox({
    		fieldLabel	: OpenLayers.i18n('year'),
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
			text 			: OpenLayers.i18n('apply'),
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
	      	   		html : "<h3>"+OpenLayers.i18n('dash_ChooseYear')+"</h3>",
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
    	if (year==undefined) { return false ; }
    	var dataurl = OpenLayers.ProxyHostURL+encodeURIComponent(config.chart.url+'&lat='+this.ndviAppState.lat+'&lon='+this.ndviAppState.lon+'&year='+year);
    	//var dataurl = config.chart.url;
    	
    	//we remove the element if already there (ie already created, and we APPEND the element...
    	if (d3.select("#"+id).select("svg")) {d3.select("#"+id).select("svg").remove();}
    	
    	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

	    var svg = d3.select("#"+this.id+" #"+id).append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	      .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	    
	    var x = d3.scale.ordinal()
	        .rangeRoundBands([0, width], 0.05);
	
	    var y = d3.scale.linear()
	        .range([height, 0]);
	        
	    var xAxis = d3.svg.axis()
	        .scale(x)
	        .orient("bottom");
	
	    var yAxis = d3.svg.axis()
	        .scale(y)
	        .orient("left");
	
	    d3.tsv(dataurl, function(error, data) {
	      data.forEach(function(d) {
		        d.decade1 = +d.decade1;
		        d.decade2 = +d.decade2;
		        d.decade3 = +d.decade3;
	      });
	      
	      x.domain(data.map(function(d) { return d.month; }));
	    //  y.domain([0, d3.max(data, function(d) { return d.decade1; })]);
	      y.domain([0, 255 ]);
	
	      svg.append("g")
	          .attr("class", "x d3_axis")
	          .attr("transform", "translate(0," + height + ")")
	          .call(xAxis)
		      /*.append("text")
				    .attr("x", width)
				    .attr("y", 6)
				    .attr("dy", ".71em")
				    .style("text-anchor", "middle")
				    .text("months")*/;
	
	      svg.append("g")
	          .attr("class", "y d3_axis")
	          .call(yAxis)
	       /* .append("text")
	          .attr("transform", "rotate(-90)")
	          .attr("y", 6)
	          .attr("dy", ".71em")
	          .style("text-anchor", "middle")
	          .text("NDVI")*/;
	
	      svg.selectAll(".d3_bar")
	          .data(data)
	        .enter().append("rect")
	          .attr("class", "d3_bar")
	          .attr("x", function(d) { return x(d.month); })
	          .attr("width", x.rangeBand()/3-1)
	          .attr("y", function(d) {return y(d.decade1); })
	          .attr("height", function(d) { return height - y(d.decade1); })
	    	.text(function(d) { return d.decade1; });
	    	
	      svg.selectAll(".d3_bar2")
	          .data(data)
	        .enter().append("rect")
	          .attr("class", "d3_bar2")
	          .attr("x", function(d) { return x(d.month)+x.rangeBand()/3; })
	          .attr("width", x.rangeBand()/3-1)
	          .attr("y", function(d) {return y(d.decade2); })
	          .attr("height", function(d) { return height - y(d.decade2); })
	    	.text(function(d) { return d.decade2; });
	    	
	      svg.selectAll(".d3_bar3")
	          .data(data)
	        .enter().append("rect")
	          .attr("class", "d3_bar3")
	          .attr("x", function(d) { return x(d.month)+2*x.rangeBand()/3; })
	          .attr("width", x.rangeBand()/3-1)
	          .attr("y", function(d) {return y(d.decade3); })
	          .attr("height", function(d) { return height - y(d.decade3); })
	    	.text(function(d) { return d.decade3; });
	  	// add legend   
	  	/*var legend = svg.append("g")
	  	  .attr("class", "legend")
	  	  .attr("x", width - 65)
	  	  .attr("y", 25)
	  	  .attr("height", 100)
	  	  .attr("width", 100);
	  	
	    var g = d3.select(".legend");
	    g.append("rect")
	      .attr("x", width - 65)
	      .attr("y", -40)
	      .attr("width", 10)
	      .attr("height", 10)
	      .style("fill", "#00D455");
	    g.append("text")
	      .attr("x", width - 50)
	      .attr("y", 8)
	      .attr("height",30)
	      .attr("width",100)
	      .style("fill", "#00D455")
	      .text("Decade 1");
	    g.append("rect")
	      .attr("x", width - 65)
	      .attr("y", 20)
	      .attr("width", 10)
	      .attr("height", 10)
	      .style("fill", "#00FF66");
	    g.append("text")
	      .attr("x", width - 50)
	      .attr("y", 28)
	      .attr("height",30)
	      .attr("width",100)
	      .style("fill", "#00FF66")
	      .text("Decade 2");
	    g.append("rect")
	      .attr("x", width - 65)
	      .attr("y", 40)
	      .attr("width", 10)
	      .attr("height", 10)
	      .style("fill", "#55FF99");
	    g.append("text")
	      .attr("x", width - 50)
	      .attr("y", 48)
	      .attr("height",30)
	      .attr("width",100)
	      .style("fill", "#55FF99")
	      .text("Decade 3");*/
	    });
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
