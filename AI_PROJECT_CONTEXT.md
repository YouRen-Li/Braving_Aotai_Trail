# AI Project Context: Braving Aotai Trail

> **System Prompt Context**: This document is designed to help AI agents understand the codebase architecture, logic flows, and data structures of "Braving Aotai Trail". Read this before making complex changes.

## 1. Project Identity

- **Type**: Text-Based Survival Roguelike (Visual Novel elements).
- **Engine**: **UniApp** (Cross-platform framework based on Vue 3).
- **Language**: **TypeScript** + **Vue 3 (Composition API)**.
- **State Management**: **Pinia**.
- **Styling**: SCSS (Scoped).

## 2. Core Architecture

### 2.1. The "Brain" (Game Store)

The entire game logic resides in `stores/modules/game.ts`. It acts as a finite state machine.

- **State**:
  - `gameState`: 'idle' | 'playing' | 'ended'.
  - `currentSceneId`: The pointer to the current narrative node.
  - `status`: Core stats (HP, Hunger, Sanity, isNight).
  - `inventory` & `equipment`: Item management.
- **Key Actions**:
  - `handleChoice(choice)`: The main loop. Resolves costs -> Transformation -> Navigation.
  - `applyCost(cost)`: Calculates stat changes based on Weather/Gear modifiers.
  - `checkSurvival()`: Checks HP/Sanity <= 0 logic and triggers `die()`.

### 2.2. The "Memory" (Meta Store)

Situated in `stores/modules/meta.ts`.

- **Purpose**: Persistence across separate runs (Roguelite elements).
- **Storage**: Uses `uni.setStorageSync` with key `braving_aotai_meta_v1`.
- **Data**: `runCount` (Total attempts), `unlockedEndings` (List of unlocked ending IDs).

### 2.3. Data-Driven Content

Content is strictly separated from logic in `utils/game/`.

- `scenes_data.ts`: The narrative graph.
  - `Scene`: Text + Image + Choices.
  - `SceneChoice`: Text + Cost + Action/Target.
- `items_data.ts`: Item definitions (`consumable`, `gear`, `tool`) and effects.
- `roles_data.ts`: Character classes and starting loadouts.

## 3. Key Subsystems Implementation

### 3.1. Sanity System (Mental Health)

- **State**: `status.sanity` (0-100+).
- **Decay logic**:
  - Weather: Fog/Storm/Snow drains extra sanity.
  - Night: Moving at night without light drains significant sanity.
- **Effects**:
  - `< 30`: UI gets `grayscale`, `blur`, and `glitch` CSS classes. `heartbeat` SFX plays.
  - `<= 0`: Triggers `dead_sanity`.

### 3.2. Day/Night & Vision

- **State**: `status.isNight` (boolean).
- **Cycle**:
  - Movement to new node = `isNight = true`.
  - Resting (`action: 'rest'`) = `isNight = false`.
- **Vision Logic**:
  - `hasVision` getter: Returns true if `!isNight` OR `equipment.head == 'gear_headlamp_01'`.
- **UI**: `DayNightOverlay.vue` uses a radial gradient mask. If `hasVision` is false, mask is solid black.

### 3.3. Audio System

- **Manager**: `utils/game/audio_manager.ts` (Singleton).
- **Implementation**: Wraps `uni.createInnerAudioContext`.
- **Structure**:
  - `playBGM(key)`: Loops ambient tracks. Swaps based on Weather (`sunny` vs `wind`).
  - `playSFX(key)`: One-shot sounds (Heartbeat, Scream, Click).

## 4. Development Guidelines

### Adding New Content

1. **New Scene**: Add entry to `scenes_data.ts`. Ensure unique ID.
2. **New Item**: Add to `items_data.ts`.
3. **New Mechanic**:
    - Add state to `game.ts`.
    - Add visualization to `pages/game/index.vue` or components.
    - Update `applyCost` or `handleAction` if it involves stat changes.

### UI Conventions

- **Components**: Keep components "dumb" where possible. Pass props or use Store getters.
- **Visuals**: Use CSS Animations for feedback (e.g. Flash on damage).
- **Assets**: Place in `/static/`. Use absolute paths `@/static/...`.

## 5. File Map

```text
/pages
  /index           # Main Menu (Entry)
  /character       # Character Selection
  /game            # Main Game Loop UI
    /components    # HUD, Inventory, Overlay, etc.
  /journal         # Meta Progression UI
/stores            # Pinia Stores (Game, Meta)
/utils/game        # Data Definitions (Scenes, Items, Roles)
```
