var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo");

//Post Model - title, content

var postSchema = new mongoose.Schema({
    title: String,
    content: String,
});
var Post = mongoose.model("Post", postSchema);

//User Model- email, name

var userSchema= new mongoose.Schema({
    user: String,
    email: String,
    posts: [postSchema] //MUST connect with the Schema NOT the model - confucting but justthe way it is!
});
var User = mongoose.model("User", userSchema);


// var newUser = new User ({
//     user: "Hermine",
//     email: "hermine.gramger@gmail.com"
// });

User.findOne({user: "Hermine"}, function(err, user){
    if (err){
        console.log(err);
    } else {
        user.posts.push({
            title: "three things I've done in my life",
            content: "Poo, eat, wee"
        });
        //pushing the post into user doesn't save it so we have to do this:
        user.save(function(err, user){
            if (err){
                console.log(err);
            } else {
                console.log(user);
            }
        });
    }
});

// newUser.posts.push({
//       title: "how to be a wizard",
//       content: "Go to hogwarts and be the best."
//     });

// newUser.save(function(err, user){
//     if (err){
//         console.log(err);
//     } else {
//         console.log(err, user);
//     }
// });

// var newPost = new Post({
//     title: "Reflections on apples",
//     content: "They are delicious"
// })

// newPost.save(function(err, post){
//     if (err){
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// })