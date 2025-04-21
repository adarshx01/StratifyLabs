//@ts-nocheck

"use client";

import { create } from "zustand";

// Define the structure of joint data
interface JointData {
  name: string;
  angle: number;
  min: number;
  max: number;
  controlRegion?: string;
  phaseOffset?: number;
  speed?: number;
}

// Simple interfaces just to satisfy type requirements
interface DetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: number;
}

interface DetectionResults {
  regions?: Record<string, number>;
  detections?: DetectionResult[];
  primaryDetection?: DetectionResult;
}

interface URDFJointState {
  joints: Record<string, JointData>;
  detectionResults: DetectionResults | null;
  useRandomMovement: boolean;
  lastUpdateTime: number;
  registerJoint: (name: string, min: number, max: number, controlRegion?: string) => void;
  updateJointAngle: (name: string, angle: number) => void;
  setDetectionResults: (results: DetectionResults) => void;
  updateJointsFromDetection: () => void;
  setUseRandomMovement: (value: boolean) => void;
  updateRandomJointMovements: () => void;
}

export const useURDFJointStore = create<URDFJointState>((set, get) => ({
  joints: {},
  detectionResults: null,
  useRandomMovement: true, // Enable random movement by default
  lastUpdateTime: Date.now(),
  
  registerJoint: (name, min, max, controlRegion = "center") => set((state) => ({
    joints: {
      ...state.joints,
      [name]: { 
        name, 
        angle: (min + max) / 2, // Start at middle position
        min, 
        max, 
        controlRegion,
        phaseOffset: Math.random() * Math.PI * 2, // Random phase offset for natural movement
        speed: 0.5 + Math.random() * 1.5 // Random speed multiplier between 0.5-2.0
      }
    }
  })),
  
  updateJointAngle: (name, angle) => set((state) => {
    if (!state.joints[name]) return state;
    
    // Ensure angle is within bounds
    const safeAngle = Math.max(
      state.joints[name].min, 
      Math.min(state.joints[name].max, Number(angle))
    );
    
    return {
      joints: {
        ...state.joints,
        [name]: { 
          ...state.joints[name], 
          angle: safeAngle
        }
      }
    };
  }),
  
  setDetectionResults: (results) => set({ detectionResults: results }),
  
  setUseRandomMovement: (value) => set({ useRandomMovement: value }),
  
  // Enhanced random movement function
  updateRandomJointMovements: () => {
    const { joints, useRandomMovement, lastUpdateTime } = get();
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTime) / 1000; // Time since last update in seconds
    
    // Even if not using random movement, we'll still do micro-movements for liveliness
    const movementIntensity = useRandomMovement ? 1.0 : 0.3;
    
    const updatedJoints = { ...joints };
    const t = currentTime / 1000; // Current time in seconds
    
    Object.keys(joints).forEach(jointName => {
      const joint = joints[jointName];
      const jointRange = joint.max - joint.min;
      const centerPosition = joint.min + jointRange * 0.5;
      const phaseOffset = joint.phaseOffset || 0;
      const speed = joint.speed || 1.0;
      
      // Calculate a complex but smooth motion pattern
      // Base movement - slow oscillation
      const baseFrequency = 0.2 * speed;
      const baseSin = Math.sin(t * baseFrequency + phaseOffset);
      const baseMovement = baseSin * 0.4 * movementIntensity;
      
      // Secondary movement - medium oscillation
      const secondaryFrequency = 0.5 * speed;
      const secondarySin = Math.sin(t * secondaryFrequency + phaseOffset * 2);
      const secondaryMovement = secondarySin * 0.15 * movementIntensity;
      
      // Tertiary movement - fast micro-oscillations for organic feel
      const tertiaryFrequency = 2.0 * speed;
      const tertiarySin = Math.sin(t * tertiaryFrequency + phaseOffset * 3);
      const tertiaryMovement = tertiarySin * 0.05 * movementIntensity;
      
      // Calculate final position factor (0-1 range)
      const positionFactor = 0.5 + (baseMovement + secondaryMovement + tertiaryMovement);
      
      // Calculate target angle
      const targetAngle = joint.min + (jointRange * positionFactor);
      
      // Apply smoothing for more natural movement
      // Faster movement toward target, slower as we approach
      const currentAngle = joint.angle;
      const distance = targetAngle - currentAngle;
      const easingFactor = Math.min(3.0 * deltaTime, 1.0); // Faster response
      
      const newAngle = currentAngle + distance * easingFactor;
      
      // Apply the new angle with constraints
      updatedJoints[jointName] = {
        ...joint,
        angle: Math.max(joint.min, Math.min(joint.max, newAngle))
      };
    });
    
    set({ 
      joints: updatedJoints,
      lastUpdateTime: currentTime
    });
  },
  
  // This function is no longer needed for API integration but kept for compatibility
  updateJointsFromDetection: () => {
    // We'll just call updateRandomJointMovements instead
    get().updateRandomJointMovements();
  }
}));