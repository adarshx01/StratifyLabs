//@ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useURDFJointStore } from "./URDFJointControl";
import { useURDFStore } from "./URDFControl";
import { Loader2, Settings } from "lucide-react";

// Define regions for mapping (these won't affect movement now, just for UI)
const REGIONS = [
  { id: "topLeft", name: "Top Left" },
  { id: "top", name: "Top" },
  { id: "topRight", name: "Top Right" },
  { id: "left", name: "Left" },
  { id: "center", name: "Center" },
  { id: "right", name: "Right" },
  { id: "bottomLeft", name: "Bottom Left" },
  { id: "bottom", name: "Bottom" },
  { id: "bottomRight", name: "Bottom Right" }
];

export function DetectionURDFMapper({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const joints = useURDFJointStore((state) => state.joints);
  const updateJointAngle = useURDFJointStore((state) => state.updateJointAngle);
  const registerJoint = useURDFJointStore((state) => state.registerJoint);
  
  // For manually testing joint movements
  const [selectedJoint, setSelectedJoint] = useState("");
  const [testAngle, setTestAngle] = useState(0);
  const [useRandomMovement, setUseRandomMovement] = useState(
    useURDFJointStore.getState().useRandomMovement
  );
  
  // When a region is selected for a joint
  const handleMapJointRegion = (jointName, regionId) => {
    if (!joints[jointName]) return;
    
    // Re-register the joint with the new region
    registerJoint(
      jointName,
      joints[jointName].min,
      joints[jointName].max,
      regionId
    );
  };
  
  // Handle testing a joint angle
  const handleTestJoint = () => {
    if (selectedJoint && selectedJoint in joints) {
      updateJointAngle(selectedJoint, parseFloat(testAngle));
    }
  };
  
  // Toggle random movement mode with immediate visual feedback
  const toggleRandomMovement = () => {
    const newValue = !useRandomMovement;
    setUseRandomMovement(newValue);
    useURDFJointStore.getState().setUseRandomMovement(newValue);
    
    // Log for debugging
    console.log(`Random movement ${newValue ? "enabled" : "disabled"}`);
  };
  
  // Update test angle when joint selection changes
  useEffect(() => {
    if (selectedJoint && joints[selectedJoint]) {
      setTestAngle(joints[selectedJoint].angle);
    }
  }, [selectedJoint, joints]);
  
  // Add this additional effect to ensure random movement stays consistent
  // with the UI toggle when the dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      // When dialog opens, sync the UI with the actual state
      setUseRandomMovement(useURDFJointStore.getState().useRandomMovement);
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>URDF Joint Control</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="mapping">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mapping">Movement Controls</TabsTrigger>
            <TabsTrigger value="testing">Joint Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mapping" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <Button 
                  onClick={toggleRandomMovement} 
                  variant={useRandomMovement ? "default" : "outline"}
                  className={useRandomMovement ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {useRandomMovement ? "Random Movement ON" : "Random Movement OFF"}
                </Button>
                <p className="text-sm opacity-70">
                  {useRandomMovement 
                    ? "Joints are moving with natural patterns" 
                    : "Joints will move minimally"}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded">
                <h4 className="font-medium mb-2">Movement Settings</h4>
                <p className="text-sm mb-4">
                  Your URDF model will move with natural patterns to showcase the 
                  articulation of the joints. The movements are procedurally generated.
                </p>
                <p className="text-sm">
                  Found {Object.keys(joints).length} active joints in your model.
                </p>
              </div>
              
              {Object.keys(joints).length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(joints).map(jointName => (
                    <div key={jointName} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded">
                      <span className="font-mono text-sm">{jointName}</span>
                      <div className="text-xs opacity-70">
                        Range: [{joints[jointName].min.toFixed(2)} to {joints[jointName].max.toFixed(2)}]
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-amber-500 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  No joints found in current URDF model. Load a URDF model with joints first.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4 mt-4">
            <p className="text-sm">
              Test joint movements manually by selecting a joint and setting its angle.
            </p>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <Label className="col-span-1">Joint</Label>
              <Select 
                value={selectedJoint} 
                onValueChange={setSelectedJoint}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select joint" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(joints).map(jointName => (
                    <SelectItem key={jointName} value={jointName}>
                      {jointName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedJoint && joints[selectedJoint] && (
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="col-span-1">Angle</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Input
                    type="range"
                    min={selectedJoint ? joints[selectedJoint]?.min || -3.14 : -3.14}
                    max={selectedJoint ? joints[selectedJoint]?.max || 3.14 : 3.14}
                    step="0.01"
                    value={testAngle}
                    onChange={(e) => setTestAngle(e.target.value)}
                  />
                  <Input 
                    type="number"
                    className="w-20"
                    value={testAngle}
                    onChange={(e) => setTestAngle(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleTestJoint} 
              className="mt-2"
              disabled={!selectedJoint}
            >
              Test Joint
            </Button>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}