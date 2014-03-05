Ext.namespace('GeoNetwork');

var catalogue;
var app;
var cookie;

GeoNetwork.app = function () {
    // private vars:
    var geonetworkUrl;
    var searching = false;
    var editorWindow;
    var editorPanel;
    
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
    var iMap, searchForm, facetsPanel, resultsPanel, metadataResultsView, tBar, bBar,
        mainTagCloudViewPanel, infoPanel, toolsPanel,
        dataTabPanel,
        visualizationModeInitialized = false,
        showSortBy=true,
        showTemplatesMenu=false;
    
    // private function:
    /**
     * Create a radio button switch in order to change perspective from a search
     * mode to a map visualization mode.
     */
    function createModeSwitcher() {
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
                change: function (rg, checked) {
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
    
    
    function initMap() {
        iMap = new GeoNetwork.mapApp();
        var layers={}, options={};
        var scales = [500000000, 250000000, 125000000, 70000000, 35000000, 17500000, 10000000, 5000000, 2500000, 1000000, 500000, 250000, 100000, 50000, 25000, 15000, 10000, 5000, 2000]; 
        if(GeoNetwork.map.CONTEXT || GeoNetwork.map.OWS) {
            options = GeoNetwork.map.CONTEXT_MAIN_MAP_OPTIONS;
        } else {
            options = GeoNetwork.map.MAIN_MAP_OPTIONS;
            layers  = GeoNetwork.map.BACKGROUND_LAYERS;
        }
        iMap.init(layers, options, scales);
        //metadataResultsView.addMap(iMap.getMap()); //moved to step2, because if kept here, search extent is duplicated, don't know why
        visualizationModeInitialized = true;
    }

    function initMap_Step2() {
        var c = Ext.getCmp('center'),
            vp = Ext.getCmp('vp');
        
        if (window.Geoportal.shortcutsZAE) {
        	var config = { 
	                title:window.Geoportal.shortcutsZAE.title ? OpenLayers.i18n(window.Geoportal.shortcutsZAE.title):OpenLayers.i18n('shortcuts'),
	                id:'raccourcisZaePanel',
	                autoHeight:true,
	                border:false,
	                width:'100%',
	                padding : 10,
	              	cbWidth:200,
	              	cbListWidth:195,
	                cls:"rac-panel",
	                map:iMap.getMap(),
	                mapapp : iMap,
	                config:window.Geoportal.shortcutsZAE
	        	};
        	Ext.apply(config, window.Geoportal.shortcutsZAE.options);
        	var shortcutsZAEPanel = new GeoExt.ShortcutsComboPanelZAE(config);
        	toolsPanel.add(shortcutsZAEPanel);
    	}
    	if (window.Geoportal.pratiquesConf) {
    		var config = { 
                    title:OpenLayers.i18n('pratiquesGDT'),
                    id:'pratiquesGDTPanel',
                    autoHeight:true,
                    width:'100%',
	                border:false,
                    padding : 10,
                  	cbWidth:200,
                  	cbListWidth:300,
                    //height: 90,
                	//collapsible: true,
                    cls:"rac-panel",
                    map:iMap.getMap(),
                    config:window.Geoportal.pratiquesConf
                };
        	Ext.apply(config, window.Geoportal.pratiquesConf.options);
        	var pratiquesGDTCbPanel = new GeoExt.PratiquesGDTComboPanel(config);
        	toolsPanel.add(pratiquesGDTCbPanel);
    	}
    	if (window.Geoportal.shortcutsCombo) {
    		var config= {
	                title:window.Geoportal.shortcutsCombo.title ? OpenLayers.i18n(window.Geoportal.shortcutsCombo.title):OpenLayers.i18n('shortcuts'),
	                header : (window.Geoportal.shortcutsZAE==null),
	                id:'raccourcisCbPanel',
	                autoHeight:true,
	                width:'100%',
	                border:false,
	                padding : 10,
	              	cbWidth:200,
	              	cbListWidth:195,
	                cls:"rac-panel",
	                map:iMap.getMap(),
	                config:window.Geoportal.shortcutsCombo
        		};
        	Ext.apply(config, window.Geoportal.shortcutsCombo.options);
    		var shortcutsPanel = new GeoExt.ShortcutsComboPanel(config);
        	toolsPanel.add(shortcutsPanel);
    	}
    	if (window.Geoportal.geonamesCountryIndicator) {
    		
    		var geonamesSearchPanel = new Ext.Panel({
    			//title: OpenLayers.i18n('geonamesSearchPanelTitle'),
    			id:'geonamesPanel',
                autoHeight:true,
                width:'100%',
                border:false,
                padding : 10,
              	cbWidth:200,
              	cbListWidth:300,
                cls:"rac-panel",
                items:[{
                    xtype: "displayfield",
                    value: OpenLayers.i18n('geonamesCbHeader')
                },{
                	xtype: 'gxux_geonamessearchcombo', 
                	fieldLabel: OpenLayers.i18n("Geonames"), 
                	zoom:8,
                    map:iMap.getMap(),
                	width:250,
                	listWidth:250,
                	loadingText: OpenLayers.i18n("geonamesLoadingText"), 
                    emptyText: OpenLayers.i18n("geonamesEmptyText"), 
                    lang: 'fr',
                    username:'pigeo_ilwac',
                    countryString: window.Geoportal.geonamesCountryIndicator?'country='+window.Geoportal.geonamesCountryIndicator:'country=BF',
                    locationIcon: '../images/viseur.png',
                    tpl: '<tpl for="."><div class="x-combo-list-item geonamesComboList" lon={lng} lat={lat}><h1>{name}</h1><p>lat: {lat}, lon:{lng} <br />{[OpenLayers.i18n(values.fcodeName)]}</p></div></tpl>'
            	}]
    		});
        	toolsPanel.add(geonamesSearchPanel);
    	}
    	
    	if (window.Geoportal.toolsPanelConfig.linkedLayers) {
    		var linkedLayers=window.Geoportal.toolsPanelConfig.linkedLayers;
    		var map = iMap.getMap();
    		toolsPanel.on("activate", function() {
    			for (var i = 0 ; i < linkedLayers.length ; i++) {
    	    		var layers = map.getLayersByName(linkedLayers[i]);
    	    		if (layers.length > 0) {
    	    			layers[0].setVisibility(true);
    	    		}
    	    	}
    		}) ;
    		if (window.Geoportal.toolsPanelConfig.disableLayersOnDeactivate) {
    			toolsPanel.on("deactivate", function() {
    				for (var i = 0 ; i < linkedLayers.length ; i++) {
    					var layers = map.getLayersByName(linkedLayers[i]);
    					if (layers.length > 0) {
    						layers[0].setVisibility(false);
    					}
    				}
    			}) ;
    		}
	    	
    	}
    	
    	if (toolsPanel.items.length==0) {
    		dataTabPanel.remove(toolsPanel);
    	}

        
        if (iMap) {
            c.add(iMap.getViewport());
            c.doLayout();
            vp.syncSize();
            if (urlParameters.bounds) {
                //iMap.getMap().zoomToExtent(urlParameters.bounds);
            	iMap.setMaxBounds(urlParameters.bounds);
            	iMap.zoomToFullExtent();
            }
            /*<jp>*/
            //iMap.addWMSLayer([['mask', 'http://ige.fr/geoserver-prod/wms?','gm_countryMask',null]])
            var lt = iMap.getTree();
            lt.lines=true;
            /****** Loads the associated metadata when a layer is asked for metadata **********/
            lt.on('showMetadataByUuid', function(evt, layer) {
            	if (layer.uuid) {
            		catalogue.metadataShow(layer.uuid);
            	}
            });
            
            Ext.getCmp('organizeTab').add(lt);
            /*</jp>*/
        }
    	metadataResultsView.addMap(iMap.getMap()); //has to be there better than in step1, because in that case, search extent is duplicated, don't know why
	    //we get sure the results extent boxes will always be drawn on the foreground (not hidden behind other layers)
    	var res = iMap.getMap().getLayersByName(OpenLayers.i18n('mdResultsLayer'))[0];
    	iMap.setAlwaysOnTop(res);
    	
    	Ext.getCmp('printPanelTab').add(iMap.getPrintPanel());
    	var res = iMap.getMap().getLayersByName(OpenLayers.i18n('printLayer'))[0];
    	iMap.setAlwaysOnTop(res);
    }
    
    /**
     * Create a language switcher mode
     *
     * @return
     */
    function createLanguageSwitcher(lang) {
        return new Ext.form.FormPanel({
            renderTo: 'lang-form',
            width: 95,
            border: false,
            layout: 'hbox',
            hidden:  GeoNetwork.Util.locales.length === 1 ? true : false,
            items: [new Ext.form.ComboBox({
                mode: 'local',
                triggerAction: 'all',
                width: 95,
                store: new Ext.data.ArrayStore({
                    idIndex: 2,
                    fields: ['id', 'name', 'id2'],
                    data: GeoNetwork.Util.locales
                }),
                valueField: 'id2',
                displayField: 'name',
                value: lang,
                listeners: {
                    select: function (cb, record, idx) {
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
    function createLoginForm() {
        var loginForm = new GeoNetwork.LoginForm({
            renderTo: 'login-form',
            catalogue: catalogue,
            layout: 'hbox',
            searchForm: Ext.getCmp('searchForm'),
            withUserMenu: true,
            hideLoginLabels: GeoNetwork.hideLoginLabels
        });
        
        catalogue.on('afterBadLogin', loginAlert, this);
        
        // Store user info in cookie to be displayed if user reload the page
        // Register events to set cookie values
        catalogue.on('afterLogin', function () {
            cookie.set('user', catalogue.identifiedUser);
        });
        catalogue.on('afterLogout', function () {
            cookie.set('user', undefined);
        });
        
        // Refresh login form if needed
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
    function loginAlert(cat, user) {
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
    function createSearchForm() {
        
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
                field: 'orgName',
                sortBy: 'ALPHA'
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
        
        
        
        
        // Multi select keyword
        var themekeyStore = new GeoNetwork.data.OpenSearchSuggestionStore({
            url: services.opensearchSuggest,
            rootId: 1,
            baseParams: {
                field: 'keyword',
                sortBy: 'ALPHA'
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
            id: 'E_keyword',
            name: 'E_keyword',
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
        
        advancedCriteria.push(themekeyField, orgNameField, categoryField, 
                                when, spatialTypes, denominatorField, 
                                catalogueField, groupField, 
                                metadataTypeField, validField, statusField);
        
        // Create INSPIRE fields if enabled in administration
        var inspirePanel = catalogue.getInspireInfo().enableSearchPanel === "true";
        if (inspirePanel) {
            var inspire = new Ext.form.FieldSet({
                title: OpenLayers.i18n('inspireSearchOptions'),
                collapsible: true,
                collapsed: true,
                items:  GeoNetwork.util.INSPIRESearchFormTools.getINSPIREFields(catalogue.services, true)
            });
            advancedCriteria.push(inspire);
        }
        
        var adv = new Ext.form.FieldSet({
            title: OpenLayers.i18n('advancedSearchOptions'),
            autoHeight: true,
            collapsible: true,
            collapsed: urlParameters.advanced !== undefined ? false : true,
            defaultType: 'checkbox',
            defaults: {
                anchor: '100%'
            },
            items: advancedCriteria
        });
        
        // Check good map options if we load map config from WMC or OWS
        var mapOptions;
        if(GeoNetwork.map.CONTEXT || GeoNetwork.map.OWS) {
            mapOptions = GeoNetwork.map.CONTEXT_MAP_OPTIONS;
        } else {
            mapOptions = GeoNetwork.map.MAP_OPTIONS;
        }
        
        
        var formItems = [];
        formItems.push(
                new GeoNetwork.form.OpenSearchSuggestionTextField({
                    hideLabel: true,
                    minChars: 2,
                    loadingText: '...',
                    hideTrigger: true,
                    url: catalogue.services.opensearchSuggest
                }),
                GeoNetwork.util.SearchFormTools.getTypesFieldWithAutocompletion(catalogue.services),
                //GeoNetwork.util.SearchFormTools.getSimpleMap(GeoNetwork.map.BACKGROUND_LAYERS, mapOptions, 
                //GeoNetwork.searchDefault.activeMapControlExtent, {width: 290}),
                adv, 
                GeoNetwork.util.SearchFormTools.getOptions(catalogue.services, undefined)
        );
        // Add advanced mode criteria to simple form - end
        
        
        // Hide or show extra fields after login event
        var adminFields = [groupField, metadataTypeField, validField, statusField];
        Ext.each(adminFields, function (item) {
            item.setVisible(false);
        });
        
        catalogue.on('afterLogin', function () {
            Ext.each(adminFields, function (item) {
                item.setVisible(true);
            });
            groupField.getStore().reload();
        });
        catalogue.on('afterLogout', function () {
            Ext.each(adminFields, function (item) {
                item.setVisible(false);
            });
            groupField.getStore().reload();
        });
        
        
        return new GeoNetwork.SearchFormPanel({
            id: 'searchForm',
            stateId: 's',
            border: false,
            searchCb: function () {
                if (metadataResultsView && Ext.getCmp('geometryMap')) {
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
            },
            padding: 5,
            defaults: {
                anchor: '100%'
            },
            autoHeight:true,
            listeners: {
                onreset: function (args) {
                    //facetsPanel.reset();
                    
                    // Remove field added by URL or quick search
                    this.cascade(function(cur){
                        if (cur.extraCriteria) {
                            this.remove(cur);
                        }
                    }, this);
                    
                    if (!args.nosearch) {
                        this.fireEvent('search');
                    }
                }
            },
            items: formItems
        });
    }
    
    function search() {
        searching = true;
        catalogue.search('searchForm', app.loadResults, null, catalogue.startRecord, true);
    }
    
    function initPanels() {
        var infoPanel = Ext.getCmp('infoPanel'), 
        resultsPanel = Ext.getCmp('resultsPanel');
        if (infoPanel.isVisible()) {
            infoPanel.hide();
        }
        if (!resultsPanel.isVisible()) {
            resultsPanel.show();
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
    function createResultsPanel(permalinkProvider) {
        metadataResultsView = new GeoNetwork.MetadataResultsView({
            catalogue: catalogue,
            displaySerieMembers: true,
            autoScroll: true,
            tpl: GeoNetwork.Templates.COMPACT,
            featurecolor: GeoNetwork.Settings.results.featurecolor,
            colormap: GeoNetwork.Settings.results.colormap,
            featurecolorCSS: GeoNetwork.Settings.results.featurecolorCSS
        });
        
        catalogue.resultsView = metadataResultsView;
        
        /*tBar = new GeoNetwork.MetadataResultsToolbar({
            catalogue: catalogue,
            searchFormCmp: Ext.getCmp('searchForm'),
            sortByCmp: Ext.getCmp('E_sortBy'),
            metadataResultsView: metadataResultsView,
            permalinkProvider: permalinkProvider,
            withPaging: true,
            searchCb: search
        });*/
        tBar = new GeoNetwork.MetadataResultsToolbar({
            catalogue: catalogue,
            searchFormCmp: Ext.getCmp('searchForm'),
            searchBtCmp: Ext.getCmp('searchBt'),
            sortByCmp: Ext.getCmp('E_sortBy'),
            metadataResultsView: metadataResultsView,
            enableOverflow:true,
            permalinkProvider: permalinkProvider,
            showSortBy:showSortBy,
            showTemplatesMenu:showTemplatesMenu,
            //withPaging: true, /*<jp>*///we use the paging in bBar, thus we need to remove it from tBar
            searchCb: search
        });
        /*tBar2 = new Ext.Toolbar({
        	items : [ OpenLayers.i18n('sortBy'), tBar.getSortByCombo(),'->',tBar.createTemplateMenu()]
        });*/
        
        bBar = createBBar();
        
        var resultPanel = new Ext.Panel({
            id: 'resultsPanel',
            border: false,
            hidden: true,
            bodyCssClass: 'md-view',
            autoWidth: true,
            layout: 'fit',
            tbar: tBar,
            items: metadataResultsView,
            // paging bar on the bottom
            bbar: bBar
        });
        window.resultPanel = resultPanel;
        return resultPanel;
    }
    /**
     * Main tagcloud displayed in the information panel
     *
     * @return
     */
    function createMainTagCloud() {
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
    function createLatestUpdate() {
        var latestView = new GeoNetwork.MetadataResultsView({
            catalogue: catalogue,
            autoScroll: true,
            tpl: GeoNetwork.Settings.latestTpl
        });
        var latestStore = GeoNetwork.Settings.mdStore();
        latestView.setStore(latestStore);
        latestStore.on('load', function () {
            Ext.ux.Lightbox.register('a[rel^=lightbox]');
        });
        var p = new Ext.Panel({
            border: false,
            bodyCssClass: 'md-view',
            items: latestView,
            renderTo: 'latest'
        });
        catalogue.kvpSearch(GeoNetwork.Settings.latestQuery, null, null, null, true, latestView.getStore());
    }
    function loadCallback(el, success, response, options) {
        if (success) {
            createMainTagCloud();
            createLatestUpdate();
        } else {
            Ext.get('infoPanel').getUpdater().update({url: 'home_eng.html'});
            Ext.get('helpPanel').getUpdater().update({url: 'help_eng.html'});
        }
    }
    /** private: methode[createInfoPanel]
     *  Main information panel displayed on load
     *
     *  :return:
     */
    function createInfoPanel() {
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
    function createHelpPanel() {
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
    function show(uuid, record, url, maximized, width, height) {
        var showFeedBackButton = record.get('email');
        
        var win = new GeoNetwork.view.ViewWindow({
            serviceUrl: url,
            lang: this.lang,
            currTab: GeoNetwork.defaultViewMode || 'simple',
            printDefaultForTabs: GeoNetwork.printDefaultForTabs || false,
            printUrl: GeoNetwork.printUrl || 'print.html',
            catalogue: this,
            maximized: maximized || false,
            metadataUuid: uuid,
            showFeedBackButton: showFeedBackButton,
            record: record,
            resultsView: this.resultsView
            });
        win.show(this.resultsView);
        win.alignTo(Ext.getBody(), 'tr-tr');
        
        
        
        // Adapt page title and meta according to current record
        
        // If more than one metadata records opened, the last one opened set the title
        // When metadata windows is closed, reset to default title
        win.on('close', function () {
            GeoNetwork.Util.updateHeadInfo({
                title: catalogue.getInfo().name
            });
        });
        
        // Get title, keywords and author for current record
        // in order to populate the META tag in the HEAD of the HTML page.
        var contacts = [];
        Ext.each(record.get('contact'), function (item) {
             contacts.push(item.name);
        });
        var subjects = [];
        Ext.each(record.get('subject'), function (item) {
            subjects.push(item.value);
        });
        GeoNetwork.Util.updateHeadInfo({
            title: catalogue.getInfo().name + ' | ' 
                   + record.get('title') 
                   + (record.get('type') ? ' (' + record.get('type') + ')' : ''),
            meta: {
                subject: record.get('abstract'),
                keywords: subjects,
                author: contacts
            }
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
                    handler: function (e, toolEl, panel, tc) {
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
                // Unsuported. Needs some kind of component to store minimized windows
                maximizable: false,
                maximized: true,
                resizable: true,
//                constrain: true,
                width: 980,
                height: 800
            });
            this.editorPanel.setContainer(this.editorWindow);
            this.editorPanel.on('editorClosed', function () {
                Ext.getCmp('searchForm').fireEvent('search');
            });
        }
        
        if (metadataId) {
            this.editorWindow.show();
            this.editorPanel.init(metadataId, create, group, child);
        }
    }
    
    function createHeader() {
        var info = catalogue.getInfo();
        /*<jp>*//*jp : commented first line, replaced by the next*/
        //Ext.getDom('title').innerHTML = '<img class="catLogo" src="../../images/logos/' + info.siteId + '.gif"/>&nbsp;' + info.name;
        Ext.getDom('title').innerHTML = window.Geoportal.portalHeader ? window.Geoportal.portalHeader :'<img class="catLogo" src="../../images/logos/' + info.siteId + '.gif"/>&nbsp;' + info.name;
        /*</jp>*/document.title = info.name;
    }
    
    // public space:
    return {
        init: function () {
            geonetworkUrl = GeoNetwork.URL || window.location.href.match(/(http.*\/.*)\/apps\/geoportal.*/, '')[1];

            urlParameters = GeoNetwork.Util.getParameters(location.href);
            var lang = urlParameters.hl || GeoNetwork.Util.defaultLocale;
            if (urlParameters.extent) {
                urlParameters.bounds = new OpenLayers.Bounds(urlParameters.extent[0], urlParameters.extent[1], urlParameters.extent[2], urlParameters.extent[3]);
            }
            
            if (urlParameters.wmc) {
               GeoNetwork.map.CONTEXT = urlParameters.wmc;
            }
            if (urlParameters.ows) {
               GeoNetwork.map.OWS = urlParameters.ows;
            }
            
            // Init cookie
            cookie = new Ext.state.CookieProvider({
                expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365))
            });
            
            // set a permalink provider which will be the main state provider.
            var permalinkProvider = new GeoExt.state.PermalinkProvider({encodeType: false});
            
            Ext.state.Manager.setProvider(permalinkProvider);
            
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
                metadataEditFn: edit,
                metadataShowFn: show
            });
            
            // Extra stuffs
            infoPanel = createInfoPanel();
            try {
                helpPanel = createHelpPanel();
            } catch (e) {
                // TODO: IE7 does not support help panel
            }
            createHeader();
            
            // Search form
            searchForm = createSearchForm();
            
            // Search result
            resultsPanel = createResultsPanel(permalinkProvider);

            initMap();
            var mapvp = iMap.getViewport();
            
//            var treeconf = new OpenLayers.Format.JSON().write(window.treeConfig);
//            console.log("app treeconf");
//            console.log(treeconf);
            var geoportalLayerTree = new GeoNetwork.Geoportal.LayerTree();
            geoportalLayerTree.init(window.treeConfig, iMap.getMap());
            var lt = geoportalLayerTree.getTree();
            // Top navigation widgets
            //createModeSwitcher();
            createLanguageSwitcher(lang);
            createLoginForm();
            edit();
            
            
            // Register events on the catalogue
            
            var margins = '35 0 0 0';
            var breadcrumb = new Ext.Panel({
                layout:'table',
                cls: 'breadcrumb',
                defaultType: 'button',
                border: false,
                split: false,
                layoutConfig: {
                    columns:2
                }
            });
            /*facetsPanel = new GeoNetwork.FacetsPanel({
                searchForm: searchForm,
                breadcrumb: breadcrumb,
                maxDisplayedItems: GeoNetwork.Settings.facetMaxItems || 7,
                facetListConfig: GeoNetwork.Settings.facetListConfig || []
            });*/
            
		    toolsPanel = new Ext.Panel({
		    	title: OpenLayers.i18n('tools'),
		    	layout:'fit',
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
				    	title: OpenLayers.i18n('choose'),
				    	id:'choisirTab',
				    	autoScroll:true,
				    	layout:'fit',
				    	items:lt
				    },{
				    	title: OpenLayers.i18n('organize'),
				    	id:'organizeTab',
				    	autoScroll: true,
				    	items:[]
				    },
				    {
				    	title:OpenLayers.i18n('search'),
				    	id:'searchTab',
				    	autoWidth:true,
		                //autoScroll: true,
		                height:'100%',
		                layout:'accordion',
		                layoutConfig: {
		                    animate: true
		                },
		                items: [{
		                			title:OpenLayers.i18n('form'),
		                			id:'searchFormPanel',
		                			layout:'fit',
		                			//height:'100%',
		                			autoScroll: true,
		                			items :  searchForm /*, tagCloudViewPanel,infoPanel*/
	                			},{
		                			title:OpenLayers.i18n('results'),
		                			id:'searchResultsPanel',
		                			layout:'fit',
		                			//height:'100%',
		                			//autoScroll: true,
		                			items : /*breadcrumb, facetsPanel,*/resultsPanel
	                			}]
	                },
	                toolsPanel
	                ,{
				    	title: OpenLayers.i18n('print'),
				    	id:'printPanelTab',
            			layout:'fit',
				    	items : [],
				    	listeners: {
	                        'show': function () {
	                        	try {
		                        	var res = iMap.getMap().getLayersByName(OpenLayers.i18n('printLayer'))[0];
		                        	res.setVisibility(true);
	                        	} catch (err) {
	                        		OpenLayers.Console.error('could not get print layer');
	                        	}
	                        },
	                        'hide': function () {
	                        	try {
		                        	var res = iMap.getMap().getLayersByName(OpenLayers.i18n('printLayer'))[0];
		                        	res.setVisibility(false);
	                        	} catch (err) {
	                        		OpenLayers.Console.error('could not get print layer');
	                        	}
	                        }
	                    }
				    }
				]
			});
            
            var viewport = new Ext.Viewport({
                layout: 'border',
                id: 'vp',
                items: [{
                    region: 'west',
                    id: 'west',
                    split: true,
                    border: false,
                    minWidth: 200,
                    width: '30%',
                    maxWidth: 600,
                    autoScroll: false,
                    collapsible: false,
                    hideCollapseTool: true,
                    collapseMode: 'mini',
                    layout:'fit',
                    margins: margins,
                    //layout : 's',
                    forceLayout: true,
                    layoutConfig: {
                        animate: true
                    },
                    items: [dataTabPanel]
                }, {
                    region: 'center',
                    id: 'center',
                    split: true,
                    layout: 'fit',
                    border: false,
                    margins: margins
                }/*, {
                    region: 'east',
                    id: 'east',
                    title: OpenLayers.i18n('facetsTitle'),
                    split: true,
                    border: false,
                    margins: margins,
                    cmargins: margins,
                    collapsible: true,
                    collapsed: true,
                    collapseMode: 'mini',
                    //floating: (Ext.isIE7 || Ext.isIE8) ? false : true,//IE<9 don't seem to support floating panel
                    width: 200,
                    items: [breadcrumb, facetsPanel]
                }*/]
            });
            
            /* Trigger visualization mode if mode parameter is 1 
             TODO : Add visualization only mode with legend panel on
             */
            if (urlParameters.mode) {
                app.switchMode(urlParameters.mode, false);
            }
            if (urlParameters.edit !== undefined && urlParameters.edit !== '') {
                catalogue.metadataEdit(urlParameters.edit);
            }
            if (urlParameters.create !== undefined) {
                resultsPanel.getTopToolbar().createMetadataAction.fireEvent('click');
            }
            if (urlParameters.uuid !== undefined) {
                catalogue.metadataShow(urlParameters.uuid, true);
            } else if (urlParameters.id !== undefined) {
                catalogue.metadataShowById(urlParameters.id, true);
            }
            
            // FIXME : should be in Search field configuration
            Ext.get('E_any').setWidth(285);
            Ext.get('E_any').setHeight(28);
            /*if (GeoNetwork.searchDefault.activeMapControlExtent) {
                Ext.getCmp('geometryMap').setExtent();
            }
            if (urlParameters.bounds) {
                Ext.getCmp('geometryMap').map.zoomToExtent(urlParameters.bounds);
            }
            */
            var events = ['afterDelete', 'afterRating', 'afterLogout', 'afterLogin'];
            Ext.each(events, function (e) {
                catalogue.on(e, function () {
                    if (searching === true) {
                        searchForm.fireEvent('search');
                    }
                });
            });

            // Hack to run search after all app is rendered within a sec ...
            // It could have been better to trigger event in SearchFormPanel#applyState
            // FIXME
            if (urlParameters.s_search !== undefined) {
                setTimeout(function () {
                    searchForm.fireEvent('search');
                }, 500);
            }
             

            
            setTimeout(function () {
            	initMap_Step2();
            	Ext.getCmp('searchForm').insert(2, GeoNetwork.util.jpSearchFormTools.getGeographicFormFields(iMap.getMap(), true));
                Ext.getCmp('searchForm').doLayout();

            }, 1000);
        },
        getIMap: function () {
            // init map if not yet initialized
            if (!iMap) {
                initMap();
            }
            
            // TODO : maybe we should switch to visualization mode also ?
            return iMap;
        },
        getCatalogue: function () {
            return catalogue;
        },
        /**
         * Do layout
         *
         * @param response
         * @return
         */
        loadResults: function (response) {
            
            initPanels();
            //facetsPanel.refresh(response);
            // FIXME : result panel need to update layout in case of slider
            // Ext.getCmp('resultsPanel').syncSize();
            Ext.getCmp('previousBt').setDisabled(catalogue.startRecord === 1);
            Ext.getCmp('nextBt').setDisabled(catalogue.startRecord + 
                    parseInt(Ext.getCmp('E_hitsperpage').getValue(), 10) > catalogue.metadataStore.totalLength);
            if ((showSortBy==true) && (Ext.getCmp('E_sortBy').getValue())) {
                Ext.getCmp('sortByToolBar').setValue(Ext.getCmp('E_sortBy').getValue()  + "#" + Ext.getCmp('sortOrder').getValue());
            } else if (showSortBy==true)  {
                Ext.getCmp('sortByToolBar').setValue(Ext.getCmp('E_sortBy').getValue());
            }
            
            resultsPanel.syncSize();
            resultsPanel.setHeight(Ext.getCmp('center').getHeight());
            
            Ext.getCmp('west').syncSize();
            Ext.getCmp('center').syncSize();
            Ext.ux.Lightbox.register('a[rel^=lightbox]');
            
            // Update page title based on search results and params
            var formParams = GeoNetwork.util.SearchTools.getFormValues(searchForm);
            var criteria = '', 
                excludedSearchParam = {E_hitsperpage: null, timeType: null,
                sortOrder: null, sortBy: null};
            for (var item in formParams) {
                if (formParams.hasOwnProperty(item) && excludedSearchParam[item] === undefined) {
                    var value = formParams[item];
                    if (value != '') {
                        fieldName = item.split('_');
                        criteria += OpenLayers.i18n(fieldName[1] || item) + ': ' + value + ' - '
                    }
                }
            }
            var title = (catalogue.metadataStore.totalLength || 0) + OpenLayers.i18n('recordsFound')
                           + (criteria !== '' ? ' | ' + criteria : '');
            
            GeoNetwork.Util.updateHeadInfo({
                title: catalogue.getInfo().name + ' | ' + title
            });
            

            Ext.getCmp('searchResultsPanel').expand(true);
            //Ext.getCmp('east').expand(true);
            
            app.updateLayout();
        },
        /*<jp>*/
        /**
         * Do layout only
         *
         * @return
         */
        updateLayout: function() {
            Ext.getCmp('west').syncSize();
            Ext.getCmp('center').syncSize();
            resultsPanel= Ext.getCmp('resultsPanel');
            resultsPanel.syncSize();
            resultsPanel.setHeight(Ext.getCmp('searchTab').getHeight()-45);
            //console.log("layout updated");
        },
        /*</jp>*/
        /**
         * Switch from one mode to another
         *
         * @param mode
         * @param force
         * @return
         */
        switchMode: function (mode, force) {
            /*var ms = Ext.getCmp('ms'),
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
                c.add(iMap.getViewport());
                c.doLayout();
                if (c.collapsed) {
                    c.toggleCollapse();
                }
                if (!w.collapsed) {
                    w.toggleCollapse();
                }
                
                Ext.getCmp('vp').syncSize();
            } else {
                if (!c.collapsed) {
                    c.toggleCollapse();
                }
                if (w.collapsed) {
                    w.toggleCollapse();
                }
            }*/
        }
    };
};

Ext.onReady(function () {
    GeoNetwork.Util.locales=[
                             ['en', 'English', 'eng'], 
                             ['fr', 'Français', 'fre']                  
                           ];
    var lang = /hl=([a-z]{3})/.exec(location.href);
    GeoNetwork.Util.setLang(lang && lang[1], '..');

    Ext.QuickTips.init();
    setTimeout(function () {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove: true});
    }, 250);
    
    app = new GeoNetwork.app();
    app.init();
    catalogue = app.getCatalogue();

    
    /* Focus on full text search field */
    Ext.getDom('E_any').focus(true);
});