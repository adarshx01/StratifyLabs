import { useAITeacher } from "@/hooks/useAITeacher";
import { useState, useEffect, useRef } from "react";

// Define the SpeechRecognition type
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const messages = useAITeacher((state) => state.messages);
  const currentMessage = useAITeacher((state) => state.currentMessage);
  const conversationMode = useAITeacher((state) => state.conversationMode);
  const setConversationMode = useAITeacher(
    (state) => state.setConversationMode
  );
  const teacher = useAITeacher((state) => state.teacher);
  const setTeacher = useAITeacher((state) => state.setTeacher);
  const speakNormalChat = useAITeacher((state) => state.speakNormalChat);
  const setSpeakNormalChat = useAITeacher((state) => state.setSpeakNormalChat);
  const [question, setQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New state for voice recording status
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check browser support for SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      // Set language based on conversation mode
      if (conversationMode === "hindiToEnglish") {
        recognitionRef.current.lang = "hi-IN"; // Hindi
      } else {
        recognitionRef.current.lang = "en-US"; // English default
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsRecording(false);
      };
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Update recognition language when conversation mode changes
  useEffect(() => {
    if (recognitionRef.current) {
      if (conversationMode === "hindiToEnglish") {
        recognitionRef.current.lang = "hi-IN"; // Hindi
      } else {
        recognitionRef.current.lang = "en-US"; // English
      }
    }
  }, [conversationMode]);

  const startVoiceInput = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const ask = () => {
    if (question.trim() === "") return;
    askAI(question);
    setQuestion("");
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentMessage]);

  return (
    <div className="z-9999 max-w-[600px] flex flex-col h-full mx-auto mr-2 bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      {/* Mode selection */}
      <div className="mb-4">
        <h2 className="text-white font-bold text-xl">
          Choose your conversation mode:
        </h2>
        <div className="flex space-x-4 mt-2">
          <button
            className={`px-4 py-2 rounded-full ${
              conversationMode === "hindiLearning"
                ? "bg-indigo-600 text-white"
                : "bg-white/20 text-white/80"
            }`}
            onClick={() => setConversationMode("hindiLearning")}
          >
            Hindi Learning
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              conversationMode === "hindiToEnglish"
                ? "bg-indigo-600 text-white"
                : "bg-white/20 text-white/80"
            }`}
            onClick={() => setConversationMode("hindiToEnglish")}
          >
            Hindi to English
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              conversationMode === "normalChat"
                ? "bg-indigo-600 text-white"
                : "bg-white/20 text-white/80"
            }`}
            onClick={() => setConversationMode("normalChat")}
          >
            Normal Chat
          </button>
        </div>
      </div>

      {/* Teacher and Voice Options */}
      <div className="mb-4 flex justify-between">
        {/* <div>
          <h3 className="text-white font-bold">Teacher:</h3>
          <div className="flex space-x-2 mt-1">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                teacher === "Swara"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/20 text-white/80"
              }`}
              onClick={() => setTeacher("Swara")}
            >
              Swara
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                teacher === "Dhruv"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/20 text-white/80"
              }`}
              onClick={() => setTeacher("Dhruv")}
            >
              Dhruv
            </button>
          </div>
        </div> */}

        {/* Speech toggle for normal chat */}
        {conversationMode === "normalChat" && (
          <div>
            <h3 className="text-white font-bold">Speech:</h3>
            <div className="flex items-center mt-1">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={speakNormalChat}
                  onChange={() => setSpeakNormalChat(!speakNormalChat)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-2 text-sm text-white">
                  {speakNormalChat ? "On" : "Off"}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Chat display */}
      {/* <div className="flex-grow overflow-y-auto mb-4 bg-slate-800/40 rounded-xl p-4">
        {messages.length === 0 ? (
          <div className="text-white/50 text-center h-full flex items-center justify-center">
            <p>
              {conversationMode === "hindiLearning"
                ? "Start by typing a sentence you want to learn in Hindi"
                : conversationMode === "hindiToEnglish"
                ? "Type a Hindi sentence to get an English translation"
                : "Begin your conversation in Hindi or English"}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-4"> */}
              {/* User message */}
              {/* <div className="flex justify-end mb-2">
                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                  <p>{msg.question}</p>
                </div>
              </div> */}

              {/* AI response */}
              {/* <div className="flex justify-start">
                <div className="bg-slate-700/80 text-white p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                  {msg.mode === "hindiLearning" ? (
                    <div>
                      <p className="font-bold">
                        {msg.answer.hindi.map((w: any) => w.word).join("")}
                      </p>
                      {msg.answer.transliteration && (
                        <p className="text-blue-300">
                          {msg.answer.transliteration}
                        </p>
                      )}
                      {msg.answer.english && (
                        <p className="text-gray-300 mt-1">
                          {msg.answer.english}
                        </p>
                      )}
                    </div>
                  ) : msg.mode === "hindiToEnglish" ? (
                    <div>
                      <p>{msg.answer.text}</p>
                      {msg.answer.notes && (
                        <p className="text-gray-300 mt-1 text-sm">
                          {msg.answer.notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>{msg.answer.text}</p>
                  )}

                  {currentMessage && currentMessage === msg && (
                    <div className="mt-2 flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150 mr-1"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>  */}

      {/* Input area */}
      <div>
        <div className="text-white/65 mb-2">
          {conversationMode === "hindiLearning"
            ? "Type or speak a sentence you want to say in Hindi."
            : conversationMode === "hindiToEnglish"
            ? "Type or speak a Hindi sentence to translate to English."
            : "Type or speak your message in Hindi or English."}
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
          </div>
        ) : (
          <div className="gap-3 flex">
            <input
              className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
              placeholder={
                conversationMode === "hindiLearning"
                  ? "Have you ever been to India?"
                  : conversationMode === "hindiToEnglish"
                  ? "क्या आप भारत गए हैं?"
                  : "Type your message..."
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  ask();
                }
              }}
            />

            {/* Microphone button for voice input */}
            <button
              className={`p-2 rounded-full ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-slate-100/20 text-white hover:bg-indigo-600"
              } transition-colors flex items-center justify-center w-12 h-12`}
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              disabled={loading}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isRecording ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
            </button>

            <button
              className="bg-slate-100/20 p-2 px-6 rounded-full text-white hover:bg-indigo-600 transition-colors"
              onClick={ask}
              disabled={loading || question.trim() === ""}
            >
              Ask
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
