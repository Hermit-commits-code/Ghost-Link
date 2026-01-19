# GHOST-LINK // ARCHITECTURAL LOGBOOK

## [2026-01-18] - PROTOCOL: INDUSTRIAL CONSOLIDATION

**Status:** ACTIVE
**Environment:** Arch Linux // Rust 1.8x // TypeScript 5.x

### 1. SUMMARY OF STRUCTURAL CHANGES

- **Decommissioned the "Maze":** Removed the deeply nested `Lab/Vanilla-Frontend/` structure.
- **Unified Project Root:** All core assets now live in `~/GhostLink/`.
- **Backend Elevation:** Rust (`vitals_bridge`) is now the primary server for both API and Static assets.
- **Frontend Elevation:** Migrated logic from Vanilla JS to TypeScript (`app.ts`).

### 2. CORE COMPONENT AUDIT

| Component     | Path                    | Language   | Responsibility               |
| :------------ | :---------------------- | :--------- | :--------------------------- |
| **Engine**    | `src/main.rs`           | Rust       | Hardware Vitals & File I/O   |
| **Logic**     | `src/static/ts/app.ts`  | TypeScript | UI Logic & API Communication |
| **Interface** | `src/static/index.html` | HTML5      | Terminal & Editor Layout     |
| **Aesthetic** | `src/static/style.css`  | CSS3       | Neon/Noir Visual Theme       |

### 3. TECHNICAL DEBT RESOLVED

- **Port Conflict:** Eliminated the need for Python's `http.server` on port 5500. Everything now runs on Port 8000.
- **Type Safety:** Implemented `interface Vitals` to prevent runtime data crashes in the frontend.
- **Pathing:** Consolidated the `.git` folder to the root for project-wide version control.

### 4. ACTIVE TASKS

- [x] Initial Project Structure Consolidation
- [x] TypeScript Compiler Configuration
- [x] Rust Static File Service Integration
- [ ] Implement Sidebar File Browser (Pending)
- [ ] GPU/Disk Usage Integration (Pending)

---

_End of Entry - GHOST_SYS_01_

## [2026-01-18] - PROTOCOL: DYNAMIC UI EXPANSION

**Status:** STABLE

### 1. FEATURES IMPLEMENTED

- **Sidebar File Browser:** Rust backend now scans `src/static` and returns a JSON list.
- **Dynamic DOM Injection:** TypeScript now builds the sidebar UI at runtime.
- **Active State Tracking:** Sidebar items now visually reflect the currently edited file via CSS `.active` class.

### 2. SUBSYSTEM UPDATES

- **Rust `main.rs`:** Added `/files` route with `std::fs::read_dir` logic.
- **TS `app.ts`:** Integrated `refreshFiles()` and attached `saveFile` to the global scope.
- **CSS `style.css`:** Added transitions and hover effects for the sidebar navigation.

### 3. VERIFICATION

- [x] Clicking sidebar item loads file into editor.
- [x] Terminal 'edit' command remains functional.
- [x] 'dist' folder is correctly filtered from the file list.

---

_End of Entry - GHOST_SYS_02_

## [2026-01-18] - PROTOCOL: FILESYSTEM MANIPULATION

**Status:** OPERATIONAL

### 1. NEW COMMANDS

- `touch [filename]`: Creates an empty file in `src/static`.
- `rm [filename]`: Removes a file with a browser confirmation safety check.
- `edit`: Defaults to `index.html` if no argument is provided.

### 2. ARCHITECTURAL FIXES

- **Port Management:** Identified `AddrInUse` (Os 98) error and documented `fuser` recovery.
- **UI Sync:** Integrated `refreshFiles()` into the creation and deletion loops to ensure the sidebar stays current.

### 3. SAFETY

- Implemented Rust-level protection against deleting `index.html`, `style.css`, and `app.js`.
