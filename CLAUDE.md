# CLAUDE.md

> ⚠️ **graphify**: Se `graphify-out/graph.json` não existir, corre `graphify .` antes de explorar o código. Após alterações: `graphify update .`

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3001/Treino-Ocular/
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
- `settings` — exercise configuration (duration, reps) plus the global `soundEnabled` flag, persisted to localStorage per user
- `diagnoses` — array of `DiagnosisRecord`, persisted to localStorage per user
- `updateSettings(key, value)` — generic over `keyof UserSettings` (works for both per-exercise settings objects and the top-level `soundEnabled` boolean); saves immediately to localStorage
- `addDiagnosis(type, result)` — appends a record and saves

`services/storage.ts` handles all localStorage access. Each user gets a generated anonymous ID (`user_<timestamp>_<random>`) stored under `ocularAppUserId`. Data keys follow `ocularAppData_<userId>_<key>`.

The 20-20-20 rule timer persists its last-fired timestamp under `ocular_last202020` so it survives page reloads and correctly fires the remaining delay.

### Component organisation

| File | Contents |
|---|---|
| `components/common.tsx` | `Header`, `BackButton`, `Card` (supports optional `subtitle`), `Button`, `Modal`, `SettingsInput`, `SoundToggle` |
| `components/Training.tsx` | All training exercises + `TrainingMenu` organised in 3 categories |
| `components/Diagnosis.tsx` | All diagnostic tests + `DiagnosisMenu` |
| `types.ts` | `View` enum, `DiagnosisType` enum, `UserSettings`, `DiagnosisRecord` |
| `services/audio.ts` | Web Audio API tone generator (`playNearTone`, `playFarTone`, `playCueTone`) — no audio assets, synthesized beeps |

### Training categories (TrainingMenu)
- **Foco & Convergência**: NearFarFocus, PencilPushUp, NearFocus, AccommodativeFacility
- **Movimento & Rastreamento**: Saccades, FigureEight, EyeRolls, SmoothPursuit
- **Relaxamento**: BlinkingInfo (guided timer), PalmingInfo (2-min countdown), LookFar (5-min rest)

### Audio cues (services/audio.ts)
Exercises where the user isn't looking at the screen at the moment of a phase change (so a visual cue alone is useless) play a short synthesized tone via the Web Audio API instead of relying on a sound file:
- **NearFarFocus** / **AccommodativeFacility** — high tone (880Hz) on "near", low tone (440Hz) on "far"
- **BlinkingInfo** — short neutral tone (660Hz) on every step change, useful with eyes closed/half-open
- **PalmingInfo** — same neutral tone at the halfway point and at the end of the 2-minute rest

Gated behind the `settings.soundEnabled` boolean (`SoundToggle` component), default `true`. `playTone()` guards against the `AudioContext` starting in a `suspended` state — the first calls used to be silently dropped because `resume()` is async and was fired without awaiting; scheduling now waits for `resume()` to settle before starting the oscillator.

`AccommodativeFacility` also randomizes the near-phase letter size each cycle (`text-xl` to `text-7xl`) so recognition requires real accommodative effort instead of always rendering a giant, effortlessly-legible glyph.

### Diagnosis screens
- VisualAcuityTest, AmslerGrid, SymptomQuestionnaire — save results via `addDiagnosis`
- DepthPerceptionTest — CSS-simulated depth perception grid; saves to `DiagnosisType.DepthPerception`
- AutostereogramTest — SIRDS canvas generated at runtime; no result saved (exercise only)
- DiagnosisHistory — reads `diagnoses` array and renders via `formatResult()` (add a branch there for any new `DiagnosisType`)

### Deployment
Deployed to GitHub Pages under the `/Treino-Ocular/` subpath. Vite `base` is set to `/Treino-Ocular/`. All asset paths (e.g. the Nodeflow logo) must use `import.meta.env.BASE_URL` as prefix.

### Tailwind
Loaded via CDN in `index.html` — there is no `tailwind.config.js`. Custom utility classes (e.g. `grid-cols-20`) do not exist; use inline `style` props for non-standard values.

### Notifications
The app requests `Notification` permission on first load and fires a native browser notification alongside the 20-20-20 modal. Both are triggered by the same `setTimeout` chain in `App.tsx`.

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
