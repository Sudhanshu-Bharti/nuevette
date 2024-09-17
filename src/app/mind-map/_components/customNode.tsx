import React from 'react';
import { Handle, Position } from 'reactflow';
import { Subtopic, Topic } from '@/types/LearningPathTypes';
import { Badge } from "@/components/ui/badge"
import { Clock } from 'lucide-react';

export const TopicNode = ({ data }: { data: Topic }) => (
  <div className="p-4 rounded-lg bg-purple-600 text-white shadow-lg w-64 border-2 border-purple-400">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white" />
    <h3 className="font-bold text-lg mb-2 truncate">{data.name}</h3>
    <p className="text-sm text-purple-100 mb-3 line-clamp-2">{data.description}</p>
    <div className="text-xs flex items-center gap-2 text-purple-200 bg-purple-700 p-2 rounded">
      <Clock size={14} />
      <span>{data.estimatedTime}</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white" />
  </div>
);

export const SubtopicNode = ({ data }: { data: Subtopic }) => (
  <div className="p-4 rounded-lg bg-indigo-600 text-white shadow-lg w-64 border-2 border-indigo-400">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white" />
    <h3 className="font-bold text-lg mb-2 truncate">{data.name}</h3>
    <p className="text-sm text-indigo-100 mb-3 line-clamp-2">{data.description}</p>
    <div className="flex flex-wrap gap-2 mb-2">
      {data.technologiesAndConcepts.map((tech, index) => (
        <Badge key={index} className="bg-indigo-800 text-white text-xs px-2 py-1">
          {tech}
        </Badge>
      ))}
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white" />
  </div>
);