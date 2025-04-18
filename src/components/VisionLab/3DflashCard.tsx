"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, PlusCircle, Save } from "lucide-react"
import { initializeApp } from "firebase/app"
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp
} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKVQ-3S48-PNhPQVWdEoOaCBI4qbPdddA",
  authDomain: "inkrit-3ebcf.firebaseapp.com",
  databaseURL: "https://inkrit-3ebcf-default-rtdb.firebaseio.com",
  projectId: "inkrit-3ebcf",
  storageBucket: "inkrit-3ebcf.appspot.com",
  messagingSenderId: "440105175644",
  appId: "1:440105175644:web:d2c8a63530207a38e67499",
  measurementId: "G-5S36EFQKVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface FlashcardData {
  content: string
  color: string
}

interface FlashcardSet {
  id?: string
  topic: string
  cards: FlashcardData[]
  createdAt?: any
}

interface FlashcardProps {
  content: string
  color: string
  number: number
  total: number
}

const Flashcard: React.FC<FlashcardProps> = ({ content, color, number, total }) => {
  return (
    <Card className="w-96 h-full relative overflow-hidden shadow-lg">
      <CardContent
        className="flex items-center justify-center h-full p-6 text-center rounded-lg shadow-md transform transition-all"
        style={{ backgroundColor: color }}
      >
        <motion.div
          className="text-2xl font-semibold"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
        <div className="absolute bottom-2 right-2 text-sm opacity-50">
          {number} / {total}
        </div>
      </CardContent>
    </Card>
  )
}

export default function FlashcardDeck3D() {
  const [topic, setTopic] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [flashcardData, setFlashcardData] = useState<FlashcardData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedSets, setSavedSets] = useState<FlashcardSet[]>([])
  
  const colors = [
    "hsl(210, 100%, 97%)", "hsl(180, 100%, 97%)", 
    "hsl(150, 100%, 97%)", "hsl(120, 100%, 97%)",
    "hsl(90, 100%, 97%)", "hsl(60, 100%, 97%)",
    "hsl(30, 100%, 97%)", "hsl(0, 100%, 97%)"
  ]
  
  useEffect(() => {
    fetchSavedFlashcardSets()
  }, [])
  
  const fetchSavedFlashcardSets = async () => {
    try {
      const q = query(collection(db, "flashcardSets"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      const sets: FlashcardSet[] = []
      querySnapshot.forEach((doc) => {
        sets.push({ id: doc.id, ...doc.data() } as FlashcardSet)
      })
      
      setSavedSets(sets)
    } catch (error) {
      console.error("Error fetching flashcard sets:", error)
    }
  }
  
  const generateFlashcards = async () => {
    if (!topic.trim()) return
    
    setIsLoading(true)
    try {
      // Use the api route instead of direct API call
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic })
      })
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.cards && Array.isArray(data.cards)) {
        // Process the cards from our API
        const cards = data.cards.map((content: string, index: number) => ({
          content,
          color: colors[index % colors.length]
        }))
        
        setFlashcardData(cards)
        setCurrentIndex(0)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error generating flashcards:", error)
      // Fallback to dummy data if API fails
      const dummyData = [
        { content: `What is ${topic}?`, color: colors[0] },
        { content: `Explain ${topic} in simple terms.`, color: colors[1] },
        { content: `Key concepts of ${topic}:`, color: colors[2] },
        { content: `Why is ${topic} important?`, color: colors[3] },
      ]
      setFlashcardData(dummyData)
      setCurrentIndex(0)
    } finally {
      setIsLoading(false)
    }
  }
  
  const saveFlashcardSet = async () => {
    if (flashcardData.length === 0 || !topic.trim()) return
    
    try {
      // Add a new document to the "flashcardSets" collection
      await addDoc(collection(db, "flashcardSets"), {
        topic,
        cards: flashcardData,
        createdAt: serverTimestamp()
      })
      
      // Refresh the saved sets list
      await fetchSavedFlashcardSets()
      
      alert("Flashcard set saved successfully!")
    } catch (error) {
      console.error("Error saving flashcard set:", error)
      alert("Error saving flashcard set. Please try again.")
    }
  }
  
  const loadFlashcardSet = (set: FlashcardSet) => {
    setTopic(set.topic)
    setFlashcardData(set.cards)
    setCurrentIndex(0)
  }

  const pageFlipVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 120 : -120,
      rotateZ: direction > 0 ? 30 : -30,
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      rotateZ: 0,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 120 : -120,
      rotateZ: direction < 0 ? 30 : -30,
      x: direction < 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setDirection(-1)
    } else if (info.offset.x < -100 && currentIndex < flashcardData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setDirection(1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">3D Flashcard Generator</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g. Quantum Physics, French Revolution, JavaScript)"
            className="w-full"
          />
        </div>
        <Button 
          onClick={generateFlashcards} 
          disabled={isLoading || !topic.trim()}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </Button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Saved Flashcard Sets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedSets.map((set) => (
            <Card 
              key={set.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => loadFlashcardSet(set)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{set.topic}</div>
                <div className="text-sm text-gray-500">{set.cards.length} cards</div>
              </CardContent>
            </Card>
          ))}
          {savedSets.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-4">No saved flashcard sets yet.</p>
          )}
        </div>
      </div>
      
      {flashcardData.length > 0 && (
        <>
          <div className="relative w-full max-w-md mx-auto h-64 md:h-80 perspective-1000 mb-6">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={pageFlipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                className="w-full h-full absolute"
              >
                <Flashcard
                  content={flashcardData[currentIndex].content}
                  color={flashcardData[currentIndex].color}
                  number={currentIndex + 1}
                  total={flashcardData.length}
                />
              </motion.div>
            </AnimatePresence>
            
            <button
              onClick={() => {
                setDirection(-1)
                setCurrentIndex(Math.max(0, currentIndex - 1))
              }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10 transition"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => {
                setDirection(1)
                setCurrentIndex(Math.min(flashcardData.length - 1, currentIndex + 1))
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10 transition"
              disabled={currentIndex === flashcardData.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={saveFlashcardSet}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Flashcard Set
            </Button>
          </div>
        </>
      )}
    </div>
  )
}