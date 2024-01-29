require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

const urlDatabase = [];
let currentId = 1;


app.post("/api/shorturl", (req, res) => {
  const url = req.body.url; 
  const regex = /^http:\/\/www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(url)) {
    res.json({ error: 'invalid url' });
  } 

  const shortUrl = currentId;
  urlDatabase.push({ url, shortUrl });
  currentId++;


  res.json({ original_url: url, short_url: shortUrl });
});


app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = parseInt(req.params.short_url);

  const urlEntry = urlDatabase.find(entry => entry.shortUrl === shortUrl);

  if(urlEntry){
    console.log(urlEntry);
    res.redirect(urlEntry.url)
  } else {
    res.json({ error: "short_url not found" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
