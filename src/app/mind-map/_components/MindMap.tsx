"use client"
import React, { useCallback } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  ConnectionLineType, 
  useNodesState, 
  useEdgesState,
  Background,
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { LearningPath } from '@/types/LearningPathTypes';
import { TopicNode, SubtopicNode } from './customNode';

const nodeTypes = {
  topic: TopicNode,
  subtopic: SubtopicNode,
};

interface MindMapProps {
  learningPath: LearningPath
}

const MindMap: React.FC<MindMapProps> = ({ learningPath }) => {
  const createNodesAndEdges = useCallback(() => {
    let nodeId = 0;
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Main node
    nodes.push({
      id: `${nodeId}`,
      data: { label: learningPath.name },
      position: { x: 0, y: 0 },
      type: 'input',
    });

    learningPath.topics.forEach((topic, topicIndex) => {
      const topicNodeId = `${++nodeId}`;
      nodes.push({
        id: topicNodeId,
        data: { 
          label: topic.name,
          description: topic.description, 
          estimatedTime: topic.estimatedTime
        },
        position: { x: (topicIndex + 1) * 300, y: 100 },
        type: 'topic',
      });
      edges.push({
        id: `e0-${topicNodeId}`,
        source: '0',
        target: topicNodeId,
        type: ConnectionLineType.SmoothStep,
        className: 'animate-pulse'
      });

      topic.subtopics.forEach((subtopic, subtopicIndex) => {
        const subtopicNodeId = `${++nodeId}`;
        nodes.push({
          id: subtopicNodeId,
          data: { 
            label: subtopic.name, 
            description: subtopic.description,
            resources: subtopic.resources,
            prerequisites: subtopic.prerequisites,
            technologiesAndConcepts: subtopic.technologiesAndConcepts
          },
          position: { x: (topicIndex + 1) * 300, y: (subtopicIndex + 2) * 300 },
          type: 'subtopic',
        });
        edges.push({
          id: `e${topicNodeId}-${subtopicNodeId}`,
          source: topicNodeId,
          target: subtopicNodeId,
          type: ConnectionLineType.SmoothStep,
          className: 'animate-pulse'
        });
      });
    });

    return { nodes, edges };
  }, [learningPath]);

  const { nodes: initialNodesResult, edges: initialEdgesResult } = createNodesAndEdges();
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodesResult);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdgesResult);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Background color="#e0e0e0" />
        <Controls className="bg-white rounded-lg shadow-md" />
        {/* <MiniMap maskColor='rgb(24, 24, 24, 0.6)' /> */}
      </ReactFlow>
    </div>
  );
};

export default MindMap;