const API_URL = 'http://127.0.0.1:8000';

export const yoloService = {
  async detect(file) {
    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(
      `${API_URL}/predict`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(
        `YOLO API failed: ${response.status}`,
      );
    }

    const data = await response.json();

    const image = await loadImage(file);

    const detections = data.detections.map(
      (item) => ({
        classId: item.class_id,
        label: item.label,
        confidence: item.confidence,
        bbox: {
          x: item.bbox[0] / image.width,
          y: item.bbox[1] / image.height,
          w:
            (item.bbox[2] - item.bbox[0]) /
            image.width,
          h:
            (item.bbox[3] - item.bbox[1]) /
            image.height,
        },
      }),
    );

    const best = detections.reduce(
      (highest, current) =>
        !highest ||
        current.confidence > highest.confidence
          ? current
          : highest,
      null,
    );

    if (!best) {
      return {
        label: 'No defect detected',
        confidence: 0,
        severity: null,
        bbox: null,
        detections: [],
        source: 'yolo',
      };
    }

    return {
      label: best.label,
      confidence: best.confidence,
      severity: null,
      bbox: best.bbox,
      detections,
      source: 'yolo',
    };
  },
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          'Unable to read image dimensions.',
        ),
      );
    };

    image.src = url;
  });
}