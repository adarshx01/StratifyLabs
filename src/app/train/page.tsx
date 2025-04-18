"use client"
import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"

// Define available tasks and models (mirrors TASKS from Python code)
const TASKS = {
  classification: ["resnet", "efficientnet", "vgg", "inception", "mobilenet", "densenet", "vit", "convnext"],
  detection: [
    "yolov3",
    "yolov4",
    "yolov5",
    "yolov8",
    "fasterrcnn",
    "ssd",
    "retinanet",
    "efficientdet",
    "detr",
    "maskrcnn",
  ],
  segmentation: ["unet", "deeplabv3", "pspnet", "segnet", "fcn", "maskrcnn", "yolact", "segformer", "mask2former"],
}

// Define available optimizers (mirrors OPTIMIZERS from Python code)
const OPTIMIZERS = ["sgd", "adam", "rmsprop", "adagrad", "adamw"]

export default function Train() {
  // State for form inputs
  const [task, setTask] = useState("classification")
  const [model, setModel] = useState(TASKS["classification"][0])
  const [optimizer, setOptimizer] = useState(OPTIMIZERS[0])
  const [trainPct, setTrainPct] = useState(0.7)
  const [valPct, setValPct] = useState(0.2)
  const [testPct, setTestPct] = useState(0.1)
  const [datasetPath, setDatasetPath] = useState("")
  const [epochs, setEpochs] = useState(5)
  const [apiRoute, setApiRoute] = useState("http://localhost:8000")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  // Update model when task changes
  useEffect(() => {
    setModel(TASKS[task][0])
  }, [task])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("Training started...")
    setLogs([`[${new Date().toISOString()}] Initializing training for ${model} on ${task} task...`])

    // Construct the payload matching the TrainRequest model in FastAPI
    const payload = {
      task,
      model,
      optimizer,
      train_pct: trainPct,
      val_pct: valPct,
      test_pct: testPct,
      dataset_path: datasetPath,
      epochs,
    }

    try {
      // Log the request
      setLogs((prevLogs) => [
        ...prevLogs,
        `[${new Date().toISOString()}] Sending request to ${apiRoute}/train`,
        `[${new Date().toISOString()}] Payload: ${JSON.stringify(payload, null, 2)}`,
      ])

      const response = await fetch(`${apiRoute}/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      // Log the raw response
      const responseText = await response.text()
      setLogs((prevLogs) => [...prevLogs, `[${new Date().toISOString()}] Received response: ${responseText}`])

      // Parse the response
      const data = response.ok ? JSON.parse(responseText) : { detail: responseText }

      if (!response.ok) {
        throw new Error(data.detail || "Training failed")
      }

      // Log success and update message
      setLogs((prevLogs) => [
        ...prevLogs,
        `[${new Date().toISOString()}] Training completed successfully`,
        `[${new Date().toISOString()}] Model saved at: ${data.model_saved_at}`,
      ])
      setMessage(`Training completed successfully. Model saved at: ${data.model_saved_at}`)
    } catch (error) {
      // Log error
      setLogs((prevLogs) => [...prevLogs, `[${new Date().toISOString()}] ERROR: ${error.message}`])
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Add this useEffect to auto-scroll to the bottom of logs
  useEffect(() => {
    // Auto-scroll to the bottom of the terminal when new logs are added
    const terminalElement = document.querySelector(".terminal-logs")
    if (terminalElement) {
      terminalElement.scrollTop = terminalElement.scrollHeight
    }
  }, [logs])

  return (
    <div className="container mx-auto px-4 py-32 max-w-6xl">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Terminal className="mr-2 h-8 w-8" />
          AI Model Training Platform
        </h1>
        <p className="opacity-80">Configure and train state-of-the-art machine learning models</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-lg">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Route */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GPU Endpoint</label>
              <input
                type="text"
                value={apiRoute}
                onChange={(e) => setApiRoute(e.target.value)}
                placeholder="e.g., http://localhost:8000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task</label>
                <select
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="classification">Classification</option>
                  <option value="detection">Detection</option>
                  <option value="segmentation">Segmentation</option>
                </select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model Architecture</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {TASKS[task].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Optimizer Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Optimizer</label>
                <select
                  value={optimizer}
                  onChange={(e) => setOptimizer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {OPTIMIZERS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Epochs */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Epochs</label>
                <input
                  type="number"
                  min="1"
                  value={epochs}
                  onChange={(e) => setEpochs(Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Dataset Path */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dataset Path (on server)
              </label>
              <input
                type="text"
                value={datasetPath}
                onChange={(e) => setDatasetPath(e.target.value)}
                placeholder="/path/to/dataset"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Train Percentage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Train %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={trainPct}
                  onChange={(e) => setTrainPct(Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Validation Percentage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Validation %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={valPct}
                  onChange={(e) => setValPct(Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Test Percentage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Test %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={testPct}
                  onChange={(e) => setTestPct(Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              {isLoading ? "Training in Progress..." : "Start Training"}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-md ${
                message.includes("Error")
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Terminal-like Log Display */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between bg-gray-900 text-white p-2 rounded-t-md">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2" />
              <span className="text-sm font-mono">Training Logs</span>
            </div>
            {logs.length > 0 && (
              <button onClick={() => setLogs([])} className="text-xs text-gray-400 hover:text-white">
                Clear
              </button>
            )}
          </div>
          <div
            className="bg-black text-green-400 font-mono text-sm p-4 rounded-b-md overflow-y-auto terminal-logs"
            style={{
              height: "500px",
              boxShadow: "inset 0 0 10px rgba(0, 255, 0, 0.2)",
              backgroundImage: "radial-gradient(rgba(0, 50, 0, 0.1) 1px, transparent 0)",
              backgroundSize: "4px 4px",
            }}
          >
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>API response logs will appear here when you start training...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="flex">
                    <span className="text-purple-400 mr-2">$</span>
                    <span className="whitespace-pre-wrap break-words">{log}</span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">$</span>
                    <span className="animate-pulse">_</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

