var mongoose = require("mongoose");
const moment = require("moment");


var AuthorSchema = new mongoose.Schema({
    first_name : {type: String, required: true, max :100},
    family_name : {type : String, required: true, max : 100},
    date_of_birth : {type: Date},
    date_of_death : {type: Date}
})

//Virtual for author's full name(for me this is just a virtual to get full name of author)
AuthorSchema.virtual("name").get(function(){
//To avoid errors in cases where an author does not have either a family name or first name
//we want to make sure we handle the exception by returning an empty string for that case
    var fullname = "";
    if(this.first_name && this.family_name){
       return  fullname = this.family_name + "," + this.first_name
    }
    if(!this.firstname || !this.family_name){
       return  fullname = ""
    }

    return fullname;
});

//Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function(){
    //return this.date_of_death ? moment(this.date_of_death).format("YYYY") : "" +" - " +this.date_of_birth ? moment(this.date_of_birth).format("YYYY"): "";
    return this.date_of_birth ? moment(this.date_of_birth).format("YYYY") : ""
})

//Virtual for author's URL
AuthorSchema.virtual("url").get(function(){
    return "/catalog/author/" + this._id;
})

//Export model
module.exports = mongoose.model("Author", AuthorSchema);