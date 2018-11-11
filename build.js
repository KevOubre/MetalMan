var contentful = require('contentful'),
  fs = require('fs'),
  path = require('path');



// path should have trailing slash
/*
function removeDirForce(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}*/



const client = contentful.createClient({
  space: 'knnbub1gupcl',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'dad21cd7010f7eb24533c2f50a8502b1704b30051ebaea6e2ddc0c3b906769f8'
})



function make_files(li) {

  li.items.forEach(element => {
    //console.log(element.fields.theinterviews);
    if (element.fields.whoami != undefined) {
      var stream = fs.createWriteStream("src/html/" + element.fields.whoami + "/" + element.fields.slug + ".md");

      stream.once('open', function (fd) {
        stream.write("---\n");
        stream.write("title: " + element.fields.title + " \n");
        stream.write("date : " + "2016-10-14" + "\n")
        stream.write("contentful:" + "\n")

        stream.write("  contentype: " + "interview" + "\n")
        stream.write("  entry_id : " + element.sys.id + " \n")
        if (element.fields.whoami == "interview") {
          stream.write("template : post.html \n")
        } else {
          console.log(element.fields);
          stream.write("template : wikientry.html \n")
        }

        stream.write("exists : " + element.fields.slug + " \n")
        stream.write("---")
        stream.end();
      })
    };

  });
  //console.log(li.items)

}


client.getEntries()
  .then((response) => make_files(response))
  .catch(console.error)



var
  metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  assets = require('metalsmith-assets'),
  collections = require('metalsmith-collections'),
  handlebars = require('handlebars'),
  permalinks = require('metalsmith-permalinks'),
  contentful = require('contentful-metalsmith')


ms = metalsmith(__dirname) // the working directory
  .clean(true) // clean the build directory
  .metadata({
    site: {
      name: 'Brothers',
    }
  })
  .source('./src/html/') // the page source directory
  .destination('./build/') // the destination directory
  .use(assets({
    source: 'src/assets/', // relative to the working directory
    destination: './assets/' // relative to the build directory
  }))

  .use(collections({
    interview: {
      pattern: 'interview/*.md',
      sortBy: 'date',
      reverse: true
    },
    wiki: {
      pattern: 'wiki/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))

  .use(markdown()) // convert markdown to HTML
  .use(contentful({
    space_id: 'knnbub1gupcl',
    access_token: 'dad21cd7010f7eb24533c2f50a8502b1704b30051ebaea6e2ddc0c3b906769f8',

  }))

  .use(templates({
    engine: 'handlebars',
    directory: './src/template',
    default: 'article.html',
    pattern: ["*/*/*html", "*/*html", "*html"],
    partials: {
      articleheader: '../partials/articleheader',
      indexheader: '../partials/indexheader',
      footer: '../partials/footer'
    }
  }))

  .build(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('E!');
    }
  });;