.. _editor_gui:
.. include:: ../../substitutions.txt

Edition interface
=====================


.. _metadata_edit_mode:

Views
--------

A view basicy defines which fields will be visible and how.
It is possible to configure which views will be available (cf. :ref:`how_to_config_edit_mode`).
They depend on the metadata standard: the available views for an ISO metadata differ from the available ones in Dublin Core.

In the following description, we will consider the avialable views for ISO standard.

Default view
`````````````````
The default view is listing all the non-empty fields of the metadata sheet or template. It gives a simple and light view of the metadata, but it will not be possible to add a element that is hidden. In this case, it will be necessary to use another mode, usually the advanced mode.

This view is also available in all other standards.

INSPIRE view
`````````````
This view has been created in order to organize the editor according to the `INSPIRE Metadata Implementing Rules <http://inspire.jrc.ec.europa.eu/index.cfm/pageid/101>`_.

It is organized in the following way:

- Identification
- Classification of spatial data and services
- Keywords & INSPIRE themes
- Geographic location
- Temporal reference
- Quality and validity
- Conformity 
- Constraint related to access and use
- Organisations responsible for the establishment, management, maintenance and distribution


By group
``````````

The 3 tabs, *core*, *minimum* and *all*, gather the information subsets as defined in the ISO standard.

By package (Complete view)
``````````````````````````

This view gives access the the **whole** set of descriptors as defined in the metadata standard. The tabs match with main ISO sections:

- Metadata
- Identification
- Maintenance
- Constraints
- Spatial Informations
- Reference System
- Distribution
- Data quality
- Application schema
- Catalog
- Content Information
- Extension Information

XML View
``````````

The **XML View**  displays the whole metadata content in its original form; the XML structure is composed of XML tags enclosing the information between opening and enclosing matching tags:

::

  <gmd:language>
    <gco:CharacterString>eng</gco:CharacterString>
  </gmd:language>


A minimal knwoledge of XML language is strongly advised in order to uxe the XML view.

.. figure:: xmlView1.png

   XML View




Menu bar
-------------

.. figure:: toolbar.png
   :scale: 85%
   
   Tool bar in edition mode

The menu bar is composed of:

- **Record type** : choose if the sheet will be set as metadata or template
- **View mode** : choose one of the available modes of the current metadata standard (cf. :ref:`metadata_edit_mode`)
- **Save** : save the sheet
- **Save and check** : saves and validates the sheet (cf. :ref:`metadata_validation`)
- **Save and close** : saves the sheet and closes the editor
- **Minor edit** : does not change the update date
- **Reset** : resets the form
- **Cancel** : cancels the current edition

