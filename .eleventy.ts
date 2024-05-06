import lodash from 'lodash';
import { ExcerptGenerator } from './src/_js/excerptGenerator';

import { UserConfig } from '@11ty/eleventy';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig: UserConfig) {
  eleventyConfig.addPassthroughCopy({ public: './' })

  eleventyConfig.setBrowserSyncConfig({
    files: ['dist/**/*'],
  })

  eleventyConfig.addPassthroughCopy('*.css');
  eleventyConfig.addAsyncFilter('formatDate', async function (date: Date) {
    // format as dd mmm yyyy
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
  });

  eleventyConfig.addCollection("_postsByYear", (collectionApi: { getFilteredByTag: (arg0: string) => any[]; }) => {
    let postsByKey:any = {};
    collectionApi.getFilteredByTag("posts").forEach(post => {
      let key = post.date.getFullYear();

      if (!postsByKey[key]) {
        postsByKey[key] = [];
      }

      postsByKey[key].push(post);
    });

    let postsByKeyPaged: Array<any> = [];
    for (let key in postsByKey) {
      postsByKey[key].sort((a: { date: number; }, b: { date: number; }) => a.date > b.date).reverse();

      let totalPages = Math.ceil(postsByKey[key].length / 20);

      lodash.chunk(postsByKey[key], 20).forEach((posts: any, index: number) => {
        postsByKeyPaged.push({
          key: key,
          posts: posts,
          pageNumber: index + 1,
          totalPages: totalPages
        });
      })
    }

    return postsByKeyPaged;
  });

  // https://www.martingunnarsson.com/posts/eleventy-excerpts/
  eleventyConfig.addFilter("excerpt", function (content: any) {
    return new ExcerptGenerator().getExcerpt(content, 500);
  });

  return {
    templateFormats: ['md', 'njk', 'jpg', 'png', 'gif'],
    dir: {
      input: 'src',
      output: '_site',
      layouts: '_js/layouts',
    }
  }
}
