
import React, { useState, useEffect } from 'react';
import { View, SetView } from './types';
import { useUserData } from './hooks/useUserData';
import { Header, BackButton, Modal } from './components/common';

import { 
    TrainingMenu, 
    NearFarFocus, 
    PencilPushUp, 
    NearFocus, 
    Saccades, 
    BlinkingInfo, 
    PalmingInfo 
} from './components/Training';

import { 
    DiagnosisMenu, 
    VisualAcuityTest, 
    AmslerGrid, 
    SymptomQuestionnaire, 
    DiagnosisHistory 
} from './components/Diagnosis';

import { Card } from './components/common';

// --- Main Menu ---
const MainMenu: React.FC<{ setView: SetView }> = ({ setView }) => {
    const TrainingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
    const DiagnosisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 space-y-8">
            <Card title="Treino Diário" description="Exercícios para fortalecer e relaxar os seus olhos." onClick={() => setView(View.TrainingMenu)} icon={<TrainingIcon />} />
            <Card title="Diagnóstico" description="Autoavaliação para monitorizar a sua visão." onClick={() => setView(View.DiagnosisMenu)} icon={<DiagnosisIcon />} />
        </div>
    );
};

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.MainMenu);
    const { userId, settings, diagnoses, updateSettings, addDiagnosis } = useUserData();
    const [is202020ModalOpen, setIs202020ModalOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIs202020ModalOpen(true);
        }, 20 * 60 * 1000); // 20 minutes

        return () => clearInterval(timer);
    }, []);

    const navigateBack = () => {
        const parentMap: { [key in View]?: View } = {
            [View.TrainingMenu]: View.MainMenu,
            [View.DiagnosisMenu]: View.MainMenu,
            [View.NearFarFocus]: View.TrainingMenu,
            [View.PencilPushUp]: View.TrainingMenu,
            [View.NearFocus]: View.TrainingMenu,
            [View.Saccades]: View.TrainingMenu,
            [View.BlinkingInfo]: View.TrainingMenu,
            [View.PalmingInfo]: View.TrainingMenu,
            [View.VisualAcuityTest]: View.DiagnosisMenu,
            [View.AmslerGrid]: View.DiagnosisMenu,
            [View.SymptomQuestionnaire]: View.DiagnosisMenu,
            [View.DiagnosisHistory]: View.DiagnosisMenu,
        };
        setView(parentMap[view] ?? View.MainMenu);
    };

    const renderView = () => {
        switch (view) {
            case View.MainMenu: return <MainMenu setView={setView} />;
            // Training
            case View.TrainingMenu: return <TrainingMenu setView={setView} />;
            case View.NearFarFocus: return <NearFarFocus settings={settings.nearFarFocus} updateSettings={updateSettings} setView={setView}/>;
            case View.PencilPushUp: return <PencilPushUp />;
            case View.NearFocus: return <NearFocus settings={settings.nearFocus} updateSettings={updateSettings} setView={setView}/>;
            case View.Saccades: return <Saccades settings={settings.saccades} updateSettings={updateSettings} setView={setView}/>;
            case View.BlinkingInfo: return <BlinkingInfo />;
            case View.PalmingInfo: return <PalmingInfo />;
            // Diagnosis
            case View.DiagnosisMenu: return <DiagnosisMenu setView={setView} />;
            case View.VisualAcuityTest: return <VisualAcuityTest addDiagnosis={addDiagnosis} />;
            case View.AmslerGrid: return <AmslerGrid addDiagnosis={addDiagnosis} />;
            case View.SymptomQuestionnaire: return <SymptomQuestionnaire addDiagnosis={addDiagnosis} />;
            case View.DiagnosisHistory: return <DiagnosisHistory diagnoses={diagnoses} />;
            default: return <MainMenu setView={setView} />;
        }
    };

    return (
        <div className="antialiased">
            <Header userId={userId} />
            <main className="pt-20">
                {view !== View.MainMenu && view !== View.PencilPushUp && <BackButton onClick={navigateBack} />}
                {view === View.PencilPushUp && <BackButton onClick={navigateBack} />}
                
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
