var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    comment: {type: String},
    replies: [{type: String}],
},
{
    timestamps: true
}
)

var BookSchema = new Schema({
    title :{ type: String, required : true },
    author : {type: Schema.Types.ObjectId, ref: "Author"},
    picture: {type: String, required: true},
    summary : {type : String, require: true},
    isbn: {type : String, required :true},
    genre : [{type: Schema.Types.ObjectId, ref : "Genre"}],
    comments: CommentSchema
})

//Virtual for Book's URL
BookSchema.virtual("url").get(function(){
    return "/catalog/book/" + this._id;
});

//Export Model
module.exports = mongoose.model("Book", BookSchema);