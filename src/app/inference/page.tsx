"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowRight, Cpu, Activity, Layers, Navigation, Grid, Info, Check } from "lucide-react"
import SciFiCamera from "@/components/TestCamera/page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const INFERENCE_TASKS = [
  {
    id: "classification",
    label: "Classification",
    description: "Classify images into predefined categories",
    icon: <Activity className="w-5 h-5 text-blue-500" />,
    features: ["Single and multi-label classification", "Confidence scores", "Real-time prediction"],
    useCase: "Identify objects, scenes, or content types in images"
  },
  {
    id: "detection",
    label: "Object Detection",
    description: "Detect and localize objects in images",
    icon: <Navigation className="w-5 h-5 text-green-500" />,
    features: ["Bounding box prediction", "Multiple object detection", "Object counting"],
    useCase: "Locate and identify multiple objects within a single image"
  },
  {
    id: "obstacle-detection",
    label: "Obstacle Detection",
    description: "Identify obstacles for navigation systems",
    icon: <Grid className="w-5 h-5 text-yellow-500" />,
    features: ["Distance estimation", "Hazard identification", "Traversability analysis"],
    useCase: "Enable robots to navigate safely by detecting and avoiding obstacles"
  },
  {
    id: "urdf-simulation",
    label: "URDF Simulation",
    description: "Simulate robot models with URDF",
    icon: <Cpu className="w-5 h-5 text-purple-500" />,
    features: ["Physics-based simulation", "Joint manipulation", "Sensor simulation"],
    useCase: "Test robot behaviors and algorithms in a virtual environment"
  },
  {
    id: "segmentation",
    label: "Segmentation",
    description: "Pixel-level classification of image regions",
    icon: <Layers className="w-5 h-5 text-red-500" />,
    features: ["Instance segmentation", "Semantic segmentation", "Panoptic segmentation"],
    useCase: "Precisely outline and classify different regions within images"
  },
]

export default function InferencePage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("visual")

  const selectedTaskData = INFERENCE_TASKS.find(task => task.id === selectedTask)

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inference Center</h1>
          <p className="text-muted-foreground mt-1">Run AI models on visual inputs in real-time</p>
        </div>
        <Link href="/visionlab">
          <Button variant="outline" className="flex items-center gap-2">
            Advanced VisionLab
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      
      <Separator className="my-6" />
      
      <Card className="mb-8 border-none shadow-sm bg-gradient-to-br from-slate-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Select Inference Task
          </CardTitle>
          <CardDescription>
            Choose the type of visual AI processing to run on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="visual">Visual Selection</TabsTrigger>
              {/* <TabsTrigger value="list">List View</TabsTrigger> */}
            </TabsList>
            
            <TabsContent value="visual">
              <RadioGroup 
                value={selectedTask || ""} 
                onValueChange={setSelectedTask} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {INFERENCE_TASKS.map((task) => (
                  <div key={task.id}>
                    <RadioGroupItem
                      value={task.id}
                      id={`visual-${task.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`visual-${task.id}`}
                      className="flex flex-col h-full rounded-xl border-2 border-muted bg-card p-6 hover:bg-accent/5 hover:border-accent/40 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 [&:has([data-state=checked])]:border-blue-500 [&:has([data-state=checked])]:bg-blue-50 dark:[&:has([data-state=checked])]:bg-blue-950/20 cursor-pointer transition-all"
                    >
                      <div className="mb-3 rounded-full bg-muted/70 p-2.5 w-12 h-12 flex items-center justify-center">
                        {task.icon}
                      </div>
                      <h3 className="font-medium text-lg">{task.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5">{task.description}</p>
                      
                      {selectedTask === task.id && (
                        <Badge variant="secondary" className="mt-4 w-fit bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          <Check className="w-3.5 h-3.5 mr-1" /> Selected
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="space-y-2">
                {INFERENCE_TASKS.map((task) => (
                  <div 
                    key={task.id}
                    className={`p-4 border rounded-lg cursor-pointer flex items-start gap-4 transition-colors ${selectedTask === task.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-accent/5'}`}
                    onClick={() => setSelectedTask(task.id)}
                  >
                    <div className="rounded-full bg-muted/70 p-2 flex items-center justify-center">
                      {task.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{task.label}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <RadioGroupItem
                      value={task.id}
                      checked={selectedTask === task.id}
                      id={`list-${task.id}`}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTask && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task details panel */}
          <Card className="lg:col-span-1 border-none shadow-sm bg-gradient-to-br from-slate-50 to-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {selectedTaskData?.icon}
                {selectedTaskData?.label}
              </CardTitle>
              <CardDescription>{selectedTaskData?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Features</h3>
                  <ul className="space-y-1">
                    {selectedTaskData?.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Use Case</h3>
                  <p className="text-sm">{selectedTaskData?.useCase}</p>
                </div>

                <Button className="w-full mt-4" variant="default">
                  Start Processing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview panel */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardContent className="p-0">
              {selectedTask === "segmentation" ? (
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Live Segmentation</h2>
                      <p className="text-muted-foreground">Real-time feed with segmentation mask</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Live Demo</Badge>
                  </div>
                  <div className="rounded-lg overflow-hidden border bg-background">
                    <SciFiCamera />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground">Processing at 24 FPS</div>
                    <Button variant="outline" size="sm">
                      Adjust Settings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="bg-slate-100 p-4 rounded-full mb-6">
                    {selectedTaskData?.icon && <div className="w-12 h-12">{selectedTaskData?.icon}</div>}
                  </div>
                  <h2 className="text-2xl font-semibold mb-3">{selectedTaskData?.label} Demo</h2>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    This advanced functionality is available in the VisionLab environment with expanded features and customization options.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/visionlab">
                      <Button className="flex items-center gap-2">
                        Open in VisionLab
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedTask && (
        <Card className="mt-8 bg-muted/30 border-dashed border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Select a Task to Begin</h2>
            <p className="text-muted-foreground max-w-md">
              Choose one of the inference tasks above to start processing visual data with AI.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}