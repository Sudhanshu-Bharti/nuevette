"use client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useState } from "react"

export default function AiComponent() {
  const [prompt, setPrompt] = useState("")
  const [boardUrl, setBoardUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    if (!prompt.trim()) {
      setError("Please enter a topic for the learning path.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true)
    setError("")
    setBoardUrl("")
    
    try {
      const response = await axios.post("/api/prompt", { prompt }) 
      console.log(response.data)
      if (response.data.boardUrl) {
        setBoardUrl(response.data.boardUrl)
      } else {
        setError("Failed to generate Miro board.")
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
          <p className="text-xl text-muted-foreground">Enter a topic to generate a learning path in Miro.</p>
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
        {boardUrl && (
          <div className="mt-12 space-y-6 rounded-md border border-input bg-background p-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Miro Board Generated</h2>
            <p>Your learning path has been created in Miro. Click the button below to view it:</p>
            <Button
              onClick={() => window.open(boardUrl, '_blank')}
              className="mt-4"
            >
              Open Miro Board
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}