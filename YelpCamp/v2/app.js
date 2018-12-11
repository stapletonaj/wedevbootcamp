//require express and other things and excecute it with "app"
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

//connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp");

//mongoose SCHEMA setup
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

//This is the most confusing line when using mongoose...
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill", 
//     image:"http://www.photosforclass.com/download/flickr-3694344957",
//     description: "This is a huge campsite. No bathrooms but lovely trees to poo on!"
//     }, function(err, campground){
//             if (err){
//             console.log(err);
//             }   else {
//                 console.log("Newly created campground");
//                 console.log(campground);
//                 }
//         });

//removed the hardcoded campgrounds and added to database in v2
// var campgrounds = [
//         {name: "Salmon Creek", image:"http://www.photosforclass.com/download/flickr-5641024448"},
//         {name: "Granite Hill", image:"http://www.photosforclass.com/download/flickr-3694344957"},
//         {name: "Mountaingoats Rest", image:"http://www.photosforclass.com/download/flickr-7121859753"},
//         {name: "Salmon Creek", image:"http://www.photosforclass.com/download/flickr-5641024448"},
//         {name: "Granite Hill", image:"http://www.photosforclass.com/download/flickr-3694344957"},
//         {name: "Mountaingoats Rest", image:"http://www.photosforclass.com/download/flickr-7121859753"}
// ];

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
 
app.get("/", function(req, res){
    res.render("landing");
});

//RESTful - INDEX, show all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from database
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds})
        }
    });
    //res.render("campgrounds", {campgrounds:campgrounds});
});

//RESTful - CREATE, add a new campground to DB
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err)
        } else  {
                //redirect to campgrounds page
                res.redirect("/campgrounds");
                 }
    })
    
});

//RESTful - NEW, page that gets data for a NEW campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//RESTful - SHOW, page that shows data about one particluare campgound (/campgrounds/:id)

app.get("/campgrounds/:id", function(req, res){
    //find the campground with a provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
       if (err){
           console.log(err);
       }    else {
               //render the show template and pass through the campground ID to that page.
               res.render("show", {campground: foundCampground});
            }
    });
});


// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});