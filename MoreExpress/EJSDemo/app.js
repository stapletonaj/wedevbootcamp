var express = require("express");
var app = express();

//tell express to include other files other than views
app.use(express.static("public"));
//tell express to render all pages a ejs
app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("home");
});

app.get("/fallinlovewith/:thing", function(req, res){
   var thing = req.params.thing;
   res.render("love", {thingVar: thing,});
});

app.get("/posts", function(req, res){
   var posts = [
       {title: "Post one", author: "Suzie"},
       {title: "My Adorable pet bunny", author: "Charly"},
       {title: "Sofie is so cute", author: "Me"}
       ];
       res.render("posts", {posts:posts});
   }
);

// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});
