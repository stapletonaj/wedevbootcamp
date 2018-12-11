var mongoose = require("mongoose")

//Post Model - title, content

var postSchema = new mongoose.Schema({
    title: String,
    content: String,
});
//var Post = mongoose.model("Post", postSchema);
// must say what we are exporting:
module.exports = mongoose.model("Post", postSchema);