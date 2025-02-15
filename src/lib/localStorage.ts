import { LearningPath } from "@/types/LearningPathTypes";

const CURRENT_PATH_KEY = "currentLearningPath";
const RECENT_PATHS_KEY = "recentLearningPaths";

export const getCurrentPath = (): LearningPath | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CURRENT_PATH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentPath = (path: LearningPath): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_PATH_KEY, JSON.stringify(path));
};

export const getRecentPaths = (): LearningPath[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(RECENT_PATHS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToRecentPaths = (path: LearningPath): void => {
  if (typeof window === "undefined") return;
  const recentPaths = getRecentPaths();
  const updatedPaths = [
    path,
    ...recentPaths.filter((p) => p.id !== path.id),
  ].slice(0, 6);

  localStorage.setItem(RECENT_PATHS_KEY, JSON.stringify(updatedPaths));
  setCurrentPath(path);
};
