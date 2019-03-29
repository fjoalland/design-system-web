---
layout: component-detail
group: components
permalink: /components/pagination.html

title: Pagination
description: Pagination is used for splitting up content or data into several pages, with a control for navigating to the next or previous page.

variations:
- title: Pager standard
  pattern: pagination/pager-standard.html
  storybook: https://www.loire-atlantique.fr/jcms/sorties-loisirs-fr-c_5063
- title: Pager infini
  pattern: pagination/pager-infini.html
  storybook: https://www.loire-atlantique.fr/jcms/tout-savoir-sur-le-departement/elu-es/annuaire-des-elu-es-fr-p1_214628
---

## Usage

Generally, Pagination is used if there are more than 25 items displayed in one view. The default number displayed will vary depending on the context.

## Best practices

### Identify the current page

Clearly identify which page the user is on my displaying the current page number. By providing context into how many pages there are in total (eg. 1 of 4 pages), you can help provide clarity around the data displayed.