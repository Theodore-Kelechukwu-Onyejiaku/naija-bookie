const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    whoReplied: { type: String },
    reply: { type: String },
  },
  {
    timestamps: true,
  }
);

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

module.exports = mongoose.model("Comment", commentSchema);