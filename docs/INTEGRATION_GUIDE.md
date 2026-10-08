# Integration guide

The current application is intentionally independent of YOLO, sensors, KG and RCA.

Replace the mock providers through `src/integrations/registry.js`.

## YOLO

Implement the defect detection adapter with:

- defect label
- confidence
- severity
- normalized bounding box
- optional raw model response

The upload UI already has a bounding-box rendering provision.

## Sensors

Implement the sensor subscription contract so the Digital Twin can receive readings using:

`machineId.parameterKey -> numeric value`

## KG / RCA

Do not modify the Digital Twin components to contain RCA logic.

The future RCA/KG team should provide the frontend with a stable result contract. The UI can then display the result in the Suggestions and machine-detail views.

The implementation details of the KG and RCA remain outside this frontend repository.
