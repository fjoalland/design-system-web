---
layout: component-detail
group: templates
permalink:

title: Candidature spontanée
description: Modèle de page basée sur le template "carrefour".
status: Validé

variations:

- title: Formulaire de candidature
  pattern: page/LA__candidature.html

- title: Template carrefour
  pattern: templates/template-entryMenu.html

---
## Utilisation

Page utilisée pour afficher un formulaire de candidature.

## Notes d'intégration

La zone formulaire comprend des champs avec ou sans infos complémentaires. Les champs qui comportent une info complémentaire doivent avoir une marge basse plus grande que les champs sans infos, de façon que le placeholder puisse remonter sans se superposer à l'info complémentaire du champ juste au-dessus. Les `<li>` sont donc pourvues de deux types de marge : `ds44-mb3` pour les champs sans info complémentaire et `ds44-mb35` pour les champs avec info.
