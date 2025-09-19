import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Activity, TrendingUp, Network, Zap, Cable, AlertTriangle } from 'lucide-react';

interface TrafficData {
  timestamp: string;
  packetsPerSecond: number;
  bandwidth: number;
  latency: number;
}

interface SwitchStats {
  id: string;
  name: string;
  activePorts: number;
  totalPorts: number;
  macEntries: number;
  throughput: number;
  utilization: number;
  errors: number;
}

interface TrafficMonitorProps {
  isSimulating: boolean;
}

const TrafficMonitor: React.FC<TrafficMonitorProps> = ({ isSimulating }) => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [switchStats, setSwitchStats] = useState<SwitchStats[]>([
    { id: '1', name: 'Switch 1', activePorts: 3, totalPorts: 4, macEntries: 247, throughput: 89.5, utilization: 67, errors: 0 },
    { id: '2', name: 'Switch 2', activePorts: 2, totalPorts: 4, macEntries: 156, throughput: 45.2, utilization: 34, errors: 1 },
  ]);

  useEffect(() => {
    if (!isSimulating) {
      setTrafficData([]);
      return;
    }

    const interval = setInterval(() => {
      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        packetsPerSecond: Math.floor(Math.random() * 1000) + 100,
        bandwidth: Math.random() * 100 + 20,
        latency: Math.floor(Math.random() * 50) + 10,
      };

      setTrafficData((prev) => {
        const updated = [...prev, newData];
        return updated.slice(-20); // Keep last 20 entries
      });
      
      // Update switch stats
      setSwitchStats(prev => prev.map(sw => ({
        ...sw,
        throughput: Math.random() * 100,
        utilization: Math.random() * 80 + 10,
        macEntries: Math.max(0, sw.macEntries + Math.floor(Math.random() * 5) - 2),
        errors: Math.random() > 0.95 ? sw.errors + 1 : sw.errors
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentStats = trafficData.length > 0 ? trafficData[trafficData.length - 1] : null;

  return (
    <Card className="h-full p-4 bg-card border-border overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-card-foreground">Network Monitor</h3>
        {isSimulating && (
          <Badge variant="default" className="ml-auto">
            LIVE
          </Badge>
        )}
      </div>

      <div className="space-y-4 overflow-y-auto h-[calc(100%-60px)]">
        {/* Real-time Stats */}
        {currentStats && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Packets/sec</span>
                </div>
                <div className="text-lg font-bold text-accent">
                  {currentStats.packetsPerSecond.toLocaleString()}
                </div>
              </div>
              <div className="bg-muted/20 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Bandwidth</span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {currentStats.bandwidth.toFixed(1)} MB/s
                </div>
              </div>
            </div>

            <div className="bg-muted/20 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Network Latency</span>
                <span className="text-sm font-medium">{currentStats.latency}ms</span>
              </div>
              <Progress 
                value={Math.min(currentStats.latency / 10, 100)} 
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Switch Statistics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-secondary" />
            <h4 className="font-medium text-sm">Switch Status</h4>
          </div>
          
          {switchStats.map((sw) => (
            <Card key={sw.id} className="p-3 bg-muted/20 border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{sw.name}</span>
                {sw.errors > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {sw.errors} errors
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Ports Active</span>
                  <span className="font-medium">{sw.activePorts}/{sw.totalPorts}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">MAC Entries</span>
                  <span className="font-medium">{sw.macEntries}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium">{sw.utilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={sw.utilization} className="h-1" />
                </div>
                
                <div className="flex items-center gap-1 pt-1">
                  <Cable className="w-3 h-3 text-secondary" />
                  <span className="text-xs text-muted-foreground">
                    {sw.throughput.toFixed(1)} Mbps throughput
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Traffic History */}
        {trafficData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Activity</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {trafficData.slice(-10).reverse().map((data, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground">{data.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-accent">{data.packetsPerSecond} pps</span>
                    <span className="text-primary">{data.bandwidth.toFixed(1)} MB/s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isSimulating && (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Start simulation to monitor traffic</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrafficMonitor;