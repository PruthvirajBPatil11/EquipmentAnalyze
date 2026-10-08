// Single source of truth for roles, permissions and machine ownership.
export const ROLES = {
  panel: {
    label: 'Panel Controller',
    desc: 'Reviews uploaded defects and approves or rejects suggested changes.',
    tags: ['Upload image', 'Approve / reject', 'Full twin view'],
    can: { upload: true, review: true, apply: false, allMachines: true },
  },
  machine: {
    label: 'Machine Controller',
    desc: 'Owns specific machines, gets alerts for them and applies approved changes.',
    tags: ['Own machines only', 'Apply approved changes', 'Machine alerts'],
    can: { upload: true, review: false, apply: true, allMachines: false },
  },
};

// Placeholder people: edit names / machine ownership here.
export const USERS = [
  { id: 'p1', name: 'Arun Menon', role: 'panel' },
  { id: 'p2', name: 'Priya Nair', role: 'panel' },
  { id: 'm1', name: 'Ravi Kumar', role: 'machine', owns: ['F-01', 'F-02', 'D-01', 'D-02'] },
  { id: 'm2', name: 'Meera Joshi', role: 'machine', owns: ['LP-01', 'LP-02'] },
  { id: 'm3', name: 'Imran Khan', role: 'machine', owns: ['XR-01', 'XR-02', 'HT-01', 'HT-02'] },
  { id: 'm4', name: 'Dev Patel', role: 'machine', owns: ['CNC-01', 'CNC-02'] },
  { id: 'm5', name: 'Asha Rao', role: 'machine', owns: ['PT-01', 'PT-02', 'VI-01', 'VI-02'] },
];

export const canSee = (user, machineId) =>
  ROLES[user.role].can.allMachines || (user.owns || []).includes(machineId);
export const ownerIdsOf = (machineId) => USERS.filter((u) => u.owns?.includes(machineId)).map((u) => u.id);
export const ownerNamesOf = (machineId) => USERS.filter((u) => u.owns?.includes(machineId)).map((u) => u.name);
