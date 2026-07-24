
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { SetView, UserSettings } from '../types';
import { View } from '../types';
import { Button, BackButton, Card, SettingsInput } from './common';

// --- Icons (embedded for simplicity) ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10m16-5H4m16 5H4M4 7h16" /></svg>;
const MoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M16 17v4m-2-2h4m5-11l-3-3-3 3M19 5l-3 3-3-3" /></svg>;
const HandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.63 8.257c.36.43.123 1.123-.39 1.35l-2.73 1.19a.4.4 0 01-.482-.132l-3.08-3.99a.4.4 0 01.077-.542l2.6-2.06c.45-.357 1.096-.11 1.34.398l2.665 3.786zM9.49 9.33l-2.73 1.19c-.513.226-.23 1.01.39 1.35l2.665 3.786c.244.508.89.756 1.34.398l2.6-2.06a.4.4 0 00.077-.542l-3.08-3.99a.4.4 0 00-.482-.132z" /></svg>;

// --- Category Section ---
const CategorySection: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
    <div className="space-y-3">
        <h3 className={`text-sm font-bold uppercase tracking-widest ${color} px-1`}>{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children}
        </div>
    </div>
);

// --- Training Menu ---
interface TrainingMenuProps { setView: SetView; }
export const TrainingMenu: React.FC<TrainingMenuProps> = ({ setView }) => (
    <div className="p-4 pt-24 space-y-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white">Treino Diário da Visão</h2>

        <CategorySection title="🎯 Foco & Convergência" color="text-cyan-400">
            <Card title="Foco Perto/Longe" description="Alterna o foco para melhorar a flexibilidade." onClick={() => setView(View.NearFarFocus)} icon={<EyeIcon />} />
            <Card title="Convergência (Lápis)" description="Treina a convergência dos dois olhos." onClick={() => setView(View.PencilPushUp)} icon={<PencilIcon />} />
            <Card title="Foco Próximo" description="Fortalece a visão ao perto focando numa letra." onClick={() => setView(View.NearFocus)} icon={<TextIcon />} />
            <Card title="Facilidade de Foco" description="Treina a rapidez a alternar entre perto e longe." onClick={() => setView(View.AccommodativeFacility)} icon={<EyeIcon />} />
        </CategorySection>

        <CategorySection title="👁️ Movimento & Rastreamento" color="text-violet-400">
            <Card title="Rastreamento Ocular" description="Melhora a precisão dos movimentos oculares." onClick={() => setView(View.Saccades)} icon={<MoveIcon />} />
            <Card title="Figura 8" description="Siga um oito infinito para treinar o rastreamento." onClick={() => setView(View.FigureEight)} icon={<MoveIcon />} />
            <Card title="Rotações Oculares" description="Círculos completos para esticar os músculos oculares." onClick={() => setView(View.EyeRolls)} icon={<SparklesIcon />} />
            <Card title="Perseguição Ocular" description="Siga um alvo em movimento suave, sem mover a cabeça." onClick={() => setView(View.SmoothPursuit)} icon={<MoveIcon />} />
        </CategorySection>

        <CategorySection title="🌿 Relaxamento" color="text-green-400">
            <Card title="Pestanejar Consciente" description="Exercício guiado para combater os olhos secos." onClick={() => setView(View.BlinkingInfo)} icon={<SparklesIcon />} />
            <Card title="Palming" description="2 minutos de escuridão total para relaxar." onClick={() => setView(View.PalmingInfo)} icon={<HandIcon />} />
            <Card title="Olhar ao Longe" description="5 minutos de descanso ativo — o mais eficaz." onClick={() => setView(View.LookFar)} icon={<EyeIcon />} />
        </CategorySection>
    </div>
);

// --- Exercise Wrapper ---
const ExerciseWrapper: React.FC<{ title: string; children: React.ReactNode; className?: string; }> = ({ title, children, className }) => (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center transition-colors duration-300 ${className || ''}`}>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h2>
        {children}
    </div>
);

// --- Completion Screen ---
const CompletionScreen: React.FC<{ title: string }> = ({ title }) => (
    <ExerciseWrapper title={title}>
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-400 mt-4 text-2xl font-bold">Treino Concluído!</p>
        </div>
    </ExerciseWrapper>
);

// --- Settings Screen ---
interface SettingsScreenProps<T> {
    onStart: () => void;
    settings: T;
    onSettingsChange: (newSettings: T) => void;
    children: React.ReactNode;
}

const SettingsScreen = <T,>({ onStart, settings, onSettingsChange, children }: SettingsScreenProps<T>) => (
    <div className="p-4 pt-24 space-y-6 flex flex-col h-full">
        <h3 className="text-2xl font-bold text-center text-white">Configurações</h3>
        <div className="space-y-4">{children}</div>
        <div className="flex-grow"></div>
        <Button onClick={onStart}>Iniciar Treino</Button>
    </div>
);


// --- Near/Far Focus ---
interface NearFarFocusProps {
    settings: UserSettings['nearFarFocus'];
    updateSettings: (key: 'nearFarFocus', newSettings: UserSettings['nearFarFocus']) => void;
    setView: SetView;
}

export const NearFarFocus: React.FC<NearFarFocusProps> = ({ settings, updateSettings, setView }) => {
    const [isStarted, setIsStarted] = useState(false);
    const [isNear, setIsNear] = useState(true);
    const [repsLeft, setRepsLeft] = useState(settings.repetitions);
    const [isFlashing, setIsFlashing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!isStarted || repsLeft === 0) return;

        const interval = setInterval(() => {
            setIsNear(prev => {
                if (!prev) { // Was far, now is near, one rep is complete
                    setRepsLeft(r => r - 1);
                    setIsFlashing(true);
                    setTimeout(() => setIsFlashing(false), 300);
                }
                return !prev;
            });
        }, settings.duration * 1000);

        return () => clearInterval(interval);
    }, [isStarted, repsLeft, settings.duration]);
    
    useEffect(() => {
        if(repsLeft === 0 && isStarted) {
            setIsFinished(true);
            const timer = setTimeout(() => {
                setIsStarted(false);
                setIsFinished(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [repsLeft, isStarted]);
    
    const handleStart = () => {
        setRepsLeft(settings.repetitions);
        setIsStarted(true);
    };

    if (!isStarted) {
        return (
            <SettingsScreen onStart={handleStart} settings={settings} onSettingsChange={(s) => updateSettings('nearFarFocus', s)}>
                <SettingsInput label="Duração" value={settings.duration} onChange={v => updateSettings('nearFarFocus', {...settings, duration: v})} unit="segundos" />
                <SettingsInput label="Repetições" value={settings.repetitions} onChange={v => updateSettings('nearFarFocus', {...settings, repetitions: v})} unit="vezes" />
                 {repsLeft === 0 && <p className="text-green-400 text-center font-bold">Treino concluído!</p>}
            </SettingsScreen>
        );
    }

    if (isFinished) {
        return <CompletionScreen title="Foco Perto/Longe" />;
    }

    return (
        <ExerciseWrapper title="Foco Perto/Longe" className={isFlashing ? 'bg-green-800' : ''}>
            <div className="transition-all duration-500 flex flex-col items-center">
                <p className={`font-black text-white transition-all duration-700 ${isNear ? 'text-4xl' : 'text-9xl'}`}>
                    {isNear ? "FOCA NO PERTO" : "FOCA NO LONGE"}
                </p>
                <p className="text-slate-400 mt-8 text-xl">Repetições restantes: {repsLeft}</p>
            </div>
        </ExerciseWrapper>
    );
};


// --- Pencil Push-Up ---
export const PencilPushUp: React.FC = () => {
    const [distance, setDistance] = useState(100); // 0 (near) to 100 (far)
    const [isAuto, setIsAuto] = useState(false);

    useEffect(() => {
        if (!isAuto) return;
        let dir = -1;
        const interval = setInterval(() => {
            setDistance(d => {
                if (d <= 0) dir = 1;
                if (d >= 100) dir = -1;
                return d + dir;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [isAuto]);

    const blurAmount = useMemo(() => Math.max(0, (100 - distance) / 10), [distance]);
    const scaleAmount = useMemo(() => 0.5 + (100 - distance) / 100 * 2, [distance]);

    return (
        <div className="w-full overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
            {/* Scene — fills all available space above controls */}
            <div className="relative flex-1 overflow-hidden">
                {/* Background landscape */}
                <div className="absolute inset-0 transition-all duration-300" style={{
                    filter: `blur(${blurAmount}px)`,
                    background: 'linear-gradient(180deg, #1a3a5c 0%, #2d6a9f 38%, #4a9eda 50%, #6dbf8e 51%, #3d8c5f 72%, #2a6040 100%)'
                }}>
                    <div style={{ position: 'absolute', bottom: '28%', left: '12%', width: '14%', height: '28%', background: '#1e4d2b', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    <div style={{ position: 'absolute', bottom: '28%', right: '15%', width: '20%', height: '38%', background: '#163d22', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    <div style={{ position: 'absolute', bottom: '28%', left: '40%', width: '9%', height: '20%', background: '#255c35', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    <div style={{ position: 'absolute', top: '12%', left: '22%', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,200,0.95)', boxShadow: '0 0 24px 10px rgba(255,255,180,0.4)' }} />
                </div>
                <div className="absolute inset-0 bg-black/20" />

                {/* Pencil — centered in the scene, original scale movement */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="bg-yellow-400 border-2 border-yellow-600 w-4 rounded-full shadow-xl transition-transform duration-300"
                        style={{ height: '30vh', transform: `scale(${scaleAmount})`, transformOrigin: 'center center' }}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-900/80 backdrop-blur-sm z-20 space-y-3 flex-shrink-0">
                <div className="flex gap-4">
                    <Button onClick={() => setDistance(d => Math.max(0, d - 5))} disabled={isAuto}>Aproximar</Button>
                    <Button onClick={() => setDistance(d => Math.min(100, d + 5))} disabled={isAuto}>Afastar</Button>
                </div>
                <Button onClick={() => setIsAuto(!isAuto)} variant={isAuto ? 'secondary' : 'primary'}>
                    {isAuto ? 'Parar Automático' : 'Iniciar Automático'}
                </Button>
            </div>
        </div>
    );
};

// --- Near Focus ---
interface NearFocusProps {
    settings: UserSettings['nearFocus'];
    updateSettings: (key: 'nearFocus', newSettings: UserSettings['nearFocus']) => void;
    setView: SetView;
}
export const NearFocus: React.FC<NearFocusProps> = ({ settings, updateSettings, setView }) => {
    const [isStarted, setIsStarted] = useState(false);
    const [repsLeft, setRepsLeft] = useState(settings.repetitions);
    const [letter, setLetter] = useState('A');
    const [isFlashing, setIsFlashing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const generateLetter = useCallback(() => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        setLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }, []);

    useEffect(() => {
        if (!isStarted || repsLeft === 0) return;
        
        generateLetter();
        const interval = setInterval(() => {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 300);
            setRepsLeft(r => {
                const newReps = r - 1;
                if (newReps > 0) generateLetter();
                return newReps;
            });
        }, settings.duration * 1000);

        return () => clearInterval(interval);
    }, [isStarted, repsLeft, settings.duration, generateLetter]);

    useEffect(() => {
        if(repsLeft === 0 && isStarted) {
            setIsFinished(true);
            const timer = setTimeout(() => {
                setIsStarted(false);
                setIsFinished(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [repsLeft, isStarted]);

    const handleStart = () => {
        setRepsLeft(settings.repetitions);
        setIsStarted(true);
    };

    if (!isStarted) {
        return (
            <SettingsScreen onStart={handleStart} settings={settings} onSettingsChange={(s) => updateSettings('nearFocus', s)}>
                <SettingsInput label="Duração Foco" value={settings.duration} onChange={v => updateSettings('nearFocus', {...settings, duration: v})} unit="segundos" />
                <SettingsInput label="Repetições" value={settings.repetitions} onChange={v => updateSettings('nearFocus', {...settings, repetitions: v})} unit="vezes" />
                 {repsLeft === 0 && <p className="text-green-400 text-center font-bold">Treino concluído!</p>}
            </SettingsScreen>
        );
    }
    
    if (isFinished) {
        return <CompletionScreen title="Foco Próximo" />;
    }

    return (
        <ExerciseWrapper title="Foco Próximo" className={isFlashing ? 'bg-green-800' : ''}>
             <p className="font-mono text-9xl font-bold text-white">{letter}</p>
             <p className="text-slate-400 mt-8 text-xl">Repetições restantes: {repsLeft}</p>
        </ExerciseWrapper>
    );
};

// --- Accommodative Facility (Facilidade de Foco) ---
export const AccommodativeFacility: React.FC = () => {
    const SESSION_SECONDS = 60;
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [phase, setPhase] = useState<'near' | 'far'>('near');
    const [letter, setLetter] = useState('A');
    const [cycles, setCycles] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);

    const generateLetter = useCallback(() => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";
        setLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }, []);

    useEffect(() => {
        if (!started || finished) return;
        if (secondsLeft <= 0) { setFinished(true); return; }
        const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [started, finished, secondsLeft]);

    const handleStart = () => {
        setCycles(0);
        setPhase('near');
        generateLetter();
        setSecondsLeft(SESSION_SECONDS);
        setFinished(false);
        setStarted(true);
    };

    const handleConfirm = () => {
        if (phase === 'near') {
            setPhase('far');
        } else {
            setCycles(c => c + 1);
            generateLetter();
            setPhase('near');
        }
    };

    const cyclesPerMinute = ((cycles / (SESSION_SECONDS - secondsLeft || 1)) * 60).toFixed(1);

    if (finished) {
        return (
            <ExerciseWrapper title="Facilidade de Foco">
                <div className="flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-400 text-2xl font-bold">Treino Concluído!</p>
                    <p className="text-white text-xl">{cycles} ciclos completos</p>
                    <p className="text-slate-400">≈ {cyclesPerMinute} ciclos/minuto</p>
                </div>
            </ExerciseWrapper>
        );
    }

    if (!started) {
        return (
            <ExerciseWrapper title="Facilidade de Foco">
                <div className="space-y-4 max-w-sm text-center">
                    <p className="text-slate-300">Segure o telemóvel a uma distância confortável de leitura.</p>
                    <ol className="text-slate-300 text-left list-decimal list-inside space-y-2">
                        <li>Quando aparecer uma letra, foque nela e leia-a em voz alta assim que estiver nítida</li>
                        <li>Prima "Consegui Ler" — vai pedir-lhe para focar num ponto distante (janela, parede)</li>
                        <li>Quando esse ponto distante estiver nítido, prima "Consegui Focar"</li>
                        <li>Repita o ciclo o mais rápido possível, sem perder a nitidez</li>
                    </ol>
                    <p className="text-slate-400 text-sm">60 segundos • mede quantos ciclos perto/longe consegue completar</p>
                    <Button onClick={handleStart}>Iniciar</Button>
                </div>
            </ExerciseWrapper>
        );
    }

    return (
        <ExerciseWrapper title="Facilidade de Foco">
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                {phase === 'near' ? (
                    <>
                        <p className="text-slate-300">Foque no ecrã e leia a letra</p>
                        <p className="font-mono text-9xl font-bold text-white">{letter}</p>
                    </>
                ) : (
                    <>
                        <p className="text-slate-300">Olhe agora para um ponto distante</p>
                        <p className="text-4xl">🌄</p>
                        <p className="text-slate-400">Espere até estar nítido, depois confirme</p>
                    </>
                )}
                <Button onClick={handleConfirm}>{phase === 'near' ? 'Consegui Ler ✓' : 'Consegui Focar ✓'}</Button>
                <div className="flex justify-between w-full text-slate-400 text-sm">
                    <span>Ciclos: {cycles}</span>
                    <span>{secondsLeft}s restantes</span>
                </div>
            </div>
        </ExerciseWrapper>
    );
};

// --- Saccades ---
interface SaccadesProps {
    settings: UserSettings['saccades'];
    updateSettings: (key: 'saccades', newSettings: UserSettings['saccades']) => void;
    setView: SetView;
}
export const Saccades: React.FC<SaccadesProps> = ({ settings, updateSettings, setView }) => {
    const [isStarted, setIsStarted] = useState(false);
    // halfCycles counts left+right movements; each full rep = 2 half-cycles
    const [halfCyclesLeft, setHalfCyclesLeft] = useState(settings.repetitions * 2);
    const [isLeftActive, setIsLeftActive] = useState(true);
    const [isFlashing, setIsFlashing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const repsLeft = Math.ceil(halfCyclesLeft / 2);

    useEffect(() => {
        if (!isStarted || halfCyclesLeft <= 0) return;

        const interval = setInterval(() => {
            setIsLeftActive(prev => !prev);
            setHalfCyclesLeft(r => {
                const next = r - 1;
                if (next % 2 === 0 && next > 0) {
                    setIsFlashing(true);
                    setTimeout(() => setIsFlashing(false), 300);
                }
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isStarted, halfCyclesLeft]);

    useEffect(() => {
        if(halfCyclesLeft <= 0 && isStarted) {
            setIsFinished(true);
            const timer = setTimeout(() => {
                setIsStarted(false);
                setIsFinished(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [halfCyclesLeft, isStarted]);

    const handleStart = () => {
        setHalfCyclesLeft(settings.repetitions * 2);
        setIsStarted(true);
    };
    
    if (!isStarted) {
        return (
             <SettingsScreen onStart={handleStart} settings={settings} onSettingsChange={(s) => updateSettings('saccades', s)}>
                <SettingsInput label="Repetições" value={settings.repetitions} onChange={v => updateSettings('saccades', {...settings, repetitions: v})} unit="vezes" min={5} max={50}/>
                 {halfCyclesLeft <= 0 && <p className="text-green-400 text-center font-bold">Treino concluído!</p>}
            </SettingsScreen>
        );
    }

    if (isFinished) {
        return <CompletionScreen title="Rastreamento Ocular" />;
    }

    const Dot: React.FC<{isActive: boolean}> = ({isActive}) => (
        <div className={`w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-400 scale-125' : 'bg-slate-700'}`}></div>
    );
    
    return (
        <ExerciseWrapper title="Rastreamento Ocular" className={isFlashing ? 'bg-green-800' : ''}>
            <p className="mb-8 text-slate-300">Mova apenas os seus olhos, não a cabeça.</p>
            <div className="w-full max-w-xs flex justify-between items-center">
                <Dot isActive={isLeftActive} />
                <Dot isActive={!isLeftActive} />
            </div>
            <p className="text-slate-400 mt-8 text-xl">Repetições restantes: {repsLeft}</p>
        </ExerciseWrapper>
    );
};


// --- Guided Exercise Timer Helper ---
const useGuidedTimer = (steps: { label: string; duration: number }[], reps: number) => {
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [repsDone, setRepsDone] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(steps[0].duration);

    useEffect(() => {
        if (!started || finished) return;
        if (secondsLeft <= 0) {
            const nextStep = (stepIndex + 1) % steps.length;
            if (nextStep === 0) {
                const newReps = repsDone + 1;
                if (newReps >= reps) { setFinished(true); return; }
                setRepsDone(newReps);
            }
            setStepIndex(nextStep);
            setSecondsLeft(steps[nextStep].duration);
            return;
        }
        const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [started, finished, secondsLeft, stepIndex, repsDone]);

    const start = () => { setStarted(true); setFinished(false); setRepsDone(0); setStepIndex(0); setSecondsLeft(steps[0].duration); };
    return { started, finished, repsDone, stepIndex, secondsLeft, start };
};

// --- Blinking Guided ---
export const BlinkingInfo: React.FC = () => {
    const steps = [
        { label: 'Feche os olhos suavemente', duration: 2 },
        { label: 'Abra os olhos', duration: 1 },
        { label: 'Feche e aperte gentilmente', duration: 2 },
        { label: 'Abra e relaxe', duration: 1 },
    ];
    const REPS = 10;
    const { started, finished, repsDone, stepIndex, secondsLeft, start } = useGuidedTimer(steps, REPS);

    if (finished) return <CompletionScreen title="Pestanejar Consciente" />;

    return (
        <ExerciseWrapper title="Pestanejar Consciente">
            {!started ? (
                <div className="space-y-4 max-w-sm text-center">
                    <p className="text-slate-300">Estimula as glândulas lacrimais e alivia os olhos secos causados pelo ecrã.</p>
                    <p className="text-slate-400 text-sm">{REPS} ciclos completos • ~60 segundos</p>
                    <Button onClick={start}>Iniciar</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-5xl font-bold text-cyan-400">{secondsLeft}</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{steps[stepIndex].label}</p>
                    <p className="text-slate-400">Ciclo {repsDone + 1} de {REPS}</p>
                </div>
            )}
        </ExerciseWrapper>
    );
};

// --- Palming Guided ---
export const PalmingInfo: React.FC = () => {
    const DURATION = 120; // 2 minutes
    const [started, setStarted] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(DURATION);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!started || finished) return;
        if (secondsLeft <= 0) { setFinished(true); return; }
        const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [started, secondsLeft, finished]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const progress = ((DURATION - secondsLeft) / DURATION) * 100;

    if (finished) return <CompletionScreen title="Palming" />;

    return (
        <ExerciseWrapper title="Palming — Relaxamento">
            {!started ? (
                <div className="space-y-4 max-w-sm text-center">
                    <ol className="text-slate-300 text-left list-decimal list-inside space-y-2">
                        <li>Esfregue as palmas para as aquecer</li>
                        <li>Feche os olhos e cubra-os com as palmas em concha</li>
                        <li>Respire fundo — foque na escuridão total</li>
                    </ol>
                    <p className="text-slate-400 text-sm">2 minutos de relaxamento</p>
                    <Button onClick={() => setStarted(true)}>Iniciar</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                    <div className="w-36 h-36 rounded-full bg-slate-900 flex items-center justify-center relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <circle cx="50" cy="50" r="44" fill="none" stroke="#22d3ee" strokeWidth="8"
                                strokeDasharray={`${progress * 2.76} 276`} strokeLinecap="round" />
                        </svg>
                        <span className="text-3xl font-bold text-cyan-400">{mins}:{secs.toString().padStart(2, '0')}</span>
                    </div>
                    <p className="text-slate-300 text-lg">Olhos fechados — respira fundo</p>
                </div>
            )}
        </ExerciseWrapper>
    );
};

// --- Figure Eight ---
export const FigureEight: React.FC = () => {
    const PHASE_DURATION = 30;
    const [started, setStarted] = useState(false);
    const [phase, setPhase] = useState<'cw' | 'ccw'>('cw');
    const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION);
    const [finished, setFinished] = useState(false);
    const [dotAngle, setDotAngle] = useState(0);

    useEffect(() => {
        if (!started || finished) return;
        if (secondsLeft <= 0) {
            if (phase === 'cw') { setPhase('ccw'); setSecondsLeft(PHASE_DURATION); }
            else setFinished(true);
            return;
        }
        const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [started, secondsLeft, phase, finished]);

    useEffect(() => {
        if (!started || finished) return;
        const dir = phase === 'cw' ? 1 : -1;
        const anim = setInterval(() => setDotAngle(a => a + dir * 2), 16);
        return () => clearInterval(anim);
    }, [started, phase, finished]);

    // Lemniscate (figure-8) parametric: x = cos(t), y = sin(t)*cos(t)
    const t = (dotAngle * Math.PI) / 180;
    const dotX = 50 + 40 * Math.cos(t);
    const dotY = 50 + 20 * Math.sin(t) * Math.cos(t);

    if (finished) return <CompletionScreen title="Figura 8" />;

    return (
        <ExerciseWrapper title="Figura 8">
            {!started ? (
                <div className="space-y-4 max-w-sm text-center">
                    <p className="text-slate-300">Siga o ponto com os olhos, sem mover a cabeça.</p>
                    <p className="text-slate-300">30 segundos em cada direção.</p>
                    <Button onClick={() => setStarted(true)}>Iniciar</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                    <svg viewBox="0 0 100 100" className="w-full max-w-xs" style={{ maxHeight: '40vh' }}>
                        {/* Figure-8 path guide */}
                        <path d="M 10 50 Q 10 10 50 50 Q 90 90 90 50 Q 90 10 50 50 Q 10 90 10 50 Z"
                            fill="none" stroke="#334155" strokeWidth="1.5" />
                        {/* Moving dot */}
                        <circle cx={dotX} cy={dotY} r="4" fill="#22d3ee" />
                    </svg>
                    <p className="text-xl font-semibold text-white">
                        {phase === 'cw' ? '→ Sentido horário' : '← Sentido anti-horário'}
                    </p>
                    <p className="text-slate-400">{secondsLeft}s restantes</p>
                </div>
            )}
        </ExerciseWrapper>
    );
};

// --- Eye Rolls ---
export const EyeRolls: React.FC = () => {
    const REPS = 5;
    const [started, setStarted] = useState(false);
    const [phase, setPhase] = useState<'cw' | 'ccw'>('cw');
    const [repsDone, setRepsDone] = useState(0);
    const [finished, setFinished] = useState(false);
    const [dotAngle, setDotAngle] = useState(0);

    useEffect(() => {
        if (!started || finished) return;
        const speed = 1.2;
        const anim = setInterval(() => {
            setDotAngle(prev => {
                const next = prev + speed;
                if (next >= 360) {
                    const newReps = repsDone + 1;
                    if (phase === 'cw' && newReps >= REPS) {
                        setPhase('ccw'); setRepsDone(0);
                    } else if (phase === 'ccw' && newReps >= REPS) {
                        setFinished(true);
                    } else {
                        setRepsDone(newReps);
                    }
                    return 0;
                }
                return next;
            });
        }, 16);
        return () => clearInterval(anim);
    }, [started, finished, phase, repsDone]);

    const dir = phase === 'cw' ? 1 : -1;
    const rad = ((dotAngle - 90) * Math.PI) / 180;
    const dotX = 50 + 38 * Math.cos(dir * rad);
    const dotY = 50 + 38 * Math.sin(dir * rad);

    if (finished) return <CompletionScreen title="Rotações Oculares" />;

    return (
        <ExerciseWrapper title="Rotações Oculares">
            {!started ? (
                <div className="space-y-4 max-w-sm text-center">
                    <p className="text-slate-300">Siga o ponto com os olhos em círculo completo, sem mover a cabeça.</p>
                    <p className="text-slate-300">5 voltas em cada direção.</p>
                    <Button onClick={() => setStarted(true)}>Iniciar</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                    <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: '40vh' }}>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#334155" strokeWidth="1.5" />
                        <circle cx={dotX} cy={dotY} r="5" fill="#22d3ee" />
                    </svg>
                    <p className="text-xl font-semibold text-white">
                        {phase === 'cw' ? '→ Sentido horário' : '← Sentido anti-horário'}
                    </p>
                    <p className="text-slate-400">Volta {repsDone + 1} de {REPS}</p>
                </div>
            )}
        </ExerciseWrapper>
    );
};

// --- Smooth Pursuit ---
export const SmoothPursuit: React.FC = () => {
    const PHASE_DURATION = 30;
    const PHASES: { key: 'horizontal' | 'vertical' | 'diagonal'; label: string }[] = [
        { key: 'horizontal', label: 'Movimento Horizontal' },
        { key: 'vertical', label: 'Movimento Vertical' },
        { key: 'diagonal', label: 'Movimento Diagonal' },
    ];
    const [started, setStarted] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION);
    const [finished, setFinished] = useState(false);
    const [t, setT] = useState(0);

    useEffect(() => {
        if (!started || finished) return;
        if (secondsLeft <= 0) {
            if (phaseIndex < PHASES.length - 1) {
                setPhaseIndex(p => p + 1);
                setSecondsLeft(PHASE_DURATION);
            } else {
                setFinished(true);
            }
            return;
        }
        const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [started, secondsLeft, phaseIndex, finished]);

    useEffect(() => {
        if (!started || finished) return;
        const anim = setInterval(() => setT(prev => prev + 0.03), 16);
        return () => clearInterval(anim);
    }, [started, finished]);

    const phase = PHASES[phaseIndex].key;
    const sway = Math.sin(t); // -1..1
    let dotX = 50, dotY = 50;
    if (phase === 'horizontal') { dotX = 50 + 40 * sway; dotY = 50; }
    else if (phase === 'vertical') { dotX = 50; dotY = 50 + 35 * sway; }
    else { dotX = 50 + 38 * sway; dotY = 50 + 33 * sway; }

    if (finished) return <CompletionScreen title="Perseguição Ocular" />;

    return (
        <ExerciseWrapper title="Perseguição Ocular">
            {!started ? (
                <div className="space-y-4 max-w-sm text-center">
                    <p className="text-slate-300">Siga o ponto com os olhos, de forma suave e contínua — sem mover a cabeça.</p>
                    <p className="text-slate-300">30 segundos em cada direção: horizontal, vertical e diagonal.</p>
                    <Button onClick={() => setStarted(true)}>Iniciar</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                    <svg viewBox="0 0 100 100" className="w-full max-w-xs" style={{ maxHeight: '40vh' }}>
                        <circle cx={dotX} cy={dotY} r="4" fill="#22d3ee" />
                    </svg>
                    <p className="text-xl font-semibold text-white">{PHASES[phaseIndex].label}</p>
                    <p className="text-slate-400">{secondsLeft}s restantes</p>
                </div>
            )}
        </ExerciseWrapper>
    );
};

// --- Look Far (Rest) ---
export const LookFar: React.FC = () => {
    const DURATION = 300; // 5 minutes
    const [started, setStarted] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(DURATION);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!started || finished) return;
        if (secondsLeft <= 0) { setFinished(true); return; }
        const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [started, secondsLeft, finished]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    if (finished) return <CompletionScreen title="Descanso Ativo" />;

    return (
        <ExerciseWrapper title="Olhar ao Longe">
            {!started ? (
                <div className="space-y-4 max-w-sm text-center">
                    <p className="text-slate-300">Olhe pela janela ou para o horizonte. Não foque em nada em particular — deixe os olhos descansar naturalmente.</p>
                    <p className="text-slate-400 text-sm">5 minutos • O exercício mais eficaz contra a fadiga de ecrã</p>
                    <Button onClick={() => setStarted(true)}>Iniciar</Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <p className="text-6xl">🌄</p>
                    <p className="text-slate-300 text-lg">Olhe para longe — relaxe os olhos</p>
                    <p className="text-5xl font-bold text-cyan-400">{mins}:{secs.toString().padStart(2, '0')}</p>
                    <p className="text-slate-500 text-sm">Não foque em nada específico</p>
                </div>
            )}
        </ExerciseWrapper>
    );
};
