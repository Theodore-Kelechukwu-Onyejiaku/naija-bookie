var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name : {type : String, required: true, min : 3, max : 100}
})

//Creating a virtual for the url of the book instance
GenreSchema.virtual("url").get(function(){
    return "/catalog/genre" + this._id;
});

//Export the model
module.exports = mongoose.model("Genre", GenreSchema);