
import React, { useState } from 'react';
import type { SetView, Routine, RoutineProgress } from '../types';
import { View } from '../types';
import { Button, Card } from './common';

// --- Exercise catalog (label shown in the custom routine builder) ---
export const EXERCISE_CATALOG: { view: View; label: string }[] = [
    { view: View.NearFarFocus, label: 'Foco Perto/Longe' },
    { view: View.PencilPushUp, label: 'Convergência (Lápis)' },
    { view: View.NearFocus, label: 'Foco Próximo' },
    { view: View.AccommodativeFacility, label: 'Facilidade de Foco' },
    { view: View.Saccades, label: 'Rastreamento Ocular' },
    { view: View.FigureEight, label: 'Figura 8' },
    { view: View.EyeRolls, label: 'Rotações Oculares' },
    { view: View.SmoothPursuit, label: 'Perseguição Ocular' },
    { view: View.BlinkingInfo, label: 'Pestanejar Consciente' },
    { view: View.Blink3s, label: 'Piscar 3S' },
    { view: View.PalmingInfo, label: 'Palming' },
    { view: View.LookFar, label: 'Olhar ao Longe' },
];

const labelFor = (view: View) => EXERCISE_CATALOG.find(e => e.view === view)?.label ?? '?';

// --- Preset routines ---
export const PRESET_ROUTINES: Routine[] = [
    {
        id: 'fatigue-relief',
        name: 'Alívio de Fadiga de Ecrã',
        description: 'Pestanejar, Palming e Olhar ao Longe — para depois de um dia de ecrã.',
        exercises: [View.BlinkingInfo, View.PalmingInfo, View.LookFar],
    },
    {
        id: 'near-focus',
        name: 'Foco ao Perto',
        description: 'Foco Perto/Longe, Facilidade de Foco e Convergência — para dificuldade a focar de perto.',
        exercises: [View.NearFarFocus, View.AccommodativeFacility, View.PencilPushUp],
    },
    {
        id: 'quick',
        name: 'Rápida',
        description: 'Rastreamento, Rotações Oculares e Pestanejar — cerca de 3 minutos.',
        exercises: [View.Saccades, View.EyeRolls, View.BlinkingInfo],
    },
];

// --- Routine Menu ---
interface RoutineMenuProps {
    setView: SetView;
    customRoutine: View[];
    onSaveCustomRoutine: (views: View[]) => void;
    routineProgress: RoutineProgress;
    onStartRoutine: (exercises: View[]) => void;
}
export const RoutineMenu: React.FC<RoutineMenuProps> = ({ customRoutine, onSaveCustomRoutine, routineProgress, onStartRoutine }) => {
    const [building, setBuilding] = useState(false);
    const [selected, setSelected] = useState<Set<View>>(new Set(customRoutine));

    const toggle = (view: View) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(view) ? next.delete(view) : next.add(view);
            return next;
        });
    };

    const handleSave = () => {
        onSaveCustomRoutine([...selected]);
        setBuilding(false);
    };

    return (
        <div className="p-4 pt-24 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white">A Minha Rotina</h2>

            {routineProgress.streakCount > 0 && (
                <p className="text-center text-lg text-amber-400 font-semibold">
                    🔥 {routineProgress.streakCount} dia{routineProgress.streakCount > 1 ? 's' : ''} seguido{routineProgress.streakCount > 1 ? 's' : ''}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_ROUTINES.map(r => (
                    <Card
                        key={r.id}
                        title={r.name}
                        description={r.description}
                        onClick={() => onStartRoutine(r.exercises)}
                        icon={<span className="text-4xl">👁️</span>}
                    />
                ))}
            </div>

            <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">Rotina Personalizada</h3>
                    <button onClick={() => setBuilding(b => !b)} className="text-cyan-400 text-sm hover:text-cyan-300">
                        {building ? 'Fechar' : customRoutine.length > 0 ? 'Editar' : 'Criar'}
                    </button>
                </div>

                {!building && customRoutine.length > 0 && (
                    <>
                        <p className="text-slate-400 text-sm">{customRoutine.map(labelFor).join(' → ')}</p>
                        <Button onClick={() => onStartRoutine(customRoutine)}>Iniciar Rotina Personalizada</Button>
                    </>
                )}

                {!building && customRoutine.length === 0 && (
                    <p className="text-slate-400 text-sm">Ainda não criou uma rotina personalizada.</p>
                )}

                {building && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            {EXERCISE_CATALOG.map(e => (
                                <label key={e.view} className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(e.view)}
                                        onChange={() => toggle(e.view)}
                                        className="w-4 h-4 accent-cyan-500"
                                    />
                                    {e.label}
                                </label>
                            ))}
                        </div>
                        <Button onClick={handleSave} disabled={selected.size === 0}>Guardar Rotina</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Routine Complete ---
interface RoutineCompleteProps {
    setView: SetView;
    routineProgress: RoutineProgress;
}
export const RoutineComplete: React.FC<RoutineCompleteProps> = ({ setView, routineProgress }) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-400 text-2xl font-bold">Rotina Concluída!</p>
        <p className="text-amber-400 text-lg font-semibold">
            🔥 {routineProgress.streakCount} dia{routineProgress.streakCount > 1 ? 's' : ''} seguido{routineProgress.streakCount > 1 ? 's' : ''}
        </p>
        <Button onClick={() => setView(View.RoutineMenu)}>Voltar às Rotinas</Button>
    </div>
);
