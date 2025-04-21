"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, Database } from "lucide-react"
import type { AnnotationImage } from "./annotation-app"
import { useToast } from "@/hooks/use-toast"

interface DatasetSelectorProps {
  onImagesLoaded: (images: AnnotationImage[], labels: string[]) => void
}

export default function DatasetSelector({ onImagesLoaded }: DatasetSelectorProps) {
  const [source, setSource] = useState<"upload" | "stratos">("upload")
  const [uploading, setUploading] = useState(false)
  const [labels, setLabels] = useState<string>("")
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    // Process the uploaded files
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      toast({
        title: "No images found",
        description: "Please upload image files (jpg, png, etc.)",
        variant: "destructive",
      })
      setUploading(false)
      return
    }

    // Create object URLs for the images
    const loadedImages: AnnotationImage[] = []
    let loadedCount = 0

    imageFiles.forEach((file) => {
      const objectUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        loadedImages.push({
          id: `img-${Date.now()}-${loadedCount}`,
          src: objectUrl,
          filename: file.name,
          width: img.width,
          height: img.height,
        })

        loadedCount++

        if (loadedCount === imageFiles.length) {
          // All images loaded
          const labelList = labels
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l)
          const defaultLabels = labelList.length > 0 ? labelList : ["Object"]

          onImagesLoaded(loadedImages, defaultLabels)
          setUploading(false)

          toast({
            title: "Images loaded",
            description: `Loaded ${loadedImages.length} images`,
          })
        }
      }

      img.onerror = () => {
        loadedCount++
        if (loadedCount === imageFiles.length) {
          onImagesLoaded(
            loadedImages,
            labels
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l),
          )
          setUploading(false)
        }
      }

      img.src = objectUrl
    })
  }

  const handleStratosDataset = () => {
    setUploading(true)

    // Simulate loading a dataset from Stratos
    setTimeout(() => {
      // Create sample dataset with placeholder images
      const sampleImages: AnnotationImage[] = Array(10)
        .fill(0)
        .map((_, i) => ({
          id: `stratos-${i}`,
          src: `/placeholder.svg?height=500&width=500`,
          filename: `sample_image_${i + 1}.jpg`,
          width: 500,
          height: 500,
        }))

      const labelList = labels
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l)
      const defaultLabels = labelList.length > 0 ? labelList : ["Cat", "Dog", "Bird"]

      onImagesLoaded(sampleImages, defaultLabels)
      setUploading(false)

      toast({
        title: "Dataset loaded",
        description: "Loaded sample dataset from Stratos",
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Selection</CardTitle>
        <CardDescription>Upload your own images or select from Stratos datasets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="labels">Labels (comma separated)</Label>
            <Input
              id="labels"
              placeholder="e.g. Cat, Dog, Bird"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter the labels you want to use for annotation, separated by commas
            </p>
          </div>

          <Tabs value={source} onValueChange={(value) => setSource(value as "upload" | "stratos")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="stratos">Stratos Dataset</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </TabsContent>
            <TabsContent value="stratos" className="space-y-4">
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 rounded-lg bg-muted/50">
                <Database className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-4 text-sm text-muted-foreground">Select a dataset from Stratos</p>
                <Button onClick={handleStratosDataset} disabled={uploading}>
                  {uploading ? "Loading..." : "Load Sample Dataset"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
