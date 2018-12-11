//Require things that we will use...
var express     = require("express");
var bodyParser  = require("body-parser");
var mongoose    = require('mongoose');
var expressSanitizer = require("express-sanitizer");
var app         = express();
//required to make PUT request when editing the blogs
var methodOverride = require("method-override");


//APP CONFIG - part that we can just copy from app to app (connecting mongoose, setting view engine, serving up static file that will contain the css and js, body parser )

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE CONFIG - Create a schema for mongoose to workwith
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//create a mongoose model from the schema
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            //render the index page and *****SEND THROUGH DATA!******
            res.render("index", {blogs: blogs});
          }
    });
});

//RESTful Routes ==============================================================
//NEW route
app.get("/blogs/new", function(req, res){
   res.render("new");
});

//CREATE route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   //create blog
   Blog.create(req.body.blog, function(err, newBlog){
       if (err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   });
});

//SHOW route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog:foundBlog});
    }
    });
});

//edit route
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err){
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog:foundBlog});
       }
       });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       } else {
            res.redirect("/blogs/"+ req.params.id);
       }
   }); 
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
   //Detroy Blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if (err){
          res.redirect("/blogs");
       } else {
          res.redirect("/blogs");
       }
   });
});

// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog server has started!");
});