"use client";

import React, { useState } from "react";
import { FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { URDFEditor } from "./URDFEditor";
import { create } from "zustand";

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
  const setUrdfContent = useURDFStore((state) => state.setUrdfContent);
  const showModel = useURDFStore((state) => state.showModel);
  const hideModel = useURDFStore((state) => state.hideModel);

  const handleLoad = (content) => {
    if (content && content.trim()) {
      setUrdfContent(content);
    }
  };

  const toggleEditor = () => {
    setEditorOpen(true);
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
        <Button
          onClick={toggleEditor}
          className="rounded-full p-3 bg-green-600 hover:bg-green-700 text-white"
        >
          <FileCode className="h-5 w-5 mr-2" />
          <span>Edit URDF</span>
        </Button>
      )}
      
      <URDFEditor 
        isOpen={isEditorOpen} 
        onClose={() => setEditorOpen(false)} 
        onLoad={handleLoad}
      />
    </>
  );
}