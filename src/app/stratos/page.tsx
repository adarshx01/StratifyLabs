//@ts-nocheck
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, ArrowUpRight, Star, Download, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomePage() {
  return (
    // Remove outer wrappers that cause shifting
    // Remove the min-h-screen since layout already provides this
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-muted/40 py-6">
        <div className="w-full px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Open Datasets & Models for Computer Vision
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover, share, and collaborate on computer vision projects. Access high-quality datasets and
                  pre-trained models for your next AI project.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="px-8">Explore Projects</Button>
                <Button variant="outline">Upload Your Dataset</Button>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px] xl:h-[500px] rounded-xl overflow-hidden bg-muted">
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Computer Vision Projects"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                  <p className="text-xs font-medium">Datasets</p>
                  <p className="text-lg font-bold">2,500+</p>
                </div>
                <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                  <p className="text-xs font-medium">Models</p>
                  <p className="text-lg font-bold">1,200+</p>
                </div>
                <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                  <p className="text-xs font-medium">Contributors</p>
                  <p className="text-lg font-bold">5,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="w-full px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search projects..." className="w-full pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="object-detection">Object Detection</SelectItem>
                  <SelectItem value="segmentation">Segmentation</SelectItem>
                  <SelectItem value="classification">Classification</SelectItem>
                  <SelectItem value="keypoint">Keypoint Detection</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              id: 1,
              title: "Urban Object Detection",
              description: "Detect and classify urban objects like vehicles, pedestrians, and traffic signs.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Object Detection",
              stars: 245,
              downloads: 1.2,
              views: 5.6,
            },
            {
              id: 2,
              title: "Medical Image Segmentation",
              description: "Segment organs and anomalies in medical imaging scans.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Segmentation",
              stars: 189,
              downloads: 0.9,
              views: 4.3,
            },
            {
              id: 3,
              title: "Retail Product Recognition",
              description: "Identify products on store shelves for inventory management.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Classification",
              stars: 156,
              downloads: 0.7,
              views: 3.8,
            },
            {
              id: 4,
              title: "Aerial Imagery Analysis",
              description: "Analyze satellite and drone imagery for environmental monitoring.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Segmentation",
              stars: 203,
              downloads: 1.0,
              views: 4.7,
            },
            {
              id: 5,
              title: "Human Pose Estimation",
              description: "Track human body keypoints for motion analysis and fitness applications.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Keypoint Detection",
              stars: 278,
              downloads: 1.5,
              views: 6.2,
            },
            {
              id: 6,
              title: "Wildlife Monitoring",
              description: "Detect and track wildlife in natural habitats for conservation efforts.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Object Detection",
              stars: 167,
              downloads: 0.8,
              views: 3.5,
            },
            {
              id: 7,
              title: "Manufacturing Defect Detection",
              description: "Identify defects in manufacturing processes for quality control.",
              image: "/placeholder.svg?height=300&width=400",
              category: "Classification",
              stars: 132,
              downloads: 0.6,
              views: 2.9,
            },
            {
              id: 8,
              title: "Document OCR & Analysis",
              description: "Extract text and analyze document structure for automation.",
              image: "/placeholder.svg?height=300&width=400",
              category: "OCR",
              stars: 195,
              downloads: 0.9,
              views: 4.1,
            },
          ].map((project) => (
            <Link href={`/stratos/projects/${project.id}`} key={project.id} className="group">
              <div className="flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2">{project.category}</Badge>
                </div>
                <div className="flex flex-col space-y-1.5 p-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary flex items-center">
                    {project.title}
                    <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm border-t">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {project.downloads}k
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {project.views}k
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="gap-2">
            Load More Projects
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-12 md:py-16 bg-muted/40">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join Our Community</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Contribute your own datasets and models or collaborate with others on cutting-edge computer vision
                projects.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="px-8">Create Account</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
