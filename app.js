const express = require("express");
const bodyparser = require("body-parser");
const  _ = require("lodash");
const mongoose = require('mongoose');
const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/articles', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  date: Date
});

const Article = mongoose.model('Article', articleSchema);

app.get("/", function (req, res) {

  Article.find({}, function(err, articles){
    res.render("index", {articles:articles});
  });

});

app.get("/newArticle", function(req,res){
     res.render("new", {title:"", description:"", content:""});
});

app.post("/edit/:articleID", function(req,res){

  let articleID = req.params.articleID;

  Article.findById(articleID,function(err,article){
    if(!err){

        article.title = req.body.title;
        article.description = req.body.description;
        article.content = req.body.content;

        article.save();
        res.redirect("/");
    }else{
      console.log(err);
    }
  })

})

app.get("/edit/:articleID", function(req,res){

  let articleID = req.params.articleID;

  Article.findById(articleID, function(err, article){
    res.render("edit", {title:article.title, description:article.description, content:article.content, id:article._id});
  });

});

app.get("/articles/:articleID", function(req,res){
    
  let articleID = req.params.articleID;
  console.log(articleID);

  Article.findById(articleID, function(err, article){
    res.render("post", {article: article});
    
  });

});

app.post("/newArticle", function(req,res){


  const article = new Article(
      { 
         title: req.body.title,
         date: new Date().toLocaleDateString(),
         description: req.body.description,
         content: req.body.content 
     }
  );

  article.save();
  // console.log(article);
  res.redirect("/");
});

app.post("/delete", function(req,res){
  let deleteBlog = req.body.deleteName;

  Article.findOneAndDelete(deleteBlog, function(err){
    if (!err) {
      res.redirect("/");
    }
  });

});

app.listen(3000, function (req, res) {
  console.log("Server is live");
});
