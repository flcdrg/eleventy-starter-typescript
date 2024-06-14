---
layout: base.11ty.js
title: Dave's Daydreams
---

# Dave's Daydreams

{% for post in collections._recentPosts %}

{{ post.date | formatDate }}

## <a href="{{ post.url | url }}">{{ post.data.title }}</a>

{{ post.content }}

{% endfor %}

See older posts
