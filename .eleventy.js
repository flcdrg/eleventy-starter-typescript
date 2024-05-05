/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function(config) {
  config.addPassthroughCopy({ public: './' })


  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
  })

  config.addPassthroughCopy('*.css');
  config.addAsyncFilter('formatDate', async function (date) {
    // format as dd mmm yyyy
    return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
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
