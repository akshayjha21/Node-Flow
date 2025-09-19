import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Network, Settings, Activity, Cable } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Port {
  id: number;
  status: 'active' | 'inactive' | 'error';
  connectedDevice?: string;
  speed: '10M' | '100M' | '1G' | '10G';
}

interface ForwardingEntry {
  mac: string;
  port: number;
  age: number;
}

interface SwitchNodeProps {
  data: {
    label: string;
    isActive: boolean;
    ports?: Port[];
    forwardingTable?: ForwardingEntry[];
  };
  isConnectable: boolean;
}

const SwitchNode: React.FC<SwitchNodeProps> = ({ data, isConnectable }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default ports if none provided
  const ports: Port[] = data.ports || [
    { id: 1, status: 'active', connectedDevice: 'Router-1', speed: '1G' },
    { id: 2, status: 'active', connectedDevice: 'Client-A', speed: '100M' },
    { id: 3, status: 'inactive', speed: '1G' },
    { id: 4, status: 'inactive', speed: '1G' },
  ];

  // Default forwarding table if none provided
  const forwardingTable: ForwardingEntry[] = data.forwardingTable || [
    { mac: '00:1A:2B:3C:4D:5E', port: 1, age: 120 },
    { mac: '00:5F:67:89:AB:CD', port: 2, age: 45 },
    { mac: '00:EF:12:34:56:78', port: 1, age: 300 },
  ];

  const activePortsCount = ports.filter(p => p.status === 'active').length;

  return (
    <div 
      className={`relative px-4 py-3 border-2 rounded-lg bg-card text-card-foreground min-w-[140px] transition-all duration-300 cursor-pointer ${
        data.isActive 
          ? 'border-secondary glow-secondary animate-pulse-glow' 
          : 'border-border hover:border-secondary/50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection Handles */}
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
      
      {/* Main Content */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Network className={`w-6 h-6 ${data.isActive ? 'text-secondary' : 'text-muted-foreground'}`} />
          {isHovered && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-10">
              Click to configure
            </div>
          )}
        </div>
        
        <div className="text-sm font-medium">{data.label}</div>
        
        <div className="flex items-center gap-2">
          {data.isActive && (
            <Badge variant="default" className="text-xs animate-pulse">
              FORWARDING
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {activePortsCount}/4 ports
          </Badge>
        </div>

        {/* Port Indicators */}
        <div className="flex gap-1 mt-1">
          {ports.map((port) => (
            <div
              key={port.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                port.status === 'active' 
                  ? `bg-secondary ${data.isActive ? 'animate-pulse shadow-sm shadow-secondary' : ''}` 
                  : port.status === 'error'
                  ? 'bg-destructive animate-pulse'
                  : 'bg-muted-foreground/30'
              }`}
              title={`Port ${port.id}: ${port.status} (${port.speed})`}
            />
          ))}
        </div>

        {/* Learning indicator when active */}
        {data.isActive && (
          <div className="text-xs text-secondary/80 animate-pulse">
            Learning MACs...
          </div>
        )}
      </div>
    </div>
  );
};

export default SwitchNode;