import Comments from "../models/comments.model";

export const addComment = async (req, res) => {
  try {
    const { crimePostId, userId, description, medias } = req.body;
    const comment = new Comments({
      Crime_Posts_id: crimePostId,
      User_id: userId,
      description,
      medias,
    });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comments.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.status(200).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
