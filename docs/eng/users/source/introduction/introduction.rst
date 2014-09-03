.. _introduction:
.. include:: ../substitutions.txt

Introduction to Metadata in Spatial Data Management
===================================================

What is Metadata?
-----------------

Metadata, commonly defined as “data about data” or "information about data", is a structured set of
information which describes data (including both digital and non-digital datasets)
stored in information systems. Metadata may provide a short summary about the
content, purpose, quality, location of the data as well as information related to
its creation.

Metadata Standards
------------------

Metadata standards provide data producers with the format and content for properly
describing their data, allowing users to evaluate the usefulness of the data in
addressing their specific needs.

The standards provide a documented, common set of terms and definitions
that are presented in a structured format.

Why do we need Standardized Metadata?
`````````````````````````````````````

Standardized metadata support users in effectively and efficiently accessing data
by using a common set of terminology and metadata elements that allow for a quick
means of data discovery and retrieval from metadata clearinghouses. The metadata
based on standards ensure information consistency and quality and avoid that
important parts of data knowledge are lost.

Geographic Information Metadata Standard
````````````````````````````````````````

Geographic data, which can be defined as any data with a geographic component, is
often produced by one individual or organization, and may address the needs of
various users, including information system analysts, program planners, developers
of geographic information or policy makers. Proper standard documentation on
geographic data enable different users to better evaluate the appropriateness of
data to be used for data production, storage, update.

Main standards are:

- **Dublin Core**: "The Dublin Core Schema is a small set of vocabulary terms that can be used to describe web resources (video, images, web pages, etc.), as well as physical resources such as books or CDs, and objects like artworks." [#]_

- **ISO 19139** [#]_ is used for metadata about data. It is the XML implementation specification of the ISO 19115:2003 standard. This ISO Standard precisely defines how geographic information and related services should be described, providing mandatory and conditional metadata sections, metadata entities and metadata elements. This standard applies to data series, independent datasets, individual geographic features and feature properties. Despite ISO 19115:2003 was designed for digital data, its principles can be extended to many other forms of geographic data such as maps, charts, and textual documents as well as non-geographic data.
GeoNetwork uses the *ISO Technical Specification 19139 Geographic information - Metadata - XML schema implementation* for the encoding of this XML.

- **ISO 19119** is used for metadata about services. "ISO 19119:2005 identifies and defines the architecture patterns for service interfaces used for geographic information, defines its relationship to the Open Systems Environment model, presents a geographic services taxonomy and a list of example geographic services placed in the services taxonomy. It also prescribes how to create a platform-neutral service specification, how to derive conformant platform-specific service specifications, and provides guidelines for the selection and specification of geographic services from both platform-neutral and platform-specific perspectives." [#]_

- **ISO 19110** is used for the description of attributes catalogs. "ISO 19110:2005 defines the methodology for cataloging feature types and specifies how the classification of feature types is organized into a feature catalogue and presented to the users of a set of geographic data. ISO 19110:2005 is applicable to creating catalogs of feature types in previously uncataloged domains and to revising existing feature catalogs to comply with standard practice. ISO 19110:2005 applies to the cataloging of feature types that are represented in digital form. Its principles can be extended to the cataloging of other forms of geographic data." [#]_

- **FGDC** [#]_ is the metadata standard adopted in the United States by the Federal Geographic Data Committee. 

|project_name| also supports other standards: :ref:`supported_format`.
Geographic data are often produced by organizations or freelances and may match to different use cases (GIS operators, image analysis, politics, ...). A proper documentation about those data helps better understand the data, and make proper use for production, use and update.

Metadata profiles
-----------------

A metadata profile is an adaptation of a metadata standard to suit the needs of a community. For example, the ANZLIC profile is an adaptation of the ISO19115/19139 metadata standard for Australian and New Zealand communities. A metadata profile could be implemented as:

- a specific metadata *template* that restricts the fields/elements a user can see with a set of validation rules to check compliance

- all of the above plus new fields/elements to capture concepts that aren't in the basic metadata standard

Building a metadata profile is described in the Schema Plugins section of the GeoNetwork Developers Manual. Using this guide and the GeoNetwork schema plugin capability, a profile can be built by an experienced XML/XSL software engineer.

Specific profiles are for example used in Bluenet, geocat.h and Géosource projects.

Transition between metadata standards
-------------------------------------

With the ISO19115:2003 Metadata standard for Geographic Information now
being the preferred common standard, many have a need to migrate legacy metadata
into the new standard.

|project_name| provides import (and export) functionality and has a number of
transformers in place. It is an easy process for a system administrator to
install custom transformers based on XSLT.

.. [#] http://en.wikipedia.org/wiki/Dublin_Core
.. [#] http://en.wikipedia.org/wiki/Geospatial_metadata
.. [#] http://www.iso.org/iso/catalogue_detail.htm?csnumber=39890
.. [#] http://www.iso.org/iso/home/store/catalogue_tc/catalogue_detail.htm?csnumber=39965
.. [#] http://www.fgdc.gov/metadata