var
  metalsmith = require('metalsmith'),
  markdown   = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  assets = require('metalsmith-assets'), 
  collections = require('metalsmith-collections');
  handlebars = require('handlebars');
  permalinks = require('metalsmith-permalinks');
  
  ms = metalsmith(__dirname) // the working directory
    .clean(true)            // clean the build directory
    .metadata({
      site: {
        name: 'Brothers',
      }
    })
    .source('./src/html')    // the page source directory
    .destination('./build/')  // the destination directory
    .use(assets({
      source: 'src/assets/', // relative to the working directory
      destination: './assets/' // relative to the build directory
    }))
    .use(collections({
      articles: {
        pattern: '**/*.md',
        sortBy: 'date',
        reverse: true
        },
      }))
    .use(markdown())        // convert markdown to HTML
    .use(permalinks({
      relative: false,
      pattern: ':title',
    }))
    .use(templates({
      engine: 'handlebars',
      directory: './src/template',
      default: 'article.html',
      pattern: ["*/*/*html","*/*html","*html"],
      partials: {
        header: '../partials/header',
        footer: '../partials/footer'
        }
  }))
   .build(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('E!');
      }
    });;