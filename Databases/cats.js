var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("cat", catSchema);

//add new cat to database

var george = new Cat({
    name: "Mrs Norris",
    age: 7,
    temperament: "Evil"
});

//call back function in save tells us if it was sucessful
// george.save(function(err, cat){
//     if (err){
//         console.log("SOMETHING WENT WRONG!");
//     }   else {
//         console.log("We've saved a cat to the database");
//         console.log(cat);
//         }
// });

//retreive all cats 

Cat.find({}, function(err, cats){
    if (err){
        console.log("Oh no there was an error");
        console.log(err);
    }   else {
        console.log("All the cats...");
        console.log(cats);
        }
});

//create is new and save all together
Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "So lovely"
}, function(err, cat){
    if (err){
        console.log(err);
    }   else{
        console.log(cat);
    } 
}
);