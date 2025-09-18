import React from 'react';
import { Handle, Position } from 'reactflow';
import { Network } from 'lucide-react';

interface SwitchNodeProps {
  data: {
    label: string;
    isActive: boolean;
  };
  isConnectable: boolean;
}

const SwitchNode: React.FC<SwitchNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className={`px-4 py-3 border-2 rounded-lg bg-card text-card-foreground min-w-[120px] text-center transition-all duration-300 ${
      data.isActive 
        ? 'border-secondary glow-secondary animate-pulse-glow' 
        : 'border-border hover:border-secondary/50'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-secondary border-2 border-secondary-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-secondary border-2 border-secondary-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-secondary border-2 border-secondary-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-secondary border-2 border-secondary-foreground"
        isConnectable={isConnectable}
      />
      
      <div className="flex flex-col items-center gap-2">
        <Network className={`w-6 h-6 ${data.isActive ? 'text-secondary' : 'text-muted-foreground'}`} />
        <div className="text-sm font-medium">{data.label}</div>
        {data.isActive && (
          <div className="text-xs text-accent font-medium">ACTIVE</div>
        )}
      </div>
    </div>
  );
};

export default SwitchNode;