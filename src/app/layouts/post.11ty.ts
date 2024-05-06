interface BlogPostProps {
  title: string;
  page: any;
  content: string;
  date: Date;
}

exports.data = {
  layout: 'base.11ty.js',
  permalink: function (data: any) {
    //console.log(JSON.stringify(data, null, 2));

    const date: Date = data.page.date;
    const month = new Intl.DateTimeFormat('en', { month: "2-digit" }).format(date);
    const year = date.getFullYear();
    return `/${year}/${month}/${data.page.fileSlug}.html`;
  }
}

exports.render = ({ title, page, content }: BlogPostProps) => `
  <a href="/blog">Back</a>
  <article>
    <h1>${title}</h1>
    <time>${page.date}</time>
    ${content}
  </article>
`
