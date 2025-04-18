import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const { currentMessage } = useAITeacher();
  const english = useAITeacher((state) => state.english);
  const transliteration = useAITeacher((state) => state.transliteration);
  const classroom = useAITeacher((state) => state.classroom);
  const conversationMode = useAITeacher((state) => state.conversationMode);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  const renderEnglish = (englishText: string) => (
    <>
      {english && (
        <p className="text-4xl inline-block px-2 rounded-sm font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
          {englishText}
        </p>
      )}
    </>
  );

  const renderHindi = (hindi: { word: string; reading?: string }[]) => (
    <p className="text-white font-bold text-4xl mt-2 font-hindi flex flex-wrap gap-1">
      {hindi.map((word, i) => (
        <span key={i} className="flex flex-col justify-end items-center">
          {transliteration && word.reading && (
            <span className="text-2xl text-white/65">{word.reading}</span>
          )}
          {word.word}
        </span>
      ))}
    </p>
  );

  const renderMessage = (message: any) => {
    switch (message.mode) {
      case "hindiLearning":
        return (
          <>
            <div className="flex items-center gap-3">
              <span
                className={`text-white/90 text-2xl font-bold uppercase px-3 py-1 rounded-full  ${
                  message.speech === "formal"
                    ? "bg-indigo-600"
                    : "bg-teal-600"
                }`}
              >
                {message.speech}
              </span>
              {renderEnglish(message.answer.english)}
            </div>
            {renderHindi(message.answer.hindi)}
            <div className="p-5 mt-5 bg-gradient-to-br from-pink-200/20 to-pink-500/20 rounded-xl">
              <span className="pr-4 italic bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/70 text-3xl font-bold uppercase inline-block">
                Grammar Breakdown
              </span>
              {message.answer.grammarBreakdown.map((grammar: any, i: number) => (
                <div key={i} className="mt-3">
                  {message.answer.grammarBreakdown.length > 1 && (
                    <>
                      {renderEnglish(grammar.english)}
                      {renderHindi(grammar.hindi)}
                    </>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3 items-end">
                    {grammar.chunks.map((chunk: any, i: number) => (
                      <div key={i} className="p-2 bg-black/30 rounded-md">
                        <p className="text-white/90 text-4xl font-hindi">
                          {renderHindi(chunk.hindi)}
                        </p>
                        <p className="text-pink-300/90 text-2xl">
                          {chunk.meaning}
                        </p>
                        <p className="text-blue-400/90 text-2xl">
                          {chunk.grammar}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case "hindiToEnglish":
        return (
          <>
            <p className="text-white font-bold text-4xl mt-2 font-hindi">
              {message.answer.hindi}
            </p>
            <p className="text-4xl mt-2 bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
              {message.answer.english}
            </p>
            {message.answer.explanation && (
              <p className="text-white/80 text-xl mt-2 italic">
                {message.answer.explanation}
              </p>
            )}
          </>
        );
      case "normalChat":
        return (
          <>
            <p className={`text-4xl mt-2 ${message.answer.language === "Hindi" ? "font-hindi" : ""}`}>
              {message.answer.text}
            </p>
            {message.answer.language === "Hindi" && english && (
              <p className="text-4xl mt-2 bg-clip-text text-transparent bg-gradient-to-br from-blue-300/90 to-white/90">
                {message.englishTranslation}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${
        classroom === "default"
          ? "w-[1288px] h-[676px]"
          : "w-[2528px] h-[856px]"
      } p-8 overflow-y-auto flex flex-col space-y-8  opacity-80  bg-white/60 backdrop-blur-md rounded-3xl`}
      ref={container}
    >
      {messages.length === 0 && (
        <div className="h-full w-full grid place-content-center text-center">
          <h4 className="text-6xl font-bold text-black italic">
            VisionLab
            <br />
            Virtual testing environment</h4>
          <h2 className="text-5xl font-bold mt-8 font-hindi text-red-600/90 italic">
            {/* विज़नलैब */}
            {/* <br /> */}
            वर्चुअल परीक्षण परिवेश
          </h2>
        </div>
      )}
      {messages.map((message, i) => (
        <div key={i} className="bg-black/30 p-6 rounded-xl">
          <div className="flex justify-between items-start">
            <div className="flex-grow">{renderMessage(message)}</div>
            {(message.mode === "hindiLearning" || 
              (message.mode === "normalChat" && message.answer.language === "Hindi")) && (
              currentMessage === message ? (
                <button
                  className="text-white/65"
                  onClick={() => playMessage(message)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-white/65"
                  onClick={() => playMessage(message)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                    />
                  </svg>
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};