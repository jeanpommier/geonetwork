.. _installing:
.. include:: ../../substitutions.txt

.. _basic_database_config:

Database configuration
----------------------

Geonetwork uses the `H2 database engine <http://www.h2database.com/>`_ as default. The following additional database backends are supported (listed in alphabetical order):

* DB2
* H2
* Mckoi
* MS SqlServer 2008
* MySQL
* Oracle
* PostgreSQL (or PostGIS)

To configure one of these databases for use by GeoNetwork, three steps are required.

Choose a Database Connection Pool
`````````````````````````````````
To manage connections with the database efficiently, a database connection pool is used.  GeoNetwork uses the `Apache Database Connection Pool (DBCP) <http://commons.apache.org/dbcp/>`_. This connection pool can be configured directly in the config.xml file described below or in Jetty/tomcat through the Java Naming and Directory Interface (JNDI).

* **ApacheDBCPool**: This pool is recommended for smaller catalogs (less than 10,000 records).
* **JNDIPool**: This pool is configured in Jetty or Tomcat. It is recommended for larger catalogs (especially those with more than approx 30,000 records).

More details about the DBCP configuration parameters that can be used here are in the advanced configuration section of this manual (See :ref:`Database_JNDI_configuration`).

Download and install JDBC Drivers
`````````````````````````````````
For the Apache DBCP pool, JDBC database driver jar files should be in **INSTALL_DIR/WEB-INF/lib**.  For Open Source databases, like MySQL and PostgreSQL, the jar files are already installed. For commercial databases like Oracle, the jar files must be downloaded and installed manually. This is due to licensing issues.

* `DB2 JDBC driver download <https://www-304.ibm.com/support/docview.wss?rs=4020&uid=swg27016878>`_
* `MS Sql Server JDBC driver download <http://msdn.microsoft.com/en-us/sqlserver/aa937724>`_
* `Oracle JDBC driver download <http://www.oracle.com/technetwork/database/features/jdbc/index-091264.html>`_

Specify configuration in GeoNetwork
```````````````````````````````````

GAST provides a graphical user interface to make database configuration easy. You can find out how to do this in the GAST section of the manual: :ref:`gast`. 

Alternatively you can manually configure the database by editing **INSTALL_DIR/WEB-INF/config.xml**. In the resources element of this file, you will find a resource element for each database that GeoNetwork supports. Only one of these resource elements can be enabled. The following is an example for the default H2 database used by GeoNetwork:: 

            <resource enabled="true">
              <name>main-db</name>
              <provider>jeeves.resources.dbms.ApacheDBCPool</provider>
              <config>
                <user>admin</user>
                <password>gnos</password>
                <driver>org.h2.Driver</driver>
                <url>jdbc:h2:geonetwork;MVCC=TRUE</url>
                <poolSize>33</poolSize>
                <validationQuery>SELECT 1</validationQuery>
              </config>
            </resource>

If you want to use a different database, then you need to set the enabled attribute on your choice to "true" and set the enabled attribute on the H2 database to "false". **NOTE:** If two resources are enabled, GeoNetwork will **not** start. 

As a minimum, the **<user>** , **<password>** and **<url>** for your database need to be changed. Here is an example for the DB2 database::

            <resource enabled="true">
              <name>main-db</name>
              <provider>jeeves.resources.dbms.ApacheDBCPool</provider>
              <config>
                <user>db2inst1</user>
                <password>mypassword</password>
                <driver>com.ibm.db2.jcc.DB2Driver</driver>
                <url>jdbc:db2:geonet</url>
                <poolSize>10</poolSize>
                <validationQuery>SELECT 1 FROM SYSIBM.SYSDUMMY1</validationQuery>
              </config>
            </resource>

Starting up GeoNetwork with a new database
------------------------------------------

At startup, GeoNetwork checks if the database tables it needs are present in the currently configured database.  If not, the tables are created and filled with initial data. 

If the database tables are present but were created with an earlier version of GeoNetwork, then a migration script is run.

An alternative to running these scripts automatically is to execute them manually. This is preferable for those that would like to examine and monitor the changes being made to their database tables.

* The scripts for initial setup are located in **INSTALL_DIR/WEB-INF/classes/setup/sql/create/**
* The scripts for inserting initial data are located in **INSTALL_DIR/WEB-INF/classes/setup/sql/data/**
* The scripts for migrating are located in **INSTALL_DIR/WEB-INF/classes/setup/sql/migrate/**

Issues or exceptions with databases
-----------------------------------

If you run into problems when you start GeoNetwork with a particular database, you may find a solution in the :ref:`database_specific_issues` section of this manual.

