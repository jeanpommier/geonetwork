.. _installing:
.. include:: ../../substitutions.txt

.. _UI_config:

User interface configuration
============================

The catalog administrator can configure which interface to use in `WEB-INF/config-gui.xml` as follows. 


Configuring the Default user interface
--------------------------------------

`WEB-INF/config-gui.xml` is used to define which home page to use. To configure the Default user interface use::

    <client type="redirect" 
      widget="false" 
      url="main.home"
      parameters=""
      stateId=""
      createParameter=""/>
  

Configuring the Javascript Tabbed Widgets user interface
--------------------------------------------------------

Widgets can be used to build custom interfaces. GeoNetwork provides a Javascript Widgets interface for searching, viewing and editing metadata records.


This interface can be configured using the following attributes:

 - **parameter** is used to define custom application properties like default map extent for example or change the default language to be loaded

 - **createParameter** is appended to URL when the application is called from the administration > New metadata menu (usually "#create").

 - **stateId** is the identifier of the search form (usually "s") in the application. It is used to build quick links section in the administration and permalinks.


Sample configuration::

  <!-- Widget client application with a tab based layout -->
  <client type="redirect" 
    widget="true" 
    url="../../apps/tabsearch/" 
    createParameter="#create" 
    stateId="s"/>
    


Configuring the user interface with configuration overrides
-----------------------------------------------------------

Instead of changing config-gui.xml file, the catalog administrator could use the configuration overrides mechanism to create a custom configuration (See :ref:`adv_configuration_overriddes`). By default, no overrides are set and the Default user interface is loaded. 

To configure which user interface to load, add the following line in WEB-INF/config-overrides.xml in order to load
the Widgets based user interface::
 
 
    <override>/WEB-INF/config-overrides-widgettab.xml</override>
