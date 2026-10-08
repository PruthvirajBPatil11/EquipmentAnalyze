// Standalone demo providers. Replace through registry.js when real services are ready.
import { MACHINES } from '../config/factoryLayout.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let sequence = 0;

export const defects = {
  async detect() {
    await wait(700);
    return {
      label: 'Scratch',
      confidence: 0.91,
      severity: 'medium',
      bbox: { x: 0.31, y: 0.36, w: 0.34, h: 0.12 },
      raw: null,
      source: 'demo',
    };
  },
};

export const sensors = {
  subscribe(getSetpoint, onBatch) {
    const timer = setInterval(() => {
      const batch = {};

      MACHINES.forEach((machine) => {
        machine.params.forEach((parameter) => {
          const span = parameter.hi - parameter.lo;
          let delta = (Math.random() - 0.5) * span * 0.22;

          if (Math.random() < 0.015) {
            delta = (Math.random() < 0.5 ? -1 : 1) * span * (0.42 + Math.random() * 0.28);
          }

          batch[`${machine.id}.${parameter.k}`] = +(getSetpoint(machine.id, parameter.k) + delta).toFixed(2);
        });
      });

      onBatch(batch);
    }, 2000);

    return () => clearInterval(timer);
  },
};

export const suggestions = {
  // Demo-only UI data. This is NOT RCA logic.
  async suggest(defect, machine, setpoints) {
    await wait(250);

    const parameter = machine.params[0];
    const from = setpoints[parameter.k];
    const to = +(from * 1.02).toFixed(2);

    return {
      id: `s-${Date.now().toString(36)}-${sequence++}`,
      defectId: defect.id,
      batchId: defect.batchId,
      machineId: machine.id,
      label: defect.detection.label,
      severity: defect.detection.severity || 'Pending RCA',
      ts: Date.now(),
      status: 'pending',
      source: 'demo',
      cause: {
        title: 'Root-cause analysis pending',
        text: 'The RCA service will provide the machine, parameter deviation and causal explanation here.',
      },
      risk: { level: 'Demo', odds: null },
      action: {
        text: `Demo action: inspect ${parameter.label} and verify the operating setpoint.`,
        key: parameter.k,
        label: parameter.label,
        from,
        to,
      },
    };
  },
};
