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
Ext.namespace('GeoNetwork', 'GeoNetwork.jpLang');

GeoNetwork.jpLang.en = {
	//fixes
    'org': "Organization",
    //new ones
	'choose': 'Choose',
	'facetsTitle':'Narrow your Search',
	'form': 'Search form',
	'geogCriteria': 'Geographic criteria',
    'gxBaseLayerContainer':"Base Layer",
    'IgeGeoserver':'IGE\'s map server',
	'legend:': 'Legend:',
    'organize': 'Organize',
    'overlay:':'Overlay: ',
    'ovGoogleHybrid':"Google Hybrid background map",
	'print': 'Print',
	'printHeader':"Please note that this isn't truly a print page but a PDF page generator. This PDF you can then print or save on your computer. "+
		'<br /><br /><b>Warning:</b> Google-based backgrounds will not show in the printed view. This is due to Google-licence restrictions. So, take care to put some data in the background for printing, or you could get something like a white, squared area...',
	'results': 'Search results',
	'showLegend': 'Display the legend',
	'horizCurtainButtonText': 'Horizontal curtain',
	'vertCurtainButtonText': 'Vertical curtain',
	'apply': 'Apply',
	'day':'Day',
	'month':'Month',
	'year':'Year',
	'dashBoardTooltipTitle':'Dashboard',
	'dashBoardTooltipText':"Click somewhere on the map to display the dashboard. It will give you tools to analyze several factors upon time",
	"dash_DashBoardWindow.windowTitle" : "Information Dashboard",
	'dash_ChooseDecade':'Choose which decade to query',
	'dash_ChooseYear':'Choose the year to display',
	'linkedMtdWarnTitle' : 'Warning',
	'linkedMtdWarnText' : 'You will loose the changes made since last save. If you have made significant changes, you may want to save the metadata contents first (\'Save\' button). <br /> Do you want to proceed anyway ?',
	'tools':'Tools',
	'shortcuts':'Shortcuts',
	'pratiquesGDT':'<h1 class="soberH1">Map the Sustainable Land Management (SLM) practices</h1>',
	'pratiquesConfTitle':'<h1 class="soberH1">Map of best SLM practices</h1>',
	'shortcutsAdminTitle': '<h1 class="soberH1">Administrative entities</h1>',
	'shortcutsZaeTitle': '<h1 class="soberH1">Agro-ecologic areas</h1>',
	'geonamesSearchPanelTitle' : 'Chercher un lieu (base Geonames)',
	'geonamesCbHeader': '<h1 class="soberH1">Search for a place (Geonames database)</h1>This tool perfoms a search in the geonames database (geonames.org). <br />Enter the first letters of the name of the place, and if it does exist in the database, the corresponding results will be listed. When you hover a result, its position is pointed on the map.',
	'geonamesLoadingText': 'Query the Geonames database...',
	'geonamesEmptyText': 'Search for a place (Geonames)',
	'SLMtools' : 'SLM Best Pratices',
	'searchTools' : 'Search tools (places)',
	'openPratiqueSheet' : 'Open sheet',
	'legend': 'Legend',
	'openLegendButtonText':'Open legend in popup',
	'zz':'zz'
};
OpenLayers.Util.extend(OpenLayers.Lang.en, GeoNetwork.jpLang.en);
