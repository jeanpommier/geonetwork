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
 *  class = LayertreeManagerPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: LayertreeManagerPanel(config)
 *
 *  Create a GeoNetwork layertree manager panel
 *  to view, order, edit or add nodes in the geoportal widget's layers tree
 *
 */
//Overrides
Ext.tree.TreePanel.nodeTypes.gx_layer = Ext.tree.TreeNode;
Ext.tree.TreePanel.nodeTypes.gx_baselayercontainer = Ext.tree.TreeNode;


GeoNetwork.admin.LayertreeManagerPanel = Ext.extend(Ext.Panel, {
    frame: false,
    defaultConfig: {
        title: OpenLayers.i18n('Manage Layertree'),
        defaultViewMode: 'simple',
        border: false,
        height: 800,
        layout:'border',
        autoWidth : true
    },
    catalogue:null,
    treeView:null,
    detailView:null,
    consoleView : null,
    //deals with Layertree IO features : load, save, export...
    layertreeio : null,
    tree:null, 
    tb:null,
    nodeForm:null,
    backupsListGrid:null,
    groups:null,
    useGroups:true,
    nodeFormFields : {
    	'chart':['gambia','id', 'type','text', 'uuid','legend','source', 'tablenames', 'changeScales', 'charting_fields', 'other_fields', 'format', 'cls', 'qtip', 'context', 'template', 'extensions'],    	
    	'wms':['gambia','id', 'type','text', 'uuid', 'legend', 'url', 'layers', 'format', 'TILED', 'cls', 'qtip', 'extensions'],
    	'folder':['gambia','id', 'type', 'text', 'cls', /*'expanded', */'extensions']
    },
    fieldsOrder : ['id', 'type', 'uuid', 'text', 'url', 'source', 'layers', 'format', 'TILED','legend',
                   'tablenames', 'changeScales', 'charting_fields', 'other_fields','context', 'template',
                   //'expanded', //suppressed : will be managed in the tree panel
                   'cls', 'qtip', 'extensions'],    	
    
    /** private: method[initComponent] 
     *  Initializes the layertree manager panel.
     *  
     */
    initComponent: function(config){
    
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.admin.LayertreeManagerPanel.superclass.initComponent.call(this);
                
        // Build the layout
        this.detailView = new Ext.Panel({
            region: 'east',
            split: true,
            collapsible: true,
            collapsed: false,
            hideCollapseTool: true,
            collapseMode: 'mini',
            autoScroll: true,
            minWidth: 250,
            width: '50%',
            items: []
        });
        this.tb = this.getToolbar();
        this.treeView = new Ext.Panel({
                region: 'center',
                split: true,
                autoScroll: true,
                minHeigth: 300,
                items: null,
                tbar:this.tb
            });
        this.consoleView = new Ext.Panel({
                region: 'south',
                split: true,
                collapsible: true,
                collapsed: false,
                hideCollapseTool: true,
                collapseMode: 'mini',
                autoScroll: true,
                minHeight: 50,
                height: 100,
                html:"&gt; <b>Welcome in the Layertree Management Board</b><br />It allows you to view, edit, add, transform the layers and the structure<br />"
            });
        
        this.add(this.detailView);
        this.add(this.consoleView);
        this.add(this.treeView);

        
        this.tree = this.loadTree(null, false);
        if (this.tree!=null)
        	this.treeView.add(this.tree);
        //this.createForm(this.nodeFormFields, this.fieldsOrder);
        
        //this.backupsListGrid = this.createBackupsGrid();
        //this.detailView.add(this.backupsListGrid);
        window.lm = this;
    },
    /**
     * Load layertree data in an Ext.tree
     * 
     * TODO : 
     */
    loadTree: function(specificConfig,doOverwrite) { //default : specificConfig=null, overwrite=false
		var treepanel=this.getLayertreeIO().loadTree(specificConfig, false);
		treepanel.addListener('click', function(node, event){
								                this.editNode(node);
								            }, this);
	    return treepanel;
    },
    
    /**
     * Builds the form dynamically using the nodeFormFields listed fields, 
     * in the order given by fieldsOrder array
     * 
     * TODO : 
     */
    createForm: function(nodeFormFields, fieldsOrder) {
    	var groupStore = null;
    	if (this.useGroups) groupStore=this.getGroups();
        this.nodeForm = new GeoNetwork.admin.LayerForm({
        	'nodeFormFields':nodeFormFields, 
        	'fieldsOrder':fieldsOrder,
        	'groupStore':groupStore});
        this.nodeForm.parent = this;
        this.detailView.add(this.nodeForm);
        this.detailView.doLayout();
    },
    /**
     * Gets the groups list, to use in the form, in order to define per-node group access rights
     * 
     * TODO : 
     */
    getGroups: function() {
        var lang = catalogue.lang;
        var groupStore = GeoNetwork.data.GroupStore(catalogue.services.getGroups);
        groupStore.load();
        return groupStore;
    },
    
    
    /**
     * Displays the layertree as text, in a popup window
     */
    tree2json: function() {
    	this.getLayertreeIO().tree2json(this.tree);
    },
    /**
     * Prompts for the content of a layertree.js and loads as the layertree
     */
    json2tree: function() {    	
    	this.getLayertreeIO().json2tree(this.treeReload, this);
    },
    /**
     * Reloads the tree structure from DB
     */
    treeReload: function(specificConfig, overwrite) { //default : specificConfig=null, overwrite=false
    	var newtree = this.loadTree(specificConfig, overwrite);
    	if (newtree!=null) {
    		if (this.tree!=null) {
    	    	this.treeView.remove(this.tree);
    	    	this.tree.destroy();
    		}
	    	this.tree = newtree;
	    	this.treeView.add(newtree);
	    	this.treeView.doLayout();
	    	GeoNetwork.admin.Utils.log(this.consoleView,"Layertree successfully reloaded");
	    	if (this.nodeForm)
	    		this.nodeForm.hide();
    	} else {
    		GeoNetwork.admin.Utils.log(this.consoleView,"ERROR: couldn't reload the layertree. Please report to your administrator");
    	}
    },
    /**
     * Restores the tree structure from DB backup table
     */
    createBackupsGrid: function() {
    	var backupsListGrid = new GeoNetwork.admin.BackupGridManager({
    		serviceBaseUrl:this.serviceBaseUrl,
    		hidden:true,
    		parent:this,
    		logWindow:this.consoleView
    	});
    	return backupsListGrid;
    },
    treeRestore: function() { 
    	if (this.nodeForm)
    		this.nodeForm.hide(); //we hide the panel without destroying it
    	if (!this.backupsListGrid)
    		this.backupsListGrid = this.createBackupsGrid();
    	
    	this.backupsListGrid.load();
    	if (!this.detailView.items.contains(this.backupsListGrid)) {
            this.detailView.add(this.backupsListGrid); //add only once. We had to wait for its store to be loaded, before appending to parent container
    	}
    	this.backupsListGrid.show();
    	this.detailView.doLayout()
        return true;
    },

    addFolder: function() {
    	var folder = {
    			type:"folder",
    			text:"new folder",
    			iconCls:folder,
    			leaf:false
    	};
    	this.addNode(folder);
    },
    
    addWMS: function() {
    	var wms = {
    			type:"wms",
    			text:"new wms layer",
    			url: "/geoserver-prod/wms?",
    			format:"image/png",
    			TILED:true,
    			checked:false,
    			leaf:true
    	};
    	this.addNode(wms);
    },
    
    addChart: function() {
    	var chart = {
			type:"chart",
			text:"new chart layer",
			source:"gm_census",
			format:"geojson",
			tablenames:'table1,table2,...',
			changeScales:"2500000,0",
			checked:false,
			leaf:true
    	};
    	this.addNode(chart);
    },
    addNode: function(tpl) {
    	var node = this.tree.getSelectionModel().getSelectedNode();
    	if (node==null) {
    		Ext.Msg.alert('Add node', 'Please first select a parent node in the tree');
    		return false;
    	}
    	if (node.leaf) { //we can add a node only to a folder
    		node = node.parentNode;
    	}
    	var child = new Ext.tree.TreeNode(tpl);
     	node.appendChild(child);
     	//selects and loads the node in the edit form
     	this.tree.getSelectionModel().select(child);
        this.editNode(child);
    	return true;
    },
    editNode:function(node) {
    	if (this.backupsListGrid)
    		this.backupsListGrid.hide();
    	if (!this.nodeForm)
    		this.createForm(this.nodeFormFields, this.fieldsOrder);
    	
    	this.nodeForm.show();
        this.nodeForm.editNode(node);
    },
    
    removeNode: function() {
    	var node = this.tree.getSelectionModel().getSelectedNode();
    	if (node==null) {
    		Ext.Msg.alert('You need to select a node, first');
    		return false;
    	}
    	var msg  ="You are about to delete the node "+node.text;
    	if (node.hasChildNodes()) {
    		msg += "<br /> <b>It will remove also all its child nodes. Be very careful !";
    	}
    	Ext.MessageBox.show({
    		icon: Ext.MessageBox.WARNING,
            title: OpenLayers.i18n("Delete node"), 
            msg: OpenLayers.i18n(msg),
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function(btn) {
            	if (btn=='ok') {
            		node.remove(true);
            		GeoNetwork.admin.Utils.log(this.consoleView,"Removed node "+node.text);
            	}
            },
            scope:this
        });
    	return true;
    },
    duplicateNode: function() {
    	var node = this.tree.getSelectionModel().getSelectedNode();
    	if (node==null) {
    		Ext.Msg.alert('You need to select a node, first');
    		return false;
    	}
    	var parent = node.parentNode;
    	var tpl = GeoNetwork.admin.Utils.clone(node.attributes);
    	delete tpl.id; //it needs a new id, generated by extjs will be fine (as for added nodes)
    	tpl.text = tpl.text+" (copy)";
    	var child = new Ext.tree.TreeNode(tpl);
    	parent.appendChild(child);
     	//selects and loads the node in the edit form
     	this.tree.getSelectionModel().select(child);
        this.editNode(child);
    	
    	return true;
    },
    
    getToolbar: function() {
    	//TREE actions
       	var action_2json = new Ext.Action({
    		text:'Export as Json',
    		iconCls:'export',
    		handler: this.tree2json,
    	    itemId: 'tree2json',
    	    scope:this
    	});
       	var action_import = new Ext.Action({
    		text:'Import from Json',
    		iconCls:'import',
    		handler: this.json2tree,
    	    itemId: 'json2tree',
    	    scope:this
    	});
    	var action_save = new Ext.Action({
    		text:'Save to DB',
    		iconCls:'save',
    		handler: function() {
    			Ext.MessageBox.prompt('Name', 'Please give it a name:', function(btn, text) {
    				this.getLayertreeIO().treeSave(this.tree, text, false, this.treeReload, this);
    			},this);
    		},
    	    itemId: 'treesave',
    	    scope:this
    	});
    	var action_reload = new Ext.Action({
    		text:'Reload',
    		iconCls:'reload',
    		handler: function() {
    			this.treeReload(null, false);
    		},
    	    itemId: 'treereload',
    	    scope:this
    	});
    	var action_restore = new Ext.Action({
    		text:'Restore previous version',
    		iconCls:'restore',
    		handler: this.treeRestore,
    	    itemId: 'treerestore',
    	    scope:this
    	});
        var tree_menu = new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                    action_save,
                    action_reload,
                    action_2json,
                    action_import,
                    action_restore
            ]
        });
        //ADD actions
    	var action_addfolder = new Ext.Action({
    		text:'Add folder',
    		iconCls:'folder',
    		handler: this.addFolder,
    	    itemId: 'addfolder',
    	    scope:this
    	});
    	var action_addwms = new Ext.Action({
    		text:'Add WMS layer (default)',
    		iconCls:'wms',
    		handler: this.addWMS,
    	    itemId: 'addwms',
    	    scope:this
    	});
    	var action_addchart = new Ext.Action({
    		text:'Add chart',
    		iconCls:'chart',
    		handler: this.addChart,
    	    itemId: 'addchart',
    	    scope:this
    	});
        var add_menu = new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                    action_addfolder,
                    action_addwms,
                    action_addchart
            ]
        });
        //REMOVE actions
    	var action_remove = new Ext.Action({
    		text:'Remove',
    		iconCls:'remove',
    		handler: this.removeNode,
    	    itemId: 'removenode',
    	    scope:this
    	});
        //DUPLICATE actions
    	var action_duplicate = new Ext.Action({
    		text:'Duplicate',
    		iconCls:'duplicate',
    		handler: this.duplicateNode,
    	    itemId: 'duplicatenode',
    	    scope:this
    	});



        var tb = new Ext.Toolbar();
        tb.add({
	            text:'Tree',
	            iconCls: 'tree',  // <-- icon
	            menu: tree_menu  // assign menu by instance
	        },{
	            text:'Add',
	            iconCls: 'add',  // <-- icon
	            menu: add_menu  // assign menu by instance
	        },
	        action_remove,
	        action_duplicate
        );
        return tb;
    },
    
    getLayertreeIO : function() {
    	if (!this.layertreeio) {
    		//deals with Layertree IO features : load, save, export...
            this.layertreeio = new GeoNetwork.admin.LayertreeIO({
            	serviceBaseUrl : this.serviceBaseUrl,
            	verbose:true,
            	logWindow:this.consoleView
            });
    	}
    	return this.layertreeio;
    },
    /**
     * Utils
     * */
    clone: function(obj) {
    	var newobj = {};
    	return Ext.apply(newobj, obj);
    }

});

/** api: xtype = gn_admin_LayertreeManagerPanel */
Ext.reg('gn_admin_layertreemanagerpanel', GeoNetwork.admin.LayertreeManagerPanel);