
export enum View {
  MainMenu,
  TrainingMenu,
  DiagnosisMenu,
  NearFarFocus,
  PencilPushUp,
  NearFocus,
  Saccades,
  BlinkingInfo,
  Rule202020Info,
  PalmingInfo,
  VisualAcuityTest,
  AmslerGrid,
  SymptomQuestionnaire,
  DiagnosisHistory
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
  Symptoms = 'Questionário de Sintomas'
}

export interface DiagnosisRecord {
  id: string;
  timestamp: string;
  type: DiagnosisType;
  result: any;
}

export type SetView = (view: View) => void;
