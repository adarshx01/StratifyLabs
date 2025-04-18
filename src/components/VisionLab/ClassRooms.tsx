'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const classes = [
  { id: 1, name: "Class 1" },
  { id: 2, name: "Class 2" },
  { id: 3, name: "Class 3" },
  { id: 4, name: "Class 4" },
  { id: 5, name: "Class 5" },
  { id: 6, name: "Class 6" },
  { id: 7, name: "Class 7" },
  { id: 8, name: "Class 8" },
  { id: 9, name: "Class 9" },
  { id: 10, name: "Class 10" },
  { id: 11, name: "Class 11" },
  { id: 12, name: "Class 12" },
]

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Computer Science",
]

const theories = [
  "Classical Physics",
  "Quantum Mechanics",
  "Relativity",
  "Evolution",
  "Plate Tectonics",
  "Big Bang Theory",
]

export function ClassRooms() {
  const [selectedTab, setSelectedTab] = useState("classes")

  return (
    <div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="classes">Classes 1-12</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="theories">Theories</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTab === "classes" && classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{classItem.name}</h3>
              <Link href={`/classroom/${classItem.id}`}>
                <Button className="w-full bg-[#1a73e8] hover:bg-[#1557b0]">
                  Enter Classroom
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {selectedTab === "subjects" && subjects.map((subject, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{subject}</h3>
              <Button className="w-full bg-[#1a73e8] hover:bg-[#1557b0]">
                Explore Subject
              </Button>
            </CardContent>
          </Card>
        ))}

        {selectedTab === "theories" && theories.map((theory, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{theory}</h3>
              <Button className="w-full bg-[#1a73e8] hover:bg-[#1557b0]">
                Learn Theory
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

