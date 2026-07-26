
export enum View {
  MainMenu,
  TrainingMenu,
  DiagnosisMenu,
  NearFarFocus,
  PencilPushUp,
  NearFocus,
  AccommodativeFacility,
  Saccades,
  BlinkingInfo,
  Blink3s,
  PalmingInfo,
  FigureEight,
  EyeRolls,
  SmoothPursuit,
  LookFar,
  VisualAcuityTest,
  AmslerGrid,
  SymptomQuestionnaire,
  DiagnosisHistory,
  DepthPerception,
  Autostereogram,
  RoutineMenu,
  RoutineComplete,
}

export interface ExerciseSettings {
  duration: number; // in seconds
  repetitions: number;
}

export interface UserSettings {
  nearFarFocus: ExerciseSettings;
  nearFocus: ExerciseSettings;
  pencilPushUp: ExerciseSettings;
  saccades: ExerciseSettings;
  soundEnabled: boolean;
  reminderIntervalMinutes: number;
  reminderEnabled: boolean;
  musicEnabled: boolean;
  musicVolume: number;
}

export enum DiagnosisType {
  Acuity = 'Acuidade Visual',
  Amsler = 'Grelha de Amsler',
  Symptoms = 'Questionário de Sintomas',
  DepthPerception = 'Perceção de Profundidade',
}

export interface DiagnosisRecord {
  id: string;
  timestamp: string;
  type: DiagnosisType;
  result: any;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: View[];
}

export interface RoutineProgress {
  lastCompletedDate: string | null; // 'YYYY-MM-DD'
  streakCount: number;
}

export type SetView = (view: View) => void;
