// loads contentful 
//like import with python
var contentful = require('contentful'),
  fs = require('fs'),
  path = require('path');



// makes a connection with the Contentful Space
// the numbers are special to this environment
const client = contentful.createClient({
  space: 'knnbub1gupcl',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'dad21cd7010f7eb24533c2f50a8502b1704b30051ebaea6e2ddc0c3b906769f8'
})


// given the JSON from contentful creates new files based on it
function make_a_file(element) {
  // if the content has a whoami field
  // shows
  try {
    if (element.fields.whoami != undefined) {
      var stream = fs.createWriteStream("src/html/" + element.fields.whoami + "/" + element.fields.slug + ".md");
      //console.log(element.fields.title)
      stream.once('open', function (fd) {
        stream.write("---\n");
        stream.write("title: " + element.fields.title + " \n");
        stream.write("date : " + "2016-10-14" + "\n")
        stream.write("contentful:" + "\n")

        stream.write("  contentype: " + "interview" + "\n")
        stream.write("  entry_id : " + element.sys.id + " \n")
        stream.write("exists : " + element.fields.slug + " \n")

        if (element.fields.whoami == "interview") {
          stream.write("template : interviewentry.html \n")
          stream.write("--- ")
          if (element.fields.transcripedText != undefined) {
            stream.write("\n" + element.fields.transcripedText)
          }
        } else {
          stream.write("template : wikientry.html \n")
          stream.write("---\n")
          stream.write(element.fields.information)

        }

        stream.end();


        fs.readdir("src/html/", (err, files) => {
          files.forEach(file => {

            console.log(file);
          });
        })

      })
    }
  } finally {
    console.log("something is broken");
  }
};


function make_files(li) {


  li.items.forEach(obj => {
    try {
      make_a_file(obj)
    } catch (e) {
      console.log(e)
      console.log("\n \n this is an error...")
    }
  })

};


//console.log(li.items)


client.getEntries()
  .then((response) => make_files(response))
  .catch(console.error)