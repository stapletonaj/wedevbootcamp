// Things we need ===========================================================
var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    localStratagy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user.js");
    

var app = express();
// This line is a new way of requiring and using at the same time. ^ must have 'var app' before this!
app.use(require("express-session")({
    secret: "Sofie is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

//App settings etc ===========================================================
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/auth_demo_app");
app.use(bodyParser.urlencoded({extended:true}));


//we need these lines anytime we use passport:
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES ====================================================================
app.get("/", function(req, res){
    res.render("home");
});

//this is where the middleware is used!
app.get("/secret", isLoggedIn, function(req, res){
   res.render("secret"); 
});

// Auth Routes === ================================================================================
// show sign up form---
app.get("/register", function(req, res){
   res.render("register");
});

//handle user signup
app.post("/register", function(req, res){
    //must have body parder installed for this bit!
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    
    });
});

// Login Routes
// Render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
//middleware - they sit between the beginning and end of the route...
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    //empty for the time being
});

//log out
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        res.locals.login = req.isAuthenticated();
        return next();
    }
    res.redirect('/login');
}




// Start server ==========================================================
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server started........");
});