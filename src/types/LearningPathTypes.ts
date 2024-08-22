export interface Subtopic {
    name: string
    description: string
    estimatedTime: string
    technologiesAndConcepts: string[]
    prerequisites: string[]
    resources: string[]
  }
  
  export interface Topic {
    name: string
    description: string
    estimatedTime: string
    subtopics: Subtopic[]
  }
  
  export interface LearningPath {
    name: string
    description: string
    estimatedTime: string
    topics: Topic[]
  }