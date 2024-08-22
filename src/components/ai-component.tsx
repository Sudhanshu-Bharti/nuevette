"use client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useState } from "react"
import { useRouter } from 'next/navigation'

export default function AiComponent() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      setError("Please enter a topic for the learning path.");
      return;
    }
    setIsLoading(true)
    setError("")
    
    try {
      const response = await axios.post("/api/prompt", { prompt }) 
      console.log(response.data)
      if (response.data.learningPath) {
        // Redirect to the mind map page with the learning path data
        router.push(`/mind-map?data=${encodeURIComponent(JSON.stringify(response.data.learningPath))}`)
      } else {
        setError("Failed to generate learning path.")
      }
    } catch (error) {
      console.error("Error fetching response:", error)
      setError("An error occurred while generating the learning path.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-2xl w-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Learning Path Generator
          </h1>
          <p className="text-xl text-muted-foreground">Enter a topic to generate a learning path mind map.</p>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Learning path for NextJS 14"
              className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary-foreground"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </form>
        </div>
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}