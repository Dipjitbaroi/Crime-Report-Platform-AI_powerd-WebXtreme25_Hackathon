import mongoose from "mongoose";
import Medias from "./media.model.js";
import Votes from "./votes.model.js";
import Users from "./user.model.js";

const CrimePostSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    medias: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medias",
      },
    ],
    address: [
      {
        division: { type: String, required: true },
        district: { type: String, required: true },
        details: { type: String },
      },
    ],
    crime_time: {
      type: Date,
      required: true,
    },
    votes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Votes",
    },
    verified_score: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Crime_Posts = mongoose.model("Crime_Posts", CrimePostSchema);
export default Crime_Posts;
