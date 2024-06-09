import lodash from 'lodash';
import { ExcerptGenerator } from './src/_js/excerptGenerator';
import { Categories, Post, PostsByYear } from './src/app/components/types';

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

    const formattedDate = date.toLocaleString('default', { weekday: 'long' }) + ' ' + date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();

    return `<time datetime="${date.toISOString()}">${formattedDate}</time>`;
  });

  type CollectionApi = {
    getAll(): any[];
    getFilteredByTag: (arg0: string) => any[];
  };

  eleventyConfig.addCollection("_recentPosts", (collectionApi: CollectionApi) => {

    return collectionApi.getFilteredByTag("posts").sort((a: Post, b: Post) => b.date.getTime() - a.date.getTime());
  });


  eleventyConfig.addCollection("_postsByYear", (collectionApi: CollectionApi) => {
    let postsByKey: { [id: string]: Post[] } = {};

    collectionApi.getFilteredByTag("posts").forEach((post: Post) => {
      const key = post.date.getFullYear();

      if (!postsByKey[key]) {
        postsByKey[key] = [];
      }

      postsByKey[key].push(post);
    });

    const postsByKeyPaged: PostsByYear = [];

    for (let key in postsByKey) {
      postsByKey[key].sort((a, b) => b.date.getTime() - a.date.getTime()).reverse();

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

  eleventyConfig.addCollection("categories", (collectionApi: CollectionApi) => {



    const gatheredTags: Categories = {};

    collectionApi.getAll().forEach((item) => {
      if ('tags' in item.data) {
        (item.data.tags as string[])
          .filter((tag: string) => tag !== 'posts')
          .forEach((tag: string) => {

          if (!gatheredTags[tag]) {
            gatheredTags[tag] = 1;
          }
          else {
            gatheredTags[tag] += 1;
          }
        });
      }
    });

    return gatheredTags;
  });

  // https://www.martingunnarsson.com/posts/eleventy-excerpts/
  eleventyConfig.addFilter("excerpt", function (content: string) {
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
