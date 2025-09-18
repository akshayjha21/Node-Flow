import React, { useState } from 'react';
import { Activity, Network, Zap } from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import NodeToolbar from '../components/NodeToolbar';
import SimulationControls from '../components/SimulationControls';
import TrafficMonitor from '../components/TrafficMonitor';

const Index = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStartSimulation = () => {
    setIsSimulating(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  NodeFlow
                </h1>
              </div>
              <div className="text-sm text-muted-foreground">
                Interactive Traffic Monitoring for Learning Network Basics
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                isSimulating 
                  ? 'border-accent/30 bg-accent/10 text-accent' 
                  : 'border-border bg-card text-muted-foreground'
              }`}>
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isSimulating ? 'Live' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-4">
            <NodeToolbar />
            <SimulationControls
              isSimulating={isSimulating}
              onStartSimulation={handleStartSimulation}
              onPauseSimulation={handlePauseSimulation}
              onStopSimulation={handleStopSimulation}
            />
          </div>

          {/* Network Canvas */}
          <div className="col-span-6">
            <div className="h-full relative">
              <NetworkCanvas isSimulating={isSimulating} />
              {isSimulating && (
                <div className="absolute top-4 right-4 bg-accent/20 border border-accent/30 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent animate-pulse" />
                    <span className="text-sm text-accent font-medium">Simulation Running</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3">
            <TrafficMonitor isSimulating={isSimulating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
