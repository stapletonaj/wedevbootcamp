//using the express router

var express         = require("express");
var router          = express.Router({mergeParams:true});
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");


//=======================================================================
//Comments routing
//=======================================================================

router.get("/new", isLoggedIn, function(req, res){
    //findcampgroundby id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:foundCampground});
        }
    });
});

// Comments create
router.post("/", isLoggedIn, function(req, res){
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


// is Logged in -- middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;