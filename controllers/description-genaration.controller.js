import { callDescriptionGen } from "../utils/callOpenAI.js";

export const generateDescription = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await callDescriptionGen(prompt);
    res.status(200).json({ description: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
