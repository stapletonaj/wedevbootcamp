//require express and other things and excecute it with "app"
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    passport        = require('passport'),
    localStratagy   = require("passport-local"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");


seedDB();
//connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
 
// Passport configuration
app.use(require("express-session")({
    secret: "oij ijgr oijg dfgoij sgdg sg sfg sdfg po",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is how you can send user data through to every page in an easy way ==============!!!!
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    //need this to more to the next part:
    next();
});

// Routes =======================

app.get("/", function(req, res){
    res.render("landing");
});

//RESTful - INDEX, show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //findcampgroundby id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:foundCampground});
        }
    });
});


app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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


// Authentication Routes ==================================
app.get("/register", function(req, res){
   res.render("register");
});

//handle signup logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            //we use return because it gets us out of this entire callback
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
}),

// handling log-in logic
//uses passport middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
}), function(req, res){
    //empty
});

//logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}


// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});