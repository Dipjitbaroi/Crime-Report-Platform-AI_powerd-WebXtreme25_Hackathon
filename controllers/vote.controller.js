import Votes from "../models/vote.model";

export const addVote = async (req, res) => {
  try {
    const { crimePostId, userId, voteType } = req.body;

    // Find the vote document related to the crime post
    let vote = await Votes.findOne({ Crime_Posts_id: crimePostId });
    if (!vote) {
      return res.status(404).json({ msg: "Crime post not found" });
    }

    // Check if user has already upvoted or downvoted
    const hasUpVoted = vote.up_votes.includes(userId);
    const hasDownVoted = vote.down_votes.includes(userId);

    if (hasUpVoted) {
      vote.up_votes = vote.up_votes.filter((id) => id.toString() !== userId);
    }
    if (hasDownVoted) {
      vote.down_votes = vote.down_votes.filter(
        (id) => id.toString() !== userId
      );
    }

    // Add the new vote
    if (voteType === "up_vote") {
      vote.up_votes.push(userId);
    } else if (voteType === "down_vote") {
      vote.down_votes.push(userId);
    }

    await vote.save();
    res.status(200).json({ msg: "Vote updated successfully", vote });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteVote = async (req, res) => {
  try {
    const { crimePostId, userId } = req.body;

    // Find the vote document related to the crime post
    let vote = await Votes.findOne({ Crime_Posts_id: crimePostId });
    if (!vote) {
      return res.status(404).json({ msg: "Crime post not found" });
    }

    // Remove user from up_votes and down_votes
    vote.up_votes = vote.up_votes.filter((id) => id.toString() !== userId);
    vote.down_votes = vote.down_votes.filter((id) => id.toString() !== userId);

    await vote.save();
    res.status(200).json({ msg: "Vote removed successfully", vote });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
