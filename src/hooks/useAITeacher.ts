import { create } from "zustand";

export const teachers = ["Swara","Dhruv"] as const;

type ConversationMode = "hindiLearning" | "hindiToEnglish" | "normalChat";

interface AITeacherState {
  messages: any[];
  currentMessage: any;
  loading: boolean;
  teacher: typeof teachers[number];
  speech: "formal" | "casual";
  english: boolean;
  transliteration: boolean;
  classroom: "default" | "alternative";
  conversationMode: ConversationMode;
  speakNormalChat: boolean; // New setting for normal chat speaking
  askAI: (question: string) => Promise<void>;
  playMessage: (message: any) => Promise<void>;
  setTeacher: (teacher: typeof teachers[number]) => void;
  setSpeech: (speech: "formal" | "casual") => void;
  setEnglish: (english: boolean) => void;
  setTransliteration: (transliteration: boolean) => void;
  setClassroom: (classroom: "default" | "alternative") => void;
  setConversationMode: (mode: ConversationMode) => void;
  setSpeakNormalChat: (speak: boolean) => void; // Setter for the new setting
}

export const useAITeacher = create<AITeacherState>((set, get) => ({
  messages: [],
  currentMessage: null,
  loading: false,
  teacher: "Swara",
  speech: "formal",
  english: true,
  transliteration: true,
  classroom: "default",
  conversationMode: "hindiLearning",
  speakNormalChat: false, // Default to false
  
  askAI: async (question) => {
    set({ loading: true });
    try {
      // Include history for context in normal chat mode
      let apiUrl = `/api/ai?question=${encodeURIComponent(question)}&speech=${get().speech}&mode=${get().conversationMode}`;
      
      // For normal chat, include conversation history
      if (get().conversationMode === "normalChat" && get().messages.length > 0) {
        // Get last few messages for context (limit to prevent large requests)
        const history = get().messages.slice(-5).map(msg => ({
          role: msg.question ? "user" : "assistant",
          content: msg.question || msg.answer.text
        }));
        
        apiUrl += `&history=${encodeURIComponent(JSON.stringify(history))}`;
      }
      
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const message = { question, answer: data, speech: get().speech, mode: get().conversationMode };
      set((state) => ({ messages: [...state.messages, message] }));
      
      // Play audio based on the mode
      if (get().conversationMode === "hindiLearning" || 
          get().conversationMode === "hindiToEnglish" || 
          (get().conversationMode === "normalChat" && get().speakNormalChat)) {
        await get().playMessage(message);
      }
    } catch (error) {
      console.error("Error asking AI:", error);
    } finally {
      set({ loading: false });
    }
  },
  
  playMessage: async (message) => {
    set({ currentMessage: message });
    try {
      // Determine which text to use based on the conversation mode
      let textToSpeak = "";
      
      if (message.mode === "hindiLearning") {
        // For Hindi learning, speak the Hindi words
        if (message.answer.hindi && Array.isArray(message.answer.hindi)) {
          textToSpeak = message.answer.hindi.map((w: any) => w.word).join("");
        } else {
          console.error("Invalid hindi data structure:", message.answer.hindi);
          textToSpeak = message.answer.text || "";
        }
      } else if (message.mode === "hindiToEnglish") {
        // For Hindi-to-English mode, speak the original Hindi input
        textToSpeak = message.question;
      } else if (message.mode === "normalChat") {
        // For normal chat, speak the AI's response
        textToSpeak = message.answer.text || "";
      }
      
      if (!textToSpeak) {
        console.error("No text to speak!");
        set({ currentMessage: null });
        return;
      }
      
      const voice = get().teacher === "Swara" ? "gHu9GtaHOXcSqFTK06ux" : "zT03pEAEi0VHKciJODfn";
      
      const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_090a5e984b5b32f7c79260fe9cbaeb45ff66717b5ed6b286'
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 1,
            similarity_boost: 0.9,
            style: 0.4,
            use_speaker_boost: true
          }
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`HTTP error! status: ${res.status}`, errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const arrayBuffer = await res.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        console.error("Received empty audio data");
        throw new Error("Empty audio data received");
      }
      
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
        
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      const delayTime = 0.4; // Delay in seconds
      
      setTimeout(() => {
        source.start();
      }, delayTime * 1000); 
      
      source.onended = () => {
        set({ currentMessage: null });
      };
    } catch (error) {
      console.error("Error playing message:", error);
      set({ currentMessage: null });
    }
  },
  
  setTeacher: (teacher) => set({ teacher }),
  setSpeech: (speech) => set({ speech }),
  setEnglish: (english) => set({ english }),
  setTransliteration: (transliteration) => set({ transliteration }),
  setClassroom: (classroom) => set({ classroom }),
  setConversationMode: (mode) => set({ conversationMode: mode }),
  setSpeakNormalChat: (speak) => set({ speakNormalChat: speak })
}));