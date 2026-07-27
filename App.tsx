
import React, { useState, useEffect } from 'react';
import { View, SetView } from './types';
import { useUserData } from './hooks/useUserData';
import { Header, BackButton, Modal, MusicToggle } from './components/common';
import { playMusic, stopMusic, setMusicVolume } from './services/music';

import {
    TrainingMenu,
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
    RoutineAdvanceContext,
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

import { RoutineMenu, RoutineComplete, EXERCISE_CATALOG } from './components/Routine';
import type { RoutineProgress } from './types';

// --- Main Menu ---
interface MainMenuProps {
    setView: SetView;
    reminderIntervalMinutes: number;
    onReminderIntervalChange: (minutes: number) => void;
    reminderEnabled: boolean;
    onReminderEnabledChange: (enabled: boolean) => void;
    routineProgress: RoutineProgress;
    musicEnabled: boolean;
    onMusicEnabledChange: (enabled: boolean) => void;
    musicVolume: number;
    onMusicVolumeChange: (volume: number) => void;
}
// Compact horizontal row (icon left, text right) — used only in MainMenu,
// where three stacked hero-style Cards plus settings no longer fit on a
// small phone screen (e.g. iPhone SE, 375×667) without scrolling.
interface MenuRowProps { title: string; description: string; subtitle?: string; onClick: () => void; icon: React.ReactNode; }
const MenuRow: React.FC<MenuRowProps> = ({ title, description, subtitle, onClick, icon }) => (
    <div
        onClick={onClick}
        className="w-full bg-slate-800 rounded-lg p-[clamp(0.75rem,2.2vh,2.5rem)] flex items-center gap-[clamp(0.75rem,1.6vh,1.5rem)] text-left cursor-pointer
                   hover:bg-slate-700/80 transition-colors duration-200"
    >
        <div className="text-cyan-400 flex-shrink-0">{icon}</div>
        <div className="min-w-0">
            <h3 className="font-bold text-white text-[clamp(0.95rem,2.4vh,1.5rem)]">{title}</h3>
            <p className="text-slate-400 text-[clamp(0.7rem,1.7vh,1.125rem)] leading-snug mt-0.5">{description}</p>
            {subtitle && <p className="text-slate-300 text-[clamp(0.7rem,1.7vh,1.125rem)] leading-snug mt-1">{subtitle}</p>}
        </div>
    </div>
);

const MainMenu: React.FC<MainMenuProps> = ({ setView, reminderIntervalMinutes, onReminderIntervalChange, reminderEnabled, onReminderEnabledChange, routineProgress, musicEnabled, onMusicEnabledChange, musicVolume, onMusicVolumeChange }) => {
    const TrainingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-[clamp(1.5rem,3.6vh,3.25rem)] w-[clamp(1.5rem,3.6vh,3.25rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
    const DiagnosisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-[clamp(1.5rem,3.6vh,3.25rem)] w-[clamp(1.5rem,3.6vh,3.25rem)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    const RoutineIcon = () => <span className="text-[clamp(1.25rem,3.6vh,2.5rem)]">🔥</span>;

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col justify-evenly items-center gap-[clamp(0.5rem,1.8vh,2rem)] p-4 max-w-4xl mx-auto w-full">
            <MenuRow
                title="Treino Diário"
                description="Exercícios para fortalecer e relaxar os seus olhos."
                subtitle="5-10 min/dia — foco, rastreamento e relaxamento"
                onClick={() => setView(View.TrainingMenu)}
                icon={<TrainingIcon />}
            />
            <MenuRow
                title="A Minha Rotina"
                description="Rotinas prontas ou personalizadas, em sequência."
                subtitle={routineProgress.streakCount > 0 ? `🔥 ${routineProgress.streakCount} dia${routineProgress.streakCount > 1 ? 's' : ''} seguido${routineProgress.streakCount > 1 ? 's' : ''}` : 'Crie o hábito diário'}
                onClick={() => setView(View.RoutineMenu)}
                icon={<RoutineIcon />}
            />
            <MenuRow
                title="Diagnóstico"
                description="Autoavaliação para monitorizar a sua visão."
                subtitle="Testes rápidos — não substitui uma consulta de oftalmologia"
                onClick={() => setView(View.DiagnosisMenu)}
                icon={<DiagnosisIcon />}
            />

            <div className="flex flex-col items-center gap-1">
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

            <div className="flex flex-col items-center gap-1">
                <MusicToggle
                    enabled={musicEnabled}
                    onEnabledChange={onMusicEnabledChange}
                    volume={musicVolume}
                    onVolumeChange={onMusicVolumeChange}
                />
                <p className="text-slate-400 text-sm">Toca durante os exercícios de Foco &amp; Convergência, Movimento &amp; Rastreamento e Relaxamento</p>
            </div>

            <p className="text-slate-400 text-sm text-center max-w-xs">
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
    const { userId, settings, diagnoses, updateSettings, addDiagnosis, customRoutine, saveCustomRoutine, routineProgress, completeRoutine } = useUserData();
    const [is202020ModalOpen, setIs202020ModalOpen] = useState(false);
    const [routine, setRoutine] = useState<{ queue: View[]; index: number } | null>(null);

    const startRoutine = (exercises: View[]) => {
        setRoutine({ queue: exercises, index: 0 });
        setView(exercises[0]);
    };

    // Shared by the manual back-button skip and the automatic advance fired by
    // CompletionScreen once an exercise finishes on its own.
    const advanceRoutine = () => {
        setRoutine(prev => {
            if (!prev) return prev;
            const nextIndex = prev.index + 1;
            if (nextIndex < prev.queue.length) {
                setView(prev.queue[nextIndex]);
                return { ...prev, index: nextIndex };
            }
            completeRoutine();
            setView(View.RoutineComplete);
            return null;
        });
    };

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    // Background music only plays behind Foco & Convergência (upbeat "focus"
    // track) and Relaxamento (calmer "relax" track) — it's tied to `view`
    // rather than started per-component so leaving any of these screens (back
    // button, routine advance, finishing) reliably stops it via the same
    // effect cleanup, instead of duplicating start/stop calls per component.
    const FOCUS_MUSIC_VIEWS = [View.NearFarFocus, View.PencilPushUp, View.NearFocus, View.AccommodativeFacility, View.Saccades, View.FigureEight, View.EyeRolls, View.SmoothPursuit];
    const RELAX_MUSIC_VIEWS = [View.BlinkingInfo, View.Blink3s, View.PalmingInfo, View.LookFar];
    const desiredTrack: 'focus' | 'relax' | null = FOCUS_MUSIC_VIEWS.includes(view)
        ? 'focus'
        : RELAX_MUSIC_VIEWS.includes(view)
        ? 'relax'
        : null;

    // Depends on the derived track name (a stable string), not on `view`
    // directly — moving between two exercises of the same category (e.g.
    // advancing through a routine) keeps the same track playing instead of
    // restarting it from the beginning every time the screen changes.
    useEffect(() => {
        if (settings.musicEnabled && desiredTrack) {
            playMusic(desiredTrack, settings.musicVolume);
        } else {
            stopMusic();
        }
        return () => stopMusic();
    }, [desiredTrack, settings.musicEnabled]);

    // Volume adjusts live, separately from the play/stop lifecycle above, so
    // dragging the slider doesn't also restart the track from the beginning.
    useEffect(() => {
        setMusicVolume(settings.musicVolume);
    }, [settings.musicVolume]);

    useEffect(() => {
        // Wait for the real persisted settings to load before scheduling anything.
        // Without this, the first render uses DEFAULT_SETTINGS (reminderEnabled:
        // true) for an instant before useUserData's async localStorage read
        // resolves — if the stored "last fired" timestamp was already overdue,
        // that stale default fires the modal immediately, even when the user
        // has the reminder turned off. Toggling it off afterwards can't un-open
        // a modal that already fired.
        if (!userId || !settings.reminderEnabled) return;

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
    }, [userId, settings.reminderIntervalMinutes, settings.reminderEnabled]);

    const navigateBack = () => {
        // Mid-routine, the back arrow abandons the routine and returns to its
        // menu — it's not a "skip to next" control. Advancing between
        // exercises happens automatically when one finishes (see advanceRoutine
        // wired through RoutineAdvanceContext).
        if (routine) {
            setRoutine(null);
            setView(View.RoutineMenu);
            return;
        }

        const parentMap: { [key in View]?: View } = {
            [View.TrainingMenu]: View.MainMenu,
            [View.DiagnosisMenu]: View.MainMenu,
            [View.NearFarFocus]: View.TrainingMenu,
            [View.PencilPushUp]: View.TrainingMenu,
            [View.NearFocus]: View.TrainingMenu,
            [View.AccommodativeFacility]: View.TrainingMenu,
            [View.Saccades]: View.TrainingMenu,
            [View.BlinkingInfo]: View.TrainingMenu,
            [View.Blink3s]: View.TrainingMenu,
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
            [View.RoutineMenu]: View.MainMenu,
            [View.RoutineComplete]: View.MainMenu,
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
                routineProgress={routineProgress}
                musicEnabled={settings.musicEnabled}
                onMusicEnabledChange={(v) => updateSettings('musicEnabled', v)}
                musicVolume={settings.musicVolume}
                onMusicVolumeChange={(v) => updateSettings('musicVolume', v)}
            />;
            // Training
            case View.TrainingMenu: return <TrainingMenu setView={setView} />;
            case View.NearFarFocus: return <NearFarFocus settings={settings.nearFarFocus} updateSettings={updateSettings} setView={setView} soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)}/>;
            case View.PencilPushUp: return <PencilPushUp settings={settings.pencilPushUp} updateSettings={updateSettings} />;
            case View.NearFocus: return <NearFocus settings={settings.nearFocus} updateSettings={updateSettings} setView={setView}/>;
            case View.AccommodativeFacility: return <AccommodativeFacility soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)} />;
            case View.Saccades: return <Saccades settings={settings.saccades} updateSettings={updateSettings} setView={setView}/>;
            case View.BlinkingInfo: return <BlinkingInfo soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)} />;
            case View.Blink3s: return <Blink3s soundEnabled={settings.soundEnabled} onToggleSound={(v) => updateSettings('soundEnabled', v)} />;
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
            // Routine
            case View.RoutineMenu: return <RoutineMenu
                setView={setView}
                customRoutine={customRoutine}
                onSaveCustomRoutine={saveCustomRoutine}
                routineProgress={routineProgress}
                onStartRoutine={startRoutine}
            />;
            case View.RoutineComplete: return <RoutineComplete setView={setView} routineProgress={routineProgress} />;
            default: return <MainMenu
                setView={setView}
                reminderIntervalMinutes={settings.reminderIntervalMinutes}
                onReminderIntervalChange={(v) => updateSettings('reminderIntervalMinutes', v)}
                reminderEnabled={settings.reminderEnabled}
                onReminderEnabledChange={(v) => updateSettings('reminderEnabled', v)}
                routineProgress={routineProgress}
                musicEnabled={settings.musicEnabled}
                onMusicEnabledChange={(v) => updateSettings('musicEnabled', v)}
                musicVolume={settings.musicVolume}
                onMusicVolumeChange={(v) => updateSettings('musicVolume', v)}
            />;
        }
    };

    const routineAdvanceValue = routine ? {
        next: advanceRoutine,
        nextLabel: routine.index + 1 < routine.queue.length
            ? (EXERCISE_CATALOG.find(e => e.view === routine.queue[routine.index + 1])?.label ?? null)
            : null,
    } : null;

    return (
        <div className="antialiased">
            <Header />
            <main className="pt-20">
                {view !== View.MainMenu && <BackButton onClick={navigateBack} />}

                <RoutineAdvanceContext.Provider value={routineAdvanceValue}>
                    {renderView()}
                </RoutineAdvanceContext.Provider>
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
