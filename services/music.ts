
export type MusicTrack = 'focus' | 'relax';

const TRACK_FILES: Record<MusicTrack, string> = {
    focus: 'sun-through-glass.mp3',
    relax: 'the-long-exhale.mp3',
};

let audioEl: HTMLAudioElement | null = null;
let currentTrack: MusicTrack | null = null;

const clampVolume = (volume0to100: number) => Math.max(0, Math.min(100, volume0to100)) / 100;

const getEl = (track: MusicTrack): HTMLAudioElement => {
    if (!audioEl) {
        audioEl = new Audio();
        audioEl.loop = true;
    }
    // Swap the source only when the track actually changes, so calling
    // playMusic repeatedly for the same track (e.g. on every volume change)
    // doesn't restart playback from the beginning.
    if (currentTrack !== track) {
        audioEl.src = `${import.meta.env.BASE_URL}${TRACK_FILES[track]}`;
        currentTrack = track;
    }
    return audioEl;
};

export const setMusicVolume = (volume0to100: number) => {
    if (audioEl) audioEl.volume = clampVolume(volume0to100);
};

export const playMusic = (track: MusicTrack, volume0to100: number) => {
    const el = getEl(track);
    el.volume = clampVolume(volume0to100);
    // Autoplay is only allowed following a user gesture — every call site here
    // is reached from a click (Card/Button), so play() should resolve, but
    // browsers can still reject it (e.g. no gesture in the chain); fail silently.
    el.play().catch(() => {});
};

export const stopMusic = () => {
    if (!audioEl) return;
    audioEl.pause();
    audioEl.currentTime = 0;
};
