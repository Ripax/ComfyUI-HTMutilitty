import { app } from "../../scripts/app.js";

import {
    applyMinimizedNodeColor,
    restoreNodeColors,
} from "./colors.js";


// ============================================================
// Check Minimized
// ============================================================

export function isNodeMinimized(node) {

    return (
        node?.__minimizeShortcutMinimized === true
    );
}


// ============================================================
// Minimize
// ============================================================

export function minimizeNode(node) {

    if (!node) {
        return;
    }

    node.flags =
        node.flags || {};

    node.flags.collapsed = true;

    node.__minimizeShortcutMinimized =
        true;

    applyMinimizedNodeColor(node);
}


// ============================================================
// Expand
// ============================================================

export function restoreNode(node) {

    if (!node) {
        return;
    }

    node.flags =
        node.flags || {};

    node.flags.collapsed = false;

    // Remove our state only.
    node.__minimizeShortcutMinimized =
        false;

    restoreNodeColors(node);
}


// ============================================================
// Set State
// ============================================================

export function setNodeMinimized(
    node,
    minimized
) {

    if (minimized) {

        minimizeNode(node);

    } else {

        restoreNode(node);
    }
}


// ============================================================
// Toggle
// ============================================================

export function toggleNode(node) {

    setNodeMinimized(
        node,
        !isNodeMinimized(node)
    );

    app.canvas?.setDirty?.(
        true,
        true
    );
}


// ============================================================
// Selected Nodes
// ============================================================

export function getSelectedNodes() {

    const graph = app.graph;

    if (!graph) {
        return [];
    }

    return (
        graph._nodes || []
    ).filter(
        node => node.selected
    );
}


// ============================================================
// Toggle Selected Nodes
// ============================================================

export function toggleSelectedNodes() {

    const nodes =
        getSelectedNodes();

    if (!nodes.length) {
        return;
    }


    const shouldMinimize =
        nodes.some(
            node =>
                !isNodeMinimized(node)
        );


    for (const node of nodes) {

        setNodeMinimized(
            node,
            shouldMinimize
        );
    }


    app.canvas?.setDirty?.(
        true,
        true
    );
}