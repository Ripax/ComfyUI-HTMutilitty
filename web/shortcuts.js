import { createReroute } from "./reroute.js";

import { fitView } from "./fitView.js";

import {
    toggleSelectedNodes,
} from "./minimize.js";


// ============================================================
// Editable Check
// ============================================================

function isEditableElement(element) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName?.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );
}


// ============================================================
// Shortcut Handler
// ============================================================

export function handleShortcut(event) {

    if (
        isEditableElement(
            event.target
        )
    ) {
        return;
    }


    if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return;
    }


    // --------------------------------------------------------
    // .
    // Create Reroute
    // --------------------------------------------------------

    if (
        event.key === "." ||
        event.code === "Period"
    ) {

        event.preventDefault();
        event.stopImmediatePropagation();

        createReroute();

        return;
    }


    // --------------------------------------------------------
    // f
    // Fit View
    // --------------------------------------------------------

    if (
        event.key === "f" ||
        event.code === "KeyF"
    ) {

        event.preventDefault();
        event.stopPropagation();

        fitView();

        return;
    }
}


// ============================================================
// Register Shortcuts
// ============================================================

export function registerKeyboardShortcuts() {

    window.addEventListener(
        "keydown",
        handleShortcut,
        true
    );
}