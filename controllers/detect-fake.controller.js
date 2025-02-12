import { detectFakeReport } from "../utils/callOpenAI.js";

export async function fakedetection(req, res) {
  const { description, image } = req.body;
  try {
    const detectfakeCrimePost = await detectFakeReport(description, image);
    res.json({
      score: detectfakeCrimePost,
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
