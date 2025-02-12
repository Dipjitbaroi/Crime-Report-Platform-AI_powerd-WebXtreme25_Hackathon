import Crime_Posts from "../models/crime.model.js";

export const createCrimePost = async (req, res) => {
  try {
    const crimePost = new Crime_Posts(req.body);
    const savedCrimePost = await crimePost.save();
    res.status(201).json(savedCrimePost);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getAllCrimePosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit of 10
    const skip = (page - 1) * limit;

    const crimePosts = await Crime_Posts.find()
      .populate("medias")
      .populate("votes")
      .skip(skip)
      .limit(limit);

    const totalCrimePosts = await Crime_Posts.countDocuments();
    const totalPages = Math.ceil(totalCrimePosts / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalCrimePosts,
      crimePosts,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCrimePostById = async (req, res) => {
  try {
    const crimePost = await Crime_Posts.findById(req.params.id)
      .populate("user_id")
      .populate("medias")
      .populate("votes");
    if (!crimePost) {
      return res.status(404).json({ msg: "Crime post not found" });
    }
    res.status(200).json(crimePost);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCrimePost = async (req, res) => {
  try {
    const updatedCrimePost = await Crime_Posts.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCrimePost) {
      return res.status(404).json({ msg: "Crime post not found" });
    }
    res.status(200).json(updatedCrimePost);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteCrimePost = async (req, res) => {
  try {
    const deletedCrimePost = await Crime_Posts.findByIdAndDelete(req.params.id);
    if (!deletedCrimePost) {
      return res.status(404).json({ msg: "Crime post not found" });
    }
    res.status(200).json({ msg: "Crime post deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
