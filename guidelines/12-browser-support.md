---
layout: page
type: detail
title: Support navigateurs
group: guidelines
permalink: /exigences/browsers.html
description: Guidelines that explain which browsers the design system is optimized for


---

There is a difference between [support and optimization](http://bradfrost.com/blog/mobile/support-vs-optimization/). These guidelines explain which browser environments the design system is optimized for, typically in the form of [graded browser support](https://github.com/yui/yui3/wiki/Graded-Browser-Support).

https://github.com/yui/yui3/wiki/Graded-Browser-Support


# IE

Le rendu est susceptible d'êre un peu dégradé

<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

The viewport meta tag is also needed to instruct a mobile device to keep the viewport to the amount of pixels it has on the screen i.e. prevent it from zooming out like a desktop version.
<meta name="viewport" content="initial-scale=1.0, width=device-width, shrink-to-fit=no">