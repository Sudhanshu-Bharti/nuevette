import { create } from 'zustand'
import { LearningPath } from '@/types/LearningPathTypes'

interface LearningPathStore {
  learningPath: LearningPath | null
  setLearningPath: (path: LearningPath) => void
}

export const useLearningPathStore = create<LearningPathStore>((set) => ({
  learningPath: null,
  setLearningPath: (path) => set({ learningPath: path }),
}))