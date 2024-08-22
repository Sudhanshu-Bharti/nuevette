import React from 'react';
import { Handle, Position } from 'reactflow';
import { Subtopic, Topic } from '@/types/LearningPathTypes';
import { Badge } from "@/components/ui/badge"
import { Clock } from 'lucide-react';

export const TopicNode = ({ data }: { data: Topic }) => (
  <div className="p-4 rounded-3xl  bg-slate-700 border text-white  shadow-lg w-64 max-w-full">
    <Handle type="target" position={Position.Top} />
    <div className="font-bold text-lg mb-2 break-words">{data.name}</div>
    <div className="text-sm text-white  mb-2 break-words">{data.description}</div>
    <div className="text-xs   flex items-center gap-2 text-emerald-400">
      <Clock size={15} />
      <span className="">{data.estimatedTime}</span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export const SubtopicNode = ({ data }: { data: Subtopic }) => (
  <div className="p-4 rounded-3xl bg-slate-700 border text-white shadow-md w-64 max-w-full">
    <Handle type="target" position={Position.Top} />
    <div className="font-semibold mb-2 break-words">{data.name}</div>
    <div className="text-xs text-white mb-2 break-words">{data.description}</div>
    <div className="text-sm font-semibold text-gray-200 mb-2">Technologies:</div>
    <div className="flex flex-wrap gap-1">
      {data.technologiesAndConcepts.map((tech, index) => (
        <Badge key={index} className="text-xs px-2 py-1 break-words">
          {tech}
        </Badge>
      ))}
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);