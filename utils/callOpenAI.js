import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openAiclient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callDescriptionGen(prompt) {
  try {
    const response = await openAiclient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Provide a detailed description of the image, focusing only on visible elements, objects, and the setting. Avoid any interpretation, intent analysis, or emotional assumptions. The description should be clear, objective, and factual. It must be written in plain text with no formatting, markdown, or HTML. The length should be between 100 and 300 words.",
            },
            {
              type: "image_url",
              image_url: {
                url: prompt, // Replace with actual image URL
              },
            },
          ],
        },
      ],
      model: "gpt-4o",
    });

    const messageContent = response.choices[0]?.message?.content;
    return messageContent ? messageContent.trim() : "";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
