---
layout: page
type: detail
title: Navigation
group: guidelines
permalink: /exigences/navigation.html
description: Cette page liste les exigences en matière de navigation au sein d'une page ou de composants du design system. 

---

## Navigation au sein de la page / d'un composant
Une compatibilité RGAA niveau AA est demandée. Le but de ce chapitre n'est pas de décrire à nouveau les différentes règles d'accessibilité mais plutôt de mettre en avant certains principes.

Une attention particulière est portée à la navigation au clavier entre les éléments de la page (ordre de réception du focus).

Cela concerne aussi bien la navigation entre les différents blocs de la page mais également au sein de chaque bloc (fil d'ariane, menus, liens, éléments de formulaires, composants graphiques - carousels, graphiques, vidéos, images...- ).

Vérifier que la logique de navigation n'est pas cassée en mode responsif, via l'apparition/suppression d'un bloc.

Des liens d'accessibilité permettent d'aller aux endroits importants de la page : moteur de recherche, contenu principal, pied de page (+ autre ?).


## Alternatives à la souris.
Prévoir des alternatives aux événément souris (mouseover, mouseout, focus, blur). 

Le résultat d'une action souris doit avoir un équivalent via une action clavier.
Ex : un rollover sur une image doit fonctionner aussi au clavier via l'événement `onFocus`
