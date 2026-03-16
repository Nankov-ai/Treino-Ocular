
import React from 'react';

// --- Header ---
interface HeaderProps {
  userId: string | null;
}
export const Header: React.FC<HeaderProps> = ({ userId }) => (
  <header className="bg-slate-800/50 backdrop-blur-sm p-3 text-center fixed top-0 left-0 right-0 z-10">
    <h1 className="text-xl font-bold text-cyan-400">Treino Ocular</h1>
    {userId && <p className="text-xs text-slate-400">ID: {userId}</p>}
  </header>
);

// --- BackButton ---
interface BackButtonProps {
  onClick: () => void;
}
export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-4 left-4 text-cyan-400 hover:text-cyan-300 transition-colors z-20">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
    </svg>
  </button>
);

// --- Card ---
interface CardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon: JSX.Element;
}
export const Card: React.FC<CardProps> = ({ title, description, onClick, icon }) => (
  <div
    onClick={onClick}
    className="bg-slate-800 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer
               transform hover:scale-105 hover:bg-slate-700/80 transition-all duration-300"
  >
    <div className="text-cyan-400 mb-4">{icon}</div>
    <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variant === 'primary'
    ? "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500"
    : "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500";
  
  return <button className={`${baseClasses} ${variantClasses}`} {...props}>{children}</button>;
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h2>
        <div className="text-slate-300 mb-6">{children}</div>
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
};

// --- SettingsInput ---
interface SettingsInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit: string;
}
export const SettingsInput: React.FC<SettingsInputProps> = ({ label, value, onChange, min = 1, max = 60, step = 1, unit }) => (
    <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
        <label className="font-medium text-slate-300">{label}</label>
        <div className="flex items-center gap-3">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                min={min}
                max={max}
                step={step}
                className="w-20 bg-slate-900 text-center font-bold text-lg p-2 rounded-md border-2 border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-slate-400">{unit}</span>
        </div>
    </div>
);
