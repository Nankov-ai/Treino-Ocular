
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
}

export interface ExerciseSettings {
  duration: number; // in seconds
  repetitions: number;
}

export interface UserSettings {
  nearFarFocus: ExerciseSettings;
  nearFocus: ExerciseSettings;
  saccades: ExerciseSettings;
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

export type SetView = (view: View) => void;
