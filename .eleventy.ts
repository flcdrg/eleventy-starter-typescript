import _ from 'lodash';
import { ExcerptGenerator } from './src/_js/excerptGenerator';
import { Categories, Pagination, Post, PostsByYear, PostsByYearPaged } from './src/app/components/types';

import { UserConfig } from '@11ty/eleventy';

const pluginRss = require("@11ty/eleventy-plugin-rss");

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

  // filter to exclude 'posts' tag
  eleventyConfig.addFilter('excludePostsTag', (tags: string[]) => {
    return tags.filter(tag => tag !== 'posts');
  });

  type CollectionApi = {
    getAll(): any[];
    getFilteredByTag: (arg0: string) => any[];
  };

  eleventyConfig.addCollection("_recentPosts", (collectionApi: CollectionApi) => {

    const posts = collectionApi.getFilteredByTag("posts");
    return posts
      .sort((a: Post, b: Post) => b.date.getTime() - a.date.getTime())
      // take first 5
      .slice(0, 5 - (posts.length % 5));
  });

  eleventyConfig.addCollection("_postsYears", (collectionApi: CollectionApi) => {
    // get distinct years
    return _.chain(collectionApi.getFilteredByTag("posts") as Post[])
    .map((post) => post.date.getFullYear())
    .uniq()
    .orderBy(orders => orders, ['desc'])
    .value();
  });

  eleventyConfig.addCollection("_postsByYear", (collectionApi: CollectionApi) => {
    return _.chain(collectionApi.getFilteredByTag("posts") as Post[])
      .groupBy((post) => post.date.getFullYear() as number)
      .toPairs()
      .reverse()
      .value();
  });

  eleventyConfig.addCollection("_postsReversed", (collectionApi: CollectionApi) => {
    const posts = collectionApi.getFilteredByTag("posts") as Post[];
    return _.chain(posts)
      .orderBy((post) => post.date.getTime(), ['desc'])
      // take multiple of 5
      .slice(0, 5 * Math.floor(posts.length / 5))
      .value();
  });


  eleventyConfig.addCollection("_postsByYearPaged", (collectionApi: CollectionApi) => {
    let postsByKey: { [id: string]: Post[] } = {};

    collectionApi.getFilteredByTag("posts").forEach((post: Post) => {
      const key = post.date.getFullYear();

      if (!postsByKey[key]) {
        postsByKey[key] = [];
      }

      postsByKey[key].push(post);
    });

    const postsByKeyPaged: PostsByYearPaged = [];

    for (let key in postsByKey) {
      postsByKey[key].sort((a, b) => b.date.getTime() - a.date.getTime()).reverse();

      let totalPages = Math.ceil(postsByKey[key].length / 20);

      _.chunk(postsByKey[key], 20).forEach((posts: any, index: number) => {
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

  eleventyConfig.addFilter("hashIt", function(array: Array<any>) {
    const hash: {[id:number]: any} = {};
    for (let i = 0; i < array.length; i++) {
      hash[i+1] = array[i];
    } 

    return hash;
  });

  eleventyConfig.addFilter("paginate", function (pagination: Pagination) {
    const maxPage = pagination.pages.length;

    const currentPage = pagination.pageNumber;
    console.log('currentPage', currentPage);

    const startPage = 5 * Math.floor((currentPage - 1) / 5) + 1;
    console.log('startPage', startPage);
    const pages = pagination.pages.slice(startPage, currentPage + 5);

    return pages;

  });

  // https://www.martingunnarsson.com/posts/eleventy-excerpts/
  eleventyConfig.addFilter("excerpt", function (content: string) {
    return new ExcerptGenerator().getExcerpt(content, 500);
  });

  eleventyConfig.addPlugin(pluginRss);

  // https://simplyexplained.com/blog/migrating-this-blog-from-jekyll-to-eleventy/
  eleventyConfig.addShortcode('post_url', (collection: any, filename: string) => {

    // append .md to filename if it doesn't end with that already
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    const found = collection.find((p: any) => p.template.inputPath.indexOf(filename) > -1);

    if (found) {
      return found.url;
    } else {
      throw new Error(`File ${(this as any).page.inputPath} wants to link to ${filename} but it does not exist`);
    }
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
