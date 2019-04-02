---
layout: page
type: detail
title: Impression
group: guidelines
permalink: /exigences/impression.html
description: Approche pour l'impression des pages

---

## Enjeux
Même si le site est conçu selon l'approche "mobile first", l'impression reste néanmoins possible et il convient d'adapter la feuille de style du site au média ``print`` afin d'optimiser le rendu des différentes pages lors de l'impression .

## Définir des règles d'impression lors du maquettage des pages
Réfléchir en amont, dès la phase de maquettage des écrans, à la version imprimée.

Chaque composant est pensé afin de permettre une impression sans difficulté des informations contenues dans la page.

### Exemples de règles à mettre en place
Les menus escamotables sont automatiquement ouverts lors d'une impression.

Afficher les URLs des liens.
Les liens imprimés ne servent à rien si l'on ne sait pas où ils mènent. On peut par exemple en css afficher la cible d'un lien à côté du texte.
``
    a:after {
        content: " (" attr(href) ") ";
    }
``

Supprimer le contenu inutile.

Pour éviter un gaspillage d'encre et de papier, il est important de supprimer ce qui n'a pas de sens à l'impression, comme certains aspects de pure présentation, les publicités, la navigation, etc. 

Reset CSS spécifique.

Gérer les sauts de page.

Utiliser des unités absolues (cm, mm, pt...).

### Ressources
[https://la-cascade.io/css-noubliez-pas-limpression-papier/](https://la-cascade.io/css-noubliez-pas-limpression-papier/)