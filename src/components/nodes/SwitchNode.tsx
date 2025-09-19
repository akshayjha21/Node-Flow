import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Network, Settings, Activity, Cable } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
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
    <div className={`relative px-4 py-3 border-2 rounded-lg bg-card text-card-foreground min-w-[140px] transition-all duration-300 ${
      data.isActive 
        ? 'border-secondary glow-secondary animate-pulse-glow' 
        : 'border-border hover:border-secondary/50'
    }`}>
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
          <Popover open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-secondary/20"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" side="right">
              <Card className="border-0 shadow-lg">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">{data.label} Configuration</h3>
                  </div>
                  
                  {/* Port Status */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Cable className="w-4 h-4" />
                      Port Status ({activePortsCount}/4 active)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {ports.map((port) => (
                        <div key={port.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-xs font-medium">Port {port.id}</span>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant={port.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs h-5"
                            >
                              {port.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{port.speed}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Forwarding Table */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      MAC Address Table
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {forwardingTable.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                          <span className="font-mono">{entry.mac}</span>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>P{entry.port}</span>
                            <span>{entry.age}s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="text-sm font-medium">{data.label}</div>
        
        <div className="flex items-center gap-2">
          {data.isActive && (
            <Badge variant="default" className="text-xs">
              ACTIVE
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
              className={`w-2 h-2 rounded-full ${
                port.status === 'active' 
                  ? 'bg-secondary animate-pulse' 
                  : port.status === 'error'
                  ? 'bg-destructive'
                  : 'bg-muted-foreground/30'
              }`}
              title={`Port ${port.id}: ${port.status} (${port.speed})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwitchNode;