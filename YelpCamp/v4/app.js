//require express and other things and excecute it with "app"
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");


seedDB();
//connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v4");
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
            res.render("campgrounds/index", {campgrounds:allCampgrounds})
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
    res.render("campgrounds/new");
});

//RESTful - SHOW, page that shows data about one particluare campgound (/campgrounds/:id)

app.get("/campgrounds/:id", function(req, res){
    //find the campground with a provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err){
           console.log(err);
       }    else {
               //console.log(foundCampground);
               //render the show template and pass through the campground ID to that page.
               res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

//=======================================================================
//Comments routing
//=======================================================================

app.get("/campgrounds/:id/comments/new", function(req, res){
    //findcampgroundby id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:foundCampground});
        }
    });
});


app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //reditect to campground/:id
});

// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});