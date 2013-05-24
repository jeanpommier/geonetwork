/*********************************************
*	Tree config for SI-GDT information tool
**********************************************/


var infosConfig = [
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
                	'dataURL':'http://ilwac.ige.fr/sigdt-config/ilwac_json_getPunctualData-0.1.php?',
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
                                  	'dataURL':'http://jean.localhost/sigdt-config/ilwac_json_getPunctualData-0.1.php?tables=v_1c4_pop_urb_rur_reg,v_1c4_pop_urb_rur_cer&fields=poprur,popurb&geom_field=the_geom&lon=-2&lat=17',
                                  	
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
                	'dataURL':'http://jean.localhost/sigdt-config/ilwac_json_getPunctualData-0.1.php?tables=v_1c4_pop_urb_rur_reg,v_1c4_pop_urb_rur_cer&fields=poprur,popurb&geom_field=the_geom&lon=-2&lat=17',
                	
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