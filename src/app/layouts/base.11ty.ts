import navigation from '../components/navigation'
import { Categories, PostsByYear } from '../components/types';

interface PageProps {
  title: string;
  content: string;
  lang: string;
  description: string;
  collections: any;
}

const defaultDescription = 'TypeScript starter for Eleventy'

module.exports = function ({
  title, content, lang = 'en', description = defaultDescription, collections
}: PageProps) {

  const categories = collections.categories as Categories;

  const categoriesList =
  Object.keys(categories)
    // sort by category name
    .sort((a, b) => a.localeCompare(b))
    .map((category) => 
      `<li><a href="/tags/${category}">${category} (${categories[category]})</a></li>`
    ).join('');
  
  return `
  <!doctype html>
  <html lang="${lang}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${description}">
      <title>${title || 'Hello world'}</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
    <header>
      ${navigation}
    </header>
    <div class="page">
      <main class="content">
        ${content}
      </main>
      <aside class="right-sidebar">
        <h3>Blog archive</h3>
        <ul>
        ${
          (collections._postsByYear as PostsByYear)
          // sort by year descending
          .sort((a: any, b: any) => b.key - a.key)
          .map((year: any) => `
            <li><a href="/${year.key}">${year.key}</a></li>
          `)
          .join('')
        }
        </ul>

        <h3>Tags</h3>
        <ul>
          ${categoriesList}
        </ul>

      </aside>
    </div>
    </body>
  </html>
`;
}