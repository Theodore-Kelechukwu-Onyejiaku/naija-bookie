let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let moment = require("moment");

var ChatSchema = new Schema({
    sender: {type: Schema.Types.ObjectId, ref : "User"},
    receiver: {type: Schema.Types.ObjectId, ref: "User"},
    chats : {type: String, required: true}
}, {
    timestamps: true
})

ChatSchema.virtual("time").get(function(){
    return this.createdAt
})

module.exports = mongoose.model("Chat", ChatSchema)