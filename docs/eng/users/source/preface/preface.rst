.. _preface:.. _preface:
.. include:: ../substitutions.txt

Preface
=======

About this Project
------------------

This document provides guidelines to install, configure, use and customise the GeoNetwork opensource software. 

The GeoNetwork project started out as a Spatial Data Catalogue System for the Food and Agriculture organisation of the United Nations (:term:`FAO`), the United Nations World Food Programme (:term:`WFP`) and the United Nations Environmental Programme (:term:`UNEP`).

At present the project is widely used as the basis of Spatial Data Infrastructures all around the world. 

The project is part of the Open Source Geospatial Foundation (:term:`OSGeo`) and can be found at `GeoNetwork opensource <http://geonetwork-opensource.org>`_.

.. image:: OSGeo_project.png
   :align: center

License Information
-------------------

Software
````````

The |project_name| opensource software is released under the :term:`GPL` v2 license and can be used and modified free of charge.

Documentation
`````````````

Documentation is released under a :term:`Creative Commons` license with the following conditions.

You are free to Share (to copy, distribute and transmit) and to Remix (to adapt) the documentation under the following conditions:

- Attribution. You must attribute GeoNetwork opensource documentation to `GeoNetwork opensource developers <http://geonetwork-opensource.org>`_.

- Share Alike. If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.

With the understanding that:

- Any of the above conditions can be waived if you get permission from the copyright holder.

- Public Domain. Where the work or any of its elements is in the public domain under applicable law, that status is in no way affected by the license.

Other Rights. In no way are any of the following rights affected by the license:

- Your fair dealing or fair use rights, or other applicable copyright exceptions and limitations;

- The author's moral rights;

- Rights other persons may have either in the work itself or in how the work is used, such as publicity or privacy rights.

Notice: For any reuse or distribution, you must make clear to others the license terms of this work. The best way to do this is with a link to this web page.

You may obtain a copy of the License at `Creative Commons Attribution-ShareAlike 3.0 Unported License <http://creativecommons.org/licenses/by-sa/3.0/>`_

The document is written in reStructuredText format for consistency and portability.

Author Information
------------------

The documentation was written by the GeoNetwork opensource Developers and other community members. The basis for the reStructuredText based documentation is based on the work done by the `GeoServer <http://geoserver.org>`_ project and the `Sphinx <http://sphinx.pocoo.org/>`_ framework. 

If you have questions, found a bug or have enhancements, please contact us through the GeoNetwork opensource Development Mailing list at geonetwork-devel@lists.sourceforge.net

What is GeoNetwork opensource ?
-----------------------------

GeoNetwork opensource is a standard based and decentralised spatial information
management system, designed to enable access to geo-referenced databases and
cartographic products from a variety of data providers through descriptive metadata,
enhancing the spatial information exchange and sharing between organisations and
their audience, using the capacities and the power of the Internet. The system
provides a broad community of users with easy and timely access to available spatial
data and thematic maps from multidisciplinary sources, that may in the end support
informed decision making. The main goal of the software is to increase
collaboration within and between organisations for reducing duplication and
enhancing information consistency and quality and to improve the accessibility of a
wide variety of geographic information along with the associated information,
organised and documented in a standard and consistent way.

Main Features are:

- Instant search on local and distributed geospatial
  catalogues

- Uploading and downloading of data, documents, PDF's and any other
  content

- An interactive Web map viewer that combines Web Map Services from
  distributed servers around the world

- Online map layout generation and export in PDF format

- Online editing of metadata with a powerful template system

- Scheduled harvesting and synchronisation of metadata between
  distributed catalogues

- Groups and users management

- Fine grained access control

Background and evolution
````````````````````````

The prototype of the GeoNetwork catalogue was developed by the Food and Agriculture
organisation of the United Nations (FAO) in 2001 to systematically archive and
publish the geographic datasets produced within the organisation. The prototype was
built on experiences within and outside the organisation. It used metadata content
available from legacy systems that was transformed into what was then only a draft
metadata standard, the ISO 19115. Later on, another UN agency, the World Food
Programme (WFP) joined the project and with its contribution the first version of
the software was released in 2003 and operational catalogues were established in FAO
and WFP. The system was based on the ISO19115:DIS metadata standard and embedded the
Web Map Client InterMap that supported Open Geospatial Consortium (OGC) compliant
Web Map Services. Distributed searches were possible using the standard Z39.50
catalogue protocol. At that moment it was decided to develop the program as a Free and
Open Source Software to allow the whole geospatial users community to benefit from
the development results and to contribute to the further advancement of the
software.

Jointly with the UN Environmental Programme (UNEP), FAO developed a second version
in 2004. The new release allowed users to work with multiple metadata standards (ISO
19115, FGDC and Dublin Core) in a transparent manner. It also allowed metadata to be
shared between catalogues through a caching mechanism, improving reliability when
searching in multiple catalogues.

In 2006, the GeoNetwork team dedicated efforts to develop a DVD containing the
GeoNetwork version 2.0.3 and the best free and open source software in the field of
Geoinformatics. The DVD was produced and distributed in hard copy to over three
thousand people. More recently, the OSGeo Live project has been developed with GeoNetwork and all the best Open Source Geospatial software available on a self-contained bootable DVD, USB thumb drive or Virtual Machine based on Xubuntu. The GeoNetwork community has been a part of this project and will continue to make sure the latest stable version of GeoNetwork is included. You can download the OSGeo-Live images from `OSGeo Live website <http://live.osgeo.org>`_.

GeoNetwork opensource is the result of the collaborative development of many contributors.
These include among others the Food and Agriculture organisation (FAO), the UN Office for the
Coordination of Humanitarian Affairs (UNOCHA), the Consultative Group on
International Agricultural Research (CSI-CGIAR), The UN Environmental Programme (UNEP),
The European Space Agency (ESA) and many others. Support for
the metadata standard ISO19115:2003 has been added by using the
ISO19139:2007 implementation specification schema published in May 2007. The release
also serves as the open source reference implementation of the OGC Catalogue Service
for the Web (CSW 2.0.2) specification. Improvements to give users a more responsive
and interactive experience have been substantial and include a new Web map viewer
and a complete revision of search interface.

The use of International Standards
``````````````````````````````````

GeoNetwork has been developed following the principles of a Free and Open Source
Software (FOSS) and based on International and Open Standards for services and
protocols, like the ISO-TC211 and the Open Geospatial Consortium (OGC)
specifications. The architecture is largely compatible with the OGC
Portal Reference Architecture, i.e. the OGC guide for implementing standardised
geospatial portals. Indeed the structure relies on the same three
main modules identified by the OGC Portal Reference Architecture, that are focused
on spatial data, metadata and interactive map visualisation. The system is also
fully compliant with the OGC specifications for querying and retrieving information
from Web catalogues (CSW). It supports the most common standards to
specifically describe geographic data (ISO19139 and FGDC) and the international
standard for general documents (Dublin Core). It uses standards (OGS WMS) also for
visualising maps through the Internet.

Harvesting geospatial data in a shared environment
``````````````````````````````````````````````````

Within the geographic information environment, the increased collaboration between
data providers and their efforts to reduce duplication have stimulated the
development of tools and systems to significantly improve the information sharing
and guarantee an easier and quicker access of data from a variety of sources without
undermining the ownership of the information. The harvesting functionality in
GeoNetwork is a mechanism of data collection in perfect accordance with both rights
to data access and data ownership protection. Through the harvesting functionality
it is possible to collect public information from the different GeoNetwork nodes
installed around the world and to copy and store periodically this information
locally. In this way a user from a single entry point can get information also from
distributed catalogues. The logo posted on top each harvested record informs the
user about the data source.


GeoNetwork Open Source Community
--------------------------------

The community of users and developers of the GeoNetwork software has increased
dramatically since the release of version 2.0 in December 2005 and the subsequent
releases. At present, the user and developer mailing lists count
well over 250 subscriptions each. Subscription to these lists is open to anyone
interested. 
'The archive of the mailing lists provides an important resource for
users and can be freely browsed online. Members provide feedback within the
community and provide translations, new functionalities, bug reports, fixes and
instructions to the project as a whole. Building a self sustaining community of
users and developers is one of the biggest challenges for the project. This
community-building process relies on active participation and interaction of its
members. It also relies on building trust and operating in a transparent manner,
thereby agreeing on the overall objectives, prioritization and long term direction
of the project. A number of actions have been taken by the project team to
facilitate this process.


Project Steering Committee (PSC)
````````````````````````````````

The foundation for the establishment of a GeoNetwork Advisory Board was laid at
the 2006 workshop in Rome and membership criteria were defined. A work plan is presented and discussed at the yearly GeoNetwork workshop.

During the 2006 workshop, the Project Advisory Board decided to propose the
GeoNetwork opensource project as an incubator project to the newly founded
`Open Source Geospatial Foundation (OSGeo) <http://www.osgeo.org>`_.
The GeoNetwork opensource project is now an OSGeo project.

The `Project Steering Committee (PSC) <http://trac.osgeo.org/geonetwork/wiki/PSC>`_ coordinates the main development frame, releases lifecycles, project documentation. PSC also deals with general support to users, validates the community fixes and votes on various purposes:

- all that may cause downward compatibility issues.
- insertion of large pieces of new code.
- API modifications.
- making new releases.
- any subject prone to controversy.
- add a new member to the PSC.
- add a new member to the code repository

Currently, the steering committee is formed by the following persons: 

- Andrea Carboni
- Patrizia Monteduro
- Simon Pigot
- Francois Prunayre
- Emanuele Tajariol
- Jeroen Ticheler
- Archie Warnock


Contributors
````````````

Active developers on the main development repository are:

- Mathieu Coudert
- Jose Garcia
- Jesse Eichar
- Roberto Giaccio
- Simon Pigot
- Francois Prunayre	
- Florent Gravin
- Emanuele Tajariol	
- Jeroen Ticheler
- Archie Warnock


`Other contributors <http://trac.osgeo.org/geonetwork/wiki/committer_list>`_ are also active, in the project sandboxes.


More information
------------------

Websites
`````````
Three public Websites have been established. 
- One focuses on the users of the software: http://geonetwork-opensource.org
- Two are dedicated to the developers: http://trac.osgeo.org/geonetwork (legacy) and https://github.com/geonetwork/core-geonetwork/

They are updated and maintained online by trusted members of the community. They
provide documentation, bug reporting and tracking, Wiki pages et cetera. 
A small part of the community connects through Internet Relay Chat (IRC) on a public ``irc://irc.freenode.net/geonetwork`` channel. 
But most interaction takes place on the `user <https://lists.sourceforge.net/mailman/listinfo/geonetwork-users>`_ and the `developer <https://lists.sourceforge.net/mailman/listinfo/geonetwork-devel>`_ mailing lists.

Source code
```````````

Source code is maintained in a publicly accessible code repository, hosted at an
independent service provider, `github.com <http://github.com/geonetwork>`_ that hosts thousands of FOSS projects.
Developers and users have full access to all sections of the source code, while
trusted developers can make changes in the repository itself. A special mailing list
has been established to monitor changes in the code repository. This 
"commit mailing list" delivers change reports by email to its subscribers.

Documentation
`````````````
The documentation is written in reStructuredText format using the `Sphinx <http://sphinx.pocoo.org>`_
framework to ensure versioning and support of multiple output formats (e.g. HTML and
PDF).


