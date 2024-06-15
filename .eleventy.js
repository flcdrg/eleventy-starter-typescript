"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const excerptGenerator_1 = require("./src/_js/excerptGenerator");
const pluginRss = require("@11ty/eleventy-plugin-rss");
/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ public: './' });
    eleventyConfig.setBrowserSyncConfig({
        files: ['dist/**/*'],
    });
    eleventyConfig.addPassthroughCopy('*.css');
    eleventyConfig.addAsyncFilter('formatDate', async function (date) {
        // format as dd mmm yyyy
        const formattedDate = date.toLocaleString('default', { weekday: 'long' }) + ' ' + date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
        return `<time datetime="${date.toISOString()}">${formattedDate}</time>`;
    });
    // filter to exclude 'posts' tag
    eleventyConfig.addFilter('excludePostsTag', (tags) => {
        return tags.filter(tag => tag !== 'posts');
    });
    eleventyConfig.addCollection("_recentPosts", (collectionApi) => {
        return collectionApi.getFilteredByTag("posts")
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            // take first 5
            .slice(0, 5);
    });
    eleventyConfig.addCollection("_postsYears", (collectionApi) => {
        // get distinct years
        return lodash_1.default.chain(collectionApi.getFilteredByTag("posts"))
            .map((post) => post.date.getFullYear())
            .uniq()
            .orderBy(orders => orders, ['desc'])
            .value();
    });
    eleventyConfig.addCollection("_postsByYear", (collectionApi) => {
        return lodash_1.default.chain(collectionApi.getFilteredByTag("posts"))
            .groupBy((post) => post.date.getFullYear())
            .toPairs()
            .reverse()
            .value();
    });
    eleventyConfig.addCollection("_postsReversed", (collectionApi) => {
        return lodash_1.default.chain(collectionApi.getFilteredByTag("posts"))
            .orderBy((post) => post.date.getTime(), ['desc'])
            .value();
    });
    eleventyConfig.addCollection("_postsByYearPaged", (collectionApi) => {
        let postsByKey = {};
        collectionApi.getFilteredByTag("posts").forEach((post) => {
            const key = post.date.getFullYear();
            if (!postsByKey[key]) {
                postsByKey[key] = [];
            }
            postsByKey[key].push(post);
        });
        const postsByKeyPaged = [];
        for (let key in postsByKey) {
            postsByKey[key].sort((a, b) => b.date.getTime() - a.date.getTime()).reverse();
            let totalPages = Math.ceil(postsByKey[key].length / 20);
            lodash_1.default.chunk(postsByKey[key], 20).forEach((posts, index) => {
                postsByKeyPaged.push({
                    key: key,
                    posts: posts,
                    pageNumber: index + 1,
                    totalPages: totalPages
                });
            });
        }
        return postsByKeyPaged;
    });
    eleventyConfig.addCollection("categories", (collectionApi) => {
        const gatheredTags = {};
        collectionApi.getAll().forEach((item) => {
            if ('tags' in item.data) {
                item.data.tags
                    .filter((tag) => tag !== 'posts')
                    .forEach((tag) => {
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
    eleventyConfig.addFilter("excerpt", function (content) {
        return new excerptGenerator_1.ExcerptGenerator().getExcerpt(content, 500);
    });
    eleventyConfig.addPlugin(pluginRss);
    // https://simplyexplained.com/blog/migrating-this-blog-from-jekyll-to-eleventy/
    eleventyConfig.addShortcode('post_url', (collection, filename) => {
        // append .md to filename if it doesn't end with that already
        if (!filename.endsWith('.md')) {
            filename += '.md';
        }
        const found = collection.find((p) => p.template.inputPath.indexOf(filename) > -1);
        if (found) {
            return found.url;
        }
        else {
            throw new Error(`File ${this.page.inputPath} wants to link to ${filename} but it does not exist`);
        }
    });
    return {
        templateFormats: ['md', 'njk', 'jpg', 'png', 'gif'],
        dir: {
            input: 'src',
            output: '_site',
            layouts: '_js/layouts',
        }
    };
};
