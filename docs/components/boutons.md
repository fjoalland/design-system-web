---
layout: component-detail
group: components

title: Boutons
description: Boutons d'action
status: A valider

variations:
- title: Boutons standards
  description: Pour la version large, ajouter la classe `ds44-btnStd--large`. Pour la version sombre, ajouter la classe `ds44-btn--inverted`.
  pattern: boutons/buttons.html

- title: Boutons avec icône et texte
  description: Ces boutons paramétrables ont des tailles et des aspects variables. Ils sont toujours construits autour d'une icône et d'un texte.
  pattern: boutons/buttons-icotext.html

- title: Boutons avec icône seule
  description: Boutons avec icône et libellé caché pour les aides techniques.
  pattern: boutons/buttons-ico.html
---


## General guidelines

Les boutons sont utilisés pour déclencher des actions. Eviter l'usage des boutons pour naviguer : préférer les liens. Il est possible de donner à un lien un aspect de bouton, si nécessaire, en lui appliquant les mêmes classes qu'à une balise `<button>`.

Utiliser le bouton contextuel avec la classe `ds44-btnStd--contextual` pour créer des boutons aux couleurs du site.

## Usage

| Type de bouton              | Objet                                                                        |
| --------------------------- |------------------------------------------------------------------------------|
| Bouton standard             | A remplir avec Julien                                                        |
| Bouton standard large       |                                                                              |
| Bouton fixé en bas de page  | Classe : `ds44-fullWBtn` + éventuelles classes de gestion de couleur. Ajouter un conteneur positionné en fixe autour du bouton : `ds44-container-fixed ds44-posBot`                        |



## Icon usage

* Les glyphes-icônes s'utilisent dans des conteneurs de type `<i class="icon"></i>`.
* Chaque glyphe possède un code appelé par un style. Exemple : la croix est appelée par la classe `icon-cross`. Se référer à la page de preview des icônes pour les noms des classes.
* Les glyphes sont déclinés en différentes tailles, relatives ou fixes (se référer à la documentation des icônes).
* pour des questions d'alignement vertical, dans les boutons contenant des glyphes et du texte, le bloc de texte doit être placé dans un conteur de type `<span class="ds44-btnText>Texte du bouton</span>`.

## Other rules
