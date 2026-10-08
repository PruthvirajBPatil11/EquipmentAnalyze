import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../store/AppStore.jsx';

export default function Upload({ go }) {
  const { submitImage } = useApp();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = (selectedFile) => {
    setError('');
    setResult(null);

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Select an image file.');
      return;
    }

    setFile(selectedFile);
  };

  const run = async () => {
    if (!file) return;

    setBusy(true);
    setError('');
    setResult(null);

    try {
      setResult(await submitImage({ file }));
    } catch (error) {
      console.error(error);
      setError('The analysis request could not be completed. Check the YOLO service.');
    } finally {
      setBusy(false);
    }
  };

  const detection = result?.defect?.detection;

  return (
    <div className="page narrow">
      <div className="section-heading">
        <div>
          <span className="eyebrow">INSPECTION INPUT</span>
          <h2>Upload wheel image</h2>
          <p className="muted small">
            Upload an alloy wheel image for YOLO11n defect detection.
          </p>
        </div>
      </div>

      <label
        className="drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          pick(event.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => pick(event.target.files[0])}
        />

        {preview ? (
          <span className="imgwrap">
            <img src={preview} alt="Selected alloy wheel" />

            {detection?.bbox && (
              <i
                className="bbox"
                style={{
                  left: `${detection.bbox.x * 100}%`,
                  top: `${detection.bbox.y * 100}%`,
                  width: `${detection.bbox.w * 100}%`,
                  height: `${detection.bbox.h * 100}%`,
                }}
              >
                <em>
                  {detection.label} ·{' '}
                  {Math.round(detection.confidence * 100)}%
                </em>
              </i>
            )}
          </span>
        ) : (
          <span>
            <b>Drop alloy wheel image here</b>
            <br />
            <span className="muted small">
              or click to browse · single image
            </span>
          </span>
        )}
      </label>

      {error && <p className="fault-text small">{error}</p>}

      <button
        className="btn primary"
        disabled={!file || busy}
        onClick={run}
      >
        {busy ? 'Analysing…' : 'Analyse Image'}
      </button>

      {result && (
        <div className="result-banner">
          <div>
            <strong>YOLO11n Detection</strong>

            {detection ? (
              <div className="muted small">
                {detection.label} ·{' '}
                {Math.round(detection.confidence * 100)}% confidence
              </div>
            ) : (
              <div className="muted small">
                No defect detected
              </div>
            )}
          </div>

          {detection && (
            <button className="link" onClick={() => go('suggestions')}>
              Open suggestions →
            </button>
          )}
        </div>
      )}
    </div>
  );
}