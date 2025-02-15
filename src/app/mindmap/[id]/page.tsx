"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import MindMap from "@/app/mindmap/_components/MindMap";
import { BrowserComponent } from "@/components/ui/browser-component";
import { getRecentPaths } from "@/lib/localStorage";
import { useLearningPathStore } from "@/store";

export default function MindMapPage() {
  const params = useParams();
  const learningPath = useLearningPathStore((state) => state.learningPath);
  const setLearningPath = useLearningPathStore(
    (state) => state.setLearningPath
  );

  useEffect(() => {
    if (!learningPath && params.id) {
      const paths = getRecentPaths();
      const foundPath = paths.find((p) => p.id === params.id);
      if (foundPath) {
        setLearningPath(foundPath);
      }
    }
  }, [params.id]);

  if (!learningPath) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <BrowserComponent className="w-full h-full">
        <section className="w-full h-full">
          <MindMap learningPath={learningPath} />
        </section>
      </BrowserComponent>
    </div>
  );
}
