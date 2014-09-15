.. _installing:
.. include:: ../../substitutions.txt

Installing the software
=======================

Where do I get the installer?
-----------------------------

The download links are provided under the GeoNetwork's Download page: http://www.geonetwork-opensource.org/downloads.html

- To install |project_name| on Windows, use the .exe file installer.

- If you are not on Windows, use the platform independent installer (.jar)

- For a server installation, you would better use the web archive format (.war) and install geonetwork in a servlet container. See the :ref:`Server_installation` section.


System requirements
-------------------

GeoNetwork can run either on **MS Windows** , **Linux** or **Mac OS X** .

Some general system requirements for the software to run without problems are listed below:

**Processor** : 1 GHz or higher

**Memory (RAM)** : 1 GB or higher

**Disk Space** : Minimum of 512MB of free disk space. Additional space is required depending on the amount of spatial data that you expect to upload.

**Software requirements** : A Java Runtime Environment (JRE 1.6.0 or later). 

*For server installations*, Apache Tomcat and a dedicated JDBC compliant DBMS (MySQL, Postgresql, Oracle) can be used instead of Jetty and H2. 


Supported browsers
``````````````````

GeoNetwork should work normally with the following browsers:

#. Firefox v1.5+ (All) [#all_os]_
#. Internet Explorer v8+ (Windows)
#. Safari v3+ (Mac OS X Leopard)
#. Chrome
#. Opera

How do I install |project_name| opensource?
-------------------------------------------

Before running the |project_name| installer, make sure that all system requirements are satisfied, and in particular that the Java Runtime Environment version 1.6.0 (or later) is set up on your machine.

On Windows
``````````

If you use Windows, the following steps will guide you to complete the installation:

.. warning:: Avoid installing in a directory containing spaces. Best is to install in ``c:\programs`` and not in ``c:\program files``

1. Double click on **geonetwork-install-2.10.x.exe** to start the GeoNetwork opensource desktop installer
2. Follow the instructions on screen. You can choose to install the embedded map server (based on `GeoServer <http://www.geoserver.org>`_ and the European Union Inspire Directive configuration pack. Developers may be interested in installing the source code and installer building tools. Full source code can be found in the GeoNetwork github code repository at http://github.com/geonetwork.
3. It will ask you to choose the user interface you want to use. It will still be possible to change the user interface, afterwards. See :ref:`UI_config`.
4. After completion of the installation process, a 'GeoNetwork desktop' menu will be added to your Windows Start menu under 'Programs'
5. Click Start\>Programs\>GeoNetwork desktop\>Start server to start the Geonetwork opensource Web server. The first time you do this, the system will require about 1 minute to complete startup.
6. Click Start\>Programs\>Geonetwork desktop\>Open GeoNetwork opensource to start using GeoNetwork opensource, or connect your Web browser to `http://localhost:8080/geonetwork/ <http://localhost:8080/geonetwork/>`_

.. figure:: installer.png

   *Installer*

.. figure:: install_packages.png

   *Packages to be installed*

The installer allows to install these additional packages:

1. GeoNetwork User Interface: Experimental UI for GeoNetwork using javascript components based on ExtJs library.
2. GeoServer: Web Map Server that provides default base layers for the GeoNetwork map viewer.
3. European Union INSPIRE Directive configuration pack: Enables INSPIRE support in GeoNetwork.

 - INSPIRE validation rules.
 - Thesaurus files (GEMET, Inspire themes).
 - INSPIRE search panel.
 - INSPIRE metadata view.

4. GAST: Installs GeoNetwork's Administrator Survival Tool. See :ref:`gast`.


Installation using the platform independent installer
`````````````````````````````````````````````````````

If you downloaded the platform independent installer (a .jar file), you can in most cases start the installer by simply double clicking on it. 
If not, open a terminal window, and run ``java -jar geonetwork-install-2.10.3.jar``.

Follow the instructions on screen (see also the section called On Windows).

At the end of the installation process you can choose to save the installation script.

.. figure:: install_script.png
   
   *Save the installation script for commandline installations*


Commandline installation
````````````````````````

If you downloaded the platform independent installer (a .jar file), you can perform commandline installations on computers without a graphical interface. You first need to generate an install script (see Figure Save the installation script for commandline installations). This install script can be edited in a text editor to change some installation parameters.

To run the installation from the commandline, issue the following command in a terminal window and hit enter to start::

    java -jar geonetwork-install-2.10.0.jar install.xml
    [ Starting automated installation ]
    Read pack list from xml definition.
    Try to add to selection [Name: Core and Index: 0]
    Try to add to selection [Name: GeoServer and Index: 1]
    Try to add to selection [Name: European Union INSPIRE Directive configuration pack and Index: 2]
    Try to add to selection [Name: GAST and Index: 3]
    Modify pack selection.
    Pack [Name: European Union INSPIRE Directive configuration pack and Index: 2] added to selection.
    Pack [Name: GAST and Index: 3] added to selection.
    [ Starting to unpack ]
    [ Processing package: Core (1/4) ]
    [ Processing package: GeoServer (2/4) ]
    [ Processing package: European Union INSPIRE Directive configuration pack (3/4) ]
    [ Processing package: GAST (4/4) ]
    [ Unpacking finished ]
    [ Creating shortcuts ....... done. ]
    [ Add shortcuts to uninstaller  done. ]
    [ Writing the uninstaller data ... ]
    [ Automated installation done ]

You can also run the installation with lots of debug output. To do so run the installer with the flag *-DTRACE=true*::

  java -DTRACE=true -jar geonetwork-install-2.10.0.jar

.. [#all_os] All = Windows, Linux and Mac OS X


Advanced installation
`````````````````````
To see how to customize your installation, use a specific database or install |project_name| on a production server, please go to the :ref:`sysadmin` section.


Additional Software
```````````````````

The software listed here is not required to run GeoNetwork, but can be used for custom advanced installations (see :ref:`sysadmin`).

#. A JDBC compatible database:

   - MySQL DBMS v5.5+ (All) [#all_os]_
   
   - Postgresql DBMS v7+  / PostGIS (All) [#all_os]_
   
   - Oracle
   
   - SQLServer
     
#. A servlet container:
   
   - Apache Tomcat v5.5+ (All) [#all_os]_

