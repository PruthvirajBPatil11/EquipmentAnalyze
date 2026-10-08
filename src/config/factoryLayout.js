// Data-driven factory definition. Add/move machines here, not in components.
// Param: sp = setpoint, [lo,hi] = normal band (placeholder values: replace with plant specs).
const p = (k, label, unit, sp, lo, hi) => ({ k, label, unit, sp, lo, hi });

export const STAGES = [
  { id: 'melt', name: 'Melting Furnace', blurb: 'Ingot to molten alloy', machines: ['F-01', 'F-02'] },
  { id: 'degas', name: 'Degassing & Filtration', blurb: 'Hydrogen and inclusion removal', machines: ['D-01', 'D-02'] },
  { id: 'cast', name: 'Low-Pressure Die Casting', blurb: 'Wheel formed in the die', machines: ['LP-01', 'LP-02'] },
  { id: 'xray', name: 'X-ray Inspection', blurb: 'Internal porosity screening', machines: ['XR-01', 'XR-02'] },
  { id: 'heat', name: 'Heat Treatment (T6)', blurb: 'Solution, quench and ageing', machines: ['HT-01', 'HT-02'] },
  { id: 'cnc', name: 'CNC Machining', blurb: 'Turning and drilling to size', machines: ['CNC-01', 'CNC-02'] },
  { id: 'paint', name: 'Painting & Coating', blurb: 'Powder coat and curing', machines: ['PT-01', 'PT-02'] },
  { id: 'insp', name: 'Final Inspection', blurb: 'Vision and leak test', machines: ['VI-01', 'VI-02'] },
];

export const MACHINES = [
  { id: 'F-01', name: 'Melting Furnace A', kind: 'furnace', params: [p('temp', 'Melt temperature', '°C', 720, 700, 740), p('level', 'Bath level', '%', 78, 60, 90)] },
  { id: 'F-02', name: 'Holding Furnace', kind: 'furnace', params: [p('temp', 'Holding temperature', '°C', 690, 670, 710)] },
  { id: 'D-01', name: 'Rotary Degasser', kind: 'degas', params: [p('rpm', 'Rotor speed', 'rpm', 350, 300, 400), p('gas', 'Purge gas flow', 'L/min', 12, 10, 14)] },
  { id: 'D-02', name: 'Filtration Unit', kind: 'degas', params: [p('press', 'Filter pressure', 'bar', 1.2, 0.8, 1.6)] },
  { id: 'LP-01', name: 'LPDC Machine 1', kind: 'caster', params: [p('die', 'Die temperature', '°C', 425, 400, 450), p('press', 'Fill pressure', 'mbar', 450, 400, 500)] },
  { id: 'LP-02', name: 'LPDC Machine 2', kind: 'caster', params: [p('die', 'Die temperature', '°C', 425, 400, 450), p('press', 'Fill pressure', 'mbar', 450, 400, 500)] },
  { id: 'XR-01', name: 'X-ray Cabinet', kind: 'xray', params: [p('kv', 'Tube voltage', 'kV', 160, 150, 170)] },
  { id: 'XR-02', name: 'Reject Conveyor', kind: 'xray', params: [p('rate', 'Throughput', 'wheels/h', 60, 50, 70)] },
  { id: 'HT-01', name: 'Solution Furnace', kind: 'oven', params: [p('temp', 'Furnace temperature', '°C', 540, 530, 550)] },
  { id: 'HT-02', name: 'Ageing Oven', kind: 'oven', params: [p('temp', 'Oven temperature', '°C', 160, 150, 170)] },
  { id: 'CNC-01', name: 'CNC Lathe 1', kind: 'cnc', params: [p('rpm', 'Spindle speed', 'rpm', 3000, 2700, 3300), p('feed', 'Feed rate', 'mm/min', 400, 350, 450)] },
  { id: 'CNC-02', name: 'CNC Lathe 2', kind: 'cnc', params: [p('rpm', 'Spindle speed', 'rpm', 3000, 2700, 3300), p('feed', 'Feed rate', 'mm/min', 400, 350, 450)] },
  { id: 'PT-01', name: 'Powder Coat Booth', kind: 'paint', params: [p('kv', 'Gun voltage', 'kV', 70, 60, 80)] },
  { id: 'PT-02', name: 'Curing Oven', kind: 'oven', params: [p('temp', 'Oven temperature', '°C', 190, 180, 200)] },
  { id: 'VI-01', name: 'Vision Station', kind: 'inspect', params: [p('lux', 'Lighting', 'lux', 800, 700, 900)] },
  { id: 'VI-02', name: 'Leak Test Rig', kind: 'inspect', params: [p('press', 'Test pressure', 'bar', 5, 4.5, 5.5)] },
];

export const machineById = (id) => MACHINES.find((m) => m.id === id);
export const stageById = (id) => STAGES.find((s) => s.id === id);

const RANK = { normal: 0, warning: 1, fault: 2 };
export const worst = (a, b) => (RANK[a] >= RANK[b] ? a : b);
export const paramStatus = (q, v) => {
  const span = q.hi - q.lo;
  const out = v < q.lo ? q.lo - v : v > q.hi ? v - q.hi : 0;
  return out === 0 ? 'normal' : out / span > 0.15 ? 'fault' : 'warning';
};
export const machineStatus = (m, readings) =>
  m.params.reduce((s, q) => worst(s, paramStatus(q, readings[`${m.id}.${q.k}`])), 'normal');
