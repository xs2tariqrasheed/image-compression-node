var http = require("http");
var express = require("express");
const sharp = require("sharp");
var app = express();

app.set("port", process.env.PORT || 3005);
app.set("views", __dirname + "/app/server/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/app/public"));

require("./app/routes")(app);

const fs = require("fs");

async function compressPng(file, currentIndex, lastIndex) {
  await sharp(__dirname + "/input/" + file)
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .withMetadata()
    .toFile("./output/" + file, function (err) {
      if (err) {
        console.log(err, "error");
      } else {
        console.log("DONE: ", file);
        if (lastIndex === currentIndex) {
          console.log("COMPLETED!!!");
          process.exit(1);
        }
      }
    });
}

http.createServer(app).listen(app.get("port"), function () {
  const files = fs.readdirSync(__dirname + "/input");
  files.forEach(async (file, index) => {
    await compressPng(file, index, files.length - 1);
  });
});
