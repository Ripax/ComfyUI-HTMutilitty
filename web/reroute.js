import { app } from "../../scripts/app.js";

import {
    addRerouteIcon,
} from "./rerouteIcon.js";


export function getMousePosition() {

    const canvas =
        app.canvas;

    if (!canvas) {
        return [0, 0];
    }


    if (canvas.graph_mouse) {

        return [
            canvas.graph_mouse[0],
            canvas.graph_mouse[1],
        ];
    }


    return [0, 0];
}


// ============================================================
// Create Reroute
// ============================================================

export function createReroute() {

    const graph =
        app.graph;

    if (!graph) {
        return;
    }


    if (
        typeof graph.createReroute !==
        "function"
    ) {

        console.warn(
            "[ComfyUI-HTMutilitty] " +
            "createReroute() unavailable"
        );

        return;
    }


    const position =
        getMousePosition();


    const reroute =
        graph.createReroute(
            position
        );


    if (!reroute) {
        return;
    }


    addRerouteIcon(
        reroute
    );


    // Deselect existing nodes.
    for (
        const node of graph._nodes || []
    ) {

        node.selected = false;
    }


    reroute.selected = true;


    app.canvas?.setDirty?.(
        true,
        true
    );
}