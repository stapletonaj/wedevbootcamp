var express = require("express");
var app = express();
var bodyparser = require("body-parser");


app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));

var friends = ["Andy", "Kate", "Sofie", "Arnold", "Karen"];

app.get("/", function(req ,res){
   res.render('home'); 
});

app.get("/friends",function(req, res){
    res.render('friends', {friends:friends});
});

app.post("/addfriend", function(req, res){
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("/friends");
});


// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});