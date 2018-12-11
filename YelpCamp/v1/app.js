//require express and excecute it with "app"
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
        {name: "Salmon Creek", image:"http://www.photosforclass.com/download/flickr-5641024448"},
        {name: "Granite Hill", image:"http://www.photosforclass.com/download/flickr-3694344957"},
        {name: "Mountaingoats Rest", image:"http://www.photosforclass.com/download/flickr-7121859753"},ls
        
        {name: "Salmon Creek", image:"http://www.photosforclass.com/download/flickr-5641024448"},
        {name: "Granite Hill", image:"http://www.photosforclass.com/download/flickr-3694344957"},
        {name: "Mountaingoats Rest", image:"http://www.photosforclass.com/download/flickr-7121859753"}
];

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
 
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image =req.body.image;
    var newCampground = {name: name, image:image};
    campgrounds.push(newCampground);
    //redirect to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});