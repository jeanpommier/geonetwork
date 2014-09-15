.. _installing:
.. include:: ../../substitutions.txt


Upgrading to a new Version
==========================

The upgrade process from one version to another is typically a fairly simple process.  Following the normal setup instructions, should result in Geonetwork successfully upgrading the internal datastructures from the old version to the new version.  The exceptions to this rule are:

* Migration to Geonetwork 2.8 will reset all harvesters to run every 2 hours. This is because the underlying harvester scheduler has been changed and the old schedules are not longer supported.  In this case one must review all the harvesters and define new schedules for them.
