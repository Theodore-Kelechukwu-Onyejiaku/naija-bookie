var moment = require("moment");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema({
    book: {type:Schema.Types.ObjectId, ref : "Book", required: true}, //Reference to the associated book
    imprint: {type : String, required : true},
    status: {type: String, required: true, enum : ["Available", "Maintenance", "Loaned", "Reserved"], default: "Maintenance"},
    due_back: {type: Date, default: Date.now}
})

//Virtual for Book Instance's url
BookInstanceSchema.virtual("url").get(function(){
    return "/catalog/bookinstance/" + this._id;
})

BookInstanceSchema.virtual("due_date_formatted").get(function(){
    return moment(this.due_back).format("MMMM Do, YYYY")
})

//Export the model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);