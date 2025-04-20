"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Power, Zap, Maximize, Settings, RefreshCcw, CheckCircle, XCircle, ArrowRight, Database, FolderOpen, Camera, FileVideo } from "lucide-react"
import SciFiCorner from "@/components/TestCamera/sci-fi-corner"
import WebcamFeed from "@/components/TestCamera/webcam-feed"

export default function SciFiCamera() {
  const [isActive, setIsActive] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customModelPath, setCustomModelPath] = useState("")
  const [customDatasetPath, setCustomDatasetPath] = useState("")
  const [customNumClasses, setCustomNumClasses] = useState("7")
  const [availableModels, setAvailableModels] = useState<any>({})
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState("CHECKING")
  
  const API_BASE_URL = "http://localhost:8001"
  const webcamRef = useRef<any>(null)
  
  // Check API connection
  useEffect(() => {
    checkApiConnection()
  }, [])

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models/available`, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      })
      if (response.ok) {
        setApiStatus("ONLINE")
        fetchSavedModels()
        
        // Also fetch available tasks and set defaults
        const data = await response.json()
        if (Object.keys(data.tasks).length > 0) {
          const firstTaskType = Object.keys(data.tasks)[0]
          setSelectedTask(firstTaskType)
          
          if (data.tasks[firstTaskType].length > 0) {
            setSelectedModel(data.tasks[firstTaskType][0])
          }
        }
      } else {
        setApiStatus("ERROR")
      }
    } catch (error) {
      console.error("API connection error:", error)
      setApiStatus("OFFLINE")
    }
  }

  // Fetch available saved models
  const fetchSavedModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models/saved`)
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.saved_models || {})
        
        // Set default model path if available
        if (data.saved_models && 
            Object.keys(data.saved_models).length > 0 && 
            data.saved_models.classification && 
            data.saved_models.classification.length > 0) {
          setCustomModelPath(data.saved_models.classification[0].path)
        }
      }
    } catch (error) {
      console.error("Failed to fetch saved models:", error)
    }
  }

  const loadSelectedModel = async () => {
    // Use either the model selected through UI or default to first model
    const taskType = selectedTask || "classification"
    const modelName = selectedModel || "resnet"
    
    try {
      setIsLoading(true)
      
      const payload = {
        task_type: taskType,
        model_name: modelName,
        model_path: customModelPath || null,
        dataset_path: customDatasetPath || null,
        num_classes: customNumClasses ? parseInt(customNumClasses) : 7
      }
      
      console.log("Loading model with payload:", payload)
      
      const response = await fetch(`${API_BASE_URL}/api/models/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (data.status === "success") {
        console.log("Model loaded successfully:", data.message)
      } else {
        console.error("Error loading model:", data.message)
      }
    } catch (error) {
      console.error("Error loading model:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivate = async () => {
    if (!isActive) {
      // If activating, load model first
      await loadSelectedModel()
    }
    
    // Then toggle activation state
    setIsActive(!isActive)
    
    // If we have a reference to the webcam component, call its loadModel method
    if (webcamRef.current && !isActive) {
      webcamRef.current.triggerLoadModel()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="relative w-full max-w-4xl">
        {/* Top header bar */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">Vision Flow Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-cyan-600">
              {isActive ? (
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  SYSTEM ACTIVE
                </span>
              ) : isLoading ? (
                <span className="flex items-center gap-1">
                  <RefreshCcw className="h-3 w-3 animate-spin text-yellow-400" />
                  LOADING MODEL...
                </span>
              ) : (
                "SYSTEM STANDBY"
              )}
            </div>
            <button
              onClick={handleActivate}
              disabled={isLoading}
              className={`flex h-8 items-center gap-1 rounded border px-3 font-mono text-xs uppercase tracking-wider ${
                isLoading 
                  ? "border-yellow-700 bg-yellow-900/50 text-yellow-300 cursor-wait" 
                  : isActive 
                    ? "border-cyan-700 bg-cyan-900/50 text-cyan-300" 
                    : "border-cyan-900 bg-transparent text-cyan-600 hover:border-cyan-800 hover:text-cyan-500"
              }`}
            >
              {isLoading ? (
                <RefreshCcw className="h-3 w-3 animate-spin" />
              ) : (
                <Power className="h-3 w-3" />
              )}
              {isLoading ? "LOADING..." : isActive ? "DEACTIVATE" : "ACTIVATE"}
            </button>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="relative overflow-hidden rounded-lg bg-gray-900/80 p-1">
          <SciFiCorner position="top-left" />
          <SciFiCorner position="top-right" />
          <SciFiCorner position="bottom-left" />
          <SciFiCorner position="bottom-right" />

          <div className="relative z-10 p-4">
            {/* Pass the ref to WebcamFeed */}
            <div className="mb-4">
              <WebcamFeed 
                ref={webcamRef}
                isActive={isActive} 
                customModelPath={customModelPath}
                customDatasetPath={customDatasetPath}
                customNumClasses={customNumClasses}
                selectedTask={selectedTask}
                selectedModel={selectedModel}
              />
            </div>

            {/* Advanced configuration panel */}
            <div className="mt-6">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-xs font-mono text-cyan-500 hover:text-cyan-400"
              >
                <Settings className="h-3 w-3" />
                ADVANCED CONFIGURATION
                <ArrowRight className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>
              
              {showAdvanced && (
                <div className="mt-3 bg-black/30 border border-cyan-900/50 rounded p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Custom Model Path */}
                    <div>
                      <label className="block text-cyan-500 text-xs mb-1 font-mono">CUSTOM MODEL PATH</label>
                      <div className="flex">
                        <input 
                          type="text" 
                          placeholder="/path/to/model.pt" 
                          className="flex-1 bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded-l"
                          value={customModelPath}
                          onChange={(e) => setCustomModelPath(e.target.value)}
                        />
                        <button className="bg-cyan-900 text-cyan-300 px-2 rounded-r border border-cyan-800">
                          <FolderOpen className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Available model files */}
                      <div className="mt-2">
                        <span className="text-cyan-600 text-xs font-mono">SAVED MODELS:</span>
                        <div className="mt-1 max-h-32 overflow-auto text-xs">
                          {Object.entries(availableModels).map(([task, models]) => (
                            <div key={task} className="mb-1">
                              <span className="text-cyan-500">{task}:</span>
                              <div className="pl-2">
                                {Array.isArray(models) && models.map((model: any, i: number) => (
                                  <div key={i} className="flex items-center">
                                    <button 
                                      className="text-cyan-400 hover:text-cyan-300 text-left truncate"
                                      onClick={() => setCustomModelPath(model.path)}
                                    >
                                      {model.file}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Custom Dataset Path */}
                    <div>
                      <label className="block text-cyan-500 text-xs mb-1 font-mono">CUSTOM DATASET PATH</label>
                      <div className="flex">
                        <input 
                          type="text" 
                          placeholder="/path/to/dataset" 
                          className="flex-1 bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded-l"
                          value={customDatasetPath}
                          onChange={(e) => setCustomDatasetPath(e.target.value)}
                        />
                        <button className="bg-cyan-900 text-cyan-300 px-2 rounded-r border border-cyan-800">
                          <FolderOpen className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Common dataset paths */}
                      <div className="mt-2">
                        <span className="text-cyan-600 text-xs font-mono">COMMON DATASETS:</span>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          <button 
                            className="text-cyan-400 hover:text-cyan-300 text-left text-xs"
                            onClick={() => setCustomDatasetPath("/home/adarsh/WorkSpace/VisionFlow/facialemotion")}
                          >
                            /home/adarsh/WorkSpace/VisionFlow/facialemotion
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Number of Classes */}
                  <div className="mt-4">
                    <label className="block text-cyan-500 text-xs mb-1 font-mono">NUMBER OF CLASSES</label>
                    <div className="flex">
                      <input 
                        type="number" 
                        placeholder="7" 
                        className="flex-1 bg-gray-900 border border-cyan-900 text-cyan-300 text-xs p-2 rounded"
                        value={customNumClasses}
                        onChange={(e) => setCustomNumClasses(e.target.value)}
                      />
                    </div>
                    <div className="mt-1">
                      <span className="text-cyan-600 text-xs font-mono">COMMON VALUES:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {[2, 7, 10, 20, 80, 1000].map(num => (
                          <button 
                            key={num}
                            className="bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 text-xs px-2 py-1 rounded"
                            onClick={() => setCustomNumClasses(num.toString())}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* System information */}
                  <div className="mt-4 border-t border-cyan-900/30 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-cyan-600">API STATUS:</span> 
                        <span className={`${
                          apiStatus === "ONLINE" 
                            ? "text-green-400" 
                            : apiStatus === "OFFLINE" 
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}>
                          {apiStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyan-600">ENDPOINT:</span> 
                        <span className="text-cyan-400">{API_BASE_URL}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

