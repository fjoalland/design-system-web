---
layout: page
title: Formulaires
group: philosophy
permalink: /philosophie/formulaire.html
description: Exigences générales autour des formulaires en ligne

---

Les formulaires permettent de soumettre des données, il s'agit d'un composant essentiel de la relation avec les visiteurs.

Chaque formulaire comprend les éléments suivants :
* Une introduction : texte introduisant le formulaire
* Des champs :
  * Libellé : Informe l'utilisateur de la destination du champ de saisie 
  * Champ de saisie : Permet à l'utilisateur de fournir une information (texte, choix, ...)
  * Texte d'aide : Fourni une assistance pour compléter le formulaire
  * Placeholder : Texte d'exemple qui disparait lors que l'utilisateur place le curseur dans le champs de saisie
  * Validation : Permet aux utilisateurs de voir en temps réel si leur saisie est correcte. Les champs obligatoires sont mis en évidence. L'erreur est afficher au plus près du champ.
* Une ou plusieurs actions : Les actions possibles sur ce formulaire (valider, effacer, ...) sous forme de boutons
* Un message général : Rappel des conditions légales associé à la soumission du formulaire (Exemple : RGPD si présence de données personnelles) et de la suite qui sera donnée à celui ci (conservation des données, temps de réponse, ...)

## Quel types de champs ?

### Champ texte

La taille du champs doit être en cohérence avec la taille attendue de la saisie (en largeur et en nombre de lignes)

### Bouton radio

Utilisé pour des choix exclusifs parmi au moins 2 possibilités

### Cas à cocher

Utilisé si le choix peut être multiple parmi au moins 2 possibilités.

Utilisé pour des validations (choix simple de type OUI/NON par exemple).

### Liste de choix

Choix d'une possilité parmi une liste relativement longue (Au moins 5 choix) ne permettant pas d'utiliser les boutons radios.

### Choix avec autocomplétion

Lorsque la liste des choix est très importante (plus de 100 choix), l'utilisation de ce composant permet à l'utilisateur de trouver plus rapidement le choix qui lui correspond.

Exemple : saisie d'une adresse dans le département 

## Recommandations

### Ne pas demander ce dont on peut se passer

Plus un formulaire est long ou complexe, plus il génère de difficulté ou de frustration et donc de risque d'abandon.

Chaque information demandée doit être utile et il ne doit pas être possible de s'en passer.

### Editorial

Le formulaire doit être rédigé afin que chacun puisse le compléter et comprendre ce qui est attendu.

### Message d'erreur

Le message d'erreur doit être non stigmatisant et permettre au soumissionnaire de corriger celle-ci en lui fournissant une aide positive.

Message inapproprié : 
* Date incorrecte
* Erreur de format
* Champ invalide

Message appropriés :
* Le format de date attendu est mm/jj/aaaa (exemple : 21/02/1985)
* Pour votre sécurité votre mot de passe doit comporter au moins 6 caractères

Si possible, la validation se fait en temps réel (avant soumission).

### Plusieurs pages

Si le formulaire est important, il doit être scindé en plusieurs pages et coiffé d'une barre présentant les étapes.
