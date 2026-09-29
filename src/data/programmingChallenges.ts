export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface ProgrammingChallenge {
  id: string;
  courseId: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  starterCode: string;
  hint: string;
  testCases: TestCase[];
}

export const challenges: ProgrammingChallenge[] = [];
