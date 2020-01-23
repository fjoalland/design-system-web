---
layout: component-detail
group: components
status: Validé

title: Fil d'Ariane
description: Liste de liens de navigation

variations:
- title: Fil Ariane standard
  pattern: breadcrumb/breadcrumb.html
- title: Fil Ariane sur fond sombre ou image
  pattern: breadcrumb/breadcrumb--invert.html
---


## Usage

Le fil d'Ariane est un composant de navigation utilisé en haut de page pour guider l'utilisateur.

## Documentation

Le fil d'Ariane s'insère dans une liste `<ul class="ds44-list ds44-breadcrumb">`. 
Ajouter la classe de couleur intervertie `ds44-text--colorInvert` quand le fil est positionné au-dessus d'un bandeau/image.
Chaque élément de la liste doit comporter une classe `ds44-breadcrumb_item`.
Le premier élément permet de retourner à l'accueil. Le texte est rendu invisible graphiquement via la classe `visually-hidden` et remplacé par une icône.

...
