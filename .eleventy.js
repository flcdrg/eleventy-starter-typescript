/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function(config) {
  config.addPassthroughCopy({ public: './' })


  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
  })

  config.addAsyncFilter('getFullYear', async function (date) {
    return date.getFullYear();
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
