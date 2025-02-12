import mongoose from "mongoose";
import Crime_Posts from "./crime.model";
import Users from "./user.model";

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
      type: Text,
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
