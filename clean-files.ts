const fs = require("fs")
const path = require("path")

function fromDir(startPath, filter) {

  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath)
    return
  }

  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      fromDir(filename, filter) //recurse
    } else if (filename.indexOf(filter) >= 0) {
      console.log("-- found: ", filename)
      try {
        fs.unlinkSync(filename)
        //file removed
      } catch (err) {
        console.error(err)
      }
    }

  }

}


fromDir("./src/images/", ".jpg")
