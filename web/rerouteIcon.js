import { app } from "../../scripts/app.js";

import {
    REROUTE_ICON_URL,
} from "./config.js";

import {
    getRerouteIcon,
    setRerouteIcon,
    iconInstalled,
} from "./state.js";


export function loadRerouteIcon() {

    const existing =
        getRerouteIcon();

    if (existing) {
        return existing;
    }


    const icon =
        new Image();


    icon.src =
        REROUTE_ICON_URL;


    icon.onload = () => {

        app.canvas?.setDirty?.(
            true,
            true
        );
    };


    icon.onerror = () => {

        console.warn(
            "[ComfyUI-HTMutilitty] " +
            "Failed to load Reroute icon:",
            REROUTE_ICON_URL
        );
    };


    setRerouteIcon(icon);

    return icon;
}


// ============================================================
// Reroute Detection
// ============================================================

export function isRerouteNode(node) {

    return (
        node?.type === "Reroute" ||
        node?.comfyClass === "Reroute"
    );
}


// ============================================================
// Draw Icon
// ============================================================

export function drawRerouteIcon(
    node,
    ctx
) {

    if (!ctx) {
        return;
    }


    const icon =
        getRerouteIcon();


    if (!icon) {
        loadRerouteIcon();
        return;
    }


    if (!icon.complete) {
        return;
    }


    const size = 24;


    ctx.save();


    ctx.globalAlpha = 0.9;


    ctx.drawImage(
        icon,
        -size / 2,
        -size / 2,
        size,
        size
    );


    ctx.restore();
}


// ============================================================
// Add Icon
// ============================================================

export function addRerouteIcon(node) {

    if (!isRerouteNode(node)) {
        return;
    }


    if (iconInstalled.has(node)) {
        return;
    }


    iconInstalled.add(node);


    loadRerouteIcon();


    const original =
        node.onDrawForeground;


    node.onDrawForeground =
        function(ctx) {

            if (original) {

                original.call(
                    this,
                    ctx
                );
            }


            drawRerouteIcon(
                this,
                ctx
            );
        };
}