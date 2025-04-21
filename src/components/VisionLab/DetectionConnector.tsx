"use client";

import { useState, useEffect, useRef } from "react";
import { useURDFJointStore } from "./URDFJointControl";
import { useURDFStore } from "./URDFControl";

/**
 * This component is now simplified to just simulate detection data
 * rather than connecting to an external API
 */
export function DetectionConnector() {
  const [connected, setConnected] = useState(false);
  const showModel = useURDFStore((state) => state.showModel);
  const updateJointsFromDetection = useURDFJointStore((state) => state.updateJointsFromDetection);
  const useRandomMovement = useURDFJointStore((state) => state.useRandomMovement);
  
  // Connect to simulated data
  useEffect(() => {
    // Only run when the model is visible
    if (!showModel) return;
    
    console.log("DetectionConnector mounted - will update joints directly");
    
    // Simple interval to trigger joint updates
    const interval = setInterval(() => {
      // Just update joints directly - no API needed
      updateJointsFromDetection();
    }, 50); // Update quickly for smooth motion
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
    };
  }, [showModel, updateJointsFromDetection, useRandomMovement]);
  
  // This component doesn't render anything visible
  return null;
}