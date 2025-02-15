"use client";
import { useEffect, useState } from "react";
import { LearningPath } from "@/types/LearningPathTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getRecentPaths } from "@/lib/localStorage";
import { useLearningPathStore } from "@/store";

export function Showcase() {
  const router = useRouter();
  const [recentPaths, setRecentPaths] = useState<LearningPath[]>([]);
  const setLearningPath = useLearningPathStore(
    (state) => state.setLearningPath
  );

  useEffect(() => {
    const paths = getRecentPaths();
    setRecentPaths(paths);
  }, []);

  const handlePathClick = (path: LearningPath) => {
    setLearningPath(path);
    router.push(`/mindmap/${path.id}`);
  };

  if (recentPaths.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">
          Recent Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPaths.map((path, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePathClick(path)}
            >
              <CardHeader>
                <CardTitle>{path.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {path.description}
                </p>
                <p className="text-sm mt-2">
                  Estimated Time: {path.estimatedTime}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
