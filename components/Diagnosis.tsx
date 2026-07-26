
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { SetView, DiagnosisRecord } from '../types';
import { View, DiagnosisType } from '../types';
import { Button, BackButton, Card } from './common';

// --- Icons ---
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z" /></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 4v16m4-16v16M4 10h16M4 14h16" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const EyeDepthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21l5-5 5 5M7 3l5 5 5-5" /><circle cx="12" cy="12" r="3" strokeWidth={1.5}/></svg>;
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" /></svg>;

// --- Diagnosis Menu ---
interface DiagnosisMenuProps { setView: SetView; }
export const DiagnosisMenu: React.FC<DiagnosisMenuProps> = ({ setView }) => (
    <div className="p-4 pt-6 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Diagnóstico da Visão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Acuidade Visual" description="Teste simplificado para verificar a sua acuidade." onClick={() => setView(View.VisualAcuityTest)} icon={<ChartIcon />} />
            <Card title="Grelha de Amsler" description="Verifique a sua visão central para distorções." onClick={() => setView(View.AmslerGrid)} icon={<GridIcon />} />
            <Card title="Perceção de Profundidade" description="Identifique os círculos que parecem estar à frente." onClick={() => setView(View.DepthPerception)} icon={<EyeDepthIcon />} />
            <Card title="Autostereograma" description="Tente ver a figura 3D escondida no padrão de pontos." onClick={() => setView(View.Autostereogram)} icon={<MagicIcon />} />
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
            <div className="bg-white p-2 aspect-square w-full max-w-sm mx-auto relative mb-6"
                 style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gridTemplateRows: 'repeat(20, 1fr)' }}>
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
const formatResult = (type: DiagnosisType, result: any): React.ReactNode => {
    if (type === DiagnosisType.Acuity) {
        return <p>Menor tamanho legível: <span className="font-bold text-white">{result.smallestVisibleSize}px</span></p>;
    }
    if (type === DiagnosisType.Amsler) {
        const ok = result.status === 'ok';
        return (
            <p className={ok ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                {ok ? '✓ Sem distorções' : '⚠ Distorções detetadas — consulte um oftalmologista'}
            </p>
        );
    }
    if (type === DiagnosisType.DepthPerception) {
        return <p>Acertos: <span className="font-bold text-white">{result.correct}/{result.total}</span> — Falsos positivos: <span className="font-bold text-white">{result.falsePositives}</span></p>;
    }
    if (type === DiagnosisType.Symptoms) {
        return (
            <div className="space-y-1">
                {result.symptoms.length > 0
                    ? <p>Sintomas: <span className="font-bold text-white">{result.symptoms.join(', ')}</span></p>
                    : <p className="text-green-400">Sem sintomas assinalados</p>
                }
                {result.notes && <p className="text-slate-400 italic">"{result.notes}"</p>}
            </div>
        );
    }
    return null;
};

interface DiagnosisHistoryProps {
    diagnoses: DiagnosisRecord[];
}
export const DiagnosisHistory: React.FC<DiagnosisHistoryProps> = ({ diagnoses }) => {
    return (
        <div className="p-4 pt-6 space-y-4">
             <h2 className="text-3xl font-bold text-center mb-6 text-white">Histórico de Diagnósticos</h2>
             {diagnoses.length === 0 ? (
                 <p className="text-center text-slate-400">Ainda não há registos.</p>
             ) : (
                <div className="space-y-3 max-w-2xl mx-auto">
                    {diagnoses.slice().reverse().map(record => (
                        <div key={record.id} className="bg-slate-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-cyan-400">{record.type}</p>
                                <p className="text-sm text-slate-400">{new Date(record.timestamp).toLocaleString('pt-PT')}</p>
                            </div>
                            <div className="text-sm text-slate-300">
                                {formatResult(record.type, record.result)}
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
    );
};

// --- Depth Perception Test (CSS visual cues version) ---
const GRID_COLS = 5;
const GRID_ROWS = 4;
const TOTAL = GRID_COLS * GRID_ROWS;
const ELEVATED_COUNT = 6;

interface DepthPerceptionProps {
    addDiagnosis: (type: DiagnosisType, result: any) => void;
}
export const DepthPerceptionTest: React.FC<DepthPerceptionProps> = ({ addDiagnosis }) => {
    const elevated = useMemo<Set<number>>(() => {
        const set = new Set<number>();
        while (set.size < ELEVATED_COUNT) set.add(Math.floor(Math.random() * TOTAL));
        return set;
    }, []);

    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [submitted, setSubmitted] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggle = (i: number) => {
        if (submitted) return;
        setSelected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
    };

    const correct = submitted ? [...elevated].filter(i => selected.has(i)).length : 0;
    const falsePos = submitted ? [...selected].filter(i => !elevated.has(i)).length : 0;

    const handleSave = () => {
        addDiagnosis(DiagnosisType.DepthPerception, { correct, falsePositives: falsePos, total: ELEVATED_COUNT });
        setSaved(true);
    };

    return (
        <div className="p-4 pt-6 max-w-lg mx-auto space-y-5">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Perceção de Profundidade</h2>

            {/* Limitation notice */}
            <div className="bg-yellow-900/40 border border-yellow-600/50 rounded-lg p-3 text-xs text-yellow-300 space-y-1">
                <p className="font-bold">⚠️ Limitação desta versão</p>
                <p>Este teste usa pistas visuais (sombra, escala, brilho) para simular profundidade — <strong>não é um teste de estereopsis real</strong>, que requer óculos polarizados. Serve apenas para treinar a atenção visual e a deteção de contraste de profundidade percebida.</p>
            </div>

            {!submitted ? (
                <>
                    <p className="text-slate-300 text-center">Clique nos círculos que parecem estar <strong>à frente</strong> dos outros. Observe com atenção — as diferenças são subtis.</p>
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
                        {Array.from({ length: TOTAL }).map((_, i) => (
                            <div key={i} onClick={() => toggle(i)}
                                className={`aspect-square rounded-full cursor-pointer transition-all duration-200 mx-auto w-full
                                    ${elevated.has(i)
                                        ? 'bg-slate-300 shadow-[0_6px_18px_rgba(255,255,255,0.25)] scale-110'
                                        : 'bg-slate-600 shadow-none scale-100'}
                                    ${selected.has(i) ? 'ring-4 ring-cyan-400' : ''}
                                `}
                            />
                        ))}
                    </div>
                    <Button onClick={() => setSubmitted(true)} disabled={selected.size === 0}>Ver Resultado</Button>
                </>
            ) : (
                <div className="space-y-4 text-center">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
                        {Array.from({ length: TOTAL }).map((_, i) => {
                            const isElevated = elevated.has(i);
                            const isSelected = selected.has(i);
                            const hit = isElevated && isSelected;
                            const miss = isElevated && !isSelected;
                            const fp = !isElevated && isSelected;
                            return (
                                <div key={i} className={`aspect-square rounded-full mx-auto w-full transition-all
                                    ${hit ? 'bg-green-400 scale-110 shadow-[0_6px_18px_rgba(74,222,128,0.4)]' :
                                      miss ? 'bg-yellow-400 scale-110' :
                                      fp  ? 'bg-red-500 scale-100' :
                                             'bg-slate-600'}`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-center gap-4 text-sm text-slate-400">
                        <span><span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"/>Acertou</span>
                        <span><span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"/>Não selecionou</span>
                        <span><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"/>Falso positivo</span>
                    </div>
                    <p className={`text-3xl font-bold ${correct >= 5 ? 'text-green-400' : correct >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {correct} / {ELEVATED_COUNT} corretos
                    </p>
                    {falsePos > 0 && <p className="text-slate-400 text-sm">{falsePos} falso{falsePos > 1 ? 's' : ''} positivo{falsePos > 1 ? 's' : ''}</p>}
                    <Button onClick={handleSave} disabled={saved}>{saved ? 'Guardado!' : 'Guardar Resultado'}</Button>
                </div>
            )}
        </div>
    );
};

// --- Autostereogram (SIRDS) ---
const generateSIRDS = (canvas: HTMLCanvasElement) => {
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const E = Math.round(W / 7); // pattern strip width

    // Depth map: circular dome in center + small top circle
    const depthAt = (x: number, y: number): number => {
        const cx = W / 2, cy = H / 2;
        const r1 = Math.min(W, H) * 0.28;
        const d1 = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (d1 < r1) return Math.round(5 * Math.max(0, 1 - d1 / r1));

        // smaller circle above
        const cx2 = W / 2, cy2 = H * 0.22;
        const r2 = Math.min(W, H) * 0.1;
        const d2 = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);
        if (d2 < r2) return Math.round(4 * Math.max(0, 1 - d2 / r2));

        return 0;
    };

    const imgData = ctx.createImageData(W, H);
    const px = imgData.data;

    for (let y = 0; y < H; y++) {
        // random initial strip (black or white dots)
        const strip: number[] = [];
        for (let x = 0; x < E; x++) strip[x] = Math.random() > 0.5 ? 255 : 0;

        for (let x = E; x < W; x++) {
            const depth = depthAt(x, y);
            const shift = Math.round(depth * E / 25);
            strip[x] = strip[x - E + shift] ?? (Math.random() > 0.5 ? 255 : 0);
        }

        for (let x = 0; x < W; x++) {
            const idx = (y * W + x) * 4;
            const v = strip[x];
            px[idx] = v; px[idx + 1] = v; px[idx + 2] = v; px[idx + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
};

export const AutostereogramTest: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [generated, setGenerated] = useState(false);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current || !generated) return;
        const W = containerRef.current.clientWidth;
        const H = Math.round(W * 0.65); // 65% aspect ratio — tall enough for the pattern to work
        canvasRef.current.width = W;
        canvasRef.current.height = H;
        generateSIRDS(canvasRef.current);
    }, [generated]);

    const regenerate = () => { setGenerated(false); setTimeout(() => setGenerated(true), 50); };

    return (
        <div className="p-4 pt-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Autostereograma</h2>

            {/* Limitation notice */}
            <div className="bg-yellow-900/40 border border-yellow-600/50 rounded-lg p-3 text-xs text-yellow-300 space-y-1">
                <p className="font-bold">⚠️ Limitações desta versão</p>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Não é o teste clínico Randot</strong> — esse requer óculos polarizados e imagens calibradas.</li>
                    <li>Requer técnica de visão especial (olhar "para além" do ecrã) que nem toda a gente consegue.</li>
                    <li>O que vê (ou não vê) não é diagnóstico — é um exercício de fusão binocular.</li>
                </ul>
            </div>

            {/* Instructions */}
            <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300 space-y-2">
                <p className="font-bold text-white">Como tentar ver a figura 3D:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Aproxime o ecrã ao nariz.</li>
                    <li>Relaxe os olhos como se estivesse a olhar "para além" do ecrã, para um ponto distante.</li>
                    <li>Afaste lentamente o ecrã mantendo esse olhar descontraído.</li>
                    <li>Se funcionar, deverá ver uma forma a flutuar acima do padrão de pontos.</li>
                </ol>
                <p className="text-slate-400 text-sm mt-2">Dica: pode demorar alguns minutos. Não force — relaxe os olhos.</p>
            </div>

            {/* Canvas container — full width */}
            <div ref={containerRef} className="w-full">
                {!generated ? (
                    <Button onClick={() => setGenerated(true)}>Gerar Autostereograma</Button>
                ) : (
                    <div className="space-y-3">
                        <canvas
                            ref={canvasRef}
                            className="w-full rounded-lg border border-slate-700 block"
                        />
                        <Button onClick={regenerate} variant="secondary">Gerar novo padrão</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
