---
layout: page
group: philosophy
permalink: /philosophie/code.html
title: CSS, HTML et JS
description: Cette page liste les exigences techniques spécifiques prise en compte lors de la mise en oeuvre en HTML/CSS/JS des composants web du design system
---

## Définitions

CSS : Cascading Style Sheets (feuilles de style en cascade)

JS : JavaScript

HTML : HyperText Markup Language (langage de balisage)


## HTML

### Limiter la complexité et le poids du code HTML des pages

Le code HTML de chaque composant est pensé afin de limiter au maximum la complexité du document HTML final. La réduction du nombre d'éléments DOM a ainsi été recherchée.

Il est privilégie :

```html
<ul class="menu--navprincipale">
  <li>x : <a href="#">lien</a></li>
  <li>y : <a href="#">lien</a></li>
</ul>
```

à :

```html
<div class="menu nav nav-principale">
  <ul class="ul-nav-principale">
    <li class="li-nav-principale">
      <p><span class="bluecoloredspan">x</span> : <a href="#" class="a-nav-principale">lien</a></p>
    </li>  
    <li class="li-nav-principale">
      <p><span class="bluecoloredspan">y</span> : <a href="#" class="a-nav-principale">lien</a></p>
    </li>
  </ul>
</div>
```

### Prise en compte des solutions du Département

Par exception à la règle ci-dessus, certains composants ont une structure HTML imposée par une solution technique du Département (CMS, ...). Ces composants particuliers sont documentés avec le nom de la méthode de l'outil permettant d'utiliser ledit composant dans un gabarit.

Pour ces composants, c'est la structure HTML "éditeur" qui est alors respectée.

### Sémantique

Une vigilance est apportée à la semantique des pages donc du code. Les balises HTML5 sont utilisées pour structurer les pages ( `<nav>`, `<article>`, `<aside>`, `<figure>`, ...)

### Composants dynamiques ou interactifs

Si des propriétés sont nécessaires à des composants pour de l'intéractivité, elles sont passées via des attributs data-*. Dans tous les cas, les composants employant du javascript sont pensés dans une logique d'**amélioration progressive**. C'est à dire que si javascript est désactivé, les fonctions essentielles restent disponibles.

Exemples :
 - Un menu déroulant est remplacé par un lien qui permet d'accéder à une page donnant l'accès aux sous-éléments
 - Une modale est remplacée par une page qui affiche le contenu de la modale.

Exemple d'utilisation de data-*pour une alerte qui disparait au bout d'un temps configurable :

```html
<p data-hide-in="5">Se cache au bout de 5 secondes</p>
```

Dans cet exemple, sans javascript, l'alerte reste simplement affichée, ce qui n'est pas bloquant.

Autre exemple, si l'on souhaite mettre un bouton permettant de masquer l'alerte plutôt qu'une minuterie :

```html
<p data-hide="bt-hide-1">
    Je me cache si l'on appuie sur le bouton
    <span data-hide-loc="bt-hide-1"></span>
</p>
```

Un code javascript associé au composant afficherait alors le boutton dans le span et s'occuperait de masquer le paragraphe à l'appuie sur celui-ci. Sans javascript, il n'y aurait pas de bouton permettant de masquer le texte.

Cette technique est appelée **javascript discret** ou **amélioration progressive**.

### IFrame

Les composants en Frame ou IFrame sont évités autant que possible car ils compliquent la navigation avec des dispositif d'assistance et ne permettent pas une performance d'affichage optimale.

### Indentation

L'indentation des composants HTML est par convention réalisée avec 2 espaces.

### Commentaires

Le code HTML sera exempt de commentaires, tant les commentaires traditionnels que les commentaires conditionnels.

## CSS

### Framework CSS

Le framework sur lequel est basé ce design system KNACSS est performant, compact, éprouvé et adapté aux navigateurs "de premier plan" sélectionnés. Au delà, il est validé du point de vue de l'accessibilité (pas de taille en pixel, ...)

Il intégre une remise à zéro des styles sur les différents navigateurs afin d'assurer une cohérence visuelle entre les différents navigateurs.

Les couleurs et styles par défaut ont été personnalisé, il s'agit donc d'une version optimisée et adaptée pour l'usage du Département de Loire Atlantique.

Afin d'être maintenable, et rigoureusement organisé, le framework CSS est réalisé en Scss avec une séparation entre les composants coeurs et les composants optionnels pouvant être inclus ou non dans la feuille de style finale (selon le site, il est ainsi possible de limiter le nombre de composants supportés pour améliorer la performance finale).

### Performance

Afin d'optenir des performances élevées sur des téléphones mobiles aux ressources mémoire et processeur limitées, les recommandations suivantes sont prises en compte :
* Pas de propriété de style avec !important
* Pas de positionnement absolu des blocs (sauf cas exceptionnel)
* Pas d'utilisation de filtres CSS (sauf cas exceptionnel)
* Pas de ```@import``` dans les CSS
* Pas d'expression CSS 

```css
background-color: expression( (new Date()).getHours()%2 ? "#B8D4FF" : "#F08A00" );
```

### Organisation des directives de style

Scss est utilisé avec une méthodologie orientée vers la performance, le ré-emploi, la compacité, la maintenablité et la relecture du code. L'emploi de la convention BEM (Block, element, modifier) est retenue.

L'objectif est d'éviter les sélecteurs complexes, gourmand en temps de calcul côté navigateur et favoriser le réemploi entre les composants.

Le nom de chaque classe CSS est choisi pour être synthétique (gain de taille des feuilles CSS) tout en restant compréhensible. Il est écrit en minuscule et le tiret est utilisé pour composer les différents parties du nom. 

Exemple : button peut devenir btn ou bt.

Un nombre minimal de règles et des règles simples à évaluer pour le navigateurs, tel est le coeur de la philisophie de la conception de ce design system web. 

### Conventions

Les conventions et les bonnes pratiques issue de KNACSS; ici recopiée, sont respectées :
 - Priorité aux classes : Privilégiez au maximum l'usage de classes plutôt que des sélecteurs basés sur les noms des balises ou leur id 
 - Nommage des classes (BEM) : Choisissez des noms de composants fonctionnels réutilisables (ex. alert), des noms de sous-éléments préfixés par leur parent (ex. alert-title) et des variantes facilement distinguables (ex. alert-title--alternate)
 - Pas de mélange : Séparez la structure de l’apparence (une règle CSS ne doit pas comporter à la fois padding et background par exemple). Prévoyez des styles de base réutilisables, puis des classes de variantes graphiques 
 - Autonomie des composants : Séparez le conteneur du contenu (un composant ne doit jamais être ciblé par un sélecteur qui tient compte de son parent) Par exemple, n'écrivez pas .sidebar .button mais .button-primary 
 - Variables : les variables de KNACSS sont rédigées en minuscule, en anglais et les mots composés sont séparés d'un trait d'union. De préférence, le nom du composant apparaît en premier dans le nom d'une variable (ex. $checkbox-size plutôt que $size-checkbox), à l'exception des couleurs globales de texte ou de fond ( $color-primary, $background-base, etc.)
 - Couleurs : Employez systématiquement une variable pour désigner vos couleurs au sein des projets.
 - Points de rupture : optez pour la méthodologie "Mobile First" et appliquez de préférence des media queries de ce type : @media (min-width: $breakpoint). Si vous deviez choisir un intervalle maximum, optez pour @media (max-width: ($breakpoint - 1)) pour éviter les chevauchements
 - Classes utilitaires : KNACSS propose quelques classes utilitaires telles que .mt0, .txtcenter, .fl, etc. mais il est préférable de ne pas en abuser. Évitez d'accumuler les classes sur un même élément

## Javascript

Le recours au Javascript est limité aux interactions principales car il contribue à diminuer la réactivité des pages internet et demande beaucoup de travail pour préserver l'accessibilité des composants.

### Recommandation générales

Aucune fonction ou variable globale, les fonctions et les variables sont protégées dans des "scopes"

Pas de javascript dans l'HTML (inline javascript) mais uniquement dans un ou plusieurs fichiers JS externes.

La performance de chaque composant est validé en utilisant des "console.time" lors de la mise au point (Ces blocs de code sont commentés dans le code final)

Le nombre d'écouteurs d'évènement est minimisé car très gourmant en ressources sur les mobiles ou les tablettes. Pour celà, le pattern "event delegation" est utilisé dès qu'il est adapté.

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

Un mécanisme de compilation basé sur GULP permet de compiler uniquement un unique fichier JS et trois fichiers CSS (wysiwyg, print et screen) comprenant le socle et les composants sélectionnés, de manière optimisé en taille (suppression des commentaires, des caractères inutiles, ...).

Etant donné que les téléphones mobiles ne conservent pas souvent en cache les fichiers de plus de 25ko (même si l'entête HTTP indique que c'est possible), les fichiers CSS et JS résultats de cette compilation sont travaillés pour respecter cette limite.

Si au cours de l'évolution du design system, cette limite vient à être dépassée, le fichier concerné est alors scindé en deux.