interface BlogPostProps {
  title: string;
  page: any;
  content: string;
  date: Date;
}

exports.data = {
  layout: 'base.11ty.js',
  permalink: function (data: any) {
    return `/${data.page.date.getFullYear()}/${this.slug(data.title)}.html`;
  }
}

exports.permalink = ({ page }: BlogPostProps) => `/blog/${page.fileSlug}.html`

exports.render = ({ title, page, content }: BlogPostProps) => `
  <a href="/blog">Back</a>
  <article>
    <h1>${title}</h1>
    <time>${page.date}</time>
    ${content}
  </article>
`
