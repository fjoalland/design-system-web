---
layout: page
title: Historique
permalink: /historique/
description: Liste des changements
---

<div>

    {% for post in site.posts %}
		<div class="c-block">
			<h2 class="c-block__heading"><a href="{{ post.url | prepend: site.baseurl }}" class="c-block__link">{{ post.title }}</a></h2>
			<div class="c-block__desc">
				{{ post.content }}
			</div><!--end c-block__desc-->
		</div><!--end c-block-->
    {% endfor %}
	
</div>
