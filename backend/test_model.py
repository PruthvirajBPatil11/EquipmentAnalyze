from ultralytics import YOLO

print("Loading model...")

model = YOLO("models/best.pt")

print("Model loaded!")
print("Classes:", model.names)

print("Running prediction...")

results = model.predict(
    source="test.jpg",
    conf=0.25,
    save=True
)

print("Prediction completed!")

for result in results:
    print("Detections:")

    if result.boxes is None or len(result.boxes) == 0:
        print("No defects detected")
        continue

    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        bbox = box.xyxy[0].tolist()

        print("Class:", result.names[class_id])
        print("Confidence:", confidence)
        print("Bounding Box:", bbox)