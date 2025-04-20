"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Copy, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useURDFStore } from "./URDFControl";

// Basic sample URDF for users to start with
const emptyTemplateUrdf = `<robot name="my_robot">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.3 0.3 0.3"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
  </link>
</robot>`;

export function URDFEditor({ isOpen, onClose, onLoad }) {
  const currentContent = useURDFStore(state => state.urdfContent);
  const [urdfContent, setUrdfContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Load current content or template when opening
  useEffect(() => {
    if (isOpen) {
      setUrdfContent(currentContent || emptyTemplateUrdf);
    }
  }, [isOpen, currentContent]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(urdfContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUrdfContent(event.target.result.toString());
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([urdfContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robot.urdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    if (urdfContent.trim()) {
      onLoad(urdfContent);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>URDF Model Editor</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            
            <Button variant="outline" size="sm" component="label">
              <Upload className="h-4 w-4 mr-1" />
              Upload
              <input
                type="file"
                accept=".urdf,.xml"
                className="hidden"
                onChange={handleLoadFile}
              />
            </Button>
          </div>
          
          <Textarea
            placeholder="Enter URDF XML code here..."
            value={urdfContent}
            onChange={(e) => setUrdfContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm p-4"
          />
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Basic URDF structure: &lt;robot&gt; → &lt;link&gt; → &lt;visual&gt; → &lt;geometry&gt;</p>
            <p>Use &lt;box&gt;, &lt;cylinder&gt;, &lt;sphere&gt; for basic shapes</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleLoadClick}>
            Load URDF Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}