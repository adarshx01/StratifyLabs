const { GoogleGenerativeAI } = require("@google/generative-ai");
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const customWord = "[STRICTLY DO NO ANSWER IRRELEVANT TOPICS OTHER THAN COMPLAINTS, PROBLEMS ,etc, and YOU WILL BE ASKING MAXIMUM OF 2-3 QUESTION AT A TIME TILL THE END OF THE CONVERSATION ]You are a immediate, quick Cyber crime complaint registerer  asking very specific of questions(not all question at once) deeply to the topic/problem, ask short and relevant questions , step by step follow up questions from the person. e.g.- what has happened to her , what are the troubles you are facing. Based on the situation acting as a Instant police complaint registerer , ask specific and minimum length  , questions , asking full issues and problem , then at last ask user whether to create Case complaint, if yes ask name , address , phone number, [STRICTLY ask questions until you have all information] if YES then only create report and don't create thank you message, instead full summary of the report as the victim/user has given, with whole information in braces([detail_info_type_1]:{information_details_1},[detail_info_type_2]:{information_details_2},....,[report]:{summary_report})";

// In-memory conversation storage (for simplicity; consider a better approach in production)
let conversation: string[] = [];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Add user message to conversation memory
    conversation.push(message);

    // Combine system prompt and conversation history
    const fullPrompt = `${customWord}\n\nConversation history:\n${conversation.join('\n')}\n\nUser: ${message}`;

    // Generate response using Gemini
    const result = await model.generateContent(fullPrompt);
    const assistantMessage = result.response.text();

    // Add assistant's response to conversation memory
    conversation.push(assistantMessage);

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}