
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

// --- Training Menu ---
interface TrainingMenuProps { setView: SetView; }
export const TrainingMenu: React.FC<TrainingMenuProps> = ({ setView }) => (
    <div className="p-4 pt-24 space-y-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Treino Diário da Visão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Foco Perto/Longe" description="Alterna o foco para melhorar a flexibilidade." onClick={() => setView(View.NearFarFocus)} icon={<EyeIcon />} />
            <Card title="Convergência (Lápis)" description="Simula o exercício do lápis para treinar a convergência." onClick={() => setView(View.PencilPushUp)} icon={<PencilIcon />} />
            <Card title="Foco Próximo" description="Fortalece a visão ao perto focando numa letra." onClick={() => setView(View.NearFocus)} icon={<TextIcon />} />
            <Card title="Rastreamento Ocular" description="Melhora a precisão dos movimentos oculares." onClick={() => setView(View.Saccades)} icon={<MoveIcon />} />
            <Card title="Pestanejar" description="Instruções para combater os olhos secos." onClick={() => setView(View.BlinkingInfo)} icon={<SparklesIcon />} />
            <Card title="Palming" description="Técnica de relaxamento para os seus olhos." onClick={() => setView(View.PalmingInfo)} icon={<HandIcon />} />
        </div>
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
        let dir = -1; // moving closer
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
    const scaleAmount = useMemo(() => 0.5 + (100-distance)/100 * 2, [distance]);

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
            <img src="https://picsum.photos/800/1200?landscape" alt="Paisagem" className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-300" style={{ filter: `blur(${blurAmount}px)` }}/>
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="z-10 flex flex-col items-center justify-center h-full">
                <div 
                    className="bg-yellow-400 border-2 border-yellow-600 w-4 rounded-full shadow-lg transition-transform duration-300"
                    style={{ height: '30vh', transform: `scale(${scaleAmount})` }}
                ></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/50 backdrop-blur-sm z-20 space-y-4">
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

// --- Saccades ---
interface SaccadesProps {
    settings: UserSettings['saccades'];
    updateSettings: (key: 'saccades', newSettings: UserSettings['saccades']) => void;
    setView: SetView;
}
export const Saccades: React.FC<SaccadesProps> = ({ settings, updateSettings, setView }) => {
    const [isStarted, setIsStarted] = useState(false);
    const [repsLeft, setRepsLeft] = useState(settings.repetitions);
    const [isLeftActive, setIsLeftActive] = useState(true);
    const [isFlashing, setIsFlashing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!isStarted || repsLeft <= 0) return;

        const interval = setInterval(() => {
            setIsLeftActive(prev => {
                setRepsLeft(r => {
                    const newReps = r - 0.5;
                    if (Number.isInteger(newReps) && newReps > 0) {
                        setIsFlashing(true);
                        setTimeout(() => setIsFlashing(false), 300);
                    }
                    return newReps;
                });
                return !prev;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isStarted, repsLeft]);
    
    useEffect(() => {
        if(repsLeft <= 0 && isStarted) {
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
             <SettingsScreen onStart={handleStart} settings={settings} onSettingsChange={(s) => updateSettings('saccades', s)}>
                <SettingsInput label="Repetições" value={settings.repetitions} onChange={v => updateSettings('saccades', {...settings, repetitions: v})} unit="vezes" min={5} max={50}/>
                 {repsLeft <= 0 && <p className="text-green-400 text-center font-bold">Treino concluído!</p>}
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
            <p className="text-slate-400 mt-8 text-xl">Repetições restantes: {Math.ceil(repsLeft)}</p>
        </ExerciseWrapper>
    );
};


// --- Info Pages Wrapper ---
const InfoPage: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
     <div className="p-4 pt-24 space-y-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">{title}</h2>
        <div className="max-w-md mx-auto bg-slate-800 p-6 rounded-lg text-slate-300 space-y-4">
            {children}
        </div>
    </div>
)

// --- Blinking Info ---
export const BlinkingInfo: React.FC = () => (
    <InfoPage title="Exercício de Pestanejar">
        <p>Olhar para ecrãs reduz a frequência com que pestanejamos, causando olhos secos e cansaço.</p>
        <p className="font-bold">Siga este ciclo várias vezes ao dia:</p>
        <ol className="list-decimal list-inside space-y-2">
            <li>Feche os olhos suavemente, sem apertar. Mantenha-os fechados por 2 segundos.</li>
            <li>Abra os olhos.</li>
            <li>Feche os olhos novamente, aperte-os gentilmente por 2 segundos.</li>
            <li>Abra os olhos e relaxe.</li>
        </ol>
        <p>Isto ajuda a estimular as glândulas lacrimais e a espalhar as lágrimas pela superfície ocular.</p>
    </InfoPage>
);

// --- Palming Info ---
export const PalmingInfo: React.FC = () => (
    <InfoPage title="Palming para Relaxamento">
        <p>Esta técnica ajuda a relaxar os músculos dos olhos e a reduzir a tensão.</p>
        <p className="font-bold">Como fazer:</p>
        <ol className="list-decimal list-inside space-y-2">
            <li>Sente-se confortavelmente numa cadeira.</li>
            <li>Esfregue as palmas das mãos uma na outra para as aquecer.</li>
            <li>Feche os olhos e cubra-os suavemente com as palmas em concha. Não aplique pressão nos globos oculares.</li>
            <li>Respire fundo e relaxe por 1-2 minutos, focando na escuridão total.</li>
        </ol>
        <p>Faça isto sempre que sentir os olhos cansados ou tensos.</p>
    </InfoPage>
);
