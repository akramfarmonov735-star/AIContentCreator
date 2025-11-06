import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateScript(topic: string): Promise<Array<{ id: number; text: string }>> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create a short video script for social media (Instagram Reels/TikTok) about: "${topic}"

Requirements:
- Create 4-5 scenes (each 15-25 words)
- Each scene should be engaging and visual
- Write in a conversational, energetic style
- Keep total length under 60 seconds when spoken
- Focus on practical, actionable content

Format your response as a JSON array:
[
  {"id": 1, "text": "Scene 1 text here..."},
  {"id": 2, "text": "Scene 2 text here..."},
  ...
]

Only return the JSON array, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const scenes = JSON.parse(cleanText);
    
    if (!Array.isArray(scenes) || scenes.length === 0) {
      throw new Error("Invalid script format: expected an array of scenes");
    }
    
    for (const scene of scenes) {
      if (!scene.id || typeof scene.id !== 'number' || !scene.text || typeof scene.text !== 'string') {
        throw new Error("Invalid scene format: each scene must have an id (number) and text (string)");
      }
    }
    
    return scenes;
  } catch (error: any) {
    console.error("Gemini script generation error:", error);
    
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API key. Please check your Gemini API key configuration.");
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error("API quota exceeded. Please try again later or check your Gemini API quota.");
    }
    
    if (error instanceof SyntaxError) {
      throw new Error("AI returned an invalid response format. Please try again with a different topic.");
    }
    
    throw new Error(error.message || "Failed to generate script. Please try again.");
  }
}

export async function generateImagePrompt(sceneText: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create a detailed image description for this video scene: "${sceneText}"

Requirements:
- Describe a realistic, high-quality photo
- Be specific about composition, lighting, and mood
- Keep it under 100 words
- Make it suitable for stock image search

Only return the image description, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
