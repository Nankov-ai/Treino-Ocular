
import React, { useState, useEffect } from 'react';
import { View, SetView } from './types';
import { useUserData } from './hooks/useUserData';
import { Header, BackButton, Modal } from './components/common';

import {
    TrainingMenu,
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
} from './components/Training';

import {
    DiagnosisMenu,
    VisualAcuityTest,
    AmslerGrid,
    SymptomQuestionnaire,
    DiagnosisHistory,
    DepthPerceptionTest,
    AutostereogramTest,
} from './components/Diagnosis';

import { Card } from './components/common';

// --- Main Menu ---
interface MainMenuProps {
    setView: SetView;
    reminderIntervalMinutes: number;
    onReminderIntervalChange: (minutes: number) => void;
    reminderEnabled: boolean;
    onReminderEnabledChange: (enabled: boolean) => void;
}
const MainMenu: React.FC<MainMenuProps> = ({ setView, reminderIntervalMinutes, onReminderIntervalChange, reminderEnabled, onReminderEnabledChange }) => {
    const TrainingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
    const DiagnosisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 space-y-8">
            <Card
                title="Treino Diário"
                description="Exercícios para fortalecer e relaxar os seus olhos."
                subtitle="5-10 min/dia — foco, rastreamento e relaxamento"
                onClick={() => setView(View.TrainingMenu)}
                icon={<TrainingIcon />}
            />
            <Card
                title="Diagnóstico"
                description="Autoavaliação para monitorizar a sua visão."
                subtitle="Testes rápidos — não substitui uma consulta de oftalmologia"
                onClick={() => setView(View.DiagnosisMenu)}
                icon={<DiagnosisIcon />}
            />
            <div className="flex flex-col items-center gap-2">
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={reminderEnabled}
                        onChange={(e) => onReminderEnabledChange(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500"
                    />
                    Lembrete de pausa para os olhos
                </label>
                {reminderEnabled && (
                    <label className="flex items-center gap-2 text-slate-300 text-sm">
                        A cada
                        <select
                            value={reminderIntervalMinutes}
                            onChange={(e) => onReminderIntervalChange(parseInt(e.target.value, 10))}
                            className="bg-slate-800 border-2 border-slate-700 rounded-md px-2 py-1 focus:border-cyan-500 focus:outline-none"
                        >
                            <option value={20}>20 min (regra 20-20-20)</option>
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>60 min</option>
                        </select>
                    </label>
                )}
            </div>
            <p className="text-slate-400 text-sm text-center max-w-xs pt-4">
                Esta app é uma ferramenta de bem-estar visual e não substitui aconselhamento médico profissional.
            </p>
        </div>
    );
};

const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
};

const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: `${import.meta.env.BASE_URL}nodeflow_icon.svg` });
    }
};

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.MainMenu);
    const { settings, diagnoses, updateSettings, addDiagnosis } = useUserData();
    const [is202020ModalOpen, setIs202020ModalOpen] = useState(false);

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    useEffect(() => {
        if (!settings.reminderEnabled) return;

        const INTERVAL = settings.reminderIntervalMinutes * 60 * 1000;
        const STORAGE_KEY = 'ocular_last202020';

        const scheduleNext = () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            // No record yet (first ever visit): start the count from now instead of
            // treating the missing key as "infinitely overdue" and firing immediately.
            const last = stored === null ? Date.now() : parseInt(stored, 10);
            if (stored === null) localStorage.setItem(STORAGE_KEY, String(last));

            const elapsed = Date.now() - last;
            const delay = elapsed >= INTERVAL ? 0 : INTERVAL - elapsed;

            return setTimeout(() => {
                setIs202020ModalOpen(true);
                sendNotification('Regra 20-20-20 👁️', 'Olhe para algo a 6 metros de distância por 20 segundos.');
                localStorage.setItem(STORAGE_KEY, String(Date.now()));
                timerRef.current = scheduleNext();
            }, delay);
        };

        const timerRef = { current: scheduleNext() };
        return () => clearTimeout(timerRef.current);
    }, [settings.reminderIntervalMinutes, settings.reminderEnabled]);

    const navigateBack = () => {
        const parentMap: { [key in View]?: View } = {
            [View.TrainingMenu]: View.MainMenu,
            [View.DiagnosisMenu]: View.MainMenu,
            [View.NearFarFocus]: View.TrainingMenu,
            [View.PencilPushUp]: View.TrainingMenu,
            [View.NearFocus]: View.TrainingMenu,
            [View.AccommodativeFacility]: View.TrainingMenu,
            [View.Saccades]: View.TrainingMenu,
            [View.BlinkingInfo]: View.TrainingMenu,
            [View.PalmingInfo]: View.TrainingMenu,
            [View.FigureEight]: View.TrainingMenu,
            [View.EyeRolls]: View.TrainingMenu,
            [View.SmoothPursuit]: View.TrainingMenu,
            [View.LookFar]: View.TrainingMenu,
            [View.VisualAcuityTest]: View.DiagnosisMenu,
            [View.AmslerGrid]: View.DiagnosisMenu,
            [View.SymptomQuestionnaire]: View.DiagnosisMenu,
            [View.DiagnosisHistory]: View.DiagnosisMenu,
            [View.DepthPerception]: View.DiagnosisMenu,
            [View.Autostereogram]: View.DiagnosisMenu,
        };
        setView(parentMap[view] ?? View.MainMenu);
    };

    const renderView = () => {
        switch (view) {
            case View.MainMenu: return <MainMenu
                setView={setView}
                reminderIntervalMinutes={settings.reminderIntervalMinutes}
                onReminderIntervalChange={(v) => updateSettings('reminderIntervalMinutes', v)}
                reminderEnabled={settings.reminderEnabled}
                onReminderEnabledChange={(v) => updateSettings('reminderEnabled', v)}
            />;
            // Training
            case View.TrainingMenu: return <TrainingMenu setView={setView} />;
            case View.NearFarFocus: return <NearFarFocus settings={settings.nearFarFocus} updateSettings={updateSettings} setView={setView} soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)}/>;
            case View.PencilPushUp: return <PencilPushUp />;
            case View.NearFocus: return <NearFocus settings={settings.nearFocus} updateSettings={updateSettings} setView={setView}/>;
            case View.AccommodativeFacility: return <AccommodativeFacility soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)} />;
            case View.Saccades: return <Saccades settings={settings.saccades} updateSettings={updateSettings} setView={setView}/>;
            case View.BlinkingInfo: return <BlinkingInfo soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)} />;
            case View.PalmingInfo: return <PalmingInfo soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)} />;
            case View.FigureEight: return <FigureEight />;
            case View.EyeRolls: return <EyeRolls />;
            case View.SmoothPursuit: return <SmoothPursuit />;
            case View.LookFar: return <LookFar />;
            // Diagnosis
            case View.DiagnosisMenu: return <DiagnosisMenu setView={setView} />;
            case View.VisualAcuityTest: return <VisualAcuityTest addDiagnosis={addDiagnosis} />;
            case View.AmslerGrid: return <AmslerGrid addDiagnosis={addDiagnosis} />;
            case View.SymptomQuestionnaire: return <SymptomQuestionnaire addDiagnosis={addDiagnosis} />;
            case View.DiagnosisHistory: return <DiagnosisHistory diagnoses={diagnoses} />;
            case View.DepthPerception: return <DepthPerceptionTest addDiagnosis={addDiagnosis} />;
            case View.Autostereogram: return <AutostereogramTest />;
            default: return <MainMenu
                setView={setView}
                reminderIntervalMinutes={settings.reminderIntervalMinutes}
                onReminderIntervalChange={(v) => updateSettings('reminderIntervalMinutes', v)}
                reminderEnabled={settings.reminderEnabled}
                onReminderEnabledChange={(v) => updateSettings('reminderEnabled', v)}
            />;
        }
    };

    return (
        <div className="antialiased">
            <Header />
            <main className="pt-20">
                {view !== View.MainMenu && <BackButton onClick={navigateBack} />}
                
                {renderView()}
            </main>

            <Modal
                isOpen={is202020ModalOpen}
                onClose={() => setIs202020ModalOpen(false)}
                title="Regra 20-20-20"
            >
                <p>Está na hora da sua pausa! Olhe para algo a 20 pés (cerca de 6 metros) de distância por 20 segundos para relaxar os seus olhos.</p>
            </Modal>
        </div>
    );
};

export default App;
