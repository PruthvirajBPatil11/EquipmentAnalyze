import * as mock from './mock.js';
import { yoloService } from './http/yoloService.js';

export const services = {
  defects: yoloService,
  sensors: mock.sensors,
  suggestions: mock.suggestions,
  kg: null,
  rca: null,
};