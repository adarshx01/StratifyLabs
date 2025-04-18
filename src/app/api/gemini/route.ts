import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

const getPromptForType = (query: string, type: string) => {
  const prompts = {
    theory: `
      Provide educational theory and formulas about: "${query}"
      Return in this exact JSON format:
      {
        "theory": ["detailed point 1", "detailed point 2", ...],
        "formulas": ["formula 1 with explanation", "formula 2 with explanation", ...]
      }
      Ensure each array has at least 3-5 detailed items. If no information is available, include "NO DATA" in the array.
    `,
    media: `
      Provide video links strictly from the google search result or Search(not from other website): "${query}"
      Return in this exact JSON format:
      {
        "relatedImageLinks": [just image keyword],
        "relatedVideoLinks": ["youtube_url1", "youtube_url2", ...]
      }
      For images, provide single topic to search for.
      For videos, provide actual YouTube Search video URLs.
      Include 3-5 links for each. If none available, include "NO DATA" in the array.
    `,
    related: `
      Provide related topics, links, and additional reading about: "${query}"
      Return in this exact JSON format:
      {
        "relatedTopics": ["topic1 with brief explanation", "topic2 with brief explanation", ...],
        "relatedLinks": ["educational_url1", "educational_url2", ...],
        "readAlso": ["related concept 1", "related concept 2", ...]
      }
      Include 3-5 items for each array. If none available, include "NO DATA" in the array.
    `,
    summary: `
      Provide a comprehensive summary about: "${query}"
      Return in this exact JSON format:
      {
        "summary": ["main point 1", "main point 2", "main point 3", ...]
      }
      Include 3-5 detailed summary points. If no information available, include "NO DATA" in the array.
    `
  }
  
  return prompts[type as keyof typeof prompts] || prompts.theory
}

async function retryWithBackoff(operation: () => Promise<any>, maxRetries: number = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      const delay = Math.min(1000 * Math.pow(2, i), 4000) // Max 4 second delay
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export async function POST(req: Request) {
  try {
    const { query, type = 'theory' } = await req.json()
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = getPromptForType(query, type)
    
    const operation = async () => {
      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()
      
      // Add logging to see the raw response
      console.log('Raw Gemini response:', text);
      
      // Extract JSON using regex like in your flashcards route
      const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, throw error
      throw new Error("No valid JSON found in response");
    }

    try {
      const parsedResponse = await retryWithBackoff(operation)
      console.log('Gemini response:', parsedResponse)
      return NextResponse.json(parsedResponse)
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError)
      // Return a valid fallback response
      const fallbackResponse = {
        [type]: ["NO DATA"],
        ...(type === 'theory' && { formulas: ["NO DATA"] }),
        ...(type === 'media' && { relatedImageLinks: ["NO DATA"], relatedVideoLinks: ["NO DATA"] }),
        ...(type === 'related' && { relatedTopics: ["NO DATA"], relatedLinks: ["NO DATA"], readAlso: ["NO DATA"] }),
      }
      return NextResponse.json(fallbackResponse)
    }
  } catch (error) {
    console.error('Error in Gemini API:', error)
    // Return a valid fallback response
    const fallbackResponse = {
      [type]: ["NO DATA"]
    }
    return NextResponse.json(fallbackResponse)
  }
}