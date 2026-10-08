/*
 * Future integration contracts.
 * These are interfaces only. KG and RCA are intentionally NOT implemented here.
 *
 * YOLO:
 * detect(file, { batchId, machineId }) -> Promise<{
 *   label, confidence, severity, bbox, raw?
 * }>
 *
 * Sensors:
 * subscribe(getSetpoint, onBatch) -> unsubscribe
 *
 * Future RCA/KG:
 * The frontend only expects a suggestion-shaped result from the future service.
 * The actual KG/RCA implementation belongs to the other team.
 */
export const CONTRACT_VERSION = '1.0';
