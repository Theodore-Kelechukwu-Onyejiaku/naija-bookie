const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    message: []
})

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, unique: true},
    password: {type: String, required: true},
    about: {type: String},
    profilePicture: {type: String},
    fullName: {type: String},
    messages: MessageSchema,
})

UserSchema.virtual("url").get(()=>{
    return "/users/"+ this._id
})

module.exports = mongoose.model("User", UserSchema);