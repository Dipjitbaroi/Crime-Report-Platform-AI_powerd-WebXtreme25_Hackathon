import mongoose from "mongoose";
import Crime_Posts from "./crime.model.js";

const MediaSchema = new mongoose.Schema(
  {
    Crime_Posts_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Crime_Posts",
    },
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
  { timestamps: true }
);

const Medias = mongoose.model("Medias", MediaSchema);
export default Medias;
