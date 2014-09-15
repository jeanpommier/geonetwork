.. _installing:
.. include:: ../../substitutions.txt


XSLT processor configuration
----------------------------

The file ``INSTALL_DIR/web/geonetwork/WEB-INF/classes/META-INF/javax.xml.transform.TransformerFactory`` defines the XSLT processor to use in GeoNetwork. The allowed values are:

#. ``de.fzi.dbs.xml.transform.CachingTransformerFactory``: This is the Saxon XSLT processor with caching (recommended value for production use). However, when caching is on, any updates you make to stylesheets may be ignored in favour of the cached stylesheets.
#. ``net.sf.saxon.TransformerFactoryImpl``: This is the Saxon XSLT processor *without* caching. If you plan to make changes to any XSLT stylesheets you should use this setting until you are ready to move to production.

GeoNetwork sets the XSLT processor configuration using Java system properties for an instant in order to obtain its TransformerFactory implementation, then resets it to the original value, to minimize affect the XSL processor configuration for other applications that may be running in the same container.
