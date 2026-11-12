export type QuizType = 'mc' | 'fb' | 'ro' | 'sb';

export interface BaseQuiz {
  id: string;
  type: QuizType;
  prompt: string;
  explanation: string;
}

export interface MultipleChoiceQuiz extends BaseQuiz {
  type: 'mc';
  code?: string;
  options: string[];
  answerIndex: number;
}

export interface FillBlankQuiz extends BaseQuiz {
  type: 'fb';
  codeWithBlank: string;
  options: string[];
  acceptedAnswers?: string[];
  answerIndex?: number;
}

export interface ReorderQuiz extends BaseQuiz {
  type: 'ro';
  lines: string[];
  distractors?: string[];
}

export interface SpotTheBugQuiz extends BaseQuiz {
  type: 'sb';
  lines: string[];
  buggyLineIndex: number;
  fixedLine: string;
}

export type ModuleQuiz = MultipleChoiceQuiz | FillBlankQuiz | ReorderQuiz | SpotTheBugQuiz;

export interface ModuleTipSection {
  heading: string;
  explanation: string;
  codeSnippet?: string;
  outputSnippet?: string;
}

export interface ModuleTip {
  title: string;
  body: string;
  codeExample: string;
  outputExample?: string;
  sections?: ModuleTipSection[];
  notes?: string[];
}

export interface PythonModule {
  id: string;
  unit: number;
  unitTitle: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  xpReward: number;
  gemReward: number;
  tip: ModuleTip;
  skipTipCard?: boolean;
  quizzes: ModuleQuiz[];
}
