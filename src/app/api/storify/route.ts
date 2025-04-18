import { NextRequest, NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// RapidAPI key
const RAPID_API_KEY = "e2727e979emshf414c3e7f7ce4b9p1076d1jsn4ef1e1f55a8a";

/**
 * Get image description from RapidAPI using file upload
 */
async function getImageDescriptionFromBase64(base64Image: string) {
  const url = 'https://ai-api-photo-description.p.rapidapi.com/description-from-file';
  
  // Convert base64 to blob
  const fetchResponse = await fetch(base64Image);
  const blob = await fetchResponse.blob();
  
  // Create form data
  const formData = new FormData();
  formData.append('image', blob, 'image.png');
  
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': 'ai-api-photo-description.p.rapidapi.com'
    },
    body: formData
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Image description API error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.caption || "A mysterious and magical image";
  } catch (error) {
    console.error("Error calling RapidAPI:", error);
    throw error;
  }
}

async function generateStoryFromDescription(description: string) {
    const prompt = `Create a short, imaginative story based on this image description: "${description}". Make it creative ,engaging and suitable for young children.Add suitable emojis after every few instances and keep it in the word count of 140-160`;
    const result = await model.generateContent(prompt);
    const storyText = result.response.text();
    return storyText;
  }


export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { prompt, image } = await request.json();
    
    // Validate inputs
    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }
    
    const description = await getImageDescriptionFromBase64(image);
    
    const storyText = `${description}`;
    
    let response = await generateStoryFromDescription(description)

    return NextResponse.json({ 
      text: response,
      imageDescription: storyText
    });
    
    
  } catch (error) {
    // Log the error and return a proper error response
    console.error("Error in Storify API:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 }
    );
  }
}