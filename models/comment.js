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
    whoCommented: { type: String },
    comment: { type: String },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);