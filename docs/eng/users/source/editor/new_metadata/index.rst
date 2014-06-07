.. include:: ../../substitutions.txt

.. _metadata_create:

Metadata creation/edition
=====================

This chapter presents the way to create and fill a new metadata in the catalog, using the online integrated editor. 

Table of contents:

.. contents:: :local:

In order to be authorized to create or edit a metadata, the user needs to **sign in** at least as an **Editor** profile, in at least one group.
Elsewise, please contact your geocatalog administrator.

Using the online editor, there are two ways of creating a new metadata:

- in the administration backoffice, create a **New metadata** using a predefined template
- duplicate an existing metadata sheet, from the search results list

Templates
---------

The catalog provides several metadata templates, based upon the standards it supports (cf. :ref:`supported_format`). Templates are used to define in advance a set of fields, that will be available as the default view when creating a new metadata. Different templates are usually created for each kind of resources (e.g. raster or vector datasets, WMS/WFS services, downloading services).

A template can be edited and completed, using the elements from the advanced view, just like any metadata.

If no template is available, it is possible to add default templates in the administation backoffice (cf. :ref:`samplemetadata`).


Create a new metadata
-----------------------------

After logging in (cf. :ref:`how_to_login`), it is possible to create a new metadata either from **the toolbar of the results panel** (``Other actions`` menu), or from the **administration page**.

#. Select **"New metadata"**.

#. Select the metadata template (if no template suits your needs, you can create a new one). 
It is possible to filter the templates in the form, either by schema, resource type or title, by clicking on the column's header. 

#. Select the **Group** to whom the metadata will belong. The groups list is restricted to the groups assigned to this user by the administrator.

#. Click on **"Create"**.


.. figure: create.png

  Metadata creation form

A new metadata is created, based on the selected template. By default, only the users belonging to the group assigned to the metadata can see it. To make it more widely available, it is necessary to set the privileges (cf. :ref:`metadata_privileges`)


Change the view
```````````````

For detailed explanation about the views, see :ref:`metadata_edit_mode`.

When creating a new record, one can choose between the available views for the chosen standard. To change the view, simply selet it in the **View mode** menu (top toolbar). The current view is disabled in the menu. 

Mandatory and optional fields
``````````````````````````````
Some fields are defined as mandatory by the standards, and some aren't. Meaning if one of the mandatory fields is empty, the metadata will not validate.

Mandatory fields are displayed with a bold font, and a grey frame, or red one if the value is invalid.

.. figure: invalidField.png

   Mandatory title field is valid, but the abstract is not (empty)

Fields are framed in a red box when invalid. I can either mean:

- a mandatory field is empty
- a numeric field contains some text
- an invalid email address

You can also meet ome conditional fields. For example, for a contact,

- one of the ``name``, ``organization`` or ``position`` fields must be set, when using the ISO 19139 standard.
- one of the *organization* or *email* fields must be set, when following the INSPIRE implentation rules.

  .. figure:: PoC_Maint.png

  *Point of contact*

The validation report can be very useful to identify errors in conditional fields (cf. :ref:`metadata_validation`).


Help
````

In the **Help** section on the right panel, a contextual help gives useful information about the current field. It gives:

- the element name
- the definition of the element
- the element's XML tag name (eg. gmd:title)

.. figure:: helpPanel.png

   *Contextual help on the short title element (identification section)*


.. _editor_control:

Using the controls in the editor's fields
`````````````````````````````````````````

There are several type of fields:

- simple text fields
- text area fields

.. figure:: textField.png


- lists of values
- dates

.. figure:: dateFieldAndCodeList.png

   *Date field & date type field using a list of values*

- the geographic bounding box form (cf. :ref:`geobox_editor`)
- setting date periods

.. figure:: periodField.png

   *period field types*


The fields' cardinality (how many items of this type can exist) is defined in the metadata standard's schema. This schema is used to set the corresponding controls beside the input fields.

Possible controls are:

- a + to add a field
- a - to remove a field
- an arrow pointing upward, to move the field upward
- an arrow pointing downward to move it downward
- a binocular means you can search in a dictionnary to get your values


.. figure:: editorControl.png

   *Conttrols in the editor*

An arrow *before* the titles of the sections allow to fold/unfold the corresponding block (toggle control).

.. figure:: toggleControl.png


Saisir les métadonnées pour vos données géographiques
-----------------------------------------------------

.. TODO : cf la version anglaise http://geonetwork-opensource.org/manuals/trunk/users/quickstartguide/new_metadata/index.html#entering-metadata-for-your-map


.. _geobox_editor:

Saisir une emprise géographique
-------------------------------

Dans la section identification, il est possible de saisir l'emprise géographique de la métadonnée.
Celle-ci est en générale un rectangle (ie. LatLongBoundingBox). L'interface de saisir permet :

- la saisie manuelle des coordonnées dans une des projections configurées pour le catalogue
- la saisie d'un rectangle sur la carte
- le choix d'une région dans la liste déroulante
- l'effacement de l'objet


.. figure:: geoboxField.png


A noter qu'il est également possible de calculer l'emprise à partir des mots clés géographique (cf. :ref:`compute_extent`).

Il est possible de saisir plusieurs emprises pour une fiche de métadonnée. Ceci se révèle util pour un jeu de donnée
sur la france métropolitaine et les COM par exemple.


Le standard ISO permet également la saisir d'un polygone. Dans ce cas, l'interface de saisir propose un
outil de saisie de polygone ou de cercle.

.. figure:: geoField.png

La case à cocher **Exclusion** permet d'indiquer si le polygone est une surface recouverte par des données ou ne comportant pas de données.


L'aide à la saisie
------------------

Suggestion simple
`````````````````

Pour certains champs, il est possible d'avoir une liste de suggestion. Cette liste est placé à côté du champ de saisie.


.. figure:: scaleField.png

   Suggestion pour le champ niveau d'échelle


.. figure:: dqField.png

   Suggestion pour les champs nom du test et définition (Annexe C de l'ISO19138)
   
   
Une suggestion permet d'accèder rapidement à des listes classiques de valeurs et de simplifier la saisie.


.. _auto_correction:

Mécanisme de suggestion par analyse des métadonnées et correction automatique
`````````````````````````````````````````````````````````````````````````````

Dans le paneau droit de l'éditeur, le bloc **Suggestion** permet d'avoir les règles applicables à la métadonnée en cours d'édition.
Ces règles dépendent du standard de métadonnées.

Prenons le cas d'une métadonnée contenant un mot clé contenant des virgules :


.. figure:: suggestion1.png
   
   Mots clés contenant des virgules comme séparateur. Ceci n'est pas recommandé.


.. figure:: suggestion2.png
 
   Le mécanisme d'auto-correction, propose à l'éditeur de séparer les mots clés.


.. figure:: suggestion3.png

   Résultat après le traitement automatique
  
  
Les mécanismes de contrôle pour le standard ISO19139 sont les suivants :

- Séparation des mots clés contenant des virgules
- Correction des niveaux d'échelle contenant des 1/25000 ou 1:25000 en 25000
- Calcul de l'emprise à partir des mots clés géographique
- Ajout d'une section conformité INSPIRE si un thème INSPIRE se trouve dans les mots clés
- Ajout des systèmes de projection si un service WMS est associé
- Ajout d'un aperçu si un service WMS est associé
- Ajout de l'emprise si un service WMS est associé


.. _metadata_validation:

Valider les métadonnées
-----------------------

Dans le paneau droit de l'éditeur, le bloc **Validation** permet d'obtenir le niveau de validité de la métadonnée en cours d'édition
vis à vis :

- du schéma du standard (Schéma XSD)
- des recommandations ISO
- des recommandations INSPIRE (optionel)
- des recommandations |project_name|


.. figure:: validationreport.png



Saisir des métadonnées en plusieurs langues
-------------------------------------------

De prime abord, il pourrait être envisagé de dupliquer une fiche pour la rendre accessible en plusieurs langues.
Cependant la norme ISO19139 définie une manière de traduire tout ou partie d'une métadonnées.

Un éditeur peut donc créer des métadonnées ISO en plusieurs langues. Pour cela, il est nécessaire de déclarer une
nouvelle langue dans la fiche :

- Tout d'abord, vérifiez que la langue de la métadonnée est définie dans la section sur les métadonnées.

- Ensuite, ajouter une ou plusieurs autres langues dans cette même section.



En édition, chaque élément pouvant être traduit est composé de :

- une zone de texte

- une liste de sélection de la langue (langues déclarées dans la section autres langues)



Par défaut, la langue sélectionnée est la langue de l'interface si la langue est définie dans la métadonnée. 
Sinon la langue principale de la métadonnée est affichée.


.. figure:: editor-multilingual.png


En option, le service de traduction de Google peut être utilisé. 
Les traductions peuvent être suggérées pour l'éditeur en cliquant sur la petite icône située à droite du sélecteur de langue. 
Le service de traduction traduit le texte dans la langue principale de la métadonnée dans la langue sélectionnée.


En mode consultation, en fonction de langue de l'interface, si cette langue est définie dans les métadonnées, 
les éléments sont affichés dans cette langue
sinon dans la langue par défaut de la métadonnée.
Ce comportement est également appliqué pour les réponses au format dublin-core via CSW pour une fiche en ISO.



Associer des logos aux contacts
-------------------------------

Pour chaque contact, il est possible d'ajouter le logo de l'organisme. Le logo est renseigné dans l'élément
instruction pour le contact (ie. gmd:contactInstruction). En édition, si ce champ n'est pas visible, basculer
dans la vue avancée et ajouter le champ au contact.

.. figure:: contact-add-logo.png

Choisir "nom du fichier" dans la liste pour ajouter les informations sur le contact ainsi que le logo de
l'organisme (ou "texte" pour uniquement ajouter les instruction sur le contact).

Sélectionner le logo dans la liste des logos disponible dans le catalogue.

.. figure:: contact-choose-logo.png


Les logos sont affichés dans la page de consultation de la fiche et dans les résultats de la recherche.

.. figure:: contact-logo-in-search.png


L'information est stockée dans la fiche de la manière suivante :


.. code-block:: xml

  <gmd:contactInstructions>
    <gmx:FileName src="http://localhost:8080/geonetwork/images/harvesting/fao.gif"/>
  </gmd:contactInstructions>

.. _compute_extent:

Calcul de l'étendue par analyse des mots clés
---------------------------------------------

L'éditeur peut demander à |project_name| d'analyser les mots clés de la fiche en cours d'édition pour calculer l'emprise. Ce mécanisme permet une saisie plus efficace.
Par exemple, dans la section identification saisissez "FRANCE", "GUADELOUPE", "MARTINIQUE" dans les mots clés puis cliquer sur calculer les emprises pour ajouter les 3 emprises automatiquement.

L'approche est la suivante :

- Pour chaque mot clé

- Recherche le mot clé dans les thésaurus du catalogue

- Si le mot clé à une étendue

- Ajoute une étendue avec sa description dans la métadonnée


Ce processus peut être lancé selon 2 modes :

- Ajout : Conserve les étendues existantes et rajoute les nouvelle à la fin.
- Remplace : Supprime les étendues n'ayant que des éléments de type emprise (les emprises temporelle, verticale ou polygone englobant ne sont pas supprimées), et ajoute les nouvelles à la fin

L'éditeur peut supprimer les étendues inutiles après le processus.

Ce processus ne fonctionne que si des thésaurus de type géographique sont installés dans le catalogue.


.. figure:: computebbox-selectkeyword.png


Le lancement du processus se fait par le menu autres actions.

.. figure:: computebbox-button.png


La métadonnée est sauvegardée pendant le processus.

.. figure:: computebbox-results.png


Sauvegarder la métadonnée avant le lancement de l'opération si vous avez fait des modifications.



Attribuer des catégories
------------------------

Pour finaliser le tout, vous pouvez assigner des catégories à vos métadonnées. 
Les catégories choisies vont déterminer sous quelles catégories votre fiche 
va s'afficher dans la page de recherche.
Pour assigner des catégories à une carte, suivrez ces étapes :

 - Trouver votre fiche en utilisant le formulaire de recherche.
   En fonction du nombre de résultats, positionnez-vous sur la fiche, 
   ou sur le menu **Autres actions** (sur la droite). Vous allez voir 
   une liste de boutons, incluant un bouton **Catégories**.

 - Cliquez sur le bouton **Catégories**. Cela va afficher une nouvelle 
   fenêtre. Vous pouvez assigner une ou plusieurs catégories en les sélectionnant 
   ou désélectionnant sur cette page. Cocher ou décocher simplement 
   les petites cases en face des catégories.


.. figure:: categoriesManag.png


Si vous n'avez pas accès à ces informations, consulter :ref:`admin_category`.



