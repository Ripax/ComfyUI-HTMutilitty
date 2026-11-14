# Copilot Instructions for ComfyUI-HTMutilitty

## Overview

This repository is a small ComfyUI frontend extension, not a standalone application or backend service. It lives under the ComfyUI `custom_nodes` tree and is loaded by ComfyUI at runtime through the Python entry point in `__init__.py`.

The project is intentionally lightweight: it adds a UI affordance for minimizing and expanding nodes in the canvas, keyboard shortcuts, and a right-click menu command. There are no custom backend models, no node definitions, and no dependency graph to manage.

## Build, test, and lint commands

There is no repository-defined build, lint, or automated test setup for this project.

- No `package.json`, `pytest` config, `ruff`/`black` config, or ESLint config is present.
- No CI workflow or test suite is checked in for this extension.
- The extension is loaded directly by ComfyUI; the normal validation path is to launch ComfyUI, reload the browser, and exercise the feature in the canvas.

When changing behavior, validate by:

1. Restarting or reloading ComfyUI.
2. Refreshing the browser UI.
3. Testing the relevant interaction in the canvas (select node(s), use the command, or press the shortcut).

## Architecture

### Python entry point

`__init__.py` is a thin loader. It exposes version metadata and sets `WEB_DIRECTORY = "./web"`, which tells ComfyUI to load the extension's frontend assets. It does not define actual ComfyUI nodes; `NODE_CLASS_MAPPINGS` and `NODE_DISPLAY_NAME_MAPPINGS` remain empty by design.

### Frontend extension bootstrap

The main bootstrap lives in `web/minimize_shortcut.js`. It calls `app.registerExtension(...)` and registers:

- `settings`: a UI toggle for the right-click menu
- `commands`: a command that toggles selected nodes
- `keybindings`: `Ctrl+Shift+M` for minimizing/expanding
- `nodeCreated` and `loadedGraphNode`: per-node reroute icon and title setup
- `setup`: keyboard shortcut registration, the Reroute info-link observer, and a small console log banner

### State and rendering helpers

The extension keeps its behavior split into small frontend modules:

- `web/config.js`: shared IDs, colors, and static asset URLs.
- `web/minimize.js`: minimization state, toggle logic, and selected-node handling. This is the core of the feature and uses `node.flags.collapsed` plus a custom `__minimizeShortcutMinimized` flag to keep the UI state.
- `web/shortcuts.js`: handles keyboard shortcuts like `.` and `f` in addition to the minimize shortcut flow.
- `web/reroute.js`: creates Reroute nodes and updates their titles from the connected input node.
- `web/rerouteInfo.js`: adds project override, date, and GitHub details to the embedded Reroute Info panel.
- `web/rerouteIcon.js`: renders Reroute title bars and icons in classic mode and Nodes 2.0.
- `web/colors.js`: applies green node colors while minimized and restores the original colors on expand.
- `web/fitView.js`: centers or fits the canvas around selected nodes.
- `web/state.js`: stores the loaded reroute icon instance so it can be shared across nodes.

## Key conventions

- Keep this project frontend-only. Avoid introducing backend or model logic unless the feature truly requires it.
- Prefer the ComfyUI extension lifecycle (`settings`, `commands`, `keybindings`, `nodeCreated`, `setup`) over ad hoc globals or side effects.
- Preserve the canvas API patterns used by ComfyUI: when changing node state, call `app.canvas?.setDirty?.(true, true)` so the UI redraws.
- For canvas-rendered nodes, attach visual effects to `node.onDrawForeground`. Nodes 2.0 renders nodes in the DOM, so add overlays to their node elements rather than drawing behind them on the canvas.
- Treat node state as extension-owned metadata such as `__minimizeShortcutMinimized`; do not overwrite native ComfyUI node state unexpectedly.
- Keep URLs and paths relative to the extension's static `web` directory. ComfyUI mounts that directory at `/extensions/ComfyUI-HTMutilitty/`.
- This repository is intentionally minimal and dependency-free. Prefer direct, surgical edits with no added package or build tooling unless the repo clearly needs it.

## Working on this repo

- Start with the frontend extension bootstrap in `web/minimize_shortcut.js` when tracing feature behavior.
- Follow the call chain from `nodeCreated` or the command handler into the helper modules rather than trying to infer behavior from a single file.
- Validate UI changes in the browser against actual ComfyUI canvas behavior; this repo does not have an isolated test harness.
