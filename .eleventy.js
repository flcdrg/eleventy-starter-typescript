"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const excerptGenerator_1 = require("./src/_js/excerptGenerator");
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
    eleventyConfig.addCollection("_recentPosts", (collectionApi) => {
        return collectionApi.getFilteredByTag("posts").sort((a, b) => b.date.getTime() - a.date.getTime());
    });
    eleventyConfig.addCollection("_postsByYear", (collectionApi) => {
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
    return {
        templateFormats: ['md', 'njk', 'jpg', 'png', 'gif'],
        dir: {
            input: 'src',
            output: '_site',
            layouts: '_js/layouts',
        }
    };
};
