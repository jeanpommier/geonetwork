/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt
 *  class = ShortcutsPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */

Ext.namespace('GeoExt');

/** api: constructor
 *  .. class:: PratiquesGDTComboPanel(config)
 *
 *  A panel showing legends of all layers in a layer store.
 *  Depending on the layer type, a legend renderer will be chosen.
 */
GeoExt.PratiquesGDTComboPanel = Ext.extend(Ext.Panel, {

  	map:null,
  	config:null,
  	entete:null,
  	sc_combos:[],
  	cbWidth:150,
  	cbListWidth:145,
  	resetBtn:null,
  	vectorMark_radius:6,
  	vectorLayer:null,
    vectorMark_styles:[new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({pointRadius:3, fillOpacity: 0.1}, OpenLayers.Feature.Vector.style["default"])),
    					new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({pointRadius:6, fillOpacity: 0.4}, OpenLayers.Feature.Vector.style["default"])),
    					new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({pointRadius:8, fillOpacity: 0.8}, OpenLayers.Feature.Vector.style["default"]))],
                      
    /** private: method[initComponent]
     *  Initializes the legend panel.
     */
    initComponent: function() {
        GeoExt.PratiquesGDTComboPanel.superclass.initComponent.call(this);
        if (this.entete===null) {
        	this.entete = this.config.title;
        }
        this.add({html:this.entete,border:false,width:'auto'});
        if (this.config.items!==null) {
        	for (var i=0 ; i<this.config.items.length ; i++) {
        		var cb = this.createCombo(this.config.items[i],i);
        		this.sc_combos.push(cb);
        		this.add(cb);
        	}
        }
        this.resetBtn = new Ext.Button({text:OpenLayers.i18n('reset'),cls:'pratiquesResetBtn',disabled:true});
        this.add(this.resetBtn);
        this.resetBtn.on('click', function(btn, event) {
        	if (this.map.getLayerIndex(this.vectorLayer)!==-1)
        		this.map.removeLayer(this.vectorLayer);
        		
    		if (this.sc_combos.length>0) {
        		for (var i=0 ; i<this.sc_combos.length ; i++) {
        			this.sc_combos[i].reset();
        			if (i>0)
        				this.sc_combos[i].disable();
        		}
    		}
    		btn.disable();
        },this);
        if (this.sc_combos.length>0) {
        	for (var i=0 ; i<this.sc_combos.length ; i++) {
        		this.manageEvents(this.sc_combos, i, this.map);
        	}
        }
    },
    
    createCombo: function(conf, i) {
    	var map_fields = [
		           // set up the fields mapping into the xml doc
		           {name: 'id', mapping:'@id'},
		           {name: 'nom'}
		       ];
		for (var k = 1 ; k <= i ; k++) {
			map_fields.push({name:'up'+k}); //adds fields for linking with upper levels (if there are..)
		}
		
    	var mystore = new Ext.data.Store({
    		storeidx	: i, //used to know where this store is placed within the whole stores set
		    remoteSort    : false,
         	autoLoad    : { params:
                               {start:0, limit:2}
                            },
			proxy : new Ext.data.HttpProxy ({
					url : conf.url
				}),

		    // the return will be XML, so lets set up a reader
		    reader: new Ext.data.XmlReader({
		           // records will have an "emprise" tag
		           record: 'element',
		           id: '@id'
		       }, map_fields),
		    sortInfo : {field: "nom", direction: "ASC"}
        });
    
    	var mycombo = new Ext.form.ComboBox({
      					store: mystore,
					  	displayField:'nom',
					  	width:this.cbWidth,
					  	listWidth:this.cbListWidth,
						forceSelection: true,
						triggerAction: 'all',
						emptyText:conf.nom,
						selectOnFocus:true,
						disabled:(i!=0)
				  	});
				  	
	  	return mycombo;
    },
    
    manageEvents: function(combos, i, map) {
    	combos[i].on('select', function(combo, record, index) {
    		this.resetBtn.enable();
		    var bbox = new OpenLayers.Bounds(
		                                  parseFloat(record.get('xUL')),
		                                  parseFloat(record.get('yLR')),
		                                  parseFloat(record.get('xLR')),
		                                  parseFloat(record.get('yUL'))
		                              );
		      
		    this.selectedRecord = record; 
		    
		    for (var j=i+1 ; j < combos.length ; j++) {
		    	combos[j].clearValue();
				combos[j].enable();
		    	
				if ((record.id!=="-1")) { //ie si on a choisi une entrée réelle
					var indx = j-i;
					combos[j].store.filter('up'+indx, record.id); //marche si le combo a déjà été chargé une fois (sinon, cf store_communes.on('load'... )
				}
		    }
		    
		    if (i==combos.length-1) {
		    	var store_zonagesPratique = new Ext.data.Store({
				  // load using HTTP
				  url: this.config.mapUrl+record.get('id'),

				  // the return will be XML, so lets set up a reader
				  reader: new Ext.data.XmlReader({
				         // records will have an "emprise" tag
				         record: 'element',
				         id: '@id'
				     }, [
				         // set up the fields mapping into the xml doc
				         {name: 'id', mapping:'@id'},
				         {name: 'nom'},
				         {name: 'lat'},
				         {name: 'lon'},
				         {name: 'importance'}
				     ]),
				  sortInfo : {field: "importance", direction: "ASC"}
				});
				store_zonagesPratique.load();
				
				store_zonagesPratique.on('load', function(store) { 
				  var style=OpenLayers.Util.extend({
									pointRadius: "${importance}",
									fillOpacity: 0.8
								}, OpenLayers.Feature.Vector.style['default']);
				  if (this.vectorLayer==null)
				  {
				    this.vectorLayer = new OpenLayers.Layer.Vector("Pratiques GDT", {style: style});
				    this.map.addLayer(this.vectorLayer);
				  }
				  else {
				    this.vectorLayer.destroyFeatures();
				    this.map.addLayer(this.vectorLayer);//pour contrer l'effet d'une suppression via le layer manager ('organiser') qui retire la couche de la carte
			      }
			      var me = this;
				  store.each(function (record) {
				    var point = new OpenLayers.Geometry.Point(record.get("lon"), record.get("lat"));
				    point.transform(
		                    new OpenLayers.Projection("EPSG:4326"),
		                    me.map.getProjectionObject()
					      );
				    var pointFeature = new OpenLayers.Feature.Vector(point,{});
				    this.vectorLayer.addFeatures([pointFeature]);
				    pointFeature.style.fillOpacity=0.33*record.get("importance");
				    pointFeature.style.strokeOpacity=0.4+0.2*record.get("importance");
				    pointFeature.style.pointRadius=1+record.get("importance");
				    this.vectorLayer.redraw();
				  },this);
  			      this.vectorLayer.redraw();
				},this);
		    }
	  	},this);
	  	
	  	combos[i].store.on('load', function(store) { //sert au moment du premier chargement. Le reste du temps, c'est réalisé directement par une directive filter dans l'évènement select. Cf ci-dessus
	  		for (l = store.storeidx ; l >0 ; l--) {
	  			if ((this.sc_combos[l-1].selectedRecord!=null)&& (this.sc_combos[l-1].selectedRecord.id!=="-1")) {
	  				var indx = store.storeidx - l +1;
	  				store.filter('up'+indx, this.sc_combos[l-1].selectedRecord.id);
	  				break;
  				}
	  		}
	  		/*if ((combo_regions.selectedRecord!=null)&& (combo_regions.selectedRecord.id!=="0"))
		      this.filter('up', combo_regions.selectedRecord.id);*/
	  	}, this);
    },
    
    /** private: method[onRender]
     *  Private method called when the legend panel is being rendered.
     */
    onRender: function() {
        GeoExt.PratiquesGDTComboPanel.superclass.onRender.apply(this, arguments);
    },

    /** private: method[onDestroy]
     *  Private method called during the destroy sequence.
     */
    onDestroy: function() {
        /*if(this.layerStore) {
            this.layerStore.un("add", this.onStoreAdd, this);
            this.layerStore.un("remove", this.onStoreRemove, this);
            this.layerStore.un("update", this.onStoreUpdate, this);
        }*/
        GeoExt.PratiquesGDTComboPanel.superclass.onDestroy.apply(this, arguments);
    }
    
});

/** api: xtype = gx_pratiquescombopanel */
Ext.reg('gx_pratiquescombopanel', GeoExt.PratiquesGDTComboPanel);
