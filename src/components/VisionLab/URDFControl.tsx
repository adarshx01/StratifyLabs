//@ts-nocheck

"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileCode, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { URDFEditor } from "./URDFEditor";
import { DetectionURDFMapper } from "./DetectionURDFMapper";
import { create } from "zustand";
import { useURDFJointStore } from "./URDFJointControl";

// Store for managing URDF state
export const useURDFStore = create((set) => ({
  urdfContent: null,
  showModel: false,
  setUrdfContent: (content) => set({ urdfContent: content, showModel: true }),
  hideModel: () => set({ showModel: false }),
  toggleModel: () => set(state => ({ showModel: !state.showModel })),
}));

export function URDFControl() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isMapperOpen, setMapperOpen] = useState(false);
  const setUrdfContent = useURDFStore((state) => state.setUrdfContent);
  const showModel = useURDFStore((state) => state.showModel);
  const hideModel = useURDFStore((state) => state.hideModel);
  const updateRandomJointMovements = useURDFJointStore((state) => state.updateRandomJointMovements);
  const animationRef = useRef(null);

  const handleLoad = (content) => {
    if (content && content.trim()) {
      setUrdfContent(content);
      console.log("URDF content loaded successfully");
    }
  };

  const toggleEditor = () => {
    setEditorOpen(!isEditorOpen);
  };

  const toggleVisibility = () => {
    if (!showModel) {
      // If we're showing the model but don't have content, open the editor
      if (!useURDFStore.getState().urdfContent) {
        toggleEditor();
      } else {
        // Otherwise toggle visibility
        useURDFStore.getState().toggleModel();
      }
    } else {
      // Hide model
      hideModel();
    }
  };
  
  // Start animation loop for continuous joint movement
  useEffect(() => {
    console.log("Animation effect running, showModel:", showModel);
    
    if (showModel) {
      // Start animation loop for smooth movement
      const animateJoints = () => {
        updateRandomJointMovements();
        animationRef.current = requestAnimationFrame(animateJoints);
      };
      
      // Start the animation loop
      console.log("Starting animation loop");
      animationRef.current = requestAnimationFrame(animateJoints);
      
      // Log joint state periodically for debugging
      const debugInterval = setInterval(() => {
        const joints = useURDFJointStore.getState().joints;
        const jointNames = Object.keys(joints);
        if (jointNames.length > 0) {
          console.log("Active joints:", jointNames.length);
          console.log("Sample joint:", jointNames[0], joints[jointNames[0]].angle);
        }
      }, 2000);
      
      return () => {
        // Clean up animation loop
        console.log("Cleaning up animation loop");
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearInterval(debugInterval);
      };
    }
  }, [showModel, updateRandomJointMovements]);

  return (
    <>
      <Button
        onClick={toggleVisibility}
        className="rounded-full p-3 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <FileCode className="h-5 w-5 mr-2" />
        <span>{showModel ? "Hide URDF" : "Load URDF"}</span>
      </Button>
      
      {showModel && (
        <>
          <Button
            onClick={toggleEditor}
            className="rounded-full p-3 bg-green-600 hover:bg-green-700 text-white"
          >
            <FileCode className="h-5 w-5 mr-2" />
            <span>Edit URDF</span>
          </Button>
          
          <Button
            onClick={() => setMapperOpen(true)}
            className="rounded-full p-3 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Link2 className="h-5 w-5 mr-2" />
            <span>Map Joints</span>
          </Button>
        </>
      )}
      
      <URDFEditor 
        isOpen={isEditorOpen} 
        onClose={() => setEditorOpen(false)} 
        onLoad={handleLoad}
      />
      
      <DetectionURDFMapper
        isOpen={isMapperOpen}
        onClose={() => setMapperOpen(false)}
      />
    </>
  );
}