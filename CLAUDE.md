# CLAUDE.md

> ⚠️ **graphify**: Se `graphify-out/graph.json` não existir, corre `graphify .` antes de explorar o código. Após alterações: `graphify update .`

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3001/Treino-Ocular/ (falls back to next free port if taken)
npm run build    # Production build
npm run preview  # Preview production build
```

No linter or test suite is configured. TypeScript type-checking is handled by Vite at build time (`noEmit: true` in tsconfig — the compiler never emits, only checks).

## Architecture

Single-page React app with no router. Navigation is managed entirely via a `view` enum state in `App.tsx` using a `switch` statement (`renderView()`). There is no URL routing — the back button uses a hardcoded `parentMap` object in `App.tsx`.

### Adding a new screen
1. Add the new value to the `View` enum in `types.ts`
2. Add the parent mapping in `navigateBack()` in `App.tsx`
3. Add the `case` in `renderView()` in `App.tsx`
4. Export the component from either `components/Training.tsx` or `components/Diagnosis.tsx`

### State & persistence
`useUserData` (hooks/useUserData.ts) is the single source of truth for user data. It exposes:
- `settings` — exercise configuration (duration, reps) plus global flags: `soundEnabled`, `reminderEnabled`, `reminderIntervalMinutes`, `musicEnabled`, `musicVolume`, persisted to localStorage per user
- `diagnoses` — array of `DiagnosisRecord`, persisted to localStorage per user
- `customRoutine` / `saveCustomRoutine(views)` — the user's own exercise sequence for "A Minha Rotina", persisted separately
- `routineProgress` / `completeRoutine()` — `{ lastCompletedDate, streakCount }`; `completeRoutine()` is idempotent per calendar day (calling it twice the same day doesn't double the streak) and resets to 1 if a day was missed
- `updateSettings(key, value)` — generic over `keyof UserSettings` (works for both per-exercise settings objects and the top-level booleans/numbers); saves immediately to localStorage
- `addDiagnosis(type, result)` — appends a record and saves

`loadData` results are shallow-merged over `DEFAULT_SETTINGS` (`{ ...DEFAULT_SETTINGS, ...loadData(...) }`) rather than used as-is — otherwise a `settings` object saved before a new field existed (e.g. an older localStorage record missing `pencilPushUp`) would leave that field `undefined` and crash any component that reads it unconditionally. Any newly added top-level `UserSettings` field needs a `DEFAULT_SETTINGS` entry, and that merge is what makes it retroactively safe for existing users.

`services/storage.ts` handles all localStorage access. Each user gets a generated anonymous ID (`user_<timestamp>_<random>`) stored under `ocularAppUserId`. Data keys follow `ocularAppData_<userId>_<key>`.

### 20-20-20 reminder
The reminder timer (`App.tsx`) persists its last-fired timestamp under `ocular_last202020` so it survives page reloads and correctly fires the remaining delay. It's gated behind `settings.reminderEnabled` (toggle on the main menu) and its period comes from `settings.reminderIntervalMinutes` (20/30/45/60, default 20 — the "20" in "20-20-20" is a real recommendation, so don't silently change the default). When `ocular_last202020` has no stored value yet (first-ever visit), the effect seeds it with `Date.now()` instead of firing immediately — treating a missing key as "infinitely overdue" was a real bug that made the reminder pop up the instant the app loaded.

The scheduling effect also waits for `userId` to be non-null before doing anything (`if (!userId || !settings.reminderEnabled) return;`). `useUserData`'s `settings` starts out as `DEFAULT_SETTINGS` (which has `reminderEnabled: true`) for the one render before its effect reads the real value from localStorage; without the `userId` guard, that transient default could schedule — and, if `ocular_last202020` was already overdue, immediately fire — the reminder even for a user who has it turned off. `userId` and the real `settings` are set in the same effect call, so React batches them into the same render, making `userId` truthy a reliable signal that `settings` is no longer the default.

### Component organisation

| File | Contents |
|---|---|
| `components/common.tsx` | `Header`, `BackButton`, `Card` (supports optional `subtitle`), `Button`, `Modal`, `SettingsInput`, `SoundToggle` |
| `components/Training.tsx` | All training exercises + `TrainingMenu` organised in 3 categories + `RoutineAdvanceContext` |
| `components/Diagnosis.tsx` | All diagnostic tests + `DiagnosisMenu` |
| `components/Routine.tsx` | `EXERCISE_CATALOG`, `PRESET_ROUTINES`, `RoutineMenu`, `RoutineComplete` |
| `types.ts` | `View` enum, `DiagnosisType` enum, `UserSettings`, `DiagnosisRecord`, `Routine`, `RoutineProgress` |
| `services/audio.ts` | Web Audio API tone generator (`playNearTone`, `playFarTone`, `playCueTone`, `playCloseTone`, `playOpenTone`, `playEndTone`) — no audio assets, synthesized beeps |
| `services/music.ts` | Background music playback (`playMusic(track, volume)`, `stopMusic`, `setMusicVolume`) — a single `HTMLAudioElement` that swaps `.src` between real MP3 files in `public/` |

`Header` is `position: fixed`, so `BackButton` must be too (not `absolute`) — otherwise the back arrow scrolls away with page content while the header title stays pinned, which is exactly the kind of mismatch to watch for whenever adding fixed-position chrome.

### Training categories (TrainingMenu)
- **Foco & Convergência**: NearFarFocus, PencilPushUp, NearFocus, AccommodativeFacility
- **Movimento & Rastreamento**: Saccades, FigureEight, EyeRolls, SmoothPursuit
- **Relaxamento**: BlinkingInfo (guided timer), Blink3s (hold-blink), PalmingInfo (2-min countdown), LookFar (5-min rest)

### Audio cues (services/audio.ts)
Exercises where the user isn't looking at the screen at the moment of a phase change (so a visual cue alone is useless) play a short synthesized tone via the Web Audio API instead of relying on a sound file. Pairs use **distinct** tones so the next action is identifiable by ear alone (matters most with eyes closed):
- **NearFarFocus** / **AccommodativeFacility** — high tone (880Hz) on "near", low tone (440Hz) on "far"
- **BlinkingInfo** / **Blink3s** — low tone (500Hz) on "feche", high tone (950Hz) on "abra"
- **PalmingInfo** — single mid tone (660Hz) at the halfway point, two-note ascending "ta-da" (`playEndTone`) at the end — deliberately different from the halfway beep so the two milestones aren't confused

Gated behind the `settings.soundEnabled` boolean (`SoundToggle` component), default `true`. Peak gain is `0.28` (tuned down from an initial `0.45` that users found too loud, up from `0.15` that was barely audible). `playTone()` guards against the `AudioContext` starting in a `suspended` state — the first calls used to be silently dropped because `resume()` is async and was fired without awaiting; scheduling now waits for `resume()` to settle before starting the oscillator.

`AccommodativeFacility` also randomizes the near-phase letter size each cycle (`text-xl` to `text-7xl`) so recognition requires real accommodative effort instead of always rendering a giant, effortlessly-legible glyph.

`PencilPushUp` has two modes: a default **guided** mode (configurable duration/reps, like the other exercises, ending in `CompletionScreen`) and a **free** mode (the original unlimited manual/auto oscillation, no rep counting, reachable via a link on the settings screen) — the free mode has no natural end, so it's excluded from `EXERCISE_CATALOG`/routines.

Rep-counting exercises with a near/far (or similar) pair use a **half-cycle counter** (`halfCyclesLeft`, displayed as `Math.ceil(halfCyclesLeft / 2)`) rather than decrementing once per pair — this is what `Saccades` always did, and `NearFarFocus`/`NearFocus` were migrated to match after a background-tab timer throttling bug let a burst of catch-up ticks decrement a plain counter past 0 without the completion effect ever seeing exactly `0` (fixed generally with `Math.max(0, ...)` clamps, but the half-cycle pattern is the more robust shape for anything counting phase pairs).

### Background music (services/music.ts)
Two AI-generated ambient tracks live in `public/` (`sun-through-glass.mp3` for focus, `the-long-exhale.mp3` for relaxation) — authored once with an external tool (not called at runtime; the app has no AI/API dependency), 30s each, looped. `App.tsx` picks the track from `view` via two lists, `FOCUS_MUSIC_VIEWS` and `RELAX_MUSIC_VIEWS`, and derives a single `desiredTrack: 'focus' | 'relax' | null`. Playback is driven by **that derived value, not `view` directly** — moving between two exercises of the same category (e.g. advancing through a routine) keeps the same string, so the effect doesn't re-run and the track isn't restarted from the beginning. Volume changes are a **separate effect** (`setMusicVolume`, no stop/restart) so dragging the slider doesn't also restart playback. Gated behind `settings.musicEnabled` (`MusicToggle` component, common.tsx), default `false`.

`FOCUS_MUSIC_VIEWS` covers both **Foco & Convergência** and **Movimento & Rastreamento** — both categories demand active concentration, unlike **Relaxamento**, so they share the same "focus" track rather than the movement category playing nothing.

### Training category order (TrainingMenu)
Deliberately **Foco & Convergência → Movimento & Rastreamento → Relaxamento**, not alphabetical or arbitrary — it mirrors a workout structure where relaxation is the cool-down at the end, not a break in the middle of active exercises. Keep Relaxamento last if adding or reordering categories.

### MainMenu fluid layout (App.tsx)
The main menu went through many iterations chasing "fits any screen size, no dead space, no scroll" — the failure modes worth knowing before touching it again:
- **Tailwind width breakpoints (`sm:`/`lg:`) don't solve a height problem.** A tall-but-narrow window never triggers them. Anything meant to respond to available vertical space needs a height-based query — this project uses arbitrary Tailwind variants like `[@media(min-height:900px)]:gap-10`, or (better, see below) `clamp()` with `vh` units.
- **`justify-center` on a `min-h-screen` column** centers content as one block — fine for "no cut-off content", but on a tall window it piles ALL the leftover space into two symmetric margins (still reads as "empty" to a user, even if technically balanced).
- **`justify-between` on a few large sibling *groups*** (e.g. "all 3 cards" as one group, "reminder" as another) fixes the top/bottom margins but looks *worse* — the few big gaps between groups end up uneven and disconnected from the tight spacing used *inside* each group. The fix was to flatten the structure: every individual row (each `MenuRow`, the reminder block, the music block) is a **direct sibling** in one flex column with `justify-evenly`, so the leftover space divides into many equal gaps instead of a few large, mismatched ones.
- **The real fix for "adapts to any screen size" was fluid sizing, not just spacing.** `MenuRow` padding, icon size, and font sizes use `clamp(min, Nvh, max)` (e.g. `text-[clamp(0.95rem,2.4vh,1.5rem)]`), and the outer container is `h-[calc(100vh-5rem)]` (exact fit below the fixed header) rather than `min-h-*`. This scales every element continuously with real viewport height — small on a short window, larger on a tall one — so content fits without scrolling at any size instead of just being fixed-size content padded out with (or overflowing) blank space.
- **Don't stack `pt-24` (or similar) on top of `<main className="pt-20">`.** `App.tsx`'s `<main>` already clears the fixed header; a page adding its own large top padding on top of that doubles the gap. `TrainingMenu`, `RoutineMenu`, `DiagnosisMenu`, `DiagnosisHistory`, `DepthPerceptionTest`, and `AutostereogramTest` were all fixed to `pt-6`. The exercise `SettingsScreen` (the pre-start screen shared by every training exercise) still uses `pt-24` as of this writing — not yet revisited, so don't assume the fix is universal if you're auditing spacing elsewhere.

### Routines (components/Routine.tsx)
"A Minha Rotina" (`View.RoutineMenu`) runs a sequence of exercises back-to-back: 3 presets (`PRESET_ROUTINES`) plus a custom routine the user builds from `EXERCISE_CATALOG` (checkboxes, persisted via `saveCustomRoutine`). Only exercises with a real completion state are catalog-eligible — `PencilPushUp`'s free mode and anything with no finish condition can't participate.

`App.tsx` holds routine progress as local state `{ queue: View[]; index: number } | null` (not persisted — a routine is a single sitting) and provides it through `RoutineAdvanceContext` as `{ next: () => void; nextLabel: string | null }`. `CompletionScreen` (and `AccommodativeFacility`'s custom finished screen, which doesn't use `CompletionScreen`) reads this context: when set, it shows "Próximo: <nome>" and a "Começar Treino" / "Concluir Rotina" button instead of nothing. **Advancing is always a manual tap, never a silent timer** — an earlier version auto-advanced via a `setTimeout` in `CompletionScreen`, which raced each exercise's own internal "reset after 2s" timer and occasionally looped back to that exercise's start screen, looking like a repeat. The fix was two-sided: remove the per-exercise internal auto-reset (they now just stay on `CompletionScreen` until navigated away, like every other exercise already did) and replace the silent timer with an explicit button tap.

The header back button behaves differently inside a routine: it does **not** skip to the next exercise (that was tried and rejected — a back arrow that skips forward has no discoverable logic). It abandons the routine entirely and returns to `RoutineMenu`; see the `if (routine)` branch at the top of `navigateBack()` in `App.tsx`.

`completeRoutine()` only fires once the routine's `advanceRoutine()` reaches past the last exercise — not on manual abandonment via the back button.

### Diagnosis screens
- VisualAcuityTest, AmslerGrid, SymptomQuestionnaire — save results via `addDiagnosis`
- DepthPerceptionTest — CSS-simulated depth perception grid; saves to `DiagnosisType.DepthPerception`
- AutostereogramTest — SIRDS canvas generated at runtime; no result saved (exercise only)
- DiagnosisHistory — reads `diagnoses` array and renders via `formatResult()` (add a branch there for any new `DiagnosisType`)

### Deployment
Deployed to GitHub Pages under the `/Treino-Ocular/` subpath. Vite `base` is set to `/Treino-Ocular/`. All asset paths (e.g. the Nodeflow logo) must use `import.meta.env.BASE_URL` as prefix.

### SettingsInput (components/common.tsx)
Keeps its own local `text` string state (synced from `value` via `useEffect`) instead of being a plain controlled `<input value={value}>`. A plain controlled number input snaps back to the last valid value on every keystroke, which makes it impossible to clear the field before typing a new number — `text` is allowed to sit empty mid-edit, and `onBlur` reverts it only if what's left isn't a valid number. `onFocus` also selects all text so clicking in and typing replaces the value instead of appending to it.

### Tailwind
Loaded via CDN in `index.html` — there is no `tailwind.config.js`. Custom utility classes (e.g. `grid-cols-20`) do not exist; use inline `style` props for non-standard values.

### Notifications
The app requests `Notification` permission on first load and fires a native browser notification alongside the 20-20-20 modal. Both are triggered by the same `setTimeout` chain in `App.tsx`, and both are skipped when `settings.reminderEnabled` is `false`.

## graphify — Knowledge Graph

Este projeto tem um knowledge graph em `graphify-out/`.

**Instalação (uma vez):** `pip install graphifyy`
**Gerar grafo:** `graphify .` (correr na raiz do projeto)
**Atualizar após alterações:** `graphify update .`

Regras de uso:
- Para perguntas sobre o codebase, correr primeiro `graphify query "<pergunta>"` se `graphify-out/graph.json` existir
- Para relações entre ficheiros/módulos: `graphify path "<A>" "<B>"`
- Para explicar um conceito: `graphify explain "<conceito>"`
- Ler `graphify-out/GRAPH_REPORT.md` apenas para revisão de arquitectura geral
## /last30days — Pesquisa de Mercado e Insights

Usar `/last30days` antes de desenvolver novas features ou tomar decisões de produto.

**Apps de treino e saúde ocular:**
```
/last30days eye training app user feedback reddit
/last30days vision therapy app complaints ux
/last30days eye exercise app engagement retention problems
/last30days visual acuity test app accuracy feedback
```

**Educação e gamificação:**
```
/last30days educational app gamification user engagement reddit
/last30days health app quiz format feedback complaints
/last30days medical training app UX best practices reddit
/last30days React progressive web app offline feedback
```

**Mercado:**
```
/last30days eye health app market 2025 reddit
/last30days vision improvement app comparison reviews
/last30days optometry digital tools feedback
```
