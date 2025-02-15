"use client";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useLearningPathStore } from "@/store";
import { addToRecentPaths } from "@/lib/localStorage";
import { v4 as uuidv4 } from "uuid";

const ProgressBar = ({ progress }: { progress: any }) => (
  <div className="w-full max-w-md mx-auto">
    <Progress value={progress} className="w-full" />
    <p className="text-sm text-center mt-2 text-muted-foreground">
      Generating your learning path: {progress.toFixed(0)}%
    </p>
  </div>
);

export default function AiComponent() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();
  // const { addRecentPath } = useLearningPathStore();
  const setLearningPath = useLearningPathStore(
    (state) => state.setLearningPath
  );

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 100 / 35; // Assuming 35 seconds total time
        });
      }, 1000);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a topic for the learning path.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/prompt", { prompt });
      if (response.data.learningPath) {
        const pathWithId = {
          ...response.data.learningPath,
          id: uuidv4(),
          topics: response.data.learningPath.topics || [], // Ensure topics exists
        };
        setLearningPath(pathWithId);
        addToRecentPaths(pathWithId);
        router.push(`/mindmap/${pathWithId.id}`);
      } else {
        setError("Failed to generate learning path.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setError("An error occurred while generating the learning path.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-background">
      <div className="max-w-2xl w-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            What can I help you learn?
          </h1>
          {!isLoading && (
            <p className="text-xl text-muted-foreground">
              Enter a topic to generate a learning path mind map.
            </p>
          )}
          {isLoading ? (
            <ProgressBar progress={progress} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Learning path for NextJS 14"
                className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary-foreground"
              />
              <Button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary-foreground"
              >
                Generate
              </Button>
            </form>
          )}
        </div>
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mt-5">
        Made with ❤️ by Nuevette
      </div>
    </div>
  );
}
