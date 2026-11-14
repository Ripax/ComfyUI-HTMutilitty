import { MINIMIZED_COLOR } from "./config.js";


export function applyMinimizedNodeColor(node) {

    if (!node) {
        return;
    }

    if (!node.__minimizeShortcutOriginalColors) {
        node.__minimizeShortcutOriginalColors = {
            color: node.color,
            bgcolor: node.bgcolor,
        };
    }

    node.color = MINIMIZED_COLOR;
    node.bgcolor = MINIMIZED_COLOR;
}


export function restoreNodeColors(node) {

    if (!node) {
        return;
    }

    const originalColors =
        node.__minimizeShortcutOriginalColors;

    if (!originalColors) {
        return;
    }

    node.color = originalColors.color;
    node.bgcolor = originalColors.bgcolor;

    delete node.__minimizeShortcutOriginalColors;
}
