import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Zap, Shield, Clock } from 'lucide-react';

interface TrafficStats {
  packetsPerSecond: number;
  bandwidth: number;
  latency: number;
  anomalies: number;
}

interface TrafficMonitorProps {
  isSimulating: boolean;
}

const TrafficMonitor: React.FC<TrafficMonitorProps> = ({ isSimulating }) => {
  const [stats, setStats] = useState<TrafficStats>({
    packetsPerSecond: 0,
    bandwidth: 0,
    latency: 0,
    anomalies: 0,
  });

  // Simulate traffic data when simulation is running
  useEffect(() => {
    if (!isSimulating) {
      setStats({
        packetsPerSecond: 0,
        bandwidth: 0,
        latency: 0,
        anomalies: 0,
      });
      return;
    }

    const interval = setInterval(() => {
      setStats({
        packetsPerSecond: Math.floor(Math.random() * 1000) + 100,
        bandwidth: Math.floor(Math.random() * 100) + 20,
        latency: Math.floor(Math.random() * 50) + 10,
        anomalies: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Traffic Monitor</h3>
      </div>
      
      <div className="space-y-4">
        {/* Packets per Second */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Packets/sec</span>
            <span className="text-sm font-medium text-foreground">{stats.packetsPerSecond}</span>
          </div>
          <Progress 
            value={(stats.packetsPerSecond / 1100) * 100} 
            className="h-2 bg-muted"
          />
        </div>

        {/* Bandwidth Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Bandwidth</span>
            <span className="text-sm font-medium text-foreground">{stats.bandwidth}%</span>
          </div>
          <Progress 
            value={stats.bandwidth} 
            className="h-2 bg-muted"
          />
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Latency</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {stats.latency}ms
          </Badge>
        </div>

        {/* Anomalies */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Anomalies</span>
          </div>
          <Badge 
            variant={stats.anomalies > 0 ? "destructive" : "outline"} 
            className="text-xs"
          >
            {stats.anomalies}
          </Badge>
        </div>

        {/* Real-time Status */}
        <div className="mt-4 p-2 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <Zap className={`w-3 h-3 ${isSimulating ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">
              {isSimulating ? 'Monitoring live traffic' : 'No active monitoring'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrafficMonitor;