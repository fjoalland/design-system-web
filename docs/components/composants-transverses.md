---
layout: component-detail
group: components


title: Composants transverses
description: Grand composant complet qui peuvent se placer à différent endroit des pages.
status: Brouillon

variations:
- title: FAQ
  description: Foire aux questions (composant bas de page)
  pattern: FAQ/FAQ-basPage.html

- title: Page utile
  description: Composant "Cette page vous a-t-elle été utile ?" que l'on retrouve en bas de page.
  pattern: page-utile/bloc-utile.html

- title: Grands projets
  description: Composant "Les grands projets" que l'on retrouve sur la page d'accueil. Une mise en avant, un focus sur des grandes thématiques
  pattern: composants-transverses/focus-projets.html

- title: Tous nos sites
  description: Composant "Tous nos sites et applis" que l'on retrouve en bas de page de la page d'accueil.
  pattern: composants-transverses/sites-applis.html

- title: Timeline
  description: gabarit de présentation sous forme de timeline
  pattern: composants-transverses/timeline.html

- title: Tooltips
  description: Les tooltips sont utilisés pour apporter une information supplémentaire.
  pattern: composants-transverses/tooltips.html

- title: Infobulle marker
  description: Les infobulle marker ont le même comportement que les tooltips, on les trouve sur les cartes. Au clic sur l'icône marqueur, on affiche plus d'informations sur le lieu sélectionné.
  pattern: composants-transverses/infobulle_marker.html

---


## Notes d'intégration

Dans les composants, les modales sont codées au sein du <main> pour des raisons pratiques (afin de tester le fonctionnement).
**Les modales doivent être codées après le footer** dans les pages finales.


## Usage
