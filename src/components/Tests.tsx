'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "English", "History", "Geography", "Economics", "Psychology"
]

const difficultyLevels = ["Easy", "Medium", "Hard", "Mixed"]

export function Tests() {
  const [testParams, setTestParams] = useState({
    topic: '',
    subject: '',
    content: '',
    questionCount: 10,
    difficulty: 'Medium',
    timeLimit: 30,
    includeEssay: false
  })
  const [generatedTest, setGeneratedTest] = useState(null)
  const [savedTests, setSavedTests] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTestParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setTestParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name, value) => {
    setTestParams(prev => ({ ...prev, [name]: value[0] }))
  }

  const handleSwitchChange = (name, checked) => {
    setTestParams(prev => ({ ...prev, [name]: checked }))
  }

  const generateTest = async () => {
    // Simulate AI test generation
    setGeneratedTest({
      ...testParams,
      questions: Array(testParams.questionCount).fill(null).map((_, index) => ({
        id: index + 1,
        question: `Sample question ${index + 1} for ${testParams.topic} (${testParams.difficulty})`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: Math.floor(Math.random() * 4)
      })),
      essay: testParams.includeEssay ? `Write an essay about ${testParams.topic}` : null
    })
  }

  const saveTest = () => {
    setSavedTests([...savedTests, generatedTest])
    setGeneratedTest(null)
    setTestParams({
      topic: '',
      subject: '',
      content: '',
      questionCount: 10,
      difficulty: 'Medium',
      timeLimit: 30,
      includeEssay: false
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold mb-6">Generate Test</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="Enter the main topic for the test"
                value={testParams.topic}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select name="subject" value={testParams.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Additional Content (optional)</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Paste text or describe additional content for the test"
                value={testParams.content}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Number of Questions: {testParams.questionCount}</Label>
              <Slider
                min={5}
                max={50}
                step={1}
                value={[testParams.questionCount]}
                onValueChange={(value) => handleSliderChange("questionCount", value)}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select name="difficulty" value={testParams.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Limit (minutes): {testParams.timeLimit}</Label>
              <Slider
                min={5}
                max={180}
                step={5}
                value={[testParams.timeLimit]}
                onValueChange={(value) => handleSliderChange("timeLimit", value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="includeEssay"
                checked={testParams.includeEssay}
                onCheckedChange={(checked) => handleSwitchChange("includeEssay", checked)}
              />
              <Label htmlFor="includeEssay">Include Essay Question</Label>
            </div>
            <Button 
              onClick={generateTest}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0]"
            >
              Generate Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedTest && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-6">Generated Test: {generatedTest.topic}</h3>
            <div className="space-y-4">
              <p><strong>Subject:</strong> {generatedTest.subject}</p>
              <p><strong>Difficulty:</strong> {generatedTest.difficulty}</p>
              <p><strong>Time Limit:</strong> {generatedTest.timeLimit} minutes</p>
              <p><strong>Total Questions:</strong> {generatedTest.questions.length}</p>
              <div className="space-y-6">
                {generatedTest.questions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-semibold">{q.id}. {q.question}</p>
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="radio" id={`q${q.id}-o${index}`} name={`question-${q.id}`} />
                        <label htmlFor={`q${q.id}-o${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                ))}
                {generatedTest.essay && (
                  <div className="space-y-2">
                    <p className="font-semibold">Essay Question:</p>
                    <p>{generatedTest.essay}</p>
                    <Textarea rows={6} placeholder="Write your essay here..." />
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={saveTest}
              className="w-full mt-6 bg-[#1a73e8] hover:bg-[#1557b0]"
            >
              Save Test
            </Button>
          </CardContent>
        </Card>
      )}

      {savedTests.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-6">Saved Tests</h3>
            <div className="space-y-4">
              {savedTests.map((test, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{test.topic}</h4>
                    <p className="text-sm text-gray-600">Subject: {test.subject}</p>
                    <p className="text-sm text-gray-600">Questions: {test.questions.length}</p>
                    <p className="text-sm text-gray-600">Difficulty: {test.difficulty}</p>
                    <p className="text-sm text-gray-600">Time Limit: {test.timeLimit} minutes</p>
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

