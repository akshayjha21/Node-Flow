import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, Pause, Square, Activity } from 'lucide-react';

interface SimulationControlsProps {
  isSimulating: boolean;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onStopSimulation: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isSimulating,
  onStartSimulation,
  onPauseSimulation,
  onStopSimulation,
}) => {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Simulation Controls</h3>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onStartSimulation}
          disabled={isSimulating}
          size="sm"
          className="bg-gradient-primary hover:opacity-90 border-0"
        >
          <Play className="w-4 h-4 mr-1" />
          Start
        </Button>
        
        <Button
          onClick={onPauseSimulation}
          disabled={!isSimulating}
          variant="outline"
          size="sm"
          className="border-border hover:bg-muted"
        >
          <Pause className="w-4 h-4 mr-1" />
          Pause
        </Button>
        
        <Button
          onClick={onStopSimulation}
          variant="outline"
          size="sm"
          className="border-border hover:bg-destructive/10 hover:border-destructive"
        >
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isSimulating ? 'bg-accent animate-pulse-glow' : 'bg-muted'
        }`} />
        <span className="text-xs text-muted-foreground">
          {isSimulating ? 'Simulation Active' : 'Simulation Stopped'}
        </span>
      </div>
    </Card>
  );
};

export default SimulationControls;