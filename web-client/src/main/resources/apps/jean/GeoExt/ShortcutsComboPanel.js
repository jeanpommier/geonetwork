/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt
 *  class = ShortcutsComboPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */

Ext.namespace('GeoExt');

/** api: constructor
 *  .. class:: ShortcutsComboPanel(config)
 *
 *  A panel showing legends of all layers in a layer store.
 *  Depending on the layer type, a legend renderer will be chosen.
 */
GeoExt.ShortcutsComboPanel = Ext.extend(Ext.Panel, {

  	map:null,
  	config:null,
  	cbWidth:150,
  	cbListWidth:145,
  	entete:'<h1 class="soberH1">Entités administratives</h1>',
  	sc_combos:[],
                      
    /** private: method[initComponent]
     *  Initializes the legend panel.
     */
    initComponent: function() {
        GeoExt.ShortcutsComboPanel.superclass.initComponent.call(this);
        this.add({html:this.entete,border:false,width:'auto'});
        if (this.config!==null) {
        	for (var i=0 ; i<this.config.length ; i++) {
        		var cb = this.createCombo(this.config[i],i);
        		this.sc_combos.push(cb);
        		this.add(cb);
        	}
        }
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
		           {name: 'nom'},
		           {name: 'yUL'},
		           {name: 'yLR'},
		           {name: 'xLR'},
		           {name: 'xUL'}
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
		           record: 'emprise',
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
						selectOnFocus:true
				  	});
				  	
	  	return mycombo;
    },
    
    manageEvents: function(combos, i, map) {
    	var me=this;
    	combos[i].on('select', function(combo, record, index) {
		    var bbox = new OpenLayers.Bounds(
		                                  parseFloat(record.get('xUL')),
		                                  parseFloat(record.get('yLR')),
		                                  parseFloat(record.get('xLR')),
		                                  parseFloat(record.get('yUL'))
		                              );
		    bbox.transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    me.map.getProjectionObject()
		      );
		    if (map!=null)
		      map.zoomToExtent(bbox);
		      
		    this.selectedRecord = record; 
		    
		    for (var j=i+1 ; j < combos.length ; j++) {
		    	combos[j].clearValue();
		    	
				if ((record.id!=="-1")) { //ie si on a choisi une entrée réelle
					var indx = j-i;
					combos[j].store.filter('up'+indx, record.id); //marche si le combo a déjà été chargé une fois (sinon, cf store_communes.on('load'... )
				}
		    }
	  	});
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
        GeoExt.ShortcutsComboPanel.superclass.onRender.apply(this, arguments);
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
        GeoExt.ShortcutsComboPanel.superclass.onDestroy.apply(this, arguments);
    }
    
});

/** api: xtype = gx_shortcutscombopanel */
Ext.reg('gx_shortcutscombopanel', GeoExt.ShortcutsComboPanel);
