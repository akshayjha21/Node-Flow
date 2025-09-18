import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Router, Network, Monitor } from 'lucide-react';

const NodeToolbar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-semibold mb-3 text-card-foreground">Network Devices</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-auto py-3 border-border hover:border-primary/50 hover:bg-primary/10"
          draggable
          onDragStart={(event) => onDragStart(event, 'router')}
        >
          <Router className="w-4 h-4 text-primary" />
          <span className="text-sm">Router</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-auto py-3 border-border hover:border-secondary/50 hover:bg-secondary/10"
          draggable
          onDragStart={(event) => onDragStart(event, 'switch')}
        >
          <Network className="w-4 h-4 text-secondary" />
          <span className="text-sm">Switch</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-auto py-3 border-border hover:border-accent/50 hover:bg-accent/10"
          draggable
          onDragStart={(event) => onDragStart(event, 'client')}
        >
          <Monitor className="w-4 h-4 text-accent" />
          <span className="text-sm">Client</span>
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">
          Drag devices to the canvas to build your network topology
        </p>
      </div>
    </Card>
  );
};

export default NodeToolbar;