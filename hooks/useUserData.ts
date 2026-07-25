
import { useState, useEffect, useCallback } from 'react';
import type { UserSettings, DiagnosisRecord, RoutineProgress } from '../types';
import { DiagnosisType, View } from '../types';
import { initUser, saveData, loadData } from '../services/storage';

const DEFAULT_ROUTINE_PROGRESS: RoutineProgress = { lastCompletedDate: null, streakCount: 0 };

const DEFAULT_SETTINGS: UserSettings = {
  nearFarFocus: { duration: 5, repetitions: 10 },
  nearFocus: { duration: 10, repetitions: 10 },
  pencilPushUp: { duration: 4, repetitions: 5 },
  // FIX: Added duration to satisfy the ExerciseSettings type, which requires it.
  saccades: { duration: 1.5, repetitions: 15 },
  soundEnabled: true,
  reminderIntervalMinutes: 20,
  reminderEnabled: true,
};

export const useUserData = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [customRoutine, setCustomRoutine] = useState<View[]>([]);
  const [routineProgress, setRoutineProgress] = useState<RoutineProgress>(DEFAULT_ROUTINE_PROGRESS);

  useEffect(() => {
    const id = initUser();
    setUserId(id);
    // Merge over defaults so settings saved before a new field existed (e.g. an
    // older localStorage record missing `pencilPushUp`) don't crash components
    // that read it unconditionally.
    setSettings({ ...DEFAULT_SETTINGS, ...loadData(id, 'settings', DEFAULT_SETTINGS) });
    setDiagnoses(loadData(id, 'diagnoses', []));
    setCustomRoutine(loadData(id, 'customRoutine', []));
    setRoutineProgress(loadData(id, 'routineProgress', DEFAULT_ROUTINE_PROGRESS));
  }, []);

  const updateSettings = useCallback(<K extends keyof UserSettings>(key: K, newSettings: UserSettings[K]) => {
    if (!userId) return;
    setSettings(prev => {
      const updated = { ...prev, [key]: newSettings };
      saveData(userId, 'settings', updated);
      return updated;
    });
  }, [userId]);

  const addDiagnosis = useCallback((type: DiagnosisType, result: any) => {
    if (!userId) return;
    setDiagnoses(prev => {
      const newRecord: DiagnosisRecord = {
        id: `diag_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type,
        result,
      };
      const updated = [...prev, newRecord];
      saveData(userId, 'diagnoses', updated);
      return updated;
    });
  }, [userId]);

  const saveCustomRoutine = useCallback((views: View[]) => {
    if (!userId) return;
    setCustomRoutine(views);
    saveData(userId, 'customRoutine', views);
  }, [userId]);

  // Marks today's routine as done and updates the daily streak. Calling it
  // again the same day is a no-op — the streak counts days, not sessions.
  const completeRoutine = useCallback(() => {
    if (!userId) return;
    const today = new Date().toISOString().slice(0, 10);
    setRoutineProgress(prev => {
      if (prev.lastCompletedDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streakCount = prev.lastCompletedDate === yesterday ? prev.streakCount + 1 : 1;
      const updated: RoutineProgress = { lastCompletedDate: today, streakCount };
      saveData(userId, 'routineProgress', updated);
      return updated;
    });
  }, [userId]);

  return { userId, settings, diagnoses, updateSettings, addDiagnosis, customRoutine, saveCustomRoutine, routineProgress, completeRoutine };
};