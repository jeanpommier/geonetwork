Ext.namespace('GeoNetwork');

var catalogue;
var app;



GeoNetwork.app = function(){
    // private vars:
    var geonetworkUrl;
    var searching = false;
    var editorWindow;
    var editorPanel;
    var cookie;
    
    /**
     * Application parameters are :
     *
     *  * any search form ids (eg. any)
     *  * mode=1 for visualization
     *  * advanced: to open advanced search form by default
     *  * search: to trigger the search
     *  * uuid: to display a metadata record based on its uuid
     *  * extent: to set custom map extent
     */
    var urlParameters = {};
    
    /**
     * Catalogue manager
     */
    var catalogue;
    
    /**
     * An interactive map panel for data visualization
     */
    var iMap;
    
    var appToolbar;
    
    var dataTabPanel;
    
    var searchForm;
    
    var resultsPanel;
    
    var metadataResultsView;
    
    var tBar, bBar, tBar2;
    
    var mainTagCloudViewPanel, tagCloudViewPanel, infoPanel;
    
    var visualizationModeInitialized = false;
    
    // private function:
    /**
     * Create a radio button switch in order to change perspective from a search
     * mode to a map visualization mode.
     */
    function createModeSwitcher(){
        var ms = {
            xtype: 'radiogroup',
            id: 'ms',
            hidden: !GeoNetwork.MapModule,
            items: [{
                name: 'mode',
                ctCls: 'mn-main',
                boxLabel: OpenLayers.i18n('discovery'),
                id: 'discoveryMode',
                width: 110,
                inputValue: 0,
                checked: true
            }, {
                name: 'mode',
                ctCls: 'mn-main',
                width: 140,
                boxLabel: OpenLayers.i18n('visualization'),
                id: 'visualizationMode',
                inputValue: 1
            }],
            listeners: {
                change: function(rg, checked){
                    app.switchMode(checked.getGroupValue(), false);
                    /* TODO : update viewport */
                }
            }
        };
        
        return new Ext.form.FormPanel({
            renderTo: 'mode-form',
            border: false,
            layout: 'hbox',
            items: ms
        });
    }
    
    
    function initMap(){
        iMap = new GeoNetwork.mapApp();
        var scales = [500000000, 250000000, 125000000, 70000000, 35000000, 17500000, 10000000, 5000000, 2500000, 1000000, 500000, 250000, 100000, 50000, 25000, 15000, 10000, 5000, 2000]; 
        iMap.init(GeoNetwork.map.BACKGROUND_LAYERS, GeoNetwork.map.MAIN_MAP_OPTIONS, scales);
        metadataResultsView.addMap(iMap.getMap());
        visualizationModeInitialized = true;
        var lt = Ext.getCmp('toctree');
        lt.lines=true;
        /****** Loads the associated metadata when a layer is ask for metadata **********/
        lt.on('showMetadataByUuid', function(evt, layer) {
        	if (layer.uuid) {
        		catalogue.metadataShow(layer.uuid);
        	}
        });
        
        Ext.getCmp('organizeTab').add(lt);
        //var printp = Ext.getCmp('printPanel');
//console.log(printp);
        var msp = Ext.getCmp('mapViewportEastPanel');
        iMap.getViewport().remove(msp);
    }
    
   
    /**
     * Create a language switcher mode
     *
     * @return
     */
    function createLanguageSwitcher(lang){
        return new Ext.form.FormPanel({
            renderTo: 'lang-form',
            width: 120,
            border: false,
            layout: 'hbox',
            hidden:  GeoNetwork.Util.locales.length === 1 ? true : false,
            items: [new Ext.form.ComboBox({
                mode: 'local',
                triggerAction: 'all',
                width: 80,
                store: new Ext.data.ArrayStore({
                    idIndex: 0,
                    fields: ['id', 'name'],
                    data: GeoNetwork.Util.locales
                }),
                valueField: 'id',
                displayField: 'name',
                value: lang,
                listeners: {
                    select: function(cb, record, idx){
                        window.location.replace('?hl=' + cb.getValue());
                    }
                }
            })]
        });
    }
    
    
    /**
     * Create a default login form and register extra events in case of error.
     *
     * @return
     */
    function createLoginForm(){
        var loginForm = new GeoNetwork.LoginForm({
        	renderTo: 'login-form',
            catalogue: catalogue,
            layout: 'hbox',
            width:340,
            hideLoginLabels: GeoNetwork.hideLoginLabels
        });
        
        catalogue.on('afterBadLogin', loginAlert, this);

        // Store user info in cookie to be displayed if user reload the page
        // Register events to set cookie values
        catalogue.on('afterLogin', function(){
            var cookie = Ext.state.Manager.getProvider();
            cookie.set('user', catalogue.identifiedUser);
        });
        catalogue.on('afterLogout', function(){
            var cookie = Ext.state.Manager.getProvider();
            cookie.set('user', undefined);
        });
        
        // Refresh login form if needed
        var cookie = Ext.state.Manager.getProvider();
        var user = cookie.get('user');
        if (user) {
            catalogue.identifiedUser = user;
            loginForm.login(catalogue, true);
        }
    }
    
    /**
     * Error message in case of bad login
     *
     * @param cat
     * @param user
     * @return
     */
    function loginAlert(cat, user){
        Ext.Msg.show({
            title: 'Login',
            msg: 'Login failed. Check your username and password.',
            /* TODO : Get more info about the error */
            icon: Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK
        });
    }
    
    /**
     * Create a default search form with advanced mode button
     *
     * @return
     */
    function createSearchForm(){
        
                // Add advanced mode criteria to simple form - start
        var advancedCriteria = [];
        var services = catalogue.services;
//        var orgNameField = new GeoNetwork.form.OpenSearchSuggestionTextField({
//            hideLabel: false,
//            minChars: 0,
//            hideTrigger: false,
//            url: services.opensearchSuggest,
//            field: 'orgName', 
//            name: 'E_orgName', 
//            fieldLabel: OpenLayers.i18n('org')
//        });
        // Multi select organisation field 
        var orgNameStore = new GeoNetwork.data.OpenSearchSuggestionStore({
            url: services.opensearchSuggest,
            rootId: 1,
            baseParams: {
                field: 'orgName'
            }
        });
        var orgNameField = new Ext.ux.form.SuperBoxSelect({
            hideLabel: false,
            minChars: 0,
            queryParam: 'q',
            hideTrigger: false,
            id: 'E_orgName',
            name: 'E_orgName',
            store: orgNameStore,
            valueField: 'value',
            displayField: 'value',
            valueDelimiter: ' or ',
//            tpl: tpl,
            fieldLabel: OpenLayers.i18n('org')
        });
        
        var fileFormatStore = new GeoNetwork.data.OpenSearchSuggestionStore({
            url: services.opensearchSuggest,
            rootId: 1,
            baseParams: {
                field: 'format'
            }
        });
        var fileFormatField = new Ext.ux.form.SuperBoxSelect({
            hideLabel: false,
            minChars: 0,
            queryParam: 'q',
            hideTrigger: false,
            id: 'E_format',
            name: 'E_format',
            store: fileFormatStore,
            valueField: 'value',
            displayField: 'value',
            valueDelimiter: ' or ',
//            tpl: tpl,
            fieldLabel: OpenLayers.i18n('Format')
        });
        
        
        
        
        // Multi select keyword
        var themekeyStore = new GeoNetwork.data.OpenSearchSuggestionStore({
            url: services.opensearchSuggest,
            rootId: 1,
            baseParams: {
                field: 'keyword'
            }
        });
//        FIXME : could not underline current search criteria in tpl
//        var tpl = '<tpl for="."><div class="x-combo-list-item">' + 
//            '{[values.value.replace(Ext.getDom(\'E_themekey\').value, \'<span>\' + Ext.getDom(\'E_themekey\').value + \'</span>\')]}' + 
//          '</div></tpl>';
        var themekeyField = new Ext.ux.form.SuperBoxSelect({
            hideLabel: false,
            minChars: 0,
            queryParam: 'q',
            hideTrigger: false,
            id: 'E_themekey',
            name: 'E_themekey',
            store: themekeyStore,
            valueField: 'value',
            displayField: 'value',
            valueDelimiter: ' or ',
//            tpl: tpl,
            fieldLabel: OpenLayers.i18n('keyword')
//            FIXME : Allow new data is not that easy
//            allowAddNewData: true,
//            addNewDataOnBlur: true,
//            listeners: {
//                newitem: function(bs,v, f){
//                    var newObj = {
//                            value: v
//                        };
//                    bs.addItem(newObj, true);
//                }
//            }
        });
        
        
        var when = new Ext.form.FieldSet({
            title: OpenLayers.i18n('when'),
            autoWidth: true,
            //layout: 'row',
            defaultType: 'datefield',
            collapsible: true,
            collapsed: true,
            items: GeoNetwork.util.SearchFormTools.getWhen()
        });
        
        
        var catalogueField = GeoNetwork.util.SearchFormTools.getCatalogueField(services.getSources, services.logoUrl, true);
        var groupField = GeoNetwork.util.SearchFormTools.getGroupField(services.getGroups, true);
        var metadataTypeField = GeoNetwork.util.SearchFormTools.getMetadataTypeField(true);
        var categoryField = GeoNetwork.util.SearchFormTools.getCategoryField(services.getCategories, '../images/default/category/', true);
        var validField = GeoNetwork.util.SearchFormTools.getValidField(true);
        var spatialTypes = GeoNetwork.util.SearchFormTools.getSpatialRepresentationTypeField(null, true);
        var denominatorField = GeoNetwork.util.SearchFormTools.getScaleDenominatorField(true);
        var statusField = GeoNetwork.util.SearchFormTools.getStatusField(services.getStatus, true);
        
        advancedCriteria.push(themekeyField, fileFormatField, orgNameField, categoryField, 
                                when, spatialTypes, denominatorField, 
                                //catalogueField, 
                                groupField, 
                                metadataTypeField, validField, statusField);
        var adv = {
            xtype: 'fieldset',
            title: OpenLayers.i18n('advancedSearchOptions'),
            autoHeight: true,
            autoWidth: true,
            collapsible: true,
            collapsed: urlParameters.advanced!==undefined ? false : true,
            defaultType: 'checkbox',
            defaults: {
                width: 160
            },
            items: advancedCriteria
        };
        
        var formItems = [];
        /*formItems.push(GeoNetwork.util.SearchFormTools.getSimpleFormFields(catalogue.services, 
                    GeoNetwork.map.BACKGROUND_LAYERS, GeoNetwork.map.MAP_OPTIONS, true, 
                    GeoNetwork.searchDefault.activeMapControlExtent, undefined, {width: 290},true),
                    adv);
                    */
        formItems.push(GeoNetwork.util.jpSearchFormTools.getSimpleFormFields(catalogue.services, 
                true, undefined, true),
                //GeoNetwork.util.jpSearchFormTools.getGeographicFormFields(iMap.getMap(), true),
                adv,
                GeoNetwork.util.SearchFormTools.getOptions());
        // Add advanced mode criteria to simple form - end
        
        
        // Hide or show extra fields after login event
        var adminFields = [groupField, metadataTypeField, validField, statusField];
        Ext.each(adminFields, function(item){
            item.setVisible(false);
        });
        
        catalogue.on('afterLogin', function(){
            Ext.each(adminFields, function(item){
                item.setVisible(true);
            });
        });
        catalogue.on('afterLogout', function(){
            Ext.each(adminFields, function(item){
                item.setVisible(false);
            });
        });
        
        
        return new Ext.FormPanel({
            id: 'searchForm',
            border: false,
            //autoShow : true,
            padding: 5,
            //autoHeight : true,
            defaults: {
                width : 180
            },
            listeners: {
                afterrender: function(){
                }
            },
            items: formItems,
            buttons: [{
                tooltip: OpenLayers.i18n('resetSearchForm'),
                // iconCls: 'md-mn-reset',
                id: 'resetBt',
                icon: '../images/default/cross.png',
                listeners: {
                    click: function(){
                        Ext.getCmp('searchForm').getForm().reset();
                    }
                }
            }, {
                text: OpenLayers.i18n('search'),
                id: 'searchBt',
                icon: '../js/GeoNetwork/resources/images/default/find.png',
                // FIXME : iconCls : 'md-mn-find',
                iconAlign: 'right',
                listeners: {
                    click: function(){
                    
                        if (Ext.getCmp('geometryMap')) {
                           metadataResultsView.addMap(Ext.getCmp('geometryMap').map, true);
                        }
                        var any = Ext.get('E_any');
                        if (any) {
                            if (any.getValue() === OpenLayers.i18n('fullTextSearch')) {
                                any.setValue('');
                            }
                        }
                        
                        catalogue.startRecord = 1; // Reset start record
                        search();
                    }
                }
            }]
        });
    }
    
    function search(){
        searching = true;
        catalogue.search('searchForm', app.loadResults, null, catalogue.startRecord, true);
    }
    
    function initPanels(){
        var infoPanel = Ext.getCmp('infoPanel'), 
        resultsPanel = Ext.getCmp('resultsPanel'),
        tagCloudPanel = Ext.getCmp('tagCloudPanel');
        if (infoPanel.isVisible()) {
            infoPanel.hide();
        }
        if (!resultsPanel.isVisible()) {
            resultsPanel.show();
        }
        if (!tagCloudPanel.isVisible()) {
            tagCloudPanel.show();
        }
        
        // Init map on first search to prevent error
        // when user add WMS layer without initializing
        // Visualization mode
        if (GeoNetwork.MapModule && !visualizationModeInitialized) {
            initMap();
        }
    }
    /**
     * Bottom bar
     *
     * @return
     */
    function createBBar(){
    
        var previousAction = new Ext.Action({
            id: 'previousBt',
            text: '&lt;&lt;',
            handler: function(){
            	var from = catalogue.startRecord - parseInt(Ext.getCmp('E_hitsperpage').getValue(), 10);
                if (from > 0) {
                	catalogue.startRecord = from;
	            	search();
                }
            },
            scope: this
        });
        
        var nextAction = new Ext.Action({
            id: 'nextBt',
            text: '&gt;&gt;',
            handler: function(){
                catalogue.startRecord += parseInt(Ext.getCmp('E_hitsperpage').getValue(), 10);
                search();
            },
            scope: this
        });
        
        return new Ext.Toolbar({
            items: [previousAction, '|', nextAction, '|', {
                xtype: 'tbtext',
                text: '',
                id: 'info'
            }]
        });
        
    }
    
    /**
     * Results panel layout with top, bottom bar and DataView
     *
     * @return
     */
    function createResultsPanel(){
        metadataResultsView = new GeoNetwork.MetadataResultsView({
            catalogue: catalogue,
            displaySerieMembers: true,
            autoScroll: true,
            tpl: GeoNetwork.Templates.FULL
        });
        
        catalogue.resultsView = metadataResultsView;
        
        tBar = new GeoNetwork.MetadataResultsToolbar({
            catalogue: catalogue,
            searchBtCmp: Ext.getCmp('searchBt'),
            sortByCmp: Ext.getCmp('E_sortBy'),
            metadataResultsView: metadataResultsView,
            enableOverflow:true
        });
        tBar2 = new Ext.Toolbar({
        	items : [ OpenLayers.i18n('sortBy'), tBar.getSortByCombo(),'->',tBar.createTemplateMenu()]
        });
        
        bBar = createBBar();
        
        resultPanel = new Ext.Panel({
            id: 'resultsPanel',
            border: false,
            hidden: true,
            bodyCssClass: 'md-view',
            autoWidth: true,
            layout: 'fit',
            tbar: {
            	xtype: 'container',
            	layout: 'anchor',
            	defaults: {anchor: '0'},
            	defaultType: 'toolbar',
            	items: [
        	        tBar2,
            		tBar
            	]
        	},
            items: metadataResultsView,
            // paging bar on the bottom
            bbar: bBar
        });
        return resultPanel;
    }
    function loadCallback(el, success, response, options){
        
        if (success) {
            createMainTagCloud();
            //createLatestUpdate();
        } else {
            Ext.get('infoPanel').getUpdater().update({url:'home_en.html'});
            Ext.get('helpPanel').getUpdater().update({url:'help_en.html'});
        }
    }
    /** private: methode[createInfoPanel]
     *  Main information panel displayed on load
     *
     *  :return:
     */
    function createInfoPanel(){
        return new Ext.Panel({
            border: true,
            id: 'infoPanel',
            baseCls: 'md-info',
            autoWidth: true,
            contentEl: 'infoContent',
            autoLoad: {
                url: 'home_' + catalogue.LANG + '.html',
                callback: loadCallback,
                scope: this,
                loadScripts: false
            }
        });
    }
    /** private: methode[createHelpPanel]
     *  Help panel displayed on load
     *
     *  :return:
     */
    function createHelpPanel(){
        return new Ext.Panel({
            border: false,
            frame: false,
            baseCls: 'none',
            id: 'helpPanel',
            autoWidth: true,
            renderTo: 'shortcut',
            autoLoad: {
                url: 'help_' + catalogue.LANG + '.html',
                callback: initShortcut,
                scope: this,
                loadScripts: false
            }
        });
    }
    
    /**
     * Main tagcloud displayed in the information panel
     *
     * @return
     */
    function createMainTagCloud(){
        var tagCloudView = new GeoNetwork.TagCloudView({
            catalogue: catalogue,
            query: 'fast=true&summaryOnly=true',
            renderTo: 'tag',
            onSuccess: 'app.loadResults'
        });
        
        return tagCloudView;
    }
    /**
     * Create latest metadata panel.
     */
    function createLatestUpdate(){
        var latestView = new GeoNetwork.MetadataResultsView({
            catalogue: catalogue,
            autoScroll: true,
            tpl: GeoNetwork.Settings.latestTpl
        });
        var latestStore = GeoNetwork.Settings.mdStore();
        latestView.setStore(latestStore);
        latestStore.on('load', function(){
            Ext.ux.Lightbox.register('a[rel^=lightbox]');
        });
        new Ext.Panel({
            border: false,
            bodyCssClass: 'md-view',
            items: latestView,
            renderTo: 'latest'
        });
        catalogue.kvpSearch(GeoNetwork.Settings.latestQuery, null, null, null, true, latestView.getStore());
    }
    /**
     * Extra tag cloud to displayed current search summary TODO : not really a
     * narrow your search component.
     *
     * @return
     */
    function createTagCloud(){
        var tagCloudView = new GeoNetwork.TagCloudView({
            catalogue: catalogue
        });
        
        return new Ext.Panel({
            id: 'tagCloudPanel',
            border: true,
            hidden: true,
            baseCls: 'md-view',
            items: tagCloudView
        });
    }
    
    function edit(metadataId, create, group, child){
        
        if (!this.editorWindow) {
            this.editorPanel = new GeoNetwork.editor.EditorPanel({
                defaultViewMode: GeoNetwork.Settings.editor.defaultViewMode,
                catalogue: catalogue,
                xlinkOptions: {CONTACT: true}
            });
            
            this.editorWindow = new Ext.Window({
                tools: [{
                    id: 'newwindow',
                    qtip: OpenLayers.i18n('newWindow'),
                    handler: function(e, toolEl, panel, tc){
                        window.open(GeoNetwork.Util.getBaseUrl(location.href) + "#edit=" + panel.getComponent('editorPanel').metadataId);
                        panel.hide();
                    },
                    scope: this
                }],
                title: OpenLayers.i18n('mdEditor'),
                id : 'editorWindow',
                layout: 'fit',
                modal: false,
                items: this.editorPanel,
                closeAction: 'hide',
                collapsible: true,
                collapsed: false,
                maximizable: true,
                maximized: true,
                resizable: true,
//                constrain: true,
                width: 980,
                height: 800
            });
            this.editorPanel.setContainer(this.editorWindow);
            this.editorPanel.on('editorClosed', function(){
                Ext.getCmp('searchBt').fireEvent('click');
            });
        }
        
        if (metadataId) {
            this.editorWindow.show();
            this.editorPanel.init(metadataId, create, group, child);
        }
    }
    
    function createHeader(){
        var info = catalogue.getInfo();
        //Ext.getDom('title').innerHTML = '<img class="catLogo" src="../../images/logos/' + info.siteId + '.gif"/>&nbsp;' + info.name;
        Ext.getDom('title').innerHTML = window.portalHeader ? window.portalHeader : '<img class="catLogo" src="../images/logos/logoAEDD.jpg"/>&nbsp;'+
        								'<img class="catLogo" src="../images/logos/logoDGPC.jpg"/>&nbsp;'+ info.name;
        document.title = info.name;
    }
    
    function createAppToolbar() {
		var filemenu = new Ext.menu.Menu({
		    id: 'fileMenu',
		    items: [
		        {
		            text: 'Réinitialiser tout'
		        },
		        {
		            text: 'Enregistrer la session'
		        },
		        {
		            text: 'Restaurer la session'
		        }, '-', 
		        {
		            text: 'Ajouter une couche de données'
		        },
		        {
		            text: 'Chercher des données'
		        }
		    ]
		});
		var viewmenu = new Ext.menu.Menu({
		    id: 'viewMenu',
		    items: [
		        {
		            text: 'Panneau latéral',
		            menu: {        // <-- submenu by nested config object
		                items: [
		                    // stick any markup in a menu
		                    '<b class="menu-title">Choisissez le panneau actif</b>',
		                    {
		                        text: 'Choisir les couches de données',
		                        checked: true,
		                        group: 'sidepanelmode',
		                        checkHandler: onItemCheck
		                    }, {
		                        text: 'Organiser les couches de données',
		                        checked: false,
		                        group: 'sidepanelmode',
		                        checkHandler: onItemCheck
		                    }, {
		                        text: 'Chercher des données',
		                        checked: false,
		                        group: 'sidepanelmode',
		                        checkHandler: onItemCheck
		                    }, {
		                        text: 'Imprimer',
		                        checked: false,
		                        group: 'sidepanelmode',
		                        checkHandler: onItemCheck
		                    }
		                ]
		            }
		        },
		        {
		            text: "Barre d'outils",
                    checked: true
		        },
		        {
		            text: 'Mode "dual Map"',
                    checked: false
		        }
		    ]
		});
		var toolsmenu = new Ext.menu.Menu({
		    id: 'toolsMenu',
		    items: [
		        {
		            text: 'Analyse NDVI'
		        },
		        {
		            text: 'Analyse historique météorologique'
		        },
		        {
		            text: 'Moyenne d\'une zone'
		        }
		    ]
		});
		var helpmenu = new Ext.menu.Menu({
		    id: 'helpMenu',
		    items: [
		        {
		            text: 'Sommaire'
		        },
		        {
		            text: 'Raccourcis clavier'
		        }, '-', 
		        {
		            text: 'A propos'
		        }
		    ]
		});

		var tb = new Ext.Toolbar();

		tb.add({
		        text:'Fichiers',
		        iconCls: 'save',  // <-- icon
		        menu: filemenu  // assign menu by instance
		    },{
		        text:'Affichage',
		        iconCls: 'view',  // <-- icon
		        menu: viewmenu  // assign menu by instance
		    },{
		        text:'Outils',
		        iconCls: 'tools',  // <-- icon
		        menu: toolsmenu  // assign menu by instance
		    },{
		        text:'Aide',
		        iconCls: 'help',  // <-- icon
		        menu: helpmenu  // assign menu by instance
		    });
	    return tb;
    }
    function onItemCheck(item, checked){
        
    }
    
    function readLayers(mod) {
    	var layers = new Array();

    	for (var j=0 ; j < mod.length ; j++)
    	{
    		//console.log(mod[j]);
    		if (mod[j].children!=null)
    		{
    			//console.log(mod[j].layer);
    			var children = readLayers(mod[j].children);
    			for (var i = 0 ; i < children.length ; i++)
    				layers.push(children[i]);
    		}
    		else
    		{
    			var child = mod[j];
    			var layer;
    			//console.log(child.text);

    			if (child.type==null)
    				continue;

    			var checked = false;
    			if (child.checked===true)
    				checked =true;	
    			switch (child.type) {
	    			case "wms":
	    				//console.log("wms layer : "+child.layer);
	    				layer = new OpenLayers.Layer.WMS(child.layer, //sans s, c'est le nom, lisible, de la couche. Layers est le nom geoserver
	    						child.url, 
	    						{ 
			    					layers: child.layers, 
			    					format: child.format,
			    					TRANSPARENT:(child.format=="image/png"),
			    					TILED:(child.TILED==false?false:true) //if TILED is defined to false: false, else (to true or undefined): true.
			    					//,BGCOLOR: (child.bgcolor==null?'0x0033FF':child.bgcolor)
	    						},
	    						{
	    							isBaseLayer: false
	    							, transitionEffect: 'resize'
									, buffer: 0
									, visibility:checked
									, opacity : (child.opacity===null?'1.0':child.opacity)
									, uuid : child.uuid //if set, links the layer with its metadata
									, legend : child.legend //if set, links the layer with its metadata
								}
	    				);
	    				layers.push(layer);
	    				break;
	    			case "chart":
	    				var context =  {
					    		                getSize: function(feature) {
					    		                	var size = 20;
					    		                    return size ;
					    		                },
					    		                getChartURL: function(feature) {
									                var values = "";      //we're going to list the fields defined in the "charting_fields" param
									                for (var i=0 ; i < child.charting_fields.length ; i++) {
									                	values += feature.attributes[child.charting_fields[i]] + ',';
									                }
									                values = values.substr(0, values.length-1); // we remove the last comma
									                var size = 100;
									                var charturl = 'http://chart.apis.google.com/chart?cht=p&chd=t:' + values + '&chs=' + size + 'x' + size + '&chf=bg,s,ffffff00';
									                return charturl;
									            }
				    		            };
	    				OpenLayers.Util.extend(context, child.context);
	    		    	var template = {
											pointRadius: "${getSize}",
											fillOpacity: 0.8,
											externalGraphic: "${getChartURL}"
		    		            		};
	    		    	OpenLayers.Util.extend(template, child.template );
	    		    	
	    		    	// We define scale-based rules to determine which level of data (region, circle, commune) will be displayed.
	    		    	// a Rule without any style additional info suffices : any item out of the rules is filtered away
	    		    	var the_rules = [];
	    		    	if (child.changeScales!==null) {
	    		    		for (var i = 0 ; i < child.changeScales.length; i++) {
	    		    			var r = new OpenLayers.Rule({
						             minScaleDenominator: child.changeScales[i],
						             filter : new OpenLayers.Filter.Comparison({
						            	 type: OpenLayers.Filter.Comparison.EQUAL_TO,
						            	 property: "table",
						            	 value: child.tablenames[i]
						             })
						         });
	    		    			if (i > 0) {
	    		    				r.maxScaleDenominator = child.changeScales[i-1];
	    		    			}
	    		    			the_rules.push(r);
	    		    		}
	    		    	}
	    		    	var style = new OpenLayers.Style(template, {context: context ,rules: the_rules});
	    		    	var m_styleMap = new OpenLayers.StyleMap({'default': style, 'select': {fillOpacity: 0.7}});
	    		    	
	    		    	var field_list = (child.charting_fields.concat(child.other_fields)).join(",");
	    		    	var tables_list = child.tablenames.join(",");
	    		    	var geom_field = child.geom_field || "the_geom";
	    		    	var url = child.url + "?tables="+tables_list+"&fields="+field_list+"&geom_field="+geom_field;
	    				
	    		    	layer = new OpenLayers.Layer.GML( child.layer, 
	    						url,
	    						{ 
			    		    		format: OpenLayers.Format.GeoJSON
			    		    		,styleMap: m_styleMap
			    		    		,isBaseLayer: false
									,visibility:checked
									,uuid:child.uuid
									,projection: new OpenLayers.Projection("EPSG:4326")
									, legend : child.legend //if set, links the layer with its metadata
	    						}
	    		    	);
	    				layers.push(layer);
	    				break;
	    			default: 
	    				OpenLayers.Console.log("omitting invalid (non-wms) layer : "+child.layer + ", "+child.type);
	    			break;
    			}
    		}
    	}
    	return layers;
    }
    
    function loadLayersFromConfigTree (map,treeConfig) {
      	var layers = readLayers(treeConfig);

      	for (var i = 0 ; i < layers.length ; i++)
        	map.addLayer(layers[i]);
	}
    
    // public space:
    return {
        init: function(){
            geonetworkUrl = GeoNetwork.URL || window.location.href.match(/(http.*\/.*)\/apps\/jpsearch.*/, '')[1];
			//console.log(GeoNetwork);
            urlParameters = GeoNetwork.Util.getParameters(location.href);
            var lang = GeoNetwork.Util.getCatalogueLang(urlParameters.hl || GeoNetwork.defaultLocale);
            if (urlParameters.extent) {
            	var proj = new OpenLayers.Projection("EPSG:4326");
            	var projMap = new OpenLayers.Projection(GeoNetwork.map.PROJECTION);
                urlParameters.bounds = new OpenLayers.Bounds(urlParameters.extent[0], urlParameters.extent[1], urlParameters.extent[2], urlParameters.extent[3]);
    			urlParameters.bounds.transform(proj, projMap);
            }
            
            // Init cookie
            cookie = new Ext.state.CookieProvider({
                expires: new Date(new Date().getTime()+(1000*60*60*24*365))
            });
            Ext.state.Manager.setProvider(cookie);
            
            // Create connexion to the catalogue
            catalogue = new GeoNetwork.Catalogue({
                statusBarId: 'info',
                lang: lang,
                hostUrl: geonetworkUrl,
                mdOverlayedCmpId: 'resultsPanel',
                adminAppUrl: geonetworkUrl + '/srv/' + lang + '/admin',
                // Declare default store to be used for records and summary
                metadataStore: GeoNetwork.Settings.mdStore ? GeoNetwork.Settings.mdStore() : GeoNetwork.data.MetadataResultsStore(),
                metadataCSWStore : GeoNetwork.data.MetadataCSWResultsStore(),
                summaryStore: GeoNetwork.data.MetadataSummaryStore(),
                editMode: 2, // TODO : create constant
                metadataEditFn: edit
            });
            
            createHeader();
            
            // Search form
            searchForm = createSearchForm();
            
            //toolbar
            appToolbar = createAppToolbar();
            
            // Top navigation widgets
            //createModeSwitcher();
            //createLanguageSwitcher(lang);
            createLoginForm();
            edit();
            
            // Search result
            resultsPanel = createResultsPanel();
            
            // Extra stuffs
            infoPanel = createInfoPanel();
            helpPanel = createHelpPanel();
            tagCloudViewPanel = createTagCloud();
            
            var LayerNodeUI = Ext.extend(
                GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin() 
            );

            var treeconf = new OpenLayers.Format.JSON().write(window.treeConfig);
             // create the tree with the configuration from above
		    var ilwaclayers_tree = new Ext.tree.TreePanel({
		        title:'layerTree',
		        header:false,
		        id: "ilwactoctree",
		        enableDD: false,
		        autoScroll:true,
			    loader: new Ext.tree.TreeLoader({
		            // applyLoader has to be set to false to not interfer with loaders
		            // of nodes further down the tree hierarchy
		            applyLoader: false,
		            uiProviders: {
		                "layernodeui": LayerNodeUI //Ca n'a pas l'air d'être pris en compte : on n'a pas de TreeNodeUIEventMixin (pas d'evt onRenderNode)
		            }
		        }),
		        plugins: [
            		new GeoExt.plugins.FoldableLegendPlugin({})
            	],
            	root: {
		            nodeType: "async",
		            // the children property of an Ext.tree.AsyncTreeNode is used to
		            // provide an initial set of layer nodes. We use the treeConfig
		            // from above, that we created with OpenLayers.Format.JSON.write.
		            children: Ext.decode(treeconf)
		        },    
		       
		        rootVisible: false,
		        border: false,
		        region: 'center'			
		    });

		    var toolsPanel = new Ext.Panel({
				    	title: 'Outils',
				    	layout:'vbox',
				    	align:'stretch',
				    	autoScroll: true,
				    	items : []
				    });
            
            //Tab panel
            dataTabPanel = new Ext.TabPanel({
            	id:'westTabPanel',
				activeTab: 0,
				height:'100%',
				layoutOnTabChange:true,
				deferredRender:false,
				defaults:{},
				items:[
				    {
				    	title: 'Choisir', 
				    	id:'choisirTab',
				    	autoScroll:true,
				    	layout:'fit',
				    	items:[]
				    },{
				    	title: 'Organiser',
				    	id:'organizeTab',
				    	autoScroll: true,
				    	layout:'fit',
				    	items:[]
				    },
				    {
				    	title:'Chercher',
				    	id:'searchTab',
				    	autoWidth:true,
		                //autoScroll: true,
		                height:'100%',
		                layout:'accordion',
		                layoutConfig: {
		                    animate: true
		                },
		                items: [{
		                			title:'Formulaire',
		                			id:'searchFormPanel',
		                			autoWidth:true,
		                			//height:'100%',
		                			autoScroll: true,
		                			items : [ searchForm /*, tagCloudViewPanel,infoPanel*/]
	                			},{
		                			title:'Resultats',
		                			id:'searchResultsPanel',
		                			autoWidth:true,
		                			//height:'100%',
		                			//autoScroll: true,
		                			items : [resultsPanel]
	                			}]
	                },
	                toolsPanel
	                ,{
				    	title: 'Imprimer',
				    	id:'printPanelTab',
				    	items : []
				    }
				]
			});
			
            // Register events on the catalogue
            
            var margins = '35 0 0 0';
            
            var viewport = new Ext.Viewport({
                layout: 'border',
                id: 'vp',
                //tbar:appToolbar,
                items: [{
                    region: 'north',
                    id: 'north',
                    height : 0,
                    margins: margins
                	//,tbar:appToolbar
                },{
                    region: 'west',
                    id: 'west',
                    title:'Données',
                    split: true,
                    minWidth: 300,
                    width: 350,
                    maxWidth: 1100,
                    //autoScroll: true,
                    layout: 'fit',
                    collapsible: true,
                    //hideCollapseTool: true,
                    //collapseMode: 'mini',
                    //margins: margins,
                    //layout : 's',
                    forceLayout: true,
                    layoutConfig: {
                        animate: true
                    },
                    items: [dataTabPanel]
                }, {
                    region: 'center',
                    id: 'center',
                    layout: 'fit',
                    minWidth: 300,
                    split: true
                    //margins: margins,
                    //items: []
                }/*, {
                    region: 'east',
                    id: 'east',
                    layout: 'fit',
                    split: true,
                    collapsible: true,
                    hideCollapseTool: true,
                    collapseMode: 'mini',
                    collapsed: true,
                    hidden: !GeoNetwork.MapModule,
                    //margins: margins,
                    minWidth: 300,
                    width: 500
                }*/]
            });
            
            //map viewport
			initMap();
            var imapvp = iMap.getViewport();
            //console.log(imapvp);
            
            loadLayersFromConfigTree(iMap.getMap(), window.treeConfig);
            
            Ext.getCmp('searchForm').insert(2, GeoNetwork.util.jpSearchFormTools.getGeographicFormFields(iMap.getMap(), true));
            Ext.getCmp('searchForm').doLayout();
            Ext.getCmp('center').add(imapvp);
            Ext.getCmp('choisirTab').add(ilwaclayers_tree);
            
           /* Trigger visualization mode if mode parameter is 1 
             TODO : Add visualization only mode with legend panel on
             */
            if (urlParameters.mode) {
                app.switchMode(urlParameters.mode, false);
            }

            /* Init form field URL according to URL parameters */
            GeoNetwork.util.SearchTools.populateFormFromParams(searchForm, urlParameters);

            /* Trigger search if search is in URL parameters */
            if (urlParameters.search !== undefined) {
                Ext.getCmp('searchBt').fireEvent('click');
            }
            if (urlParameters.edit !== undefined && urlParameters.edit !== '') {
                catalogue.metadataEdit(urlParameters.edit);
            }
            if (urlParameters.create !== undefined) {
                //resultPanel.getTopToolbar().createMetadataAction.fireEvent('click');
                tBar.createMetadataAction.fireEvent('click');
            }
            if (urlParameters.uuid !== undefined) {
                catalogue.metadataShow(urlParameters.uuid, true);
            } else if (urlParameters.id !== undefined) {
                catalogue.metadataShowById(urlParameters.id, true);
            }
            
            // FIXME : should be in Search field configuration
            Ext.get('E_any').setWidth(285);
            Ext.get('E_any').setHeight(28);
            if (GeoNetwork.searchDefault.activeMapControlExtent) {
                Ext.getCmp('geometryMap').setExtent();
            }
            if (urlParameters.bounds) {
            	if (Ext.getCmp('geometryMap')) {
                    Ext.getCmp('geometryMap').map.zoomToExtent(urlParameters.bounds);
            	}
                // FIXME : main map apparently haven't finish loading. Without timeout, it freezes
                iMap.setMaxBounds(urlParameters.bounds);
                
                setTimeout(function(){   
                	iMap.zoomToFullExtent();
                  }, 250);
            }

            setTimeout(function(){   
            	Ext.getCmp('printPanelTab').add(app.getIMap().getPrintPanel());
            	Ext.getCmp('printPanelTab').on('activate', function() {
            		iMap.setPageLayerVisibility(true);
            	});
            	Ext.getCmp('printPanelTab').on('deactivate', function() {
            		iMap.setPageLayerVisibility(false);
            	});
            	if (window.shortcutsCombo) {
	            	var shortcutsPanel = new GeoExt.ShortcutsComboPanel({ 
	                    title:OpenLayers.i18n('shortcuts'),
	                    id:'raccourcisCbPanel',
	                    autoHeight:true,
	                    width:'100%',
	                    padding : 10,
	                  	cbWidth:200,
	                  	cbListWidth:195,
	                    //height: 90,
	                	//collapsible: true,
	                    cls:"rac-panel",
	                    map:iMap.getMap(),
	                    config:window.shortcutsCombo
	            	});
	            	toolsPanel.add(shortcutsPanel);
            	}
            	if (window.pratiquesConf) {
	            	var pratiquesGDTCbPanel = new GeoExt.PratiquesGDTComboPanel({ 
	                    title:OpenLayers.i18n('pratiquesGDT'),
	                    id:'pratiquesGDTPanel',
	                    autoHeight:true,
	                    width:'100%',
	                    padding : 10,
	                  	cbWidth:200,
	                  	cbListWidth:300,
	                    //height: 90,
	                	//collapsible: true,
	                    cls:"rac-panel",
	                    map:iMap.getMap(),
	                    config:window.pratiquesConf
		            });
	            	toolsPanel.add(pratiquesGDTCbPanel);
            	}
            	if (toolsPanel.items.length==0) {
            		dataTabPanel.remove(toolsPanel);
            	}

            }, 500); // without the timeout, we get an error about scale not being initialized. The map may lack time to fully load...
            //resultPanel.setHeight(Ext.getCmp('center').getHeight());
            
            Ext.getCmp('searchTab').on('activate', function() {
        		catalogue.resultsView.setLayersVisibility(true);
        	});
        	Ext.getCmp('searchTab').on('deactivate', function() {
        		catalogue.resultsView.setLayersVisibility(false);
        	});
            
            var events = ['afterDelete', 'afterRating', 'afterLogout', 'afterLogin'];
            Ext.each(events, function (e) {
                catalogue.on(e, function(){
                    if (searching === true) {
                        Ext.getCmp('searchBt').fireEvent('click');
                    }
                });
            });
			
           //Ext.getCmp('center').doLayout(); //apparemment c'est trop tôt, ça fait foirer des trucs (des variables pas encore initialisées, je supose)
         },
        getIMap: function(){
            // init map if not yet initialized
            if (!iMap) {
                initMap();
            }
            
            // TODO : maybe we should switch to visualization mode also ?
            return iMap;
        },
        getCatalogue: function(){
            return catalogue;
        },
        /**
         * Do layout
         *
         * @param response
         * @return
         */
        loadResults: function(response){
            
            initPanels();
            
            // FIXME : result panel need to update layout in case of slider
            // Ext.getCmp('resultsPanel').syncSize();
            Ext.getCmp('previousBt').setDisabled(catalogue.startRecord === 1);
            Ext.getCmp('nextBt').setDisabled(catalogue.startRecord + 
                    parseInt(Ext.getCmp('E_hitsperpage').getValue(), 10) > catalogue.metadataStore.totalLength);
            if (Ext.getCmp('E_sortBy').getValue()) {
              Ext.getCmp('sortByToolBar').setValue(Ext.getCmp('E_sortBy').getValue()  + "#" + Ext.getCmp('sortOrder').getValue() );

            } else {
              Ext.getCmp('sortByToolBar').setValue(Ext.getCmp('E_sortBy').getValue());

            }
            
            //Ext.getCmp('searchFormPanel').collapse(true);
            Ext.getCmp('searchResultsPanel').expand(true);
            Ext.ux.Lightbox.register('a[rel^=lightbox]');
            
            app.updateLayout();
            
            //Ext.getCmp('printPanelTab').add(iMap.getPrintPanel());
            //console.log(iMap.getPrintPanel());
        },
        /**
         * Do layout only
         *
         * @return
         */
        updateLayout: function() {
            Ext.getCmp('west').syncSize();
            Ext.getCmp('center').syncSize();
            resultsPanel.syncSize();
            resultsPanel.setHeight(Ext.getCmp('searchTab').getHeight()-45);
            //console.log("layout updated");
        },
        /**
         * Switch from one mode to another
         *
         * @param mode
         * @param force
         * @return
         */
        switchMode: function(mode, force){
           /* var ms = Ext.getCmp('ms'),
                e = Ext.getCmp('east'),
                c = Ext.getCmp('center'),
                w = Ext.getCmp('west'),
                currentMode;
            
            // Set discovery mode as default if undefined
            if (mode === null) {
                currentMode = ms.getValue().getGroupValue();
                if (currentMode === '0') {
                    ms.onSetValue(Ext.getCmp('visualizationMode'), true);
                } else {
                    ms.onSetValue(Ext.getCmp('discoveryMode'), true);
                }
                mode = currentMode = ms.getValue().getGroupValue();
            }
            
            if (force) {
                if (mode === '1') {
                    ms.onSetValue(Ext.getCmp('visualizationMode'), true);
                } else {
                    ms.onSetValue(Ext.getCmp('discoveryMode'), true);
                }
            }
            
            if (mode === '1' && !visualizationModeInitialized) {
                initMap();
            }
            
            if (mode === '1' && iMap) {
                //e.add(iMap.getViewport());
                //e.doLayout();
                if (e.collapsed) {
                    e.toggleCollapse();
                }
                if (!w.collapsed) {
                    w.toggleCollapse();
                }
                
                Ext.getCmp('vp').syncSize();
            } else {
                if (!e.collapsed) {
                    e.toggleCollapse();
                }
                if (w.collapsed) {
                    w.toggleCollapse();
                }
            }
            initMap();
            c.add(iMap.getViewport());
        	c.doLayout();*/
        }
    };
};

Ext.onReady(function(){
    var lang = /hl=([a-z]{2})/.exec(location.href);
    GeoNetwork.Util.setLang(lang && lang[1], '..');

    Ext.QuickTips.init();
    setTimeout(function(){
      Ext.get('loading').remove();
      Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);

    app = new GeoNetwork.app();
    app.init();
    catalogue = app.getCatalogue();
    
    
    Ext.getCmp('center').doLayout();

    
    /* Focus on full text search field */
    //Ext.getDom('E_any').focus(true);

});
