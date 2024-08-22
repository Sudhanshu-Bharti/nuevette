"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MindMap from './_components/MindMap'
import { LearningPath } from '@/types/LearningPathTypes'
import { BrowserComponent } from '@/components/ui/browser-component'

export default function MindMapPage() {
  const searchParams = useSearchParams()
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      setLearningPath(JSON.parse(decodeURIComponent(data)))
    }
  }, [searchParams])

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