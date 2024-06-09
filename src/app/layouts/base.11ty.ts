import navigation from '../components/navigation'
import { PostsByYear } from '../components/types';

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
        ${
          (collections._postsByYear as PostsByYear)
          // sort by year descending
          .sort((a: any, b: any) => b.key - a.key)
          .map((year: any) => `
            <li><a href="/${year.key}">${year.key}</a></li>
          `)
          .join('')
        }
      </aside>
    </div>
    </body>
  </html>
`;
}