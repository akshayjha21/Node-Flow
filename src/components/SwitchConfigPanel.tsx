import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Network, Settings, Activity, Cable, Plus, Trash2 } from 'lucide-react';

interface Port {
  id: number;
  status: 'active' | 'inactive' | 'error';
  connectedDevice?: string;
  speed: '10M' | '100M' | '1G' | '10G';
  vlan?: number;
}

interface VLAN {
  id: number;
  name: string;
  ports: number[];
}

interface SwitchConfigPanelProps {
  switchId: string;
  switchName: string;
  onClose: () => void;
}

const SwitchConfigPanel: React.FC<SwitchConfigPanelProps> = ({
  switchId,
  switchName,
  onClose
}) => {
  const [ports, setPorts] = useState<Port[]>([
    { id: 1, status: 'active', connectedDevice: 'Router-1', speed: '1G', vlan: 1 },
    { id: 2, status: 'active', connectedDevice: 'Client-A', speed: '100M', vlan: 1 },
    { id: 3, status: 'inactive', speed: '1G', vlan: 1 },
    { id: 4, status: 'inactive', speed: '1G', vlan: 1 },
  ]);

  const [vlans, setVlans] = useState<VLAN[]>([
    { id: 1, name: 'Default', ports: [1, 2, 3, 4] },
    { id: 10, name: 'Management', ports: [] },
  ]);

  const [newVlanName, setNewVlanName] = useState('');
  const [newVlanId, setNewVlanId] = useState('');

  const togglePortStatus = (portId: number) => {
    setPorts(prev => prev.map(port => 
      port.id === portId 
        ? { ...port, status: port.status === 'active' ? 'inactive' : 'active' }
        : port
    ));
  };

  const updatePortSpeed = (portId: number, speed: Port['speed']) => {
    setPorts(prev => prev.map(port => 
      port.id === portId ? { ...port, speed } : port
    ));
  };

  const addVlan = () => {
    if (newVlanName && newVlanId && !vlans.find(v => v.id === parseInt(newVlanId))) {
      setVlans(prev => [...prev, {
        id: parseInt(newVlanId),
        name: newVlanName,
        ports: []
      }]);
      setNewVlanName('');
      setNewVlanId('');
    }
  };

  const removeVlan = (vlanId: number) => {
    if (vlanId !== 1) { // Don't allow removing default VLAN
      setVlans(prev => prev.filter(v => v.id !== vlanId));
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-card border-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-secondary" />
            <div>
              <h2 className="text-xl font-semibold">{switchName}</h2>
              <p className="text-sm text-muted-foreground">Switch Configuration</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-6">
          {/* Port Configuration */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Cable className="w-5 h-5" />
              Port Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {ports.map((port) => (
                <Card key={port.id} className="p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Port {port.id}</h4>
                    <Switch 
                      checked={port.status === 'active'}
                      onCheckedChange={() => togglePortStatus(port.id)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Speed</Label>
                      <Select 
                        value={port.speed} 
                        onValueChange={(value: Port['speed']) => updatePortSpeed(port.id, value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10M">10 Mbps</SelectItem>
                          <SelectItem value="100M">100 Mbps</SelectItem>
                          <SelectItem value="1G">1 Gbps</SelectItem>
                          <SelectItem value="10G">10 Gbps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={port.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {port.status.toUpperCase()}
                      </Badge>
                      {port.connectedDevice && (
                        <Badge variant="outline" className="text-xs">
                          {port.connectedDevice}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* VLAN Configuration */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              VLAN Configuration
            </h3>
            
            {/* Add New VLAN */}
            <Card className="p-4 mb-4 bg-muted/10">
              <h4 className="font-medium mb-3">Add New VLAN</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="VLAN ID"
                  type="number"
                  value={newVlanId}
                  onChange={(e) => setNewVlanId(e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="VLAN Name"
                  value={newVlanName}
                  onChange={(e) => setNewVlanName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addVlan} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Existing VLANs */}
            <div className="space-y-3">
              {vlans.map((vlan) => (
                <Card key={vlan.id} className="p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">VLAN {vlan.id}</Badge>
                        <span className="font-medium">{vlan.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ports: {vlan.ports.length > 0 ? vlan.ports.join(', ') : 'None'}
                      </p>
                    </div>
                    {vlan.id !== 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeVlan(vlan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Statistics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center bg-muted/20">
                <div className="text-2xl font-bold text-secondary">{ports.filter(p => p.status === 'active').length}</div>
                <div className="text-sm text-muted-foreground">Active Ports</div>
              </Card>
              <Card className="p-4 text-center bg-muted/20">
                <div className="text-2xl font-bold text-accent">1,247</div>
                <div className="text-sm text-muted-foreground">MAC Entries</div>
              </Card>
              <Card className="p-4 text-center bg-muted/20">
                <div className="text-2xl font-bold text-primary">99.8%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SwitchConfigPanel;
