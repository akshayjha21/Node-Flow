import React from 'react';
import { Handle, Position } from 'reactflow';
import { Monitor } from 'lucide-react';

interface ClientNodeProps {
  data: {
    label: string;
    isActive: boolean;
  };
  isConnectable: boolean;
}

const ClientNode: React.FC<ClientNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className={`px-4 py-3 border-2 rounded-lg bg-card text-card-foreground min-w-[120px] text-center transition-all duration-300 ${
      data.isActive 
        ? 'border-accent glow-accent animate-pulse-glow' 
        : 'border-border hover:border-accent/50'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-accent border-2 border-accent-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-accent border-2 border-accent-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-accent border-2 border-accent-foreground"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-accent border-2 border-accent-foreground"
        isConnectable={isConnectable}
      />
      
      <div className="flex flex-col items-center gap-2">
        <Monitor className={`w-6 h-6 ${data.isActive ? 'text-accent' : 'text-muted-foreground'}`} />
        <div className="text-sm font-medium">{data.label}</div>
        {data.isActive && (
          <div className="text-xs text-accent font-medium">CONNECTED</div>
        )}
      </div>
    </div>
  );
};

export default ClientNode;