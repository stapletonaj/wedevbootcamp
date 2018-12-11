//using the express router

var express         = require("express");
var router          = express.Router();
var Campground      = require("../models/campground");
var middleware      = require("../middleware");

//RESTful - INDEX, show all campgrounds
router.get("/", function(req, res){
    //console.log(req.user);
    //Get all campgrounds from database
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
    //res.render("campgrounds", {campgrounds:campgrounds});
});

//RESTful - CREATE, add a new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username,
        };
    var newCampground = {name: name, image: image, description: description, author:author};
    
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else  {
                //redirect to campgrounds page
                res.redirect("/campgrounds");
                 }
    });
    
});

//RESTful - NEW, page that gets data for a NEW campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//RESTful - SHOW, page that shows data about one particluare campgound (/campgrounds/:id)

router.get("/:id", function(req, res){
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

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function (err, foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground}); 
    });  
});



//Update campground route

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if (err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});


// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
        res.redirect("/campgrounds");
        }
    });
});



module.exports = router;