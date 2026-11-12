import { PythonModule } from './types';
import module01 from './module-01.json';
import module02 from './module-02.json';
import module03 from './module-03.json';
import module04 from './module-04.json';
import module05 from './module-05.json';
import module06 from './module-06.json';
import module07 from './module-07.json';
import module08 from './module-08.json';
import module09 from './module-09.json';
import module10 from './module-10.json';
import module11 from './module-11.json';
import module12 from './module-12.json';
import module13 from './module-13.json';
import module14 from './module-14.json';
import module15 from './module-15.json';
import module16 from './module-16.json';
import module17 from './module-17.json';
import module18 from './module-18.json';
import module19 from './module-19.json';
import module20 from './module-20.json';
import module21 from './module-21.json';
import module22 from './module-22.json';
import module23 from './module-23.json';
import module24 from './module-24.json';
import module25 from './module-25.json';

// Modules list ordered from 1 to 25
export const MODULE_CATALOG: PythonModule[] = [
  module01 as unknown as PythonModule,
  module02 as unknown as PythonModule,
  module03 as unknown as PythonModule,
  module04 as unknown as PythonModule,
  module05 as unknown as PythonModule,
  module06 as unknown as PythonModule,
  module07 as unknown as PythonModule,
  module08 as unknown as PythonModule,
  module09 as unknown as PythonModule,
  module10 as unknown as PythonModule,
  module11 as unknown as PythonModule,
  module12 as unknown as PythonModule,
  module13 as unknown as PythonModule,
  module14 as unknown as PythonModule,
  module15 as unknown as PythonModule,
  module16 as unknown as PythonModule,
  module17 as unknown as PythonModule,
  module18 as unknown as PythonModule,
  module19 as unknown as PythonModule,
  module20 as unknown as PythonModule,
  module21 as unknown as PythonModule,
  module22 as unknown as PythonModule,
  module23 as unknown as PythonModule,
  module24 as unknown as PythonModule,
  module25 as unknown as PythonModule,
];

export const getModuleById = (id: string): PythonModule | undefined => {
  return MODULE_CATALOG.find(
    (m) =>
      m.id === id ||
      m.id === `unit1_lesson${m.moduleNumber}` ||
      `module-${String(m.moduleNumber).padStart(2, '0')}` === id
  );
};

export * from './types';
