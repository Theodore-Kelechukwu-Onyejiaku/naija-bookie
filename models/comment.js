const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const replySchema = new Schema(
  {
    whoReplied: { type: Schema.Types.ObjectId, ref: "User" },
    reply: { type: String },
  },
  {
    timestamps: true,
  }
);
replySchema.virtual("date").get(function(){
  return moment(replySchema.createdAt).format("MMMM Do, YYYY");
});

const commentSchema = new Schema(
  {
    whoCommented: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String },
    replies: [replySchema],
    like: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {
    timestamps: true,
  }
);


commentSchema.virtual("date").get(function(){
  return moment(this.createdAt).format("MMMM Do, YYYY");
});



module.exports = mongoose.model("Comment", commentSchema);