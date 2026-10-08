// Event chain: defect.detected -> suggestion.created -> suggestion.decided -> change.applied | alert
// Future KG / RCA stages can subscribe/emit here without UI changes.
const h = {};
export const bus = {
  on(t, f) { (h[t] ||= new Set()).add(f); return () => h[t].delete(f); },
  emit(t, payload) { h[t]?.forEach((f) => f(payload)); h['*']?.forEach((f) => f(t, payload)); },
};
