import type { CourseCategory, CourseDefinition } from '../types';
import { quantumCurriculum } from './curriculum';


export const categories: CourseCategory[] = [
  { id: 'quantum-computing', name: 'Quantum Computing' }
];

export const courses: CourseDefinition[] = [
  { id: 'quantum-computing', title: 'Quantum Computing', categoryId: 'quantum-computing', curriculum: quantumCurriculum },
];
