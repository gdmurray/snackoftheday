const https = require("https")
// @ts-ignore
const fetch = require("node-fetch")
const { exec } = require("child_process")
const fs = require("fs")
const DataStore = require("nedb")
const Stream = require("stream").Transform
const db = new DataStore({ filename: "./snacks.db", autoload: true })

let dataObject = {
  snacks: []
}

// exec(`convert ${filePath} -alpha off -bordercolor $( convert ${filePath} -format "%[pixel:p{0,0}]" info:- ) -border 1 \( +clone -fuzz 30% -fill none -floodfill +0+0 $color -alpha extract -geometry 200% -blur 0x0.5 -morphology erode square:1 -geometry 50% \) -compose CopyOpacity -composite -shave 1 ${filePath.replace("jpg", "png")}`, (error, stdout, stderr) => {

function makeTransparent(filePath) {
  exec(`
  color=$( convert ${filePath} -format "%[pixel:p{0,0}]" info:- )
  convert ${filePath} -alpha off -bordercolor $color -border 1 \\
    \\( +clone -fuzz 5% -fill transparent -floodfill +0+0 $color \\
       -alpha extract -geometry 200% -blur 0x0.5 \\
       -morphology erode square:2 -geometry 50% \\) \\
    -compose CopyOpacity -composite -shave 1 ${filePath.replace("jpg", "png")}
  `, (error, stdout, stderr) => {
      if (error) {
        console.log("ERROR", error)
      }
      if (stderr) {
        console.log("ERROR", stderr)
      }
    }
  )
}

db.loadDatabase(function(err) {
  if (!err) {
    db.find({}, function(err, docs) {
      // let smallDocs = [docs[0], docs[1], docs[2], docs[3], docs[4]]
      docs.forEach(async (elem) => {
        dataObject.snacks.push(elem)
        const path = `./static/${elem.id}.jpg`
        // const res = await fetch(elem.image)

        // fs.access(path, fs.F_OK, (err) => {
        //   if (err) {
        //     const fileStream = fs.createWriteStream(path)
        //     new Promise((resolve, reject) => {
        //       res.body.pipe(fileStream)
        //       res.body.on("error", reject)
        //       fileStream.on("finish", resolve)
        //     }).then(() => {
        //       makeTransparent(path)
        //     })
        //   } else {
        //     makeTransparent(path)
        //   }
        // })

      })
      fs.writeFileSync("./static/data.json", JSON.stringify(dataObject))
    })
  }
})