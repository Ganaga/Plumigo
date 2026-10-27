# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Plumigo is a French educational PWA for teaching children (ages 6–12) spelling and grammar through gamification. It deploys as a static site to GitHub Pages and wraps as an Android TWA (Trusted Web Activity) via Bubblewrap.

## Commands

```bash
npm run dev        # Start Vite dev server with hot reload
npm run build      # TypeScript type-check + Vite build → dist/
npm run preview    # Preview production build locally
npm run build:apk  # Generate Android APK via Bubblewrap (requires Android SDK)
```

**Single test**: There is no test suite. Type checking is the primary correctness check: `npx tsc --noEmit`.

## Architecture

**Stack**: Vanilla TypeScript + Lit web components, Vite bundler, no backend.

### Routing & Entry

`src/main.ts` registers all routes and calls `initRouter()`. `src/router.ts` implements hash-based SPA routing (`#/writing`, `#/dictation`, etc.). Route handlers render into `<div id="app">` and return optional cleanup functions (for event listener teardown).

### State Management

State is persisted to `localStorage` under key `plumigo_state_<profileId>`. Multiple profiles are supported; the active profile ID is stored in `plumigo_active`. All mutations go through `updateState(updater)` in `src/shared/storage.ts`, which loads current state, applies the updater, merges with defaults (for schema evolution), and saves back.

### Feature Modules (`src/modules/`)

| Module | Description |
|--------|-------------|
| `dashboard/` | Home screen: daily progress, navigation to activities |
| `writing/` | Creative story editor with real-time LanguageTool grammar checking |
| `dictation/` | Listen-and-type sentences across 5 French school levels (CP→CM2) |
| `hangman/` | Word-guessing game |
| `quiz/` | Multiple-choice spelling/grammar questions |
| `profile/` | Achievements, stats, parent zone (protected by mental-math gate) |

### Shared Utilities (`src/shared/`)

- `gamification.ts` — points, 7 XP levels, 25+ achievements, daily streaks
- `tts.ts` — Web Speech API wrapper for text-to-speech
- `grammar-checker.ts` — debounced (800ms) LanguageTool API calls; SPELLING errors shown in orange, GRAMMAR errors in purple
- `storage.ts` — localStorage abstraction and profile management
- `mascot.ts` — 5 mascots × 3 emotional states for feedback reactions
- `pomodoro.ts` — session timer for writing module

### Grammar Checker

Calls the public LanguageTool API from the browser. Results are never cached (enforced in `public/sw.js`). The service worker uses network-first for JS/CSS and cache-first for static assets.

### Android TWA

The `app/` directory contains the Bubblewrap-generated Android project pointing to `https://ganaga.github.io/Plumigo/`. Key config is in `app/build.gradle` (minSdk 21, targetSdk 35). The signing keystore is `android.keystore` (not committed). Asset links verification requires the SHA-256 fingerprint to match the deployed `/.well-known/assetlinks.json`.

### Deployment

Push to `master` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and deploys `dist/` to GitHub Pages.
