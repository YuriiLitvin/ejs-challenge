//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const defaultContent = require(__dirname + "/defaultContent.js")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb+srv://admin-yuri:tested1521@cluster0.rvllyyy.mongodb.net/blogDB");
}

const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {startingContent: defaultContent.home, posts: foundPosts});
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutPageContent: defaultContent.about});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactPageContent: defaultContent.contact});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:post_id", function(req, res) {
  const postId = req.params.post_id;
  Post.findById(postId, function(err, foundPost) {
    if (err) {
      console.log("There is no specified post.");
    } else {
      res.render("post", {title: foundPost.title, content: foundPost.content});
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server running successfully.");
});
