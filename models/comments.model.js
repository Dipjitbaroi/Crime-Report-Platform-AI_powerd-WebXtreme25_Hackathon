import mongoose from "mongoose";
import Crime_Posts from "./crime.model.js";
import Users from "./user.model.js";

const CommentSchema = new mongoose.Schema(
  {
    Crime_Posts_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Crime_Posts",
    },
    User_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    description: {
      type: String,
    },
    medias: [
      {
        type: {
          type: String,
          required: true,
          enum: ["photo", "video"],
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", CommentSchema);
export default Comments;
