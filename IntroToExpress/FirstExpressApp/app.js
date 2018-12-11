var express = require("express");

var app = express();



// "/" => "Hi there!"
app.get("/", function(req, res){
    res.send("Hi there!");
});

// "/bye" => "Bye"
app.get("/bye", function(req, res){
    res.send("Bye!");    
});

// "/dog" => "Meow"
app.get("/dog", function(req, res){
   res.send("Meow!"); 
});

app.get("/r/:subredditName", function(req, res){
    var subreddit = req.params.subredditName
    res.send("Welcome to the " + subreddit + " subreddit!");
});

app.get("/r/:subredditName/comments/:id/:title/", function(req, res){
    res.send("Welcome to the comments section");
});

app.get("*", function(req, res){
   res.send("You are a star!"); 
});




// Tell express to listen for requests (start server)

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!")
});