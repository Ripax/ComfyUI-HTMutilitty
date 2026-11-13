import { MINIMIZED_COLOR } from "./config.js";


export function drawMinimizedOverlay(
    node,
    ctx
) {

    if (!node || !ctx) {
        return;
    }

    if (!node.__minimizeShortcutMinimized) {
        return;
    }

    const width =
        node.size?.[0] || 100;

    const height =
        node.size?.[1] || 30;


    ctx.save();


    // --------------------------------------------------------
    // Green border
    // --------------------------------------------------------

    ctx.strokeStyle =
        MINIMIZED_COLOR;

    ctx.lineWidth = 3;

    ctx.globalAlpha = 0.95;


    ctx.strokeRect(
        1.5,
        1.5,
        width - 3,
        height - 3
    );


    // --------------------------------------------------------
    // Green indicator
    // --------------------------------------------------------

    ctx.fillStyle =
        MINIMIZED_COLOR;

    ctx.globalAlpha = 0.25;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // Green status dot
    // --------------------------------------------------------

    ctx.globalAlpha = 1.0;

    ctx.beginPath();

    ctx.arc(
        width - 10,
        10,
        4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        MINIMIZED_COLOR;

    ctx.fill();


    ctx.restore();
}