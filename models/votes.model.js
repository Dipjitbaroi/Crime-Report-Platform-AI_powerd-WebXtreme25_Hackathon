import mongoose from "mongoose";
import Crime_Posts from "./crime.model.js";

const VoteSchema = new mongoose.Schema(
  {
    Crime_Posts_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Crime_Posts",
    },
    up_votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    down_votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

const Votes = mongoose.model("Votes", VoteSchema);
export default Votes;
