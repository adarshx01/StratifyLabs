"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AnnotationImage } from "./annotation-app"
import { Trash2, Square, Pencil, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface SegmentationAnnotatorProps {
  image: AnnotationImage
  labels: string[]
  regions: {
    id: string
    labels: string[] // Changed from single label to array of labels
    points: { x: number; y: number }[]
  }[]
  onRegionsChange: (
    regions: {
      id: string
      labels: string[] // Changed from single label to array of labels
      points: { x: number; y: number }[]
    }[],
  ) => void
}

type DrawingMode = "polygon" | "rectangle"

export default function SegmentationAnnotator({ image, labels, regions, onRegionsChange }: SegmentationAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentLabels, setCurrentLabels] = useState<string[]>([labels[0] || ""])
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("polygon")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([])
  const [scale, setScale] = useState(1)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [showLabelSelector, setShowLabelSelector] = useState(false)

  // Initialize canvas and load image
  useEffect(() => {
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

      // Draw existing regions
      drawRegions()
    }
  }, [image.src])

  // Redraw canvas when regions change
  useEffect(() => {
    drawRegions()
  }, [regions, selectedRegionId])

  const drawRegions = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image.src

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw all regions
      regions.forEach((region) => {
        const isSelected = region.id === selectedRegionId

        ctx.beginPath()

        if (region.points.length > 0) {
          ctx.moveTo(region.points[0].x * scale, region.points[0].y * scale)

          for (let i = 1; i < region.points.length; i++) {
            ctx.lineTo(region.points[i].x * scale, region.points[i].y * scale)
          }

          ctx.closePath()
        }

        // Fill with semi-transparent color
        ctx.fillStyle = isSelected ? "rgba(255, 165, 0, 0.3)" : "rgba(0, 123, 255, 0.2)"
        ctx.fill()

        // Draw stroke
        ctx.strokeStyle = isSelected ? "orange" : "blue"
        ctx.lineWidth = isSelected ? 3 : 2
        ctx.stroke()

        // Draw points for selected region
        if (isSelected) {
          region.points.forEach((point) => {
            ctx.beginPath()
            ctx.arc(point.x * scale, point.y * scale, 4, 0, Math.PI * 2)
            ctx.fillStyle = "orange"
            ctx.fill()
          })
        }
      })

      // Draw current points if drawing
      if (isDrawing && currentPoints.length > 0) {
        ctx.beginPath()
        ctx.moveTo(currentPoints[0].x * scale, currentPoints[0].y * scale)

        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x * scale, currentPoints[i].y * scale)
        }

        // If polygon mode, draw line to first point when enough points
        if (drawingMode === "polygon" && currentPoints.length > 2) {
          ctx.lineTo(currentPoints[0].x * scale, currentPoints[0].y * scale)
        }

        ctx.strokeStyle = "green"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw points
        currentPoints.forEach((point) => {
          ctx.beginPath()
          ctx.arc(point.x * scale, point.y * scale, 4, 0, Math.PI * 2)
          ctx.fillStyle = "green"
          ctx.fill()
        })
      }
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && currentLabels.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    if (!isDrawing) {
      // Start drawing
      setIsDrawing(true)
      setCurrentPoints([{ x, y }])

      if (drawingMode === "rectangle") {
        // For rectangle, we just need start point, we'll complete on mouse up
        const handleMouseMove = (moveEvent: MouseEvent) => {
          const newX = (moveEvent.clientX - rect.left) / scale
          const newY = (moveEvent.clientY - rect.top) / scale
          setCurrentPoints([
            { x, y },
            { x: newX, y },
            { x: newX, y: newY },
            { x, y: newY },
          ])
        }

        const handleMouseUp = () => {
          // Complete rectangle
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)

          if (currentPoints.length === 4) {
            completeDrawing()
          }
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      }
    } else if (drawingMode === "polygon") {
      // Continue polygon
      // Check if click is near the first point to close the polygon
      const firstPoint = currentPoints[0]
      const distance = Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2))

      if (currentPoints.length > 2 && distance < 20) {
        // Close polygon
        completeDrawing()
      } else {
        // Add point
        setCurrentPoints([...currentPoints, { x, y }])
      }
    }
  }

  const completeDrawing = () => {
    if (currentPoints.length < 3) {
      // Need at least 3 points for a valid polygon
      setIsDrawing(false)
      setCurrentPoints([])
      return
    }

    // Add new region
    const newRegion = {
      id: `region-${Date.now()}`,
      labels: currentLabels,
      points: currentPoints,
    }

    onRegionsChange([...regions, newRegion])

    // Reset drawing state
    setIsDrawing(false)
    setCurrentPoints([])
    setSelectedRegionId(newRegion.id)
  }

  const cancelDrawing = () => {
    setIsDrawing(false)
    setCurrentPoints([])
  }

  const deleteSelectedRegion = () => {
    if (!selectedRegionId) return

    const updatedRegions = regions.filter((region) => region.id !== selectedRegionId)
    onRegionsChange(updatedRegions)
    setSelectedRegionId(null)
  }

  const updateRegionLabels = (regionId: string, newLabels: string[]) => {
    const updatedRegions = regions.map((region) => {
      if (region.id === regionId) {
        return { ...region, labels: newLabels }
      }
      return region
    })

    onRegionsChange(updatedRegions)
  }

  const handleLabelToggle = (label: string, checked: boolean) => {
    if (checked) {
      setCurrentLabels((prev) => [...prev, label])
    } else {
      setCurrentLabels((prev) => prev.filter((l) => l !== label))
    }
  }

  const handleRegionLabelToggle = (label: string, checked: boolean) => {
    if (!selectedRegionId) return

    const region = regions.find((r) => r.id === selectedRegionId)
    if (!region) return

    let newLabels: string[]
    if (checked) {
      newLabels = [...region.labels, label]
    } else {
      newLabels = region.labels.filter((l) => l !== label)
    }

    updateRegionLabels(selectedRegionId, newLabels)
  }

  const removeCurrentLabel = (label: string) => {
    setCurrentLabels((prev) => prev.filter((l) => l !== label))
  }

  const removeRegionLabel = (label: string) => {
    if (!selectedRegionId) return

    const region = regions.find((r) => r.id === selectedRegionId)
    if (!region) return

    const newLabels = region.labels.filter((l) => l !== label)
    updateRegionLabels(selectedRegionId, newLabels)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <div className="bg-muted/30 rounded-lg p-4 flex justify-center items-center" ref={containerRef}>
          <canvas ref={canvasRef} onClick={handleCanvasClick} className="cursor-crosshair border" />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawingMode("polygon")}
              className={drawingMode === "polygon" ? "border-primary" : ""}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Polygon
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawingMode("rectangle")}
              className={drawingMode === "rectangle" ? "border-primary" : ""}
            >
              <Square className="h-4 w-4 mr-1" />
              Rectangle
            </Button>
          </div>
          <div className="flex gap-2">
            {isDrawing && (
              <Button variant="outline" size="sm" onClick={cancelDrawing}>
                Cancel
              </Button>
            )}
            {isDrawing && drawingMode === "polygon" && currentPoints.length >= 3 && (
              <Button size="sm" onClick={completeDrawing}>
                Complete Shape
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Drawing Tools</h3>
              <p className="text-sm text-muted-foreground">
                Select labels and drawing mode, then click on the image to create annotations
              </p>
            </div>

            {!isDrawing && !selectedRegionId ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Current Labels</label>
                  <Button variant="ghost" size="sm" onClick={() => setShowLabelSelector(!showLabelSelector)}>
                    {showLabelSelector ? "Hide Labels" : "Select Labels"}
                  </Button>
                </div>

                {/* Display selected labels */}
                <div className="flex flex-wrap gap-2 py-2">
                  {currentLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="flex items-center gap-1">
                      {label}
                      <button
                        onClick={() => removeCurrentLabel(label)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {currentLabels.length === 0 && <p className="text-sm text-muted-foreground">No labels selected</p>}
                </div>

                {/* Label selector */}
                {showLabelSelector && (
                  <div className="space-y-2 border rounded-md p-3 mt-2">
                    <h4 className="text-sm font-medium">Select Labels</h4>
                    <div className="space-y-2">
                      {labels.map((label) => (
                        <div key={label} className="flex items-center space-x-2">
                          <Checkbox
                            id={`drawing-label-${label}`}
                            checked={currentLabels.includes(label)}
                            onCheckedChange={(checked) => handleLabelToggle(label, checked === true)}
                          />
                          <Label htmlFor={`drawing-label-${label}`} className="cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Regions ({regions.length})</h4>
                {selectedRegionId && (
                  <Button variant="destructive" size="sm" onClick={deleteSelectedRegion}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>

              <ScrollArea className="h-[200px] border rounded-md p-2">
                {regions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No regions created yet</p>
                ) : (
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <div
                        key={region.id}
                        className={`p-2 rounded-md cursor-pointer ${
                          selectedRegionId === region.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedRegionId(region.id)}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-1">
                            {region.labels.map((label) => (
                              <Badge key={label} variant="outline" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{region.points.length} points</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {selectedRegionId && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Region Labels</label>
                    <Button variant="ghost" size="sm" onClick={() => setShowLabelSelector(!showLabelSelector)}>
                      {showLabelSelector ? "Hide" : "Edit"}
                    </Button>
                  </div>

                  {/* Display selected region's labels */}
                  <div className="flex flex-wrap gap-2 py-2">
                    {regions
                      .find((r) => r.id === selectedRegionId)
                      ?.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="flex items-center gap-1">
                          {label}
                          <button
                            onClick={() => removeRegionLabel(label)}
                            className="ml-1 rounded-full hover:bg-muted-foreground/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>

                  {/* Label selector for region */}
                  {showLabelSelector && (
                    <div className="space-y-2 border rounded-md p-3 mt-2">
                      <h4 className="text-sm font-medium">Edit Region Labels</h4>
                      <div className="space-y-2">
                        {labels.map((label) => {
                          const region = regions.find((r) => r.id === selectedRegionId)
                          const isChecked = region?.labels.includes(label) || false

                          return (
                            <div key={label} className="flex items-center space-x-2">
                              <Checkbox
                                id={`region-label-${label}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => handleRegionLabelToggle(label, checked === true)}
                              />
                              <Label htmlFor={`region-label-${label}`} className="cursor-pointer">
                                {label}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
