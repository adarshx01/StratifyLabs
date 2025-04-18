import { useState, useEffect } from 'react';

// Define available tasks and models (mirrors TASKS from Python code)
const TASKS = {
  classification: [
    "resnet", "efficientnet", "vgg", "inception", "mobilenet",
    "densenet", "vit", "convnext"
  ],
  detection: [
    "yolov3", "yolov4", "yolov5", "yolov8", "fasterrcnn", "ssd",
    "retinanet", "efficientdet", "detr", "maskrcnn"
  ],
  segmentation: [
    "unet", "deeplabv3", "pspnet", "segnet", "fcn", "maskrcnn",
    "yolact", "segformer", "mask2former"
  ]
};

// Define available optimizers (mirrors OPTIMIZERS from Python code)
const OPTIMIZERS = ["sgd", "adam", "rmsprop", "adagrad", "adamw"];

export default function Train() {
  // State for form inputs
  const [task, setTask] = useState('classification');
  const [model, setModel] = useState(TASKS['classification'][0]);
  const [optimizer, setOptimizer] = useState(OPTIMIZERS[0]);
  const [trainPct, setTrainPct] = useState(0.7);
  const [valPct, setValPct] = useState(0.2);
  const [testPct, setTestPct] = useState(0.1);
  const [datasetPath, setDatasetPath] = useState('');
  const [epochs, setEpochs] = useState(5);
  const [apiRoute, setApiRoute] = useState('http://localhost:8000');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Update model when task changes
  useEffect(() => {
    setModel(TASKS[task][0]);
  }, [task]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Training started...');

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
    };

    try {
      const response = await fetch(`${apiRoute}/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Training failed');
      }

      const data = await response.json();
      setMessage(`Training completed successfully. Model saved at: ${data.model_saved_at}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Train a Model</h1>
      <form onSubmit={handleSubmit}>
        {/* API Route */}
        <label>
          API Route:
          <input
            type="text"
            value={apiRoute}
            onChange={(e) => setApiRoute(e.target.value)}
            placeholder="e.g., http://localhost:8000"
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>

        {/* Task Selection */}
        <label>
          Task:
          <select
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="classification">Classification</option>
            <option value="detection">Detection</option>
            <option value="segmentation">Segmentation</option>
          </select>
        </label>

        {/* Model Selection */}
        <label>
          Model:
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            {TASKS[task].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        {/* Optimizer Selection */}
        <label>
          Optimizer:
          <select
            value={optimizer}
            onChange={(e) => setOptimizer(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            {OPTIMIZERS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        {/* Train Percentage */}
        <label>
          Train Percentage:
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={trainPct}
            onChange={(e) => setTrainPct(parseFloat(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>

        {/* Validation Percentage */}
        <label>
          Validation Percentage:
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={valPct}
            onChange={(e) => setValPct(parseFloat(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>

        {/* Test Percentage */}
        <label>
          Test Percentage:
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={testPct}
            onChange={(e) => setTestPct(parseFloat(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>

        {/* Dataset Path */}
        <label>
          Dataset Path (on server):
          <input
            type="text"
            value={datasetPath}
            onChange={(e) => setDatasetPath(e.target.value)}
            placeholder="/path/to/dataset"
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>

        {/* Epochs */}
        <label>
          Epochs:
          <input
            type="number"
            min="1"
            value={epochs}
            onChange={(e) => setEpochs(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Training...' : 'Start Training'}
        </button>
      </form>

      {/* Feedback Message */}
      {message && (
        <p style={{ marginTop: '20px', wordWrap: 'break-word' }}>{message}</p>
      )}
    </div>
  );
}