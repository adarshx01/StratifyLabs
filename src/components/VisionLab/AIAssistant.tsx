'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Save, Brain, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface GeminiResponse {
  theory: string[];
  relatedTopics: string[];
  formulas: string[];
  relatedLinks: string[];
  relatedImageLinks: string[];
  summary: string[];
  relatedVideoLinks: string[];
  readAlso: string[];
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LoadingStates {
  theory: boolean;
  media: boolean;
  related: boolean;
  summary: boolean;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    theory: false,
    media: false,
    related: false,
    summary: false
  })
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Log initial component mount
  useEffect(() => {
    console.log('AIAssistant component mounted');
  }, []);

  // Log whenever geminiResponse changes
  useEffect(() => {
    if (geminiResponse) {
      console.log('Gemini Response Updated:', geminiResponse);
    }
  }, [geminiResponse]);

  const fetchPartialData = async (query: string, type: string) => {
    console.log(`Fetching ${type} data for query: "${query}"`);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, type }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`${type} data retrieved:`, data);
      return data
    } catch (err) {
      console.error(`Error fetching ${type}:`, err)
      return { [type]: ["NO DATA"] }
    }
  }

  const fetchAllData = async (query: string) => {
    console.log('Starting fetchAllData for query:', query);
    setLoading(true)
    setError(null)
    let completeResponse: GeminiResponse = {
      theory: [],
      relatedTopics: [],
      formulas: [],
      relatedLinks: [],
      relatedImageLinks: [],
      summary: [],
      relatedVideoLinks: [],
      readAlso: []
    }

    try {
      const fetchOperations = [
        { type: 'theory', key: 'theory' },
        { type: 'media', key: 'media' },
        { type: 'related', key: 'related' },
        { type: 'summary', key: 'summary' }
      ]

      for (const { type, key } of fetchOperations) {
        console.log(`Starting fetch operation for ${key}`);
        setLoadingStates(prev => ({ ...prev, [key]: true }))
        const data = await fetchPartialData(query, type)
        setLoadingStates(prev => ({ ...prev, [key]: false }))
        completeResponse = { ...completeResponse, ...data }
        console.log(`Updated completeResponse after ${key} fetch:`, completeResponse);
      }

      return completeResponse
    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError('Some content failed to load. Please try refreshing.')
      return null
    } finally {
      setLoading(false)
      console.log('fetchAllData completed');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with input:', input);
    if (!input.trim()) return

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'user' as const
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setQuiz([])
    setQuizSubmitted(false)
    setSelectedAnswers({})

    const response = await fetchAllData(input)
    console.log('Final response from fetchAllData:', response);
    
    if (response) {
      setGeminiResponse(response)
      generateQuiz(response)

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Here's what I found about "${input}"`,
        sender: 'ai'
      }])
    }
  }

  const generateQuiz = (response: GeminiResponse) => {
    console.log('Generating quiz from response:', response);
    const questions: QuizQuestion[] = []
    const theory = response.theory.filter(t => t !== "NO DATA")
    
    if (theory.length > 0) {
      theory.forEach((item, index) => {
        if (index < 5) {
          questions.push({
            question: `What concept is being described: "${item.substring(0, 100)}..."?`,
            options: [
              item,
              response.relatedTopics[index] || "Alternative concept",
              "None of the above",
              "All of the above"
            ],
            correctAnswer: 0
          })
        }
      })
    }
    
    console.log('Generated quiz questions:', questions);
    setQuiz(questions)
  }

  const saveNote = () => {
    if (!currentNote.trim()) return
    
    const newNote: Note = {
      id: Date.now().toString(),
      content: currentNote,
      timestamp: Date.now()
    }
    
    console.log('Saving new note:', newNote);
    setNotes(prev => [...prev, newNote])
    setCurrentNote('')
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    console.log(`Selected answer: Question ${questionIndex}, Option ${optionIndex}`);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
  }

  const handleQuizSubmit = () => {
    console.log('Quiz submitted with answers:', selectedAnswers);
    setQuizSubmitted(true)
  }

  const renderContent = (items: string[]) => {
    console.log('Rendering content items:', items);
    if (!items?.length || (items.length === 1 && items[0] === "NO DATA")) {
      return <p className="text-gray-500 italic">No data available</p>
    }

    return (
      <ul className="list-disc pl-5 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    )
  }

  // Fixed renderMedia function to properly handle images
  const renderMedia = (urls: string[], isVideo: boolean = false) => {
    console.log(`Rendering ${isVideo ? 'videos' : 'images'}:`, urls);
    if (!urls?.length || (urls.length === 1 && urls[0] === "NO DATA")) {
      return <p className="text-gray-500 italic">No media available</p>
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {urls.map((url, index) => {
          // Log each URL being processed
          console.log(`Processing ${isVideo ? 'video' : 'image'} URL:`, url);
          
          return (
            <div key={index} className="relative h-40">
              {isVideo ? (
                <iframe
                  className="w-full h-full rounded-md"
                  src={`https://www.youtube.com/embed/${url.split('v=')[1] || url}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // For images, use a regular img tag instead of Next.js Image component
                // to handle external URLs without domain configuration
                <div className="relative h-full w-full">
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="object-cover rounded-md w-full h-full"
                    onError={(e) => {
                      console.error(`Error loading image: ${url}`);
                      e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                      e.currentTarget.onerror = null; // Prevent infinite error loop
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const renderLoadingSpinner = (type: keyof LoadingStates) => {
    if (!loadingStates[type]) return null;
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Ask me anything about your studies! I'm here to help.
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {geminiResponse && (
          <Card className="mb-4 max-h-[400px] overflow-y-auto">
            <CardContent className="p-4">
              <Tabs defaultValue="theory" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="theory">Theory</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="related">Related</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="theory" className="space-y-4">
                  {renderLoadingSpinner('theory')}
                  <div>
                    <h3 className="font-bold mb-2">Theory</h3>
                    {renderContent(geminiResponse.theory)}
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Formulas</h3>
                    {renderContent(geminiResponse.formulas)}
                  </div>
                </TabsContent>

                <TabsContent value="media">
                  {renderLoadingSpinner('media')}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-2">Images</h3>
                      {renderMedia(geminiResponse.relatedImageLinks)}
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Videos</h3>
                      {renderMedia(geminiResponse.relatedVideoLinks, true)}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="related">
                  {renderLoadingSpinner('related')}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-2">Related Topics</h3>
                      {renderContent(geminiResponse.relatedTopics)}
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Related Links</h3>
                      {renderContent(geminiResponse.relatedLinks)}
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Read Also</h3>
                      {renderContent(geminiResponse.readAlso)}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="summary">
                  {renderLoadingSpinner('summary')}
                  <h3 className="font-bold mb-2">Summary</h3>
                  {renderContent(geminiResponse.summary)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question..."
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-4">
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Take notes here..."
                rows={3}
              />
              <Button 
                onClick={saveNote} 
                disabled={!currentNote.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" /> Save Note
              </Button>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-100 p-3 rounded">
                    <p className="mb-1">{note.content}</p>
                    <small className="text-gray-500">
                      {new Date(note.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            {quiz.length > 0 ? (
              <div className="space-y-4">
                {quiz.map((q, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded">
                    <p className="font-bold mb-2">{q.question}</p>
                    {q.options.map((option, optionIndex) => (
                      <label 
                        key={optionIndex} 
                        className={`flex items-center space-x-2 p-2 hover:bg-gray-200 rounded cursor-pointer ${
                          quizSubmitted && optionIndex === q.correctAnswer ? 'bg-green-200' : ''
                        } ${
                          quizSubmitted && selectedAnswers[index] === optionIndex && optionIndex !== q.correctAnswer ? 'bg-red-200' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          className="form-radio"
                          checked={selectedAnswers[index] === optionIndex}
                          onChange={() => handleAnswerSelect(index, optionIndex)}
                          disabled={quizSubmitted}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    {quizSubmitted && (
                      <div className={`mt-2 p-2 rounded ${
                        selectedAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedAnswers[index] === q.correctAnswer 
                          ? '✓ Correct!' 
                          : `✗ Incorrect. The correct answer was: ${q.options[q.correctAnswer]}`}
                      </div>
                    )}
                  </div>
                ))}
                <Button 
                  onClick={handleQuizSubmit}
                  disabled={quizSubmitted || Object.keys(selectedAnswers).length !== quiz.length}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Brain className="w-4 h-4 mr-2" /> Check Answers
                </Button>
                {quizSubmitted && (
                  <div className="text-center mt-4">
                    <p className="font-bold">Quiz Results</p>
                    <p>
                      Score: {Object.entries(selectedAnswers).filter(([index, answer]) => 
                        answer === quiz[parseInt(index)].correctAnswer
                      ).length} / {quiz.length}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No quiz available. Ask a question first to generate a quiz.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}