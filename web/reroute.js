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


    const liteGraph =
        globalThis.LiteGraph;

    if (
        typeof liteGraph?.createNode !==
            "function" ||
        typeof graph.add !== "function"
    ) {

        console.warn(
            "[ComfyUI-HTMutilitty] " +
            "Reroute node creation unavailable"
        );

        return;
    }

    const reroute =
        liteGraph.createNode("Reroute");

    if (!reroute) {
        console.warn(
            "[ComfyUI-HTMutilitty] " +
            "Reroute node type is not registered"
        );

        return;
    }


    const position =
        getMousePosition();

    reroute.pos = position;

    graph.add(reroute);


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