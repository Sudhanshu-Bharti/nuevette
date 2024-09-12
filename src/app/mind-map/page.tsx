"use client"
import MindMap from './_components/MindMap'
import { BrowserComponent } from '@/components/ui/browser-component'
import { useLearningPathStore } from '@/store'

export default function MindMapPage() {
  const learningPath = useLearningPathStore((state) => state.learningPath)

  if (!learningPath) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen">
      <BrowserComponent className="w-full h-full">
        <section className="w-full h-full">
          <MindMap learningPath={learningPath} />
        </section>
      </BrowserComponent>
    </div>
  )
}