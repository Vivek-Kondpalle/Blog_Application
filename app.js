const express = require("express");
const bodyparser = require("body-parser");
const  _ = require("lodash");
const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

let articles = [];

app.get("/", function (req, res) {
  res.render("index", {articles:articles});
});

app.get("/newArticle", function(req,res){
     res.render("new", {title:"", description:"", content:""});
});

app.post("/edit/:articleName", function(req,res){

  let articleName = req.params.articleName;

  articles.forEach((article) => {

    if(articleName === article.title){
      article.title = req.body.title;
      article.description = req.body.description;
      article.content = req.body.content;

      res.redirect("/");
    }
  })
})

app.get("/edit/:articleName", function(req,res){

  let articleName = req.params.articleName;

  articles.forEach((article) => {
    if(articleName === article.title){
      res.render("edit", {title:article.title, description:article.description, content:article.content});
    }
  })

});

app.get("/articles/:articleName", function(req,res){
    
  let articleName = req.params.articleName;

  articles.forEach((article) => {
    if(articleName === article.title){
      res.render("post", {article: article});
    };
  })

});

app.post("/newArticle", function(req,res){

    let article = {
        title: req.body.title,
        date: new Date().toLocaleDateString(),
        description: req.body.description,
        content: req.body.content
    };

    articles.push(article);

    res.redirect("/");
});

app.post("/delete", function(req,res){
  let deleteBlog = req.body.deleteName;

  articles.forEach((article) => {
    if(article.title === deleteBlog){
      let index = articles.indexOf(article);
      articles.splice(index, 1);
      res.redirect("/");
    }
  });

});

app.listen(3000, function (req, res) {
  console.log("Server is live");
});
