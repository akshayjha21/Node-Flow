import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import RouterNode from './nodes/RouterNode';
import SwitchNode from './nodes/SwitchNode';
import ClientNode from './nodes/ClientNode';

const nodeTypes = {
  router: RouterNode,
  switch: SwitchNode,
  client: ClientNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'router',
    position: { x: 250, y: 250 },
    data: { label: 'Router 1', isActive: false },
  },
  {
    id: '2',
    type: 'switch',
    position: { x: 100, y: 100 },
    data: { label: 'Switch 1', isActive: false },
  },
  {
    id: '3',
    type: 'client',
    position: { x: 400, y: 100 },
    data: { label: 'Client 1', isActive: false },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: false,
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: false,
    style: { stroke: 'hsl(var(--primary))' },
  },
];

interface NetworkCanvasProps {
  isSimulating: boolean;
  onSwitchSelect?: (switchInfo: {id: string, name: string}) => void;
}

const NetworkCanvas: React.FC<NetworkCanvasProps> = ({ isSimulating, onSwitchSelect }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          { 
            ...params, 
            animated: isSimulating,
            style: { 
              stroke: isSimulating ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
              strokeWidth: isSimulating ? 2 : 1,
            },
          },
          eds
        )
      ),
    [setEdges, isSimulating]
  );

  // Update edges animation when simulation state changes
  React.useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: isSimulating,
        style: {
          ...edge.style,
          stroke: isSimulating ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
          strokeWidth: isSimulating ? 2 : 1,
        },
      }))
    );
  }, [isSimulating, setEdges]);

  // Update nodes active state when simulation changes
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isActive: isSimulating,
        },
      }))
    );
  }, [isSimulating, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${nodes.length + 1}`,
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
          isActive: isSimulating,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes.length, setNodes, isSimulating]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === 'switch' && onSwitchSelect) {
        onSwitchSelect({ id: node.id, name: node.data.label });
      }
    },
    [onSwitchSelect]
  );

  return (
    <div className="w-full h-full bg-gradient-tech rounded-lg border border-border overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        className="bg-transparent"
        fitView
      >
        <Controls className="bg-card border-border" />
        <MiniMap 
          className="bg-card border border-border rounded"
          nodeColor="#hsl(var(--primary))"
          maskColor="rgba(0, 0, 0, 0.2)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="hsl(var(--border))"
        />
      </ReactFlow>
    </div>
  );
};

export default NetworkCanvas;