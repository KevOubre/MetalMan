var contentful = require('contentful'),
  fs = require('fs'),
  path = require('path');



// path should have trailing slash

/*function removeDirForce(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
} */

fs.readdir(path, function(err, items) {
  console.log(items);

  for (var i=0; i<items.length; i++) {
      console.log(items[i]);
  }
});

const client = contentful.createClient({
  space: 'knnbub1gupcl',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'dad21cd7010f7eb24533c2f50a8502b1704b30051ebaea6e2ddc0c3b906769f8'
})

function make_a_file(element) {

  if (element.fields.whoami != undefined) {
    var stream = fs.createWriteStream("src/html/" + element.fields.whoami + "/" + element.fields.slug + ".md");
    console.log(element.fields.title)
    stream.once('open', function (fd) {
      stream.write("---\n");
      stream.write("title: " + element.fields.title + " \n");
      stream.write("date : " + "2016-10-14" + "\n")
      stream.write("contentful:" + "\n")

      stream.write("  contentype: " + "interview" + "\n")
      stream.write("  entry_id : " + element.sys.id + " \n")
      stream.write("exists : " + element.fields.slug + " \n")

      if (element.fields.whoami == "interview") {
        stream.write("template : post.html \n")
        stream.write("--- ")
        if (element.fields.transcripedText != undefined) {
          stream.write("\n" + element.fields.transcripedText)
        }
      } else {
        stream.write("template : wikientry.html \n")
        stream.write("---")

      }

      stream.end();

      readdir(element.fields.whoami);
      
    })
  }
};


function make_files(li) {


    li.items.forEach(obj => {
      try {
        make_a_file(obj)
      } catch (e) {
        console.log(e)
      }
    })

  };


  //console.log(li.items)


client.getEntries()
  .then((response) => make_files(response))
  .catch(console.error)