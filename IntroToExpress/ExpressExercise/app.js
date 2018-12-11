var express = require("express");

var app = express();

//Visiting / should print Hi there, welcome to my assignment!

app.get("/", function(req, res){
   res.send("Hi there, welcome to my assignment!"); 
});

//Visiting "/speak/pig" should print the pig says Oink!
app.get("/speak/:animal", function(req, res){
   var sounds = {
       pig: "Oink",
       cow: "Moo",
       dog: "Woof Woof",
       cat: "I hate you, human",
       goldfish: "...",
   };
   var animal = req.params.animal.toLowerCase();
   var noise = animal[sounds];
//   function noiseMaker (animal){
//       if(req.params.animal == "pig"){
//           noise = "'Oink'";
//       } else if(req.params.animal == "cow"){
//           noise = "'Moo'";
//       } else if(req.params.animal == "dog"){
//           noise = "'Woof Woof'";
//       } 
       
//   }
//   noiseMaker();
   res.send("The " + animal + " says " + noise + "!");
});

//visiting /repeat/:phrase/:num should print :phrase * num

app.get("/repeat/:phrase/:num", function(req, res){
    var phrase = req.params.phrase + " ";
    var num = req.params.num;
    
   res.send(phrase.repeat(num));
   
});


// Tell Servers to start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});

//star page

app.get("*", function (req, res){
    res.send("Sorry, page not found...What are you doing with your life?")
})