OpenLayers.DOTS_PER_INCH = 90.71;
//OpenLayers.ImgPath = '../js/OpenLayers/theme/default/img/';
OpenLayers.ImgPath = '../js/OpenLayers/img/';

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

// Define a constant with the base url to the MapFish web service.
//mapfish.SERVER_BASE_URL = '../../../../../'; // '../../';

// Remove pink background when a tile fails to load
OpenLayers.Util.onImageLoadErrorColor = "transparent";

// Lang
OpenLayers.Lang.setCode(GeoNetwork.defaultLocale);

OpenLayers.Util.onImageLoadError = function() {
	this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
	if (this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
		this.src = this.src;
	} else {
		this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
		this.style.display = "none";
	}
};

// add Proj4js.defs here
// Proj4js.defs["EPSG:27572"] = "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs";
Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//new OpenLayers.Projection("EPSG:900913")


GeoNetwork.map.printCapabilities = "../../pdf";

// Config for WGS84 based maps
//GeoNetwork.map.PROJECTION = "EPSG:4326";
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-180,-90,180,90);
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-5.1,41,9.7,51);
var ovmapWmsURL = window.overviewWmsUrl?window.overviewWmsUrl:'http://ilwac.ige.fr/geoserver-prod/wms';
var ovmapWmsLayers = window.overviewWmsLayers?window.overviewWmsLayers:'ml_fond_carto';
var ovmapWmsFormat = window.overviewWmsFormat?window.overviewWmsFormat:'image/jpeg';

var plainMapTitle = window.plainMapTitle?window.plainMapTitle:'Fond générique';
var plainMapWmsUrl = window.plainMapWmsUrl?window.plainMapWmsUrl:'http://ilwac.ige.fr/geoserver-prod/wms';
var plainMapWmsLayers = window.plainMapWmsLayers?window.plainMapWmsLayers:'ml_fond_carto';
var plainMapWmsFormat = window.plainMapWmsFormat?window.plainMapWmsFormat:'image/jpeg';

GeoNetwork.map.ovmapLayers = [new OpenLayers.Layer.WMS("Fond générique", ovmapWmsURL, {layers: ovmapWmsLayers, format: ovmapWmsFormat}, {isBaseLayer: true})];
GeoNetwork.map.BACKGROUND_LAYERS = [
    //new OpenLayers.Layer.WMS("Background layer", "/geoserver/wms", {layers: 'gn:gboundaries', format: 'image/jpeg'}, {isBaseLayer: true})
    new OpenLayers.Layer.WMS(plainMapTitle, plainMapWmsUrl, {layers: plainMapWmsLayers, format: plainMapWmsFormat, TILED:'true'}, {isBaseLayer: true})
    ,
    new OpenLayers.Layer.Google(
    	      "Google Satellite",
    	      {type: google.maps.MapTypeId.SATELLITE, 'sphericalMercator': true, numZoomLevels: 22}
	)/*,
	new OpenLayers.Layer.Google(
		        "Google Hybride",
		        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22, visibility: false}
    )*/
	//Bing modern API -- needs OpenLayers 2.11 and an API key (see index_debug.html apikey)
 /*	  new OpenLayers.Layer.Bing({
		    key: apiKey,
		    //type: "AerialWithLabels",
		    type: "Aerial",
		    name: "Bing Aerial"
		})/*,
    	    // VE API : OK with OL 2.10. No need for a key
    	  new OpenLayers.Layer.VirtualEarth("Hybrid", {
              type: VEMapStyle.Hybrid, 'sphericalMercator': true, numZoomLevels: 20, isBaseLayer: true
          })*/
    //new OpenLayers.Layer.WMS("Background layer", "http://www2.demis.nl/mapserver/wms.asp?", {layers: 'Countries', format: 'image/jpeg'}, {isBaseLayer: true})
    ];

// Config for OSM based maps
GeoNetwork.map.PROJECTION = "EPSG:900913";
////GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-550000, 5000000, 1200000, 7000000);
GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7);
//GeoNetwork.map.BACKGROUND_LAYERS = [
//    new OpenLayers.Layer.OSM()
//    //new OpenLayers.Layer.Google("Google Streets");
//    ];

GeoNetwork.map.MAP_OPTIONS = {
		resolutions: [156543.033928041, 78271.51696402048, 39135.75848201023, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395],
		projection: GeoNetwork.map.PROJECTION,
		maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7),
	    restrictedExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7),
		units: "meters",
		theme:null,
		controls: []
};
GeoNetwork.map.MAIN_MAP_OPTIONS = {
		resolutions: [156543.033928041, 78271.51696402048, 39135.75848201023, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395],
		projection: GeoNetwork.map.PROJECTION,
		maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7),
	    restrictedExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7),
		units: "meters",
		theme:null,
		controls: [
		           new OpenLayers.Control.MousePosition( {'prefix': 'Lon ', 'separator':'°, Lat ', 'suffix':'°','numDigits':3, displayProjection:new OpenLayers.Projection("WGS84")}),
		           new OpenLayers.Control.OverviewMap({layers: GeoNetwork.map.ovmapLayers, maximized:true,size : new OpenLayers.Size(130,100)})
		           ]
};