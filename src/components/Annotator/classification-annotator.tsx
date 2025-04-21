"use client"
import { useEffect, useRef, useState } from "react"
import type React from "react"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Square, Trash2, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { AnnotationImage, ClassificationAnnotation } from "./annotation-app"

interface ClassificationAnnotatorProps {
  image: AnnotationImage
  labels: string[]
  annotation: {
    labels: string[]
    boundingBox: ClassificationAnnotation["boundingBox"] | null
  }
  onAnnotationUpdate: (
    labels: string[],
    boundingBox?: {
      x: number
      y: number
      width: number
      height: number
    },
  ) => void
}

export default function ClassificationAnnotator({
  image,
  labels,
  annotation,
  onAnnotationUpdate,
}: ClassificationAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(null)
  const [scale, setScale] = useState(1)
  const [boundingBox, setBoundingBox] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(annotation.boundingBox)
  const [showCanvas, setShowCanvas] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState<string[]>(annotation.labels || [])

  // Initialize canvas and load image
  useEffect(() => {
    if (!showCanvas) return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !image.src) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image.src

    img.onload = () => {
      // Calculate scale to fit image in container
      const containerWidth = container.clientWidth
      const containerHeight = 500 // Max height

      const imgAspectRatio = img.width / img.height
      const containerAspectRatio = containerWidth / containerHeight

      let newWidth, newHeight

      if (imgAspectRatio > containerAspectRatio) {
        // Image is wider than container aspect ratio
        newWidth = containerWidth
        newHeight = containerWidth / imgAspectRatio
      } else {
        // Image is taller than container aspect ratio
        newHeight = containerHeight
        newWidth = containerHeight * imgAspectRatio
      }

      // Set canvas dimensions
      canvas.width = newWidth
      canvas.height = newHeight

      // Calculate scale factor
      const newScale = newWidth / img.width
      setScale(newScale)

      // Draw image
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Draw existing bounding box if it exists
      if (boundingBox) {
        drawBoundingBox(ctx, boundingBox, scale)
      }
    }
  }, [image.src, showCanvas, boundingBox, scale])

  // Update local state when annotation changes
  useEffect(() => {
    setSelectedLabels(annotation.labels || [])
    setBoundingBox(annotation.boundingBox)
  }, [annotation])

  const drawBoundingBox = (
    ctx: CanvasRenderingContext2D,
    box: { x: number; y: number; width: number; height: number },
    currentScale: number,
  ) => {
    ctx.strokeStyle = "green"
    ctx.lineWidth = 2
    ctx.strokeRect(box.x * currentScale, box.y * currentScale, box.width * currentScale, box.height * currentScale)

    // Draw handles at corners
    ctx.fillStyle = "green"
    const handleSize = 6
    const halfHandle = handleSize / 2
    const corners = [
      { x: box.x, y: box.y }, // top-left
      { x: box.x + box.width, y: box.y }, // top-right
      { x: box.x + box.width, y: box.y + box.height }, // bottom-right
      { x: box.x, y: box.y + box.height }, // bottom-left
    ]

    corners.forEach((corner) => {
      ctx.fillRect(corner.x * currentScale - halfHandle, corner.y * currentScale - halfHandle, handleSize, handleSize)
    })
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setIsDrawing(true)
    setStartPoint({ x, y })
    setEndPoint({ x, y })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    setEndPoint({ x, y })

    // Redraw canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image.src

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw rectangle
      if (startPoint && endPoint) {
        const width = endPoint.x - startPoint.x
        const height = endPoint.y - startPoint.y

        ctx.strokeStyle = "green"
        ctx.lineWidth = 2
        ctx.strokeRect(startPoint.x * scale, startPoint.y * scale, width * scale, height * scale)
      }
    }
  }

  const handleCanvasMouseUp = () => {
    if (!isDrawing || !startPoint || !endPoint) return

    setIsDrawing(false)

    // Calculate bounding box
    const x = Math.min(startPoint.x, endPoint.x)
    const y = Math.min(startPoint.y, endPoint.y)
    const width = Math.abs(endPoint.x - startPoint.x)
    const height = Math.abs(endPoint.y - startPoint.y)

    // Only set if the box has some size
    if (width > 5 && height > 5) {
      const newBoundingBox = { x, y, width, height }
      setBoundingBox(newBoundingBox)

      // Update annotation with the new bounding box
      onAnnotationUpdate(selectedLabels, newBoundingBox)
    }
  }

  const handleLabelToggle = (label: string, checked: boolean) => {
    let newLabels: string[]

    if (checked) {
      // Add label if it doesn't exist
      newLabels = [...selectedLabels, label]
    } else {
      // Remove label if it exists
      newLabels = selectedLabels.filter((l) => l !== label)
    }

    setSelectedLabels(newLabels)
    onAnnotationUpdate(newLabels, boundingBox || undefined)
  }

  const removeLabel = (label: string) => {
    const newLabels = selectedLabels.filter((l) => l !== label)
    setSelectedLabels(newLabels)
    onAnnotationUpdate(newLabels, boundingBox || undefined)
  }

  const clearBoundingBox = () => {
    setBoundingBox(null)
    // Update annotation without a bounding box
    onAnnotationUpdate(selectedLabels)

    // Redraw canvas
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image.src
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        {!showCanvas ? (
          <div className="flex justify-center items-center bg-muted/30 rounded-lg p-4">
            <div className="relative max-w-full max-h-[500px] overflow-hidden">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.filename}
                width={image.width || 800}
                height={image.height || 600}
                className="object-contain max-h-[500px]"
              />
              <div className="absolute top-4 right-4">
                <Button onClick={() => setShowCanvas(true)} variant="secondary" size="sm">
                  <Square className="h-4 w-4 mr-1" />
                  Add Bounding Box
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4 flex justify-center items-center" ref={containerRef}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="cursor-crosshair border"
            />
          </div>
        )}

        {showCanvas && (
          <div className="flex justify-between mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowCanvas(false)}>
              Back to Image View
            </Button>
            {boundingBox && (
              <Button variant="outline" size="sm" onClick={clearBoundingBox}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Box
              </Button>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Assign labels to this image</h3>
              <p className="text-sm text-muted-foreground">
                {boundingBox
                  ? "You've drawn a bounding box. Select one or more labels to classify the region."
                  : "Select one or more labels below or draw a bounding box first."}
              </p>
            </div>

            {/* Selected labels display */}
            {selectedLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {selectedLabels.map((label) => (
                  <Badge key={label} variant="secondary" className="flex items-center gap-1">
                    {label}
                    <button
                      onClick={() => removeLabel(label)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Checkbox list for multi-select */}
            <div className="space-y-3">
              {labels.map((label) => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`label-${label}`}
                    checked={selectedLabels.includes(label)}
                    onCheckedChange={(checked) => handleLabelToggle(label, checked === true)}
                  />
                  <Label htmlFor={`label-${label}`} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            {labels.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No labels available. Please add labels in the dataset selector.
              </p>
            )}

            {!showCanvas && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Want to annotate a specific region instead of the whole image?
                </p>
                <Button onClick={() => setShowCanvas(true)} variant="outline" size="sm">
                  <Square className="h-4 w-4 mr-1" />
                  Draw Bounding Box
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
