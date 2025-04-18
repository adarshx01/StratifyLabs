import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const hindiLearningPrompt = `You are a Hindi language teacher. 
Your student asks you how to say something from English to Hindi.
You should respond with: 
- english: the English version ex: "Do you live in India?"
- hindi: the Hindi translation split into words ex: [{"word": "क्या", "reading": "kyā"}, ...]
- grammarBreakdown: an explanation of the grammar structure per sentence

Always respond with a JSON object with the following format: 
{
  "english": "",
  "hindi": [{
    "word": "",
    "reading": ""
  }],
  "grammarBreakdown": [{
    "english": "",
    "hindi": [{
      "word": "",
      "reading": ""
    }],
    "chunks": [{
      "hindi": [{
        "word": "",
        "reading": ""
      }],
      "meaning": "",
      "grammar": ""
    }]
  }]
}`;

const hindiToEnglishPrompt = `You are a Hindi to English translator.
Translate the given Hindi text to English.
Respond with a JSON object in the following format:
{
  "hindi": "Original Hindi text",
  "english": "English translation",
  "explanation": "Brief explanation of any idiomatic expressions or cultural context"
}`;

const normalChatPrompt = `You are a bilingual AI assistant capable of natural conversation in both English and Hindi.
You should:
- Understand and respond to the user's message naturally, whether they write in English or Hindi
- If the user writes in English, respond primarily in English with occasional Hindi phrases when contextually appropriate
- If the user writes in Hindi, respond primarily in Hindi with occasional English phrases when contextually appropriate
- Keep responses conversational and engaging
- Ask follow-up questions when appropriate to maintain the conversation flow
- Include cultural context when relevant

Your response should be a natural conversation, NOT a translation. Format your response as a JSON object:
{
  "text": "Your conversational response",
  "language": "The primary language of your response (English or Hindi)"
}`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const speech = url.searchParams.get("speech") || "formal";
  const question = url.searchParams.get("question") || "Hello";
  const mode = url.searchParams.get("mode") || "hindiLearning";
  const historyParam = url.searchParams.get("history");
  let history = [];
  
  if (historyParam) {
    try {
      history = JSON.parse(decodeURIComponent(historyParam));
    } catch (e) {
      console.error("Error parsing history:", e);
    }
  }

  let prompt = "";
  switch (mode) {
    case "hindiLearning":
      prompt = `${hindiLearningPrompt}\n\nHow to say "${question}" in Hindi in ${speech} speech?`;
      break;
    case "hindiToEnglish":
      prompt = `${hindiToEnglishPrompt}\n\nTranslate the following Hindi text to English: "${question}"`;
      break;
    case "normalChat":
      prompt = `${normalChatPrompt}\n\nUser: ${question}`;
      // Add history if available
      if (history && history.length > 0) {
        prompt = `${normalChatPrompt}\n\nConversation history:\n${history.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')}\n\nUser: ${question}`;
      }
      break;
    default:
      prompt = `${hindiLearningPrompt}\n\nHow to say "${question}" in Hindi in ${speech} speech?`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response - handle potential parsing errors
    try {
      // Try to extract JSON from the response if necessary
      let jsonText = text;
      // Check if the text contains a JSON structure within other text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      const jsonResponse = JSON.parse(jsonText);
      
      return new Response(JSON.stringify(jsonResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      // If can't parse JSON, return the raw text wrapped in a JSON structure
      return new Response(JSON.stringify({ 
        text: text,
        error: "Failed to parse response as JSON"
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred while processing your request',
      details: error.message || "Unknown error" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}