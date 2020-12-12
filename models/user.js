const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    message: []
})

const UserSchema = new Schema({
    fullName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    about: {type: String, about: true},
    stories: [],
    messages: MessageSchema,
})

UserSchema.virtual("url").get(()=>{
    return "/users/"+ this._id
})

module.exports = mongoose.model("User", UserSchema);