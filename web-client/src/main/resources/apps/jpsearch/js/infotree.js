/*********************************************
*	Tree config for SI-GDT information tool
**********************************************/
window.fichesPratiquesURL = 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getFichePratique.php?';
window.showlayerinfos = true;

window.infosConfig = [
	{
		text        : 'NDVI',
		type		: 'ndvipanel',
		text_intro	: "<h1>Analyse des données NDVI</h1><p>Les données NDVI (indices de végétation) sont produites de façon décadaires, ie les 1, 11 et 21 de chaque mois.</p><img src='../images/NdviPanel.jpg' style='float:left'><p>Le présent outil permet d'interroger les données historiques suivant différents modes. Veuillez sélectionner un des modes, parmis ceux proposés à gauche.</p>",
		annees		: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011'],
		mois 		: [['01','janvier'],['02','février'],['03','mars'],['04','avril'],['05','mai'],['06','juin'],['07','juillet'],['08','août'],['09','septembre'],['10','octobre'],['11','novembre'],['12','décembre']],
		jours 		: ['01','11','21'],
		children	: [
		    {
		    	text		: 'Données annuelles',
		    	type		: 'ndvi_annual',
		    	text_intro	: "L'indice de végétation varie naturellement au cours de l'année...",
		    	text_body	: "... et illustre particulèrement les besoins d'adapter les cultures et pratiques agricoles au cours de l'année",
		    	/*chart		: {
		    		type		: "line",
		    		url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_queryNDVI.php?mode=year'
		    	}*/
		    	chart		: {
		    		type		: "column",
		    		url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_queryNDVI.php?mode=yearByMonths'
		    	}
		    },
		    {
		    	text		: "Historique d'une décade",
		    	type		: 'ndvi_decade',
		    	text_intro	: "L'évolution, à date fixe, de l'indice de végétation apporte de nombreuses informations..",
		    	text_body	: "... dont un bon nombre ont à voir avec le changement climatique et l'exploitation des sols",
		    	chart		: {
		    		type		: "column",
		    		url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_queryNDVI.php?mode=decade'
		    	}
		    }
	    ] 
	},{
		text        : 'Pratiques GDT',
		type		: 'pratiquesgdtpanel',
		text_intro	: "<h1>Pratiques de Gestion Durable des Terres (GDT)</h1><p>La GDT est une des problématiques majeures au Mali. Un inventaire des pratiques recommandées, selon l'écosystème considéré a été réalisée.",
		zae_url		: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getZAE.php?',
		children	: [
		    {
		    	text		: 'Description',
		    	url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getPratiqueDescription.php?'
		    },
		    {
		    	text		: 'Agriculture',
		    	url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getPratiqueAgriculture.php?'
		    },
		    {
		    	text		: 'Dégradation',
		    	url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getPratiqueDegradation.php?'
		    },
		    {
		    	text		: 'Pratiques',
		    	url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getPratiquePratiques.php?'
		    },
		    {
		    	text		: 'Services rendus',
		    	url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getPratiqueServicesRendus.php?'
		    }
	    ] 
	},{
		alwaysUpdate: true,
		text        : 'Stations hydro',
		type		: 'layerpanel',	
		layername	: 'abn stations',
		wmsInfoURL	: 'http://ige.fr/geoserver-prod/wms?',
		text_intro	: "<h3>Données de la couche des Stations hydrographiques</h3>",
		dataurl		: 'http://ilwac.ige.fr/sigdt-config/services-ilwac/ilwac_json_queryHydroStationsDB.php?sampleRythm=1&',
		children	: [
		{
			text_intro : "<h3>Pas de données</h3>"
		},{
			text_intro : "<h3>Débits moyens journaliers (m³/s) sur les rivières, année 2010-2011</h3>"
		},{
			text_intro : "<h3>Hauteurs d'eau moyennes journalières (cm), année 2010-2011</h3>"
		}
		]
		
	},
	{
		text        : 'Donnés générales',
		granularity : [	{code:'reg', label:'Régions'},
		               	{code:'cer', label:'Cercles'},
		               	{code:'com',	label:'Communes'}
		               ],
		presentation: 'Présentation HTML des données générales',
		children   : [
		    {
	    		text        : 'Population urbaine/rurale',
	        	info_param: {
                	'granularity' : ['reg','cer'],
                	'text_intro':'De plus en plus de monde quitte la campagne pour essayer de trouver un travail en ville...',
                	'text_body':"Cet indicateur montre bien que, hormis la capitale, l'essentiel de la population est rurale. Les ville seconaires sont petites",
                	'chartType': 'pie',
                	'dataURL':'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_getPunctualData-0.1.php?',
                	'dataTablePrefix':'i_1c4_pop_urb_rur_',
                	'dataFields' : ['poprur','popurb'],
                	'geomField'	: 'the_geom'
                },
                leaf: true
		    },{
		        text        : 'Pauvreté',
	        	info_param: {
                	'granularity' : ['reg', 'com']
                },
                expanded:true,
                children   : [
                  		    {
                  	    		text        : 'Pauvreté rurale',
                  	        	info_param: {
                                  	'granularity' : ['reg','cer'],
                                  	'text_intro':'De plus en plus de monde quitte la campagne pour essayer de trouver un travail en ville...',
                                  	'text_body':"Cet indicateur montre bien que, hormis la capitale, l'essentiel de la population est rurale. Les ville seconaires sont petites",
                                  	'dataURL':'http://jean.localhost/sigdt-config/services-ilwac/ilwac_json_getPunctualData-0.1.php?tables=v_1c4_pop_urb_rur_reg,v_1c4_pop_urb_rur_cer&fields=poprur,popurb&geom_field=the_geom&lon=-2&lat=17'
                                  	
                                  },
                                  leaf: true
                  		    },{
                  		        text        : 'Pauvreté urbaine',
                  	        	info_param: {
                                  	'granularity' : ['reg','cer', 'com']
                                  },
                                  leaf: true
                  		    }     
                  		]
		    }     
		]
	},{
		text        : 'Climat',
		granularity : null,
		children   : [
		    {
	    		text        : 'SDWeb',
	        	info_param: {
                	'texte_intro':'De plus en plus de monde quitte la campagne pour essayer de trouver un travail en ville...',
                	'texte_corps':"Cet indicateur montre bien que, hormis la capitale, l'essentiel de la population est rurale. Les ville seconaires sont petites",
                	'dataURL':'http://jean.localhost/sigdt-config/services-ilwac/ilwac_json_getPunctualData-0.1.php?tables=v_1c4_pop_urb_rur_reg,v_1c4_pop_urb_rur_cer&fields=poprur,popurb&geom_field=the_geom&lon=-2&lat=17'
                },
                leaf: true
		    },{
		        text        : 'Pauvreté',
	        	info_param: {
                },
                leaf: true
		    }     
		]
	},{
		text        : 'Eau',
		granularity : [	{code:'reg', label:'Régions'},
		               	{code:'cer', label:'Cercles'},
		               	{code:'com',	label:'Communes'}
		               ],
		children   : [
		    {
	    		text        : 'Puits',
	        	info_param: {
                	'granularity' : ['reg','cer']
                },
                leaf: true
		    },{
		        text        : 'Forages',
	        	info_param: {
                	'granularity' : ['reg','cer', 'com']
                },
                leaf: true
		    }     
		]
	},{
		text        : 'Sols',
		granularity : [	{code:'reg', label:'Régions'},
		               	{code:'cer', label:'Cercles'},
		               	{code:'com',	label:'Communes'}
		               ],
		children   : [
		    {
	    		text        : 'Occupation des sols',
	        	info_param: {
                	'granularity' : ['reg','cer']
                },
                leaf: true
		    },{
		        text        : 'Perte de terres agricoles',
	        	info_param: {
                	'granularity' : ['reg','cer', 'com']
                },
                leaf: true
		    },{
		        text        : 'Perte de zones forestières',
	        	info_param: {
                	'granularity' : ['reg','cer', 'com']
                },
                leaf: true
		    }     
		]
	},{
		text        : 'Végétation',
		granularity : [	{code:'reg', label:'Régions'},
		               	{code:'cer', label:'Cercles'},
		               	{code:'com',	label:'Communes'}
		               ],
		children   : [
		    {
	    		text        : 'NDVI',
	        	info_param: {
                	'granularity' : ['reg','cer']
                },
                leaf: true
		    }  
		]
	},{
		text        : 'Risques',
		granularity : [	{code:'reg', label:'Régions'},
		               	{code:'cer', label:'Cercles'}
		               ],
		children   : [
		    {
	    		text        : 'Liste des risques',
	        	info_param: {
                	'granularity' : ['com']
                },
                leaf: true
		    },{
		        text        : 'Surfaces brûlées',
	        	info_param: {
                	'granularity' : ['reg','cer', 'com']
                },
                leaf: true
		    },{
		        text        : 'Inondations',
	        	info_param: {
                	'granularity' : ['reg','cer', 'com']
                },
                leaf: true
		    }     
		]
	}
];