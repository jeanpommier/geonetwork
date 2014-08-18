/*
 * Copyright (C) 2014 Jean Pommier, PI-geosolutions
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or (at
 * your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 * 
 * Contact: jean.pommier@pi-geosolutions.fr
 */
Ext.namespace('GeoNetwork.layers');


/** api: (define)
 *  module = GeoNetwork.layers
 *  class = GeoportalAbstractLayer
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
/** api: constructor 
 *  .. class:: GeoportalAbstractLayer(config)
 *
 *  Create an Abstract layer helper class for the Geoportal
 *  as a basis for real layer helpers (see GeoportalWMSLayer)
 *
 */


GeoNetwork.layers.GeoportalAbstractLayer = Ext.extend(Ext.util.Observable, {
    template : {}, //needs to be properly instanciated in child classes

    treeNode : null,
    form	 : null,
    
    /** private: method[initComponent] 
     */
    initComponent: function(config){
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalWMSLayer.superclass.initComponent.call(this);
                
    },
    
    getTreeNode: function() {
    	if (this.treeNode==null) {
    		this.treeNode=new Ext.tree.TreeNode(this.template);
    		this.treeNode.geoportalLayer=this;
    	}
		return this.treeNode;
    },
    
    getForm: function(conf) {
    	if (this.form) this.form.destroy();
    	this.form = new GeoNetwork.layers.GeoportalAbstractLayerForm(conf);
    	return this.form;
    },
    
    fixNodeConfig: function(attr) {
    	//deal with importing old-style layertree.js file
    	if (attr.layer && attr.text==null) { 
			attr.text = attr.layer;
			attr.leaf=true;
			if (attr.TILED==null && attr.type=="wms") attr.TILED=true;
		}
		if (attr.checked==null && attr.leaf==true) {
			attr.checked = false;
		}
		if (attr.type!='folder' && attr.type!=null) {
			attr.leaf=true;
		} else {
			attr.leaf=false;
			if (attr.children==null) { //empty folder
				//console.log(attr.text);
				attr.loaded=true;
				attr.expanded=true;
				//attr.cls='grey x-tree-node-collapsed';
				attr.iconCls='emptyFolder';
			}
		}
		if (attr.leaf!=true && attr.type==null) {
			//console.log(attr);
			attr.type='folder';
		}    	//fixes some node values
		
		attr.draggable=true;
		if (this.overwrite==true) {
			attr.id = null;
		}
		if (!attr.opacity) {
			attr.opacity=1;
		}
		if (attr.qtip) {
			attr.qcktip = attr.qtip;
		}
		return attr;
    }
});

/** api: xtype = gn_layers_geoportalabstractlayer */
Ext.reg('gn_layers_geoportalabstractlayer', GeoNetwork.layers.GeoportalAbstractLayer);