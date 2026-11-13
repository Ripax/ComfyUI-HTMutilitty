// Nodes currently minimized.
export const minimizedNodes =
    new WeakSet();

// Reroute nodes with icon installed.
export const iconInstalled =
    new WeakSet();

// Cached Reroute icon.
let rerouteIcon = null;


export function getRerouteIcon() {
    return rerouteIcon;
}


export function setRerouteIcon(icon) {
    rerouteIcon = icon;
}