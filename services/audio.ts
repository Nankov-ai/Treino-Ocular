
let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
    try {
        if (!audioCtx) {
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            audioCtx = new Ctx();
        }
        return audioCtx;
    } catch {
        return null;
    }
};

const scheduleTone = (ctx: AudioContext, frequency: number, durationMs: number) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    // 0.15 was barely audible, 0.45 was too loud — 0.28 is the middle ground.
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + durationMs / 1000);
};

export const playTone = (frequency: number, durationMs = 150) => {
    const ctx = getCtx();
    if (!ctx) return;
    // The AudioContext starts "suspended" until resumed; scheduling before it's
    // actually running silently drops the sound, so wait for resume() to settle first.
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => scheduleTone(ctx, frequency, durationMs));
    } else {
        scheduleTone(ctx, frequency, durationMs);
    }
};

// Tom agudo — usado para sinalizar "foco ao perto"
export const playNearTone = () => playTone(880);
// Tom grave — usado para sinalizar "foco ao longe"
export const playFarTone = () => playTone(440);
// Tom neutro curto — usado para transições genéricas (ex: pestanejar, meio/fim de temporizador)
export const playCueTone = () => playTone(660, 200);
// Tons distintos para "fechar" (grave) vs "abrir" (agudo) nos exercícios de piscar,
// para se distinguir a ação seguinte sem abrir os olhos.
export const playCloseTone = () => playTone(500, 200);
export const playOpenTone = () => playTone(950, 200);
// Pequeno "ta-da" de duas notas — usado para marcar o fim de algo (distinto do
// tom único de playCueTone, usado para marcos intermédios como o meio do Palming).
export const playEndTone = () => {
    playTone(660, 150);
    setTimeout(() => playTone(880, 220), 160);
};
