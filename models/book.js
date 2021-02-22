var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var moment = require("moment");


var BookSchema = new Schema({
    title :{ type: String, required : true },
    author : {type: Schema.Types.ObjectId, ref: "Author"},
    picture: {type: String, required: true},
    summary : {type : String, require: true},
    genre : [{type: Schema.Types.ObjectId, ref : "Genre"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    whoCreated: {type: Schema.Types.ObjectId, ref: "User"},
    reason: {type: String, required: true},
    like: [{type: Schema.Types.ObjectId, ref: "User"}]
}, {
    timestamps: true
})

//Virtual for Book's URL
BookSchema.virtual("url").get(function(){
    return "/catalog/book/" + this._id;
});

BookSchema.virtual("dateCreated").get(function(){
    return moment(this.createdAt).format("MMMM Do, YYYY");
})

//Export Model
module.exports = mongoose.model("Book", BookSchema);