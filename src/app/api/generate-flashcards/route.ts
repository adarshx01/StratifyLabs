// File: app/api/generate-flashcards/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate 8 flashcards about "${topic}". Each flashcard should contain a question, concept, or term related to ${topic}. Make the content educational, factual, and diverse. Return your response as a JSON array of strings where each string is the content for one flashcard.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to parse the response as JSON
    try {
      // Find the JSON in the response if it's surrounded by markdown or other text
      const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (Array.isArray(parsed)) {
          // If array of objects with content property
          if (typeof parsed[0] === 'object') {
            const cards = parsed.map(item => 
              item.content || item.question || item.text || JSON.stringify(item)
            );
            return NextResponse.json({ cards });
          }
          // If array of strings
          else if (typeof parsed[0] === 'string') {
            return NextResponse.json({ cards: parsed });
          }
        }
      }
      
      // If JSON parsing failed or unexpected format, fall back to text processing
      throw new Error("Invalid JSON format");
    } catch (jsonError) {
      // Fall back to processing plain text
      const lines = text
        .split(/\n\n|\n/)
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, ''))
        .slice(0, 8);
      
      return NextResponse.json({ cards: lines });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Return fallback cards
    return NextResponse.json({ 
      cards: [
        `What is ${req.body?.topic || "this topic"}?`,
        `Explain ${req.body?.topic || "this topic"} in simple terms.`,
        `Key concepts of ${req.body?.topic || "this topic"}:`,
        `Why is ${req.body?.topic || "this topic"} important?`
      ]
    });
  }
}