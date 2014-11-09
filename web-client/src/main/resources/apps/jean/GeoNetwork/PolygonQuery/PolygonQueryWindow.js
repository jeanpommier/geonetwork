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

/**
 * @requires GeoNetwork/windows/BaseWindow.js
 */ 

Ext.namespace('GeoNetwork.PolygonQuery');

/**
 * Class: GeoNetwork.PolygonQuery.PolygonQueryWindow
 *      PolygonQuery main Window
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.PolygonQuery.PolygonQueryWindow
 * Create an instance of GeoNetwork.PolygonQuery.PolygonQueryWindow
 *
 * Parameters:
 * config - {Object} 
 */
GeoNetwork.PolygonQuery.PolygonQueryWindow = function(config) {
    Ext.apply(this, config);
    GeoNetwork.PolygonQuery.PolygonQueryWindow.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.PolygonQuery.PolygonQueryWindow, GeoNetwork.BaseWindow, {

    /**
     * Method: init
     *     Initialize this component.
     */
    initComponent: function() {
        GeoNetwork.PolygonQuery.PolygonQueryWindow.superclass.initComponent.call(this);

        this.title = this.title || OpenLayers.i18n("featureInfoWindow.windowTitle");

        this.x=10;
        this.y = 10;
        this.width = 300;
        this.height = 600;

        this.cls = 'popup-variant1';

       	/*var fp = new GeoNetwork.PolygonQuery.PolygonQueryPanel();

        this.add(fp);*/

        this.doLayout();
    },

  

});