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

GeoNetwork.jpLang.fr = {
		//fixes
	    'org': "Organisation",
	    //new ones
		'choose': 'Choisir',
		'facetsTitle':'Affiner la recherche',
		'form': 'Formulaire de recherche',
	    'geogCriteria': 'Critères géographiques',
	    'gxBaseLayerContainer':"Fond de carte",
	    'IgeGeoserver':'Serveur cartographique IGE',
	    'legend:':'Légende :',
	    'organize': 'Organiser',
	    'overlay:':'Calque : ',
	    'ovGoogleHybrid':"Fond de carte Hybride Google",
		'print': 'Imprimer',
		'printHeader':"Veuillez noter qu'il ne s'agit pas réellement d'une page d'impression mais d'un générateur de PDF. Il produit un document PDF, que vous êtes ensuite libre d'imprimer, ou de stocker sur votre ordinateur."+
			"<br /><b>Attention :</b> Les données de fond d'origine Google ne seront pas affichées dans la vue exportée, à cause de restrictions de licence Google. Veillez donc à afficher d'autres données en guise de fond de plan.",
		'results': 'Résultats de la recherche',
		'showLegend': 'Afficher la légende',
		'horizCurtainButtonText': '\'Rideau\' horizontal',
		'vertCurtainButtonText': '\'Rideau\' vertical',
		'apply':'Appliquer',
		'day':'Jour',
		'month':'Mois',
		'year':'Année',
		'dashBoardTooltipTitle':'Tableau de bord',
		'dashBoardTooltipText':"Cliquer en un point de la carte pour afficher le tableau de bord. Il vous permettra d'analyser l'évolution de diverses données en fonction du temps",
		"dash_DashBoardWindow.windowTitle" : "Tableau de bord",
		'dash_ChooseDecade':'Déterminer la décade à afficher',
		'dash_ChooseYear':"Choisir l'année à afficher",
		'linkedMtdWarnTitle' : 'Attention',
		'linkedMtdWarnText' : 'Vous allez perdre tous les changements effectués depuis la dernière sauvegarde. Si vous avez changé du contenu, vous voudrez probablement enregistrer les modifications, au préalable. Voulez-vous continuer malgré tout ?',
		'tools':'Outils',
		'shortcuts':'Raccourcis',
		'pratiquesGDT':'Pratiques de Gestion Durable des Terres (GDT)',
		'pratiquesConfTitle':'<h1 class="soberH1">Carte des pratiques GDT</h1>',
		'shortcutsAdminTitle': '<h1 class="soberH1">Entités administratives</h1>',
		'shortcutsZaeTitle': '<h1 class="soberH1">Zonages agro-écologiques</h1>',
		'geonamesSearchPanelTitle' : 'Chercher un lieu (base Geonames)',
		'geonamesCbHeader': '<h1 class="soberH1">Chercher un lieu (base Geonames)</h1>Cet outil effectue une recherche de lieux dans la base de données Geonames (geonames.org). <br />Entrez les premières lettre du nom de lieu recherché, et s\'il est présent dans la base, les résultats correspondant seront listés. Lorsque vous survolez un résultat, sa position est pointée sur la carte.',
		'geonamesLoadingText': 'Interrogation de la base Geonames...',
		'geonamesEmptyText': 'Chercher un lieu (Geonames)',
		'SLMtools' : 'Bonnes pratiques GDT',
		'searchTools' : 'Outils de recherche (lieux)',
		'openPratiqueSheet' : 'Ouvrir la fiche',
		'legend': 'Legende',
		'openLegendButtonText':'Ouvrir la légende dans un popup',
		'zz':'zz'
};
OpenLayers.Util.extend(OpenLayers.Lang.fr, GeoNetwork.jpLang.fr);
