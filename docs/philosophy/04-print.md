---
layout: page
type: detail
title: Impression
group: philosophy
permalink: /philosophie/impression.html
description: Approche pour l'impression des pages

---

## Enjeux

Même si le site est conçu selon l'approche "mobile first", l'impression de chaque composant a été vérifié. Une feuille de style du site adaptée au média ``print`` est générée afin d'optimiser le rendu des différentes pages lors de l'impression.

## Règles mises en place

Les menus escamotables sont automatiquement ouverts lors d'une impression.

Les contenus accessibles via des onglets sont affichés les uns en dessous de autres.

Les URLs des liens sont affiché. En effet, un lien imprimé ne sert à rien si l'on ne sait pas où il mène. 

```
    a:after {
        content: " (" attr(href) ") ";
    }
```

Pour éviter un gaspillage d'encre et de papier, une classe css permet de supprimer ce qui n'a pas de sens à l'impression, comme certains aspects de pure présentation, les publicités, la navigation, etc : `hidden-print`