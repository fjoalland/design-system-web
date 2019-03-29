---
layout: page
group: guidelines
permalink: /exigences/code.html
title: CSS, HTML et JS
description: Cette page liste les exigences techniques spécifiques à la mise en oeuvre en HTML/CSS/JS des composants web du design system
---

CSS : Cascading Style Sheets (feuilles de style en cascade)

JS : JavaScript

HTML : HyperText Markup Language (langage de balisage)


## Compatibilité navigateurs

L'implémentation web du design system repose uniquement sur des balises HTML, les fonctions JS et les propriétés HTML ou CSS supportées nativement par tous les navigateurs ciblés comme "de premier plan" dans le chapitre "Navigateurs" de cette section sont utilisées.  

Aucune technique permettant d'implémenter dans un navigateur ce qui est manquant n'est employée (pas de "Shims, "Shivs" ou 'Polyfills" par exemple) afin de favoriser la performance du système, son accessibilité et sa pérennité dans la durée.

De plus, l'utilisation des éléments non supportés par les navigateurs "de second plan" est mise en oeuvre de sorte à ne pas empêcher la navigation sur le site, même si l'expérience est susceptible d'être dégradée.

## HTML

### Limiter la complexité du code

Le code HTML de chaque composant est pensé afin de limiter au maximum la complexité du document HTML final. La réduction du nombre d'éléments DOM est recherchée.

On privilégie :

```html
<ul class="menu">
  <li>x</li>
  <li>y</li>
</ul>
```

à :

```html
<div class="menu">
  <ul>
    <li>
      <p><span>x</span></p>
    </li>  
    <li>
      <p><span>y</span></p>
    </li>
  </ul>
</div>
```

### Prise en compte des solutions du Département

Par exception à la règle ci-dessus, certains composants ont une structure HTML imposée par une solution technique du Département (CMS, ...). Ces composants particuliers sont documentés avec le nom de la méthode de l'outil permettant d'utiliser ledit composant dans un gabarit.

Pour ces composants, c'est la structure HTML "éditeur" qui est respectée.

### Sémantique
Une vigilance est apportée à la semantique des pages donc du code. Les balises HTML5 sont utilisées pour structurer les pages ( `<nav>`, `<article>`, `<aside>`, `<figure>`...)

### Composants dynamiques ou interactifs

Si des propriétés sont nécessaires à des composants pour de l'intéractivité, elles sont passées via des attributs data-*. Dans tous les cas, le composant reste utilisable avec le javascript désactivé.

Exemple pour une alerte qui disparait au bout d'un temps configurable :

```html
<p data-hide-in="5">Se cache au bout de 5 secondes</p>
```

Dans cet exemple, sans javascript, l'alerte reste simplement affichée, ce qui n'est pas bloquant.

Autre exemple, si l'on souhaite mettre un bouton permettant de masquer l'alerte plutôt qu'une minuterie :

```html
<p data-hide="bt-hide-1">
    Je me cache si l'on appuie sur le bouton
    <span data-hide-loc="bt-hide-1" />
</p>
```

Un code javascript associé au composant afficherait alors le boutton dans le span et s'occuperait de masquer le paragraphe à l'appuie sur celui-ci. Sans javascript, il n'y aurait pas de bouton permettant de masquer le texte.

Cette technique est appelé "javascript discret".

### IFrame

Les composants en Frame ou IFrame sont évités autant que possible car ils compliquent la navigation avec des dispositif d'assistance et ne permettent pas une performance d'affichage optimale.

### Indentation

L'indentation des composants HTML est par convention réalisée avec 2 espaces.

### Commentaires

Le code HTML sera exempt de commentaires, tant les commentaires traditionnels que les commentaires conditionnels.

## CSS

### Framework CSS

Le framework sélectionné est performant, compact, éprouvé et adapté aux navigateurs "de premier plan" sélectionnés. Au delà, il est validé du point de vue de l'accessibilité (pas de taille en pixel, ...)

Il intégre une remise à zéro des styles sur les différents navigateurs afin d'assurer une cohérence visuelle entre les différents navigateurs.

Seuls les éléments utiles sont intégrés au design system web et les couleurs et styles par défaut sont personnalisés dès la phase de compilation (et non surchargés avec des règles supplémentaires). Il s'agit donc d'une version optimisée et adaptée pour l'usage du Département de Loire Atlantique.

Afin d'être maintenable, et rigoureusement organisé, le framework CSS est réalisé en Sass avec une séparation entre les composants coeurs et les composants optionnels pouvant être inclus ou non dans la feuille de style finale (selon le site, il est ainsi possible de limiter le nombre de composants supportés pour améliorer la performance finale).

### Performance

Afin d'optenir des performances élevées sur des téléphones mobiles aux ressources mémoire et processeur limitées, les recommandations suivantes sont prises en compte :
* Pas de positionnement absolu des blocs
* Pas de propriété de style avec !important
* Pas d'expression CSS 

```css
background-color: expression( (new Date()).getHours()%2 ? "#B8D4FF" : "#F08A00" );
```

* Pas de ```@import``` dans les CSS
* Pas d'utilisation de filtres CSS

### Organisation des directives de style

Sass est utilisé avec une méthodologie orientée vers la performance, le ré-emploi, la compacité, la maintenablité et la relecture du code. L'emploi de la convention BEM (Block, element, modifier) *ou une approche équivalente (OOCSS, SMACSS, ...)* a été retenue.

L'objectif est d'éviter les sélecteurs complexes, groumand en temps de calcul côté navigateur et favoriser le réemploi entre les composants.

Les préconisations de https://sass-guidelin.es sont respectées autant que possible.

Le nom de chaque classe CSS est choisi pour être synthétique (gain de taille des feuilles CSS) tout en reste compréhensible. Il est écrit en minuscule et le tiret est utilisé pour composer les différents parties du nom. 

Exemple : button peut devenir btn ou bt.

Un nombre minimal de règles et des règles simples à évaluer pour le navigateurs, tel est le coeur de la philisophie de la conception de ce design system web. 

## Javascript

Le recours au Javascript est limité aux interactions principales car il contribue à diminuer la réactivité des pages internet et demande beaucoup de travail pour préserver l'accessibilité des composants.

### Recommandation générales

Aucune fonction ou variable globale, les fonctions et les variables sont protégées dans des "scopes"

Pas de javascript dans l'HTML (inline javascript) mais uniquement dans un ou plusieurs fichiers JS externes.

La performance de chaque composant est validé en utilisant des "console.time" lors de la mise au point (Ces blocs de code sont commentés dans le code final)

Le nombre d'écouteurs d'évènement est minimisé car très gourmant en ressources sur les mobiles ou les tablettes. Pour celà, le patten "event delegation" est utilisé dès qu'il est adapté.

Le javascript n'est pas utilisé pour positionner ou redimmensionner des éléments là où une règle CSS aurait du être utilisé. Les positionnements non réalisables en CSS sont évités car ils ralentissent l'affichage des pages.

Chaque modification du contenu de la page en JS est réalisé de telle sorte que les logiciels d'assistance à la navigation pour les personnes handicapées soient informés du changement (ARIA).

### Framework

Le framework jQuery, pratique et très connu, est évité car peu performant et surtout la majorité des composants (jQueryUI) ne sont pas accessibles. L'utilisation de JS "Vanilla" (sans framework), souvent 10 fois plus rapide, est préféré.

## Compilation (CSS et JS)

Un code source "socle" est réalisé (CSS et JS). Il inclut les composants basiques.

Chaque composant ou groupe de composants est indépendant des autres et s'appuie sur le "socle".

Chaque composant ou groupe de composants à son propre fichier "js" et "scss".

Exemple de groupe de composant : champs de formulaire

Exemple de composant : menu accordéon

Un mécanisme de compilation permet de compiler uniquement un unique fichier JS et deux fichiers CSS (print et screen) comprenant le socle et les composants sélectionnés, de manière optimisé en taille (suppression des commentaires, des caractères inutiles, ...).

Etant donné que les téléphones mobiles ne conservent pas souvent en cache les fichiers de plus de 25ko (même si l'entête HTTP indique que c'est possible), les fichiers CSS et JS résultats de cette compilation sont travaillés pour respecter cette limite.

Si au cours de l'évolution du design system, cette limite vient à être dépassée, le fichier concerné est alors scindé en deux.

## Sources d'inspiration

AMP (Accelerated mobile pages)

ELM, TypeScript, ...