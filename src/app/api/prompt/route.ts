import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/utils/gemini';
import { MiroApi } from '@mirohq/miro-api'
import { ConnectorStyle, Geometry, Position, ShapeDataForCreate } from '@mirohq/miro-api/dist/api';
import axios from 'axios';
import * as cheerio from 'cheerio';

const MIRO_ACCESS_TOKEN = process.env.MIRO_ACCESS_TOKEN || "";
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
`;
}

interface TopicData {
  name: string;
  description: string;
  estimatedTime?: string;
  topics?: TopicData[];
  subtopics?: SubtopicData[];
}

interface SubtopicData {
  name: string;
  description: string;
  estimatedTime: string;
  technologiesAndConcepts: string[];
  prerequisites: string[];
  resources: string[];
}

interface EnhancedShapeDataForCreate extends ShapeDataForCreate {
  style: {
    fillColor: string;
    textColor: string;
    fontSize: number;
    borderColor: string;
    borderWidth: number;
    borderStyle: 'normal' | 'dashed' | 'dotted';
  };
}

async function createLinearLearningPath(boardId: string, mainTopic: TopicData) {
  const api = new MiroApi(MIRO_ACCESS_TOKEN);
  let yOffset = 0;
  const xOffset = 300;
  
  const mainTopicShape = await addTopicToBoard(boardId, mainTopic, null, 0, yOffset, 0);
  yOffset += 300;

  if (mainTopic.topics) {
    for (let i = 0; i < mainTopic.topics.length; i++) {
      const topic = mainTopic.topics[i];
      const topicShape = await addTopicToBoard(boardId, topic, null, 0, yOffset, 1);
      yOffset += 250;

      await createConnector(api, boardId, mainTopicShape.id, topicShape.id);

      if (topic.subtopics) {
        for (let j = 0; j < topic.subtopics.length; j++) {
          const subtopic = topic.subtopics[j];
          const subtopicShape = await addSubtopicToBoard(boardId, subtopic, xOffset, yOffset, 2);
          yOffset += 200;

          await createConnector(api, boardId, topicShape.id, subtopicShape.id);
        }
      }
      yOffset += 100;
    }
  }
}

async function addTopicToBoard(
  boardId: string,
  topic: TopicData,
  parentId: string | null,
  x: number,
  y: number,
  level: number
): Promise<{ id: string }> {
  const api = new MiroApi(MIRO_ACCESS_TOKEN);
  const { shape, style } = getShapeStyleForTopic(topic, level);

  const content = `<p style="font-size: 16px;"><strong>${topic.name}</strong></p><p style="font-size: 14px;">${topic.description}</p>`;
  const estimatedTime = topic.estimatedTime ? `<p style="font-size: 12px;">Est. Time: ${topic.estimatedTime}</p>` : '';

  const shapeData: EnhancedShapeDataForCreate = {
    content: content + estimatedTime,
    shape: shape,
    style: style
  };

  const geometry: Geometry = calculateGeometry(content + estimatedTime);
  const position: Position = { x, y, origin: 'center' };

  const { body } = await api._api.createShapeItem(boardId, {
    data: shapeData,
    geometry: geometry,
    position: position,
  });
  
  return { id: body.id };
}

async function addSubtopicToBoard(
  boardId: string,
  subtopic: SubtopicData,
  x: number,
  y: number,
  level: number
): Promise<{ id: string }> {
  const api = new MiroApi(MIRO_ACCESS_TOKEN);
  const { shape, style } = getShapeStyleForTopic(subtopic, level);

  const content = `
    <p style="font-size: 14px;"><strong>${subtopic.name}</strong></p>
    <p style="font-size: 12px;">${subtopic.description}</p>
    <p style="font-size: 12px;">Est. Time: ${subtopic.estimatedTime}</p>
    <p style="font-size: 12px;"><strong>Technologies:</strong> ${subtopic.technologiesAndConcepts.join(', ')}</p>
    <p style="font-size: 12px;"><strong>Prerequisites:</strong> ${subtopic.prerequisites.join(', ')}</p>
    <p style="font-size: 12px;"><strong>Resources:</strong> ${subtopic.resources.join(', ')}</p>
  `;

  const shapeData: EnhancedShapeDataForCreate = {
    content: content,
    shape: shape,
    style: style
  };

  const geometry: Geometry = calculateGeometry(content);
  const position: Position = { x, y, origin: 'center' };

  const { body } = await api._api.createShapeItem(boardId, {
    data: shapeData,
    geometry: geometry,
    position: position,
  });
  
  return { id: body.id };
}

async function createConnector(api: MiroApi, boardId: string, startShapeId: string, endShapeId: string) {
  const connectorStyle: ConnectorStyle = {
    strokeColor: '#000000',
    strokeWidth: '1',
    strokeStyle: 'normal',
    startStrokeCap: 'none',
    endStrokeCap: 'arrow',
  };

  await api._api.createConnector(boardId, {
    startItem: { id: startShapeId },
    endItem: { id: endShapeId },
    style: connectorStyle,
  });
}

function calculateGeometry(content: string): Geometry {
  const baseWidth = 250;
  const baseHeight = 120;
  const contentLength = content.length;

  return {
    width: Math.max(baseWidth, Math.min(500, contentLength * 5)),
    height: Math.max(baseHeight, Math.min(300, 80 + Math.ceil(contentLength / 30) * 20)),
  };
}

function getShapeStyleForTopic(topic: TopicData | SubtopicData, level: number): { shape: string; style: EnhancedShapeDataForCreate['style'] } {
  const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'];

  if (level === 0) {
    return {
      shape: 'round_rectangle',
      style: {
        fillColor: colors[0],
        textColor: '#000000',
        fontSize: 20,
        borderColor: '#000000',
        borderWidth: 2,
        borderStyle: 'normal'
      }
    };
  } else {
    return {
      shape: 'rectangle',
      style: {
        fillColor: colors[level % colors.length],
        textColor: '#000000',
        fontSize: 16,
        borderColor: '#000000',
        borderWidth: 1,
        borderStyle: 'normal'
      }
    };
  }
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

    const api = new MiroApi(MIRO_ACCESS_TOKEN)

    const board = await api.createBoard({
      name: `Learning Path: ${prompt}`,
      description: 'Automatically generated learning path based on official documentation',
    })

    await createLinearLearningPath(board.id, structuredData);

    return NextResponse.json({ boardUrl: board.viewLink });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ message: "An error occurred", status: 500 }, { status: 500 });
  }
}