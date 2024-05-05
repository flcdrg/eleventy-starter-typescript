---
layout: base.11ty.js
---

# Dave's Daydreams

This is an [11ty](https://11ty.dev) starter with TypeScript templates.

Check out the [blog](/blog) too!

  {% for post in collections.posts | reverse %}

{{ post.date | getFullYear }}
## <a href="{{ post.url | url }}">{{ post.data.title }}</a>

{{ post.content }}

  {% endfor %}
