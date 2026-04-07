# Scapegoat

A Yu-Gi-Oh! companion desktop app for tracking combos, negates, and life points during duels.

Built with Electron, React, TypeScript, and a local SQLite database — everything runs offline.

---

## Features

### Combos

Save and reference your deck's combos step by step. Each combo has a visual sequence of card images with connectors between steps (e.g. "searches for", "special summons", "sends to GY"). You can add optional notes per step (e.g. "don't activate if opponent has Ash"), reorder steps, and view a summary of all unique combo pieces at the bottom. Combos are searchable by name.

### Rival Tracker

Track what your opponent is holding during a duel. Log cards in their hand and their set cards separately. Cards persist between navigation so you don't lose your tracking mid-duel. Each section can be cleared individually with a reset button. Clicking any card opens a detail panel with the full card image and info.

### Negates

Log which negate cards each rival deck is running. Organize negates by deck — add a deck, then record which specific cards it negates. Useful for building a reference of what to play around against recurring opponents or known archetypes.

### Life Points Calculator

A quick LP calculator for tracking damage during a duel. Supports dealing damage, gaining LP, and halving (for effects like Kuriboh). Turns red and shows "DEAD" when LP hits zero. Starting LP is configurable in settings.

### Card Sync

Sync the local card database from an external source to keep card names and images up to date. The last sync date is shown on the home screen and in settings.

---

## Tech Stack

- [Electron] + [electron-vite]
- [React] + [TypeScript]
- [TanStack Router]
- [Tailwind CSS] + [shadcn/ui]
- [better-sqlite3]

## Development

```bash
npm install
npm run dev
```

```bash
# Build for Windows
npm run build:win
```
