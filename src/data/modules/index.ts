import { PythonModule } from './types';
import module01 from './module-01.json';

// Modules list ordered from 1 to 25
export const MODULE_CATALOG: PythonModule[] = [
  module01 as unknown as PythonModule,
];

export const getModuleById = (id: string): PythonModule | undefined => {
  return MODULE_CATALOG.find((m) => m.id === id || m.id === `unit1_lesson${m.moduleNumber}` || `module-${String(m.moduleNumber).padStart(2, '0')}` === id);
};

export * from './types';
