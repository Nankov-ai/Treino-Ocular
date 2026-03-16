
import { useState, useEffect, useCallback } from 'react';
import type { UserSettings, DiagnosisRecord } from '../types';
import { DiagnosisType } from '../types';
import { initUser, saveData, loadData } from '../services/storage';

const DEFAULT_SETTINGS: UserSettings = {
  nearFarFocus: { duration: 5, repetitions: 10 },
  nearFocus: { duration: 10, repetitions: 10 },
  // FIX: Added duration to satisfy the ExerciseSettings type, which requires it.
  saccades: { duration: 1.5, repetitions: 15 },
};

export const useUserData = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);

  useEffect(() => {
    const id = initUser();
    setUserId(id);
    setSettings(loadData(id, 'settings', DEFAULT_SETTINGS));
    setDiagnoses(loadData(id, 'diagnoses', []));
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

  return { userId, settings, diagnoses, updateSettings, addDiagnosis };
};