import type { Metadata } from "next"
import AnnotationApp from "@/components/Annotator/annotation-app"

export const metadata: Metadata = {
  title: "Image Annotation Tool",
  description: "Annotate images for classification or segmentation tasks",
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b p-4 bg-white">
        <h1 className="text-2xl font-bold">Image Annotation Tool</h1>
      </header>
      <AnnotationApp />
    </main>
  )
}
