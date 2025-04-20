"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, Cpu, Activity, Layers, Navigation, Grid } from "lucide-react"
import SciFiCamera from "@/components/TestCamera/page"

const INFERENCE_TASKS = [
  {
    id: "classification",
    label: "Classification",
    description: "Classify images into predefined categories",
    icon: <Activity className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "detection",
    label: "Object Detection",
    description: "Detect and localize objects in images",
    icon: <Navigation className="w-5 h-5 text-green-500" />,
  },
  {
    id: "obstacle-detection",
    label: "Obstacle Detection",
    description: "Identify obstacles for navigation systems",
    icon: <Grid className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: "urdf-simulation",
    label: "URDF Simulation",
    description: "Simulate robot models with URDF",
    icon: <Cpu className="w-5 h-5 text-purple-500" />,
  },
  {
    id: "segmentation",
    label: "Segmentation",
    description: "Pixel-level classification of image regions",
    icon: <Layers className="w-5 h-5 text-red-500" />,
  },
]

export default function InferencePage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Inference</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Inference Task</h2>
        <RadioGroup value={selectedTask || ""} onValueChange={setSelectedTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INFERENCE_TASKS.map((task) => (
            <div key={task.id}>
              <RadioGroupItem
                value={task.id}
                id={task.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={task.id}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="mb-2 rounded-full bg-muted p-2">{task.icon}</div>
                <h3 className="font-medium">{task.label}</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">{task.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedTask && (
        <Card className="mt-8">
          <CardContent className="p-6">
            {selectedTask === "segmentation" ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Image Segmentation</h2>
                <p className="text-gray-500 mb-4">Live feed with segmentation visualization</p>
                <SciFiCamera />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h2 className="text-2xl font-semibold mb-4">{INFERENCE_TASKS.find(t => t.id === selectedTask)?.label}</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  This functionality is available in the VisionLab environment.
                </p>
                <Link href="/visionlab">
                  <Button className="flex items-center gap-2">
                    Go to VisionLab
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}