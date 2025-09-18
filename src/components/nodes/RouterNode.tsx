import React from 'react';
import { Handle, Position } from 'reactflow';
import { Router } from 'lucide-react';

interface RouterNodeProps {
  data: {
    label: string;
    isActive: boolean;
  };
  isConnectable: boolean;
}

const RouterNode: React.FC<RouterNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className={`px-4 py-3 border-2 rounded-lg bg-card text-card-foreground min-w-[120px] text-center transition-all duration-300 ${
      data.isActive 
        ? 'border-primary glow-primary animate-pulse-glow' 
        : 'border-border hover:border-primary/50'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-primary-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-primary-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-primary-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-primary-foreground"
        isConnectable={isConnectable}
      />
      
      <div className="flex flex-col items-center gap-2">
        <Router className={`w-6 h-6 ${data.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
        <div className="text-sm font-medium">{data.label}</div>
        {data.isActive && (
          <div className="text-xs text-accent font-medium">ACTIVE</div>
        )}
      </div>
    </div>
  );
};

export default RouterNode;