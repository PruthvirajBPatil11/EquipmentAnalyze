# Alloy Wheel Digital Twin

Frontend prototype for the **Digital Twin of an Alloy Wheel Manufacturing Factory**.

## Current scope

This repository currently implements the frontend and Digital Twin only:

- Role-based Panel Controller and Machine Controller access
- Interactive 2D Digital Twin
- Eight-stage factory process view
- Machine-level live simulated parameters
- Upload Image
- History
- Suggestions
- Notifications
- Panel review / accept / reject flow
- Machine Controller apply flow
- Future integration contracts for YOLO, sensors, KG and RCA

## Intentionally not implemented

The following are future modules and are only represented through integration slots:

- YOLO defect model
- Knowledge Graph
- Root Cause Analysis
- Real sensor backend
- Real recommendation/RCA service

The UI uses standalone mock providers so the application can be developed without those services.

## Run

```bash
npm install
npm run dev
```

## Main configuration

- `src/config/factoryLayout.js` — factory stages, machines and parameter definitions
- `src/config/roles.js` — users, roles and machine ownership
- `src/integrations/registry.js` — single place to swap mock providers for real providers

## Integration boundary

Future services should be connected through `src/integrations/`.

The frontend should not need to know how YOLO, KG or RCA is implemented internally.
