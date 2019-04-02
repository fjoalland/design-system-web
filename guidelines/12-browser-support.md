---
layout: page
type: detail
title: Support navigateurs
group: guidelines
permalink: /exigences/browsers.html
description: Niveau de support des différents navigateurs web
---

## Niveau de support par navigateur

Les **navigateurs de premier plan** sont pris en charge de telle sorte que l'interface graphique soit fidèle aux maquettes dans chacun d'entre eux. 

Les **navigateurs de second plan** sont pris en charge de telle sorte que l'interface graphique soit visuellement acceptable sans fidélité complète aux maquettes.

Liste des navigateurs de premier plan :
* Chrome et autres navigateurs basés sur chromium : Version 72 et suppérieure
* Firefox : Version 60 et supérieur
* Safari : Version 12 et supérieur

Au 29 mars 2019, ces navigateurs représentait plus de 75% du trafic des sites du Département.
Ce design system entrant en production à partir de mars 2020, ce sera alors plus de 90% du trafic des sites.

Liste des navigateurs de second plan :
* Edge 11+

Au 29 mars 2019, ces navigateurs représentait environ 5% du trafic des sites du Département.

## Support de IE11

Le rendu est susceptible d'être un dégradé, ce navigateur n'est pas supporté car abandonné officiellement par Microsoft au profis de Edge. Seule la désactivation des modes de compatibilité est prise en compte :

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
```

## Viewport

Le viewport permet de choisir comment le site est affiché sur un mobile. Choisir une configuration via la META *viewport* permet de choisir le mode d'affichage et non laisser le choix au navigateur du mobile.

Les pages intégrent toujours la mention suivante dans la balise **HEAD** :

```html
<meta name="viewport" content="initial-scale=1.0, width=device-width, shrink-to-fit=no">
```