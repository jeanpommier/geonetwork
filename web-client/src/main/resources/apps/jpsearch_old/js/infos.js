Ext.namespace('GeoNetwork');


var config=null;
var tabpanel = null;
var lat=17;
var lon=-2;


Ext.onReady(function(){
	
	var infoww = new GeoNetwork.IlwacInfoWindow({lat:lat, lon:lon});
	infoww.show();
		ilwacinfo.setLonLat(-3,16.5);
});