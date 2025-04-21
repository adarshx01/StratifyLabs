// @ts-nocheck
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Star,
  Download,
  Eye,
  Share2,
  BookOpen,
  Database,
  Cpu,
  Code,
  FileText,
  BarChart4,
  ImageIcon,
  Tag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for the project
const getProjectData = (id: string) => {
  const projects = {
    "1": {
      id: 1,
      title: "Urban Object Detection",
      description:
        "A comprehensive dataset and model for detecting and classifying urban objects like vehicles, pedestrians, traffic signs, and infrastructure elements in city environments. Ideal for autonomous driving, urban planning, and smart city applications.",
      image: "/placeholder.svg?height=500&width=800",
      category: "Object Detection",
      stars: 245,
      downloads: 1.2,
      views: 5.6,
      creator: {
        name: "Urban AI Lab",
        avatar: "/placeholder.svg?height=40&width=40",
        organization: "City Tech Institute",
      },
      lastUpdated: "2023-11-15",
      license: "CC BY-NC-SA 4.0",
      tags: ["urban", "vehicles", "pedestrians", "traffic", "infrastructure", "autonomous-driving"],
      dataset: {
        size: "5.2 GB",
        images: 12500,
        annotations: 87300,
        classes: 28,
        splits: {
          train: 10000,
          validation: 1500,
          test: 1000,
        },
        formats: ["COCO", "YOLO", "Pascal VOC"],
      },
      models: [
        {
          name: "UrbanDetect-S",
          type: "YOLOv8s",
          accuracy: 89.5,
          size: "25 MB",
          inferenceTime: "5.2 ms",
        },
        {
          name: "UrbanDetect-M",
          type: "YOLOv8m",
          accuracy: 92.3,
          size: "85 MB",
          inferenceTime: "8.7 ms",
        },
        {
          name: "UrbanDetect-L",
          type: "YOLOv8l",
          accuracy: 94.8,
          size: "165 MB",
          inferenceTime: "12.5 ms",
        },
      ],
      sampleImages: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
    },
  }

  return projects[id as keyof typeof projects] || projects["1"]
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectData(params.id)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <Link
            href="/stratos"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge className="mb-2">{project.category}</Badge>
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {project.stars} stars
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {project.downloads}k downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views}k views
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="dataset">Dataset</TabsTrigger>
                    <TabsTrigger value="models">Models</TabsTrigger>
                    <TabsTrigger value="samples">Samples</TabsTrigger>
                    <TabsTrigger value="docs" className="hidden lg:inline-flex">
                      Documentation
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Description</h2>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-2 py-1">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Database className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Dataset Highlights</h3>
                          </div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Size:</span>
                              <span className="font-medium">{project.dataset.size}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Images:</span>
                              <span className="font-medium">{project.dataset.images.toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Annotations:</span>
                              <span className="font-medium">{project.dataset.annotations.toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Classes:</span>
                              <span className="font-medium">{project.dataset.classes}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Cpu className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Best Model Performance</h3>
                          </div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Model:</span>
                              <span className="font-medium">{project.models[2].name}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Accuracy:</span>
                              <span className="font-medium">{project.models[2].accuracy}%</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Size:</span>
                              <span className="font-medium">{project.models[2].size}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Inference Time:</span>
                              <span className="font-medium">{project.models[2].inferenceTime}</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="dataset" className="mt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Dataset Information</h2>
                        <Card>
                          <CardContent className="p-4 pt-6">
                            <ul className="space-y-3">
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Total Size:</span>
                                <span className="font-medium">{project.dataset.size}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Total Images:</span>
                                <span className="font-medium">{project.dataset.images.toLocaleString()}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Total Annotations:</span>
                                <span className="font-medium">{project.dataset.annotations.toLocaleString()}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Classes:</span>
                                <span className="font-medium">{project.dataset.classes}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">License:</span>
                                <span className="font-medium">{project.license}</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span className="font-medium">{project.lastUpdated}</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <h3 className="text-lg font-semibold mt-6 mb-3">Available Formats</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.dataset.formats.map((format) => (
                            <Badge key={format} variant="outline" className="px-3 py-1">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold mb-4">Dataset Splits</h2>
                        <Card className="mb-6">
                          <CardContent className="p-4 pt-6 space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Training Set</span>
                                <span className="text-sm text-muted-foreground">
                                  {project.dataset.splits.train.toLocaleString()} images
                                </span>
                              </div>
                              <Progress value={80} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Validation Set</span>
                                <span className="text-sm text-muted-foreground">
                                  {project.dataset.splits.validation.toLocaleString()} images
                                </span>
                              </div>
                              <Progress value={12} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Test Set</span>
                                <span className="text-sm text-muted-foreground">
                                  {project.dataset.splits.test.toLocaleString()} images
                                </span>
                              </div>
                              <Progress value={8} className="h-2" />
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Download Dataset
                          </Button>
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            View Docs
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">Class Distribution</h2>
                      <div className="h-[300px] w-full rounded-lg border bg-muted flex items-center justify-center">
                        <BarChart4 className="h-16 w-16 text-muted-foreground/50" />
                        <span className="ml-2 text-muted-foreground">Class distribution chart</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="models" className="mt-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Available Models</h2>
                      <div className="grid gap-6 md:grid-cols-3">
                        {project.models.map((model, index) => (
                          <Card key={index}>
                            <CardContent className="p-4 pt-6">
                              <h3 className="font-semibold text-lg mb-2">{model.name}</h3>
                              <p className="text-sm text-muted-foreground mb-4">Based on {model.type}</p>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span className="text-muted-foreground">Accuracy:</span>
                                  <span className="font-medium">{model.accuracy}%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-muted-foreground">Model Size:</span>
                                  <span className="font-medium">{model.size}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-muted-foreground">Inference Time:</span>
                                  <span className="font-medium">{model.inferenceTime}</span>
                                </li>
                              </ul>
                              <div className="mt-4 pt-4 border-t flex gap-2">
                                <Button variant="outline" className="flex-1 text-xs">
                                  <Download className="mr-1 h-3 w-3" />
                                  Download
                                </Button>
                                <Button variant="outline" className="flex-1 text-xs">
                                  <Code className="mr-1 h-3 w-3" />
                                  Code
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">Model Performance Comparison</h2>
                      <div className="h-[300px] w-full rounded-lg border bg-muted flex items-center justify-center">
                        <BarChart4 className="h-16 w-16 text-muted-foreground/50" />
                        <span className="ml-2 text-muted-foreground">Performance comparison chart</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">Integration Examples</h2>
                      <Card>
                        <CardContent className="p-4 pt-6">
                          <div className="rounded-md bg-muted p-4">
                            <pre className="text-sm">
                              <code>
                                {`# Python example using the UrbanDetect model
import cv2
from urbandetect import UrbanDetectModel

# Load the model
model = UrbanDetectModel.from_pretrained('urbandetect-l')

# Run inference on an image
image = cv2.imread('street_scene.jpg')
results = model.predict(image)

# Display results
for detection in results:
    label = detection['class']
    confidence = detection['confidence']
    bbox = detection['bbox']  # [x, y, width, height]
    
    # Draw bounding box
    x, y, w, h = bbox
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.putText(image, f"{label}: {confidence:.2f}", 
                (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

cv2.imshow('Detections', image)
cv2.waitKey(0)`}
                              </code>
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="samples" className="mt-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Sample Images</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {project.sampleImages.map((image, index) => (
                          <div key={index} className="relative aspect-video overflow-hidden rounded-lg border">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Sample ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">Visualization</h2>
                      <div className="h-[400px] w-full rounded-lg border bg-muted flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                        <span className="ml-2 text-muted-foreground">Interactive visualization would appear here</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="docs" className="mt-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Documentation</h2>
                      <Card>
                        <CardContent className="p-6">
                          <div className="prose max-w-none">
                            <h3>Getting Started</h3>
                            <p>
                              This guide will help you get started with the Urban Object Detection dataset and models.
                            </p>

                            <h4>Installation</h4>
                            <div className="rounded-md bg-muted p-4 my-4">
                              <pre className="text-sm">
                                <code>pip install urbandetect</code>
                              </pre>
                            </div>

                            <h4>Basic Usage</h4>
                            <p>
                              The Urban Object Detection package provides easy-to-use interfaces for both the dataset
                              and pre-trained models. Here's a quick example to get you started:
                            </p>

                            <div className="rounded-md bg-muted p-4 my-4">
                              <pre className="text-sm">
                                <code>
                                  {`from urbandetect import UrbanDetectModel, UrbanDataset

# Load a pre-trained model
model = UrbanDetectModel.from_pretrained('urbandetect-s')

# Or load the dataset
dataset = UrbanDataset(split='train')`}
                                </code>
                              </pre>
                            </div>

                            <h4>Dataset Structure</h4>
                            <p>The dataset is organized into the following structure:</p>

                            <ul>
                              <li>
                                <strong>images/</strong> - Contains all image files
                              </li>
                              <li>
                                <strong>annotations/</strong> - Contains annotation files in multiple formats
                              </li>
                              <li>
                                <strong>splits/</strong> - Contains train/val/test split information
                              </li>
                              <li>
                                <strong>metadata.json</strong> - Contains dataset metadata
                              </li>
                            </ul>

                            <h4>Model Information</h4>
                            <p>We provide three model variants with different size/performance tradeoffs:</p>

                            <ul>
                              <li>
                                <strong>UrbanDetect-S</strong> - Small model, fastest inference
                              </li>
                              <li>
                                <strong>UrbanDetect-M</strong> - Medium model, balanced performance
                              </li>
                              <li>
                                <strong>UrbanDetect-L</strong> - Large model, highest accuracy
                              </li>
                            </ul>

                            <h4>Citation</h4>
                            <div className="rounded-md bg-muted p-4 my-4">
                              <pre className="text-sm">
                                <code>
                                  {`@article{urbandetect2023,
  title={Urban Object Detection: A Large-Scale Dataset and Benchmark},
  author={Smith, John and Johnson, Emily and Williams, Robert},
  journal={Conference on Computer Vision},
  year={2023}
}`}
                                </code>
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 pt-6">
                  <h3 className="font-semibold mb-4">Project Creator</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.creator.avatar || "/placeholder.svg"} alt={project.creator.name} />
                      <AvatarFallback>UA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.creator.name}</p>
                      <p className="text-sm text-muted-foreground">{project.creator.organization}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{project.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">License:</span>
                    <span>{project.license}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 pt-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Dataset
                    </Button>
                    <Button className="w-full justify-start">
                      <Cpu className="mr-2 h-4 w-4" />
                      Download Models
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="mr-2 h-4 w-4" />
                      View Code Examples
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 pt-6">
                  <h3 className="font-semibold mb-4">Related Projects</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Traffic Sign Recognition",
                        category: "Classification",
                        image: "/placeholder.svg?height=100&width=200",
                      },
                      {
                        title: "Pedestrian Tracking",
                        category: "Object Tracking",
                        image: "/placeholder.svg?height=100&width=200",
                      },
                      {
                        title: "Road Segmentation",
                        category: "Segmentation",
                        image: "/placeholder.svg?height=100&width=200",
                      },
                    ].map((related, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={related.image || "/placeholder.svg"}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{related.title}</h4>
                          <p className="text-xs text-muted-foreground">{related.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
