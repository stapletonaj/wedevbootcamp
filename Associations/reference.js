var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo_2");

var Post = require("./models/post");
var User = require("./models/user");

Post.create({
    title: "Fuck yeah! Part four",
    content: "fdsgsdfgsdfgsdfghdh sh srgh sgth afderg !"
}, function(err, post){
    User.findOne({name: "Bob"}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            foundUser.posts.push(post);
            foundUser.save(function(err, data){
                if (err){
                    console.log(err);
                } else {
                    console.log(data);
                }
            })
        }
    })
}
);

//how do we find the user and then the posts for that user?

User.findOne({email:"bob@gmail.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});