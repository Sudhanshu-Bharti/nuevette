import { create } from "zustand";
import { LearningPath } from "@/types/LearningPathTypes";

interface LearningPathStore {
  learningPath: LearningPath | null;
  setLearningPath: (path: LearningPath) => void;
  recentPaths: LearningPath[];
  addRecentPath: (path: LearningPath) => void;
}

export const useLearningPathStore = create<LearningPathStore>((set) => ({
  learningPath: null,
  recentPaths: [],
  setLearningPath: (path) => set({ learningPath: path }),
  addRecentPath: (path) =>
    set((state) => ({
      recentPaths: [path, ...state.recentPaths].slice(0, 12), 
    })),
}));
