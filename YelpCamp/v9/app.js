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


// Requiring Routes!
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seedDB();
//connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v8");
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

// Express Router!!!
//the first argument in these appends the string to the font to help clean up the code
//also have to go and remove it from the routes...
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});