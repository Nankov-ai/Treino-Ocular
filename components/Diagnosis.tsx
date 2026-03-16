
import React, { useState } from 'react';
import type { SetView, DiagnosisRecord } from '../types';
import { View, DiagnosisType } from '../types';
import { Button, BackButton, Card } from './common';

// --- Icons ---
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z" /></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 4v16m4-16v16M4 10h16M4 14h16" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- Diagnosis Menu ---
interface DiagnosisMenuProps { setView: SetView; }
export const DiagnosisMenu: React.FC<DiagnosisMenuProps> = ({ setView }) => (
    <div className="p-4 pt-24 space-y-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Diagnóstico da Visão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Acuidade Visual" description="Teste simplificado para verificar a sua acuidade." onClick={() => setView(View.VisualAcuityTest)} icon={<ChartIcon />} />
            <Card title="Grelha de Amsler" description="Verifique a sua visão central para distorções." onClick={() => setView(View.AmslerGrid)} icon={<GridIcon />} />
            <Card title="Sintomas" description="Registe como se sente para acompanhar a evolução." onClick={() => setView(View.SymptomQuestionnaire)} icon={<ClipboardIcon />} />
            <Card title="Histórico" description="Veja os seus resultados e progressos anteriores." onClick={() => setView(View.DiagnosisHistory)} icon={<HistoryIcon />} />
        </div>
    </div>
);

// --- Diagnosis Wrapper ---
const DiagnosisWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
        <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h2>
            {children}
        </div>
    </div>
);

// --- Visual Acuity Test ---
interface VisualAcuityTestProps {
    addDiagnosis: (type: DiagnosisType, result: any) => void;
}
export const VisualAcuityTest: React.FC<VisualAcuityTestProps> = ({ addDiagnosis }) => {
    const [fontSize, setFontSize] = useState(64); // in px
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        addDiagnosis(DiagnosisType.Acuity, { smallestVisibleSize: fontSize });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <DiagnosisWrapper title="Teste de Acuidade Visual">
            <p className="text-slate-400 mb-6">Aumente ou diminua o tamanho até encontrar a menor letra que consegue ler claramente. Isto é uma simulação e não substitui um exame profissional.</p>
            <div className="bg-white text-black p-8 rounded-lg flex items-center justify-center mb-6 min-h-[200px]">
                <p className="font-bold select-none" style={{ fontSize: `${fontSize}px` }}>E</p>
            </div>
            <div className="flex gap-4 mb-4">
                <Button onClick={() => setFontSize(s => Math.max(8, s - 4))}>Menor</Button>
                <Button onClick={() => setFontSize(s => Math.min(200, s + 4))}>Maior</Button>
            </div>
            <Button onClick={handleSave} disabled={saved}>{saved ? 'Resultado Guardado!' : 'Guardar Resultado'}</Button>
        </DiagnosisWrapper>
    );
};


// --- Amsler Grid ---
interface AmslerGridProps {
    addDiagnosis: (type: DiagnosisType, result: any) => void;
}
export const AmslerGrid: React.FC<AmslerGridProps> = ({ addDiagnosis }) => {
    const [saved, setSaved] = useState<string | null>(null);

    const handleSave = (result: 'ok' | 'distorted') => {
        addDiagnosis(DiagnosisType.Amsler, { status: result });
        setSaved(result);
        setTimeout(() => setSaved(null), 2000);
    };

    return (
         <DiagnosisWrapper title="Grelha de Amsler">
            <p className="text-slate-400 mb-6">Cubra um olho e foque no ponto central. As linhas devem parecer retas e contínuas. Repita com o outro olho. Se notar ondulações, manchas ou distorções, consulte um oftalmologista.</p>
            <div className="bg-white p-2 aspect-square w-full max-w-sm mx-auto grid grid-cols-20 grid-rows-20 relative mb-6">
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => handleSave('distorted')} variant="secondary" disabled={!!saved}>Vejo Distorção</Button>
                <Button onClick={() => handleSave('ok')} disabled={!!saved}>Tudo Certo</Button>
            </div>
             {saved && <p className="mt-4 text-green-400">Resultado Guardado!</p>}
        </DiagnosisWrapper>
    );
};

// --- Symptom Questionnaire ---
interface SymptomQuestionnaireProps {
    addDiagnosis: (type: DiagnosisType, result: any) => void;
}
export const SymptomQuestionnaire: React.FC<SymptomQuestionnaireProps> = ({ addDiagnosis }) => {
    const symptomsList = ["Fadiga Ocular", "Visão Turva", "Dores de Cabeça", "Olhos Secos", "Visão Dupla", "Sensibilidade à Luz"];
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [otherNotes, setOtherNotes] = useState("");
    const [saved, setSaved] = useState(false);

    const handleToggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
    };

    const handleSubmit = () => {
        addDiagnosis(DiagnosisType.Symptoms, { symptoms: selectedSymptoms, notes: otherNotes });
        setSaved(true);
        setSelectedSymptoms([]);
        setOtherNotes("");
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <DiagnosisWrapper title="Questionário de Sintomas">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3 text-left">Selecione os sintomas que sentiu hoje:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {symptomsList.map(symptom => (
                            <button key={symptom} onClick={() => handleToggleSymptom(symptom)} 
                                className={`p-3 rounded-lg text-sm transition-colors ${selectedSymptoms.includes(symptom) ? 'bg-cyan-500 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}>
                                {symptom}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2 text-left">Notas adicionais:</h3>
                    <textarea value={otherNotes} onChange={(e) => setOtherNotes(e.target.value)}
                        className="w-full h-24 p-3 bg-slate-800 rounded-lg text-slate-200 border-2 border-slate-700 focus:border-cyan-500 focus:outline-none"
                        placeholder="Ex: Pior ao fim do dia..."></textarea>
                </div>
                <Button onClick={handleSubmit} disabled={saved}>{saved ? 'Sintomas Guardados!' : 'Guardar Registo'}</Button>
            </div>
        </DiagnosisWrapper>
    );
};

// --- Diagnosis History ---
interface DiagnosisHistoryProps {
    diagnoses: DiagnosisRecord[];
}
export const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({ diagnoses }) => {
    return (
        <div className="p-4 pt-24 space-y-4">
             <h2 className="text-3xl font-bold text-center mb-6 text-white">Histórico de Diagnósticos</h2>
             {diagnoses.length === 0 ? (
                 <p className="text-center text-slate-400">Ainda não há registos.</p>
             ) : (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {diagnoses.slice().reverse().map(record => (
                        <div key={record.id} className="bg-slate-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-cyan-400">{record.type}</p>
                                <p className="text-xs text-slate-400">{new Date(record.timestamp).toLocaleString('pt-PT')}</p>
                            </div>
                            <pre className="text-sm text-slate-300 bg-slate-900/50 p-2 rounded whitespace-pre-wrap font-sans">
                                {JSON.stringify(record.result, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
             )}
        </div>
    );
};
