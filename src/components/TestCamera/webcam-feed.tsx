"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Shield, Power, Zap, Maximize, Settings, RefreshCcw, CheckCircle, XCircle } from "lucide-react"

interface WebcamFeedProps {
  isActive: boolean;
  customModelPath?: string;
  customDatasetPath?: string;
  customNumClasses?: string;
  selectedTask?: string;
  selectedModel?: string;
}

interface ModelInfo {
  status: string;
  task_type?: string;
  model_name?: string;
  model_path?: string;
  dataset_path?: string;
  num_classes?: number;
  message?: string;
}

const WebcamFeed = forwardRef<{triggerLoadModel: () => void}, WebcamFeedProps>(({
  isActive, 
  customModelPath, 
  customDatasetPath,
  customNumClasses,
  selectedTask,
  selectedModel
}, ref) => {
  // State for model selection and UI control
  const [showControls, setShowControls] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<Record<string, string[]>>({});
  const [localSelectedTask, setLocalSelectedTask] = useState<string>("");
  const [localSelectedModel, setLocalSelectedModel] = useState<string>("");
  const [numClasses, setNumClasses] = useState<string>("7");
  const [modelPath, setModelPath] = useState<string>("");
  const [datasetPath, setDatasetPath] = useState<string>("");
  const [currentModel, setCurrentModel] = useState<ModelInfo | null>(null);
  const [notification, setNotification] = useState<{message: string, isSuccess: boolean} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "http://localhost:8001";

  // Expose loadModel method to parent
  useImperativeHandle(ref, () => ({
    triggerLoadModel: () => {
      loadModel();
    }
  }));

  // Update local state when props change
  useEffect(() => {
    if (customModelPath) {
      setModelPath(customModelPath);
    }
    if (customDatasetPath) {
      setDatasetPath(customDatasetPath);
    }
    if (customNumClasses) {
      setNumClasses(customNumClasses);
    }
    if (selectedTask) {
      setLocalSelectedTask(selectedTask);
    }
    if (selectedModel) {
      setLocalSelectedModel(selectedModel);
    }
  }, [customModelPath, customDatasetPath, customNumClasses, selectedTask, selectedModel]);

  // Fetch available models and current model on component mount
  useEffect(() => {
    if (isActive) {
      fetchAvailableModels();
      fetchCurrentModel();
    }
  }, [isActive]);

  // Fetch available models from API
  const fetchAvailableModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models/available`);
      const data = await response.json();
      setAvailableTasks(data.tasks);
      
      // Set default selections if data is available and not already set
      if (Object.keys(data.tasks).length > 0 && !localSelectedTask) {
        const firstTaskType = Object.keys(data.tasks)[0];
        setLocalSelectedTask(firstTaskType);
        if (data.tasks[firstTaskType].length > 0 && !localSelectedModel) {
          setLocalSelectedModel(data.tasks[firstTaskType][0]);
        }
      }
    } catch (error) {
      console.error("Error fetching available models:", error);
      showNotification("Failed to fetch available models", false);
    }
  };

  // Fetch current model info from API
  const fetchCurrentModel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models/current`);
      const data = await response.json();
      setCurrentModel(data);
    } catch (error) {
      console.error("Error fetching current model:", error);
      showNotification("Failed to fetch current model info", false);
    }
  };

  // Load selected model via API
  const loadModel = async () => {
    try {
      setIsLoading(true);
      
      // Use either local state or props for task and model
      const taskToUse = localSelectedTask || selectedTask || "classification";
      const modelToUse = localSelectedModel || selectedModel || "resnet";
      
      const payload = {
        task_type: taskToUse,
        model_name: modelToUse,
        model_path: modelPath || undefined,
        dataset_path: datasetPath || undefined,
        num_classes: numClasses ? parseInt(numClasses) : undefined
      };
      
      console.log("Loading model with payload:", payload);
      
      const response = await fetch(`${API_BASE_URL}/api/models/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        showNotification(data.message, true);
        fetchCurrentModel();
      } else {
        showNotification(data.message, false);
      }
    } catch (error) {
      console.error("Error loading model:", error);
      showNotification(`Error loading model: ${error}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  // Display notification
  const showNotification = (message: string, isSuccess: boolean) => {
    setNotification({ message, isSuccess });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="relative aspect-video w-full">
      {isActive ? (
        <>
          {/* Video feed from FastAPI backend */}
          <img src={`${API_BASE_URL}/video_feed`} className="h-full w-full object-cover" alt="Video feed" />
          
          {/* Current model info overlay */}
          {currentModel && currentModel.status === "active" && (
            <div className="absolute top-2 left-2 bg-black/30 p-2 rounded text-xs font-mono">
              <div className="text-cyan-400">{currentModel.model_name?.toUpperCase()}</div>
              <div className="text-cyan-400">{currentModel.task_type}</div>
              {currentModel.num_classes && (
                <div className="text-cyan-400">Classes: {currentModel.num_classes}</div>
              )}
            </div>
          )}
          
          {/* Controls button */}
          <button 
            onClick={() => setShowControls(!showControls)}
            className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 p-2 rounded"
          >
            <Settings className="h-4 w-4 text-cyan-400" />
          </button>
          
          {/* Model Controls Panel */}
          {showControls && (
            <div className="absolute top-0 right-0 w-64 h-full bg-black/80 p-3 overflow-auto border-l border-cyan-900">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-cyan-400 text-sm font-mono">MODEL SELECTION</h3>
                <button onClick={() => setShowControls(false)}>
                  <XCircle className="h-4 w-4 text-cyan-600 hover:text-cyan-400" />
                </button>
              </div>
              
              {/* Task Type Selector */}
              <div className="mb-3">
                <label className="block text-cyan-500 text-xs mb-1 font-mono">TASK TYPE</label>
                <select 
                  className="w-full bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded"
                  value={localSelectedTask}
                  onChange={(e) => {
                    setLocalSelectedTask(e.target.value);
                    if (availableTasks[e.target.value]?.length > 0) {
                      setLocalSelectedModel(availableTasks[e.target.value][0]);
                    }
                  }}
                >
                  {Object.keys(availableTasks).map(task => (
                    <option key={task} value={task}>
                      {task.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Model Selector */}
              <div className="mb-3">
                <label className="block text-cyan-500 text-xs mb-1 font-mono">MODEL</label>
                <select 
                  className="w-full bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded"
                  value={localSelectedModel}
                  onChange={(e) => setLocalSelectedModel(e.target.value)}
                >
                  {localSelectedTask && availableTasks[localSelectedTask]?.map(model => (
                    <option key={model} value={model}>
                      {model.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Custom paths inputs */}
              <div className="mb-3">
                <label className="block text-cyan-500 text-xs mb-1 font-mono">MODEL PATH</label>
                <input 
                  type="text" 
                  placeholder="Optional custom model path" 
                  className="w-full bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded"
                  value={modelPath}
                  onChange={(e) => setModelPath(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-cyan-500 text-xs mb-1 font-mono">DATASET PATH</label>
                <input 
                  type="text" 
                  placeholder="Optional dataset path" 
                  className="w-full bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded"
                  value={datasetPath}
                  onChange={(e) => setDatasetPath(e.target.value)}
                />
              </div>
              
              {/* Number of Classes */}
              <div className="mb-4">
                <label className="block text-cyan-500 text-xs mb-1 font-mono">NUMBER OF CLASSES</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded"
                  value={numClasses}
                  onChange={(e) => setNumClasses(e.target.value)}
                />
              </div>
              
              {/* Load Model Button */}
              <button
                onClick={loadModel}
                disabled={isLoading}
                className={`w-full py-2 px-3 rounded text-xs font-mono ${
                  isLoading 
                    ? "bg-cyan-900/50 text-cyan-600 cursor-not-allowed" 
                    : "bg-cyan-800 text-cyan-100 hover:bg-cyan-700"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCcw className="h-3 w-3 animate-spin" />
                    LOADING...
                  </div>
                ) : "LOAD MODEL"}
              </button>
              
              {/* Notification */}
              {notification && (
                <div className={`mt-3 p-2 rounded text-xs ${
                  notification.isSuccess ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}>
                  <div className="flex items-start gap-1">
                    {notification.isSuccess 
                      ? <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" /> 
                      : <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    <span>{notification.message}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-950">
          <div className="text-center">
            <p className="font-mono text-sm text-cyan-400">FEED INACTIVE</p>
            <p className="mt-2 font-mono text-xs text-cyan-600">Click ACTIVE to enable feed</p>
          </div>
        </div>
      )}

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px] opacity-30"></div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none rounded-sm bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>
    </div>
  )
});

WebcamFeed.displayName = "WebcamFeed";

export default WebcamFeed;

