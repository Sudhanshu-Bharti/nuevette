import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/utils/gemini';
import axios from 'axios';
import * as cheerio from 'cheerio';


const SERP_API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY || "";

const docUrls: { [key: string]: string } = {
  'react': 'https://reactjs.org/docs/getting-started.html',
  'nextjs': 'https://nextjs.org/docs',
  'python': 'https://docs.python.org/3/',
};

async function searchForDocumentation(technology: string): Promise<string> {
  const query = `${technology} official documentation`;
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    const organicResults = response.data.organic_results;
    if (organicResults && organicResults.length > 0) {
      return organicResults[0].link;
    }
  } catch (error) {
    console.error('Error searching for documentation:', error);
  }
  
  return '';
}

async function fetchOfficialDocumentation(technology: string): Promise<string> {
  let url = docUrls[technology.toLowerCase()];
  
  if (!url) {
    url = await searchForDocumentation(technology);
  }
  
  if (!url) {
    console.warn(`Couldn't find documentation URL for ${technology}`);
    return '';
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const content = $('body').text();
    return content;
  } catch (error) {
    console.error(`Failed to fetch documentation for ${technology}:`, error);
    return '';
  }
}

function processDocumentationData(rawDocs: string): string {
  let processed = rawDocs.replace(/\s+/g, ' ').trim();
  
  const sections = ['Introduction', 'Getting Started', 'Core Concepts', 'API Reference', 'Advanced Guides'];
  let result = '';
  
  for (const section of sections) {
    const index = processed.indexOf(section);
    if (index !== -1) {
      result += processed.slice(index, index + 500) + '\n\n';
    }
  }
  
  if (result.length === 0) {
    result = processed.slice(0, 2000);
  }
  
  return result;
}

function createEnhancedPrompt(technology: string, docs: string): string {
  return `
          Based on the following excerpt from the official documentation for ${technology}, create a comprehensive and detailed learning path. The path should be suitable for a beginner to become proficient in ${technology}. Include the following:

          Documentation excerpt:
          ${docs}

          1. Main topics: 5-7 core areas of study, referencing specific sections from the documentation where applicable.
          2. Subtopics: For each main topic, provide 3-5 specific subtopics or skills to learn.
          3. For each subtopic, include:
            - A brief description of what it covers, citing relevant parts of the documentation
            - Estimated time to learn (in hours)
            - Specific technologies, tools, or concepts to study
            - Any prerequisites or dependencies
            - Suggested resources (official documentation sections, books, courses, or websites)

          Ensure the learning path is logically structured, progressing from foundational concepts to more advanced topics. 

          The output should be in the following JSON format:
          {
            "name": "Main Topic",
            "description": "Overall description of the learning path",
            "estimatedTime": "Total estimated time for the entire path",
            "topics": [
              {
                "name": "Main Topic 1",
                "description": "Description of main topic 1",
                "estimatedTime": "Estimated time for main topic 1",
                "subtopics": [
                  {
                    "name": "Subtopic 1.1",
                    "description": "Detailed description of subtopic 1.1",
                    "estimatedTime": "Estimated time for subtopic 1.1",
                    "technologiesAndConcepts": ["Tech 1", "Concept 1", "Tool 1"],
                    "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
                    "resources": ["Documentation: Section X", "Book: Title", "Course: URL", "Website: URL"]
                  }
                ]
              }
            ]
          }
          `
}

function cleanJsonResponse(response: string): string {
  response = response.replace(/```json\n|\n```/g, '');
  return response.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required", status: 400 }, { status: 400 });
    }

    const officialDocs = await fetchOfficialDocumentation(prompt);
    const processedDocs = processDocumentationData(officialDocs);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const enhancedPrompt = createEnhancedPrompt(prompt, processedDocs);

    const result = await model.generateContent(enhancedPrompt);
    let structuredData;
    
    try {
      const cleanedResponse = cleanJsonResponse(result.response.text());
      structuredData = JSON.parse(cleanedResponse);
      console.log("Structured data:", JSON.stringify(structuredData, null, 2));
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      console.log("Raw response:", result.response.text());
      return NextResponse.json({ message: "Failed to parse AI response", status: 500 }, { status: 500 });
    }

    return NextResponse.json({ learningPath: structuredData });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ message: "An error occurred", status: 500 }, { status: 500 });
  }
}