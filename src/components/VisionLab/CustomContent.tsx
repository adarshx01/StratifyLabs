'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function CustomContent() {
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [savedNotes, setSavedNotes] = useState([])

  const generateContent = async () => {
    // Simulate AI content generation
    setGeneratedContent(`This is a detailed explanation about ${topic}...`)
  }

  const saveNote = () => {
    setSavedNotes([...savedNotes, { topic, content: generatedContent }])
    setTopic('')
    setGeneratedContent('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Generate Custom Content</h3>
          <div className="space-y-4">
            <Input
              placeholder="Enter a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button 
              onClick={generateContent}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0]"
            >
              Generate Content
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Generated Content</h3>
            <Textarea 
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={10}
              className="mb-4"
            />
            <Button 
              onClick={saveNote}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0]"
            >
              Save Note
            </Button>
          </CardContent>
        </Card>
      )}

      {savedNotes.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Saved Notes</h3>
            <div className="space-y-4">
              {savedNotes.map((note, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{note.topic}</h4>
                    <p className="text-sm text-gray-600">{note.content.substring(0, 100)}...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

