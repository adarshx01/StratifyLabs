'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

const courses = [
  {
    id: 1,
    title: "Mathematics",
    image: "/images/courses/math3.jpg",
    description: "Master mathematical concepts from basic arithmetic to advanced calculus"
  },
  {
    id: 2,
    title: "Physics",
    image: "/images/courses/phy3.jpg",
    description: "Explore the fundamental laws that govern the universe"
  },
  {
    id: 3,
    title: "Chemistry",
    image: "/images/courses/chem2.jpg",
    description: "Learn about matter, its properties, and transformations"
  },
  {
    id: 4,
    title: "Biology",
    image: "/images/courses/bio3.jpg",
    description: "Discover the science of life and living organisms"
  },
  {
    id: 5,
    title: "Computer Science",
    image: "/images/courses/cs2.jpg",
    description: "Learn programming, algorithms, and computational thinking"
  },
  {
    id: 6,
    title: "English",
    image: "/images/courses/eng.jpg",
    description: "Develop your language and communication skills"
  }
]

export function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null)

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
  }

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={() => setSelectedCourse(null)}
          variant="outline"
          className="mb-4"
        >
          ← Back to Courses
        </Button>
        <h2 className="text-2xl font-bold mb-4">{selectedCourse.title} - Select Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <Card key={level} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{level}</h3>
                <p className="text-gray-600 mb-4">
                  {level === 'Beginner' && 'Start your learning journey with fundamental concepts'}
                  {level === 'Intermediate' && 'Build upon your basic knowledge with more complex topics'}
                  {level === 'Advanced' && 'Master advanced concepts and specialized topics'}
                </p>
                <Button 
                  className="w-full bg-[#1a73e8] hover:bg-[#1557b0]"
                  onClick={() => window.location.href = `/education/${selectedCourse.title}/${level.toLowerCase()}`}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCourseClick(course)}
        >
          <CardContent className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <Button className="w-full bg-[#1a73e8] hover:bg-[#1557b0]">
                View Course
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

