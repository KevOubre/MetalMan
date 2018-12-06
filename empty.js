var   fs = require('fs'),
  path = require('path');


function removeDirForce(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {throw err};
  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}


removeDirForce("src/html/interview/");
removeDirForce("src/html/bio/");