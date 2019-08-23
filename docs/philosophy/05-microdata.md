---
layout: page
type: detail
title: Microdonnées
group: philosophy
permalink: /philosophie/microdata.html
description: L'utilisation de microdonnées dans les composants permet aux moteurs de recherche et autres indexeurs de mieux comprendre le contenu des pages
---

Les composants intégrent des microdonnées lorsque ceci est opportun.

## Microdonnées HTML5 et Schema.org

Les schémas utilisés sont basés sur les [micro-formats de schema.org](https://schema.org/docs/schemas.html)

Exemple pour un contact :

```html
<div itemscope itemtype="http://schema.org/Person">
    <span itemprop="name">Jane Doe</span>
    <img src="janedoe.jpg" itemprop="image" alt="Photo of Jane Joe"/>
    <span itemprop="jobTitle">Professor</span>
    <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
        <span itemprop="streetAddress">
            20341 Whitworth Institute
            405 N. Whitworth
        </span>
        <span itemprop="addressLocality">Seattle</span>,
        <span itemprop="addressRegion">WA</span>
        <span itemprop="postalCode">98052</span>
    </div>
    <span itemprop="telephone">(425) 123-4567</span>
    <a href="mailto:jane-doe@xyz.edu" itemprop="email">jane-doe@xyz.edu</a>
</div>
```

## Sémantique, Open GRAPH et Twitter card

Le protocole Open Graph est utilisé sur les gabarits de page afin de permettre aux principaux réseaux sociaux (Facebook, Google +, Twitter, Linked in...) d'avoir des informations précises sur les pages du site. 

```html
<head prefix="og: http://ogp.me/ns#">
    <meta property="og:site_name" content="nature.loire-atlantique.fr" />
    <meta property="og:url" content="https://nature.loire-atlantique.fr/jcms/accueil-nature-fr-local_56369" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="La Loire-Atlantique, un département au naturel" />
    <meta property="og:description" content="Afin de préserver la qualité des sites et des paysages, le Département s&apos;engage pour la protection et la valorisation des espaces naturels sensibles. Il assure leur gestion et permet l&apos;ouverture au public de ces sites exceptionnels !" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@loireatlantique" />
```