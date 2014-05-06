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
Ext.namespace('GeoNetwork.admin');


/** api: (define)
 *  module = GeoNetwork.admin
 *  class = LayerForm
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: LayerForm(config)
 *
 *  Creates an specific form, for node attributes edition 
 *  (layer parameters' edition, actually)
 *
 */

GeoNetwork.admin.LayerForm = Ext.extend(Ext.form.FormPanel, {
    id: 'node-form',
    labelWidth:75,
    frame:true,
    labelAlign: 'left',
    title: 'node details', 
    defaultType: 'textfield',
    defaults: {width: '90%', 'hidden':true},
    autoHeight: true,
    border: false,
    
    nodeFormFields : null, //should be initialized by constructor. See LayertreeManager class
    fieldsOrder : null, //idem
    currentNode:null,
    
    /** private: method[initComponent] 
     *  Initializes the form panel
     *  
     *  TODO : 
     */
    initComponent: function(config){
    	var me=this;
    	this.buttons = [{
            text: 'Apply',
            //iconCls:'icon-disk',
            handler:this.applyChanges,
            scope:this
        },{
            text: 'Cancel changes',
            handler: function(button, event) {
            	this.editNode(this.currentNode);
            },
            scope:this
        }];
    	
    	
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.admin.LayerForm.superclass.initComponent.call(this);
                
        if (this.nodeFormFields!=null) {
        	this.Build();
        }
    },
    
    /** private: method[Build] 
     *  Builds the form itself
     *  
     *  TODO : 
     */
    Build: function() {
    	var items = [];
    	var tmp = [];
		Ext.each(this.fieldsOrder, function (fname, index) {
			if (tmp.indexOf(fname) < 0 ) {
				tmp.push(fname); //used to remove duplicates
				switch(fname) {
    				case 'id': //will use the next statement
    				case 'type':
    					items.push({
	    		            fieldLabel: fname,
	    		            name: fname,
	    		            disabled:true
	    		        });
    					break;
    				case 'checked': //will use the next statement
    				//case 'expanded': //will use the next statement
    				case 'leaf': 
    					items.push({
    			        	xtype: 'checkbox',
    			            fieldLabel: fname,
    			            //inputValue:true,
    			            name: fname,
    			            value:false
    			        });
    					break;
    				case 'TILED':
    					items.push({
    			        	xtype: 'checkbox',
    			            fieldLabel: fname,
    			            //inputValue:false,
    			            name: fname,
    			            value:true
    			        });
    					/*items.push({
		            	xtype: 'combo',
		                fieldLabel: fname,
		                name: fname,
		                typeAhead: true,
		                triggerAction: 'all',
		                lazyRender:true,
		                mode: 'local',
		                store: new Ext.data.ArrayStore({
		                    id: 0,
		                    fields: [
		                        'value',
		                        'text'
		                    ],
		                    data: [[true, 'Yes'],[false, 'No']]
		                }),
		                valueField: 'value',
		                displayField: 'text'
		            });*/
    					break;
					case 'extensions':
						items.push({
							xtype : 'textarea',
							fieldLabel : fname,
							name : fname
						});
						break;
					case 'format':
						items.push({
				            xtype: 'radiogroup',
				            columns: 'auto',
				            fieldLabel: 'Image format',
				            name:'format', //necessary for hide/show procedures
				            items: [{
				                name: 'format',
				                inputValue: 'image/png',
				                boxLabel: 'PNG'
				            }, {
				                name: 'format',
				                inputValue: 'image/jpg',
				                boxLabel: 'JPG'
				            }]
				        });
						break;
					default:
        				items.push({
    			            fieldLabel: fname,
    			            name: fname
    			        });
				}
			}
		}, this);
    	
    	this.add(items);
    },

    /**
     * Loads node attributes in the form
     * 
     * TODO : 
     */
    editNode: function(node) {
    	//builds the form structure corresponding to the node type
    	if (node.attributes.type) {
    		this.initForm(node.attributes.type);
    	} else {
        	this.getForm().reset();
    	}
    	//fixes somes node values
    	if (node.attributes.TILED==null) {
    		node.attributes.TILED=true;
    	}
    	//loads the node values in the form
    	this.getForm().setValues(node.attributes);
    	this.currentNode=node;
    },

    /**
     * Resets the form : 
     * - resets the content
     * - hides/shows the fields depending on the node type
     * 
     * TODO : 
     */
    initForm: function(type) {
     	this.getForm().reset();
     	
     	Ext.each(this.getForm().items.items, function(field,index) {
     		if (this.nodeFormFields[type].indexOf(field.name)>=0) {
     			field.show();
     		} else {
         		field.hide();
     		}
     	}, this);
    },
    
    /**
     * Applies the changes in the form to the node attributes & display in the tree
     * 
     * TODO : 
     */
    applyChanges: function(button, event) {
    	var node = this.currentNode;
		if (node!=null) {
			var values = this.getForm().getFieldValues();
			//collect the relevant data
			var attr={};
			Ext.iterate(values, function(key, value) {
				if (this.nodeFormFields[node.attributes.type].indexOf(key)>=0) {
					attr[key]=value;
				}
			}, this)
			//specifics
			if (attr.format!=null) {
				attr.format = attr.format.inputValue;
			}
			attr.layer=attr.text;

			//apply on node
			Ext.apply(node.attributes,attr);
			node.setText(attr.text);
			console.log(node);
			console.log(attr);
		}
    }


});

/** api: xtype = gn_admin_LayerForm */
Ext.reg('gn_admin_layerform', GeoNetwork.admin.LayerForm);