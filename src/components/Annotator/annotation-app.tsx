"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DatasetSelector from "./dataset-selector"
import ClassificationAnnotator from "./classification-annotator"
import SegmentationAnnotator from "./segmentation-annotator"
import { Button } from "@/components/ui/button"
import { Download, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type AnnotationTask = "classification" | "segmentation"
export type ImageSource = "upload" | "stratos"

export interface AnnotationImage {
  id: string
  src: string
  filename: string
  width?: number
  height?: number
}

// Update ClassificationAnnotation to support multiple labels
export interface ClassificationAnnotation {
  imageId: string
  labels: string[] // Changed from single label to array of labels
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

// Update SegmentationAnnotation to support multiple labels per region
export interface SegmentationAnnotation {
  imageId: string
  regions: {
    id: string
    labels: string[] // Changed from single label to array of labels
    points: { x: number; y: number }[]
  }[]
}

export default function AnnotationApp() {
  const [task, setTask] = useState<AnnotationTask>("classification")
  const [images, setImages] = useState<AnnotationImage[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1)
  const [classificationAnnotations, setClassificationAnnotations] = useState<ClassificationAnnotation[]>([])
  const [segmentationAnnotations, setSegmentationAnnotations] = useState<SegmentationAnnotation[]>([])
  const [availableLabels, setAvailableLabels] = useState<string[]>([])
  const { toast } = useToast()

  const handleImagesLoaded = (loadedImages: AnnotationImage[], labels: string[]) => {
    setImages(loadedImages)
    setAvailableLabels(labels)
    setCurrentImageIndex(loadedImages.length > 0 ? 0 : -1)
    // Reset annotations when new images are loaded
    setClassificationAnnotations([])
    setSegmentationAnnotations([])
  }

  const handleSaveAnnotations = () => {
    toast({
      title: "Annotations saved",
      description: `Saved annotations for ${images.length} images`,
    })
  }

  const handleExportAnnotations = () => {
    let data: any
    let filename: string

    if (task === "classification") {
      // Format for classification with multiple labels and bounding boxes
      data = {
        images: {},
        annotations: [],
      }

      images.forEach((img) => {
        data.images[img.filename] = {
          width: img.width || 0,
          height: img.height || 0,
        }
      })

      classificationAnnotations.forEach((anno) => {
        const image = images.find((img) => img.id === anno.imageId)
        if (image) {
          data.annotations.push({
            image: image.filename,
            labels: anno.labels, // Now an array of labels
            bbox: anno.boundingBox
              ? [anno.boundingBox.x, anno.boundingBox.y, anno.boundingBox.width, anno.boundingBox.height]
              : null,
          })
        }
      })

      filename = "classification_annotations.json"
    } else {
      // COCO format for segmentation with multiple labels
      const cocoData = {
        info: {
          description: "Image Annotations in COCO format",
          date_created: new Date().toISOString(),
        },
        images: images.map((img, index) => ({
          id: index + 1,
          file_name: img.filename,
          width: img.width || 0,
          height: img.height || 0,
        })),
        annotations: [],
        categories: availableLabels.map((label, index) => ({
          id: index + 1,
          name: label,
          supercategory: "object",
        })),
      }

      let annotationId = 1
      segmentationAnnotations.forEach((anno) => {
        const imageIndex = images.findIndex((img) => img.id === anno.imageId)
        if (imageIndex !== -1) {
          anno.regions.forEach((region) => {
            // For each region, create an annotation for each label
            region.labels.forEach((label) => {
              const labelIndex = availableLabels.indexOf(label)
              if (labelIndex !== -1) {
                const flatPoints = region.points.reduce((acc, point) => {
                  acc.push(point.x, point.y)
                  return acc
                }, [] as number[])

                // Calculate bbox [x, y, width, height]
                const xs = region.points.map((p) => p.x)
                const ys = region.points.map((p) => p.y)
                const minX = Math.min(...xs)
                const minY = Math.min(...ys)
                const maxX = Math.max(...xs)
                const maxY = Math.max(...ys)

                cocoData.annotations.push({
                  id: annotationId++,
                  image_id: imageIndex + 1,
                  category_id: labelIndex + 1,
                  segmentation: [flatPoints],
                  area: (maxX - minX) * (maxY - minY),
                  bbox: [minX, minY, maxX - minX, maxY - minY],
                  iscrowd: 0,
                })
              }
            })
          })
        }
      })

      data = cocoData
      filename = "segmentation_annotations_coco.json"
    }

    // Create and download the file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Annotations exported",
      description: `Downloaded ${filename}`,
    })
  }

  const currentImage = currentImageIndex >= 0 ? images[currentImageIndex] : null

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // Update to handle multiple labels
  const handleClassificationUpdate = (labels: string[], boundingBox?: ClassificationAnnotation["boundingBox"]) => {
    if (!currentImage) return

    setClassificationAnnotations((prev) => {
      // Remove any existing annotation for this image
      const filtered = prev.filter((a) => a.imageId !== currentImage.id)
      // Add the new annotation with multiple labels
      return [...filtered, { imageId: currentImage.id, labels, boundingBox }]
    })
  }

  const handleSegmentationUpdate = (regions: SegmentationAnnotation["regions"]) => {
    if (!currentImage) return

    setSegmentationAnnotations((prev) => {
      // Remove any existing annotation for this image
      const filtered = prev.filter((a) => a.imageId !== currentImage.id)
      // Add the new annotation
      return [...filtered, { imageId: currentImage.id, regions }]
    })
  }

  const getClassificationForCurrentImage = () => {
    if (!currentImage) return { labels: [], boundingBox: null }
    const annotation = classificationAnnotations.find((a) => a.imageId === currentImage.id)
    return {
      labels: annotation?.labels || [],
      boundingBox: annotation?.boundingBox || null,
    }
  }

  const getSegmentationForCurrentImage = () => {
    if (!currentImage) return []
    return segmentationAnnotations.find((a) => a.imageId === currentImage.id)?.regions || []
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 max-w-7xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>Task Selection</CardTitle>
          <CardDescription>Choose the type of annotation task you want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={task} onValueChange={(value) => setTask(value as AnnotationTask)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            </TabsList>
            <TabsContent value="classification">
              <p className="text-sm text-muted-foreground mt-2">
                Classification tasks involve assigning one or more labels to the entire image or a specific region.
              </p>
            </TabsContent>
            <TabsContent value="segmentation">
              <p className="text-sm text-muted-foreground mt-2">
                Segmentation tasks involve drawing regions on the image and assigning one or more labels to each region.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <DatasetSelector onImagesLoaded={handleImagesLoaded} />

      {images.length > 0 && currentImage && (
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Annotation Workspace</CardTitle>
              <CardDescription>
                {currentImageIndex + 1} of {images.length} - {currentImage.filename}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrevImage} disabled={currentImageIndex <= 0}>
                Previous
              </Button>
              <Button variant="outline" onClick={handleNextImage} disabled={currentImageIndex >= images.length - 1}>
                Next
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {task === "classification" ? (
              <ClassificationAnnotator
                image={currentImage}
                labels={availableLabels}
                annotation={getClassificationForCurrentImage()}
                onAnnotationUpdate={handleClassificationUpdate}
              />
            ) : (
              <SegmentationAnnotator
                image={currentImage}
                labels={availableLabels}
                regions={getSegmentationForCurrentImage()}
                onRegionsChange={handleSegmentationUpdate}
              />
            )}
          </CardContent>
        </Card>
      )}

      {images.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleSaveAnnotations}>
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
          <Button onClick={handleExportAnnotations}>
            <Download className="mr-2 h-4 w-4" />
            Export Annotations
          </Button>
        </div>
      )}
    </div>
  )
}
