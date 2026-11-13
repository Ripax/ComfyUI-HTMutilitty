import { app } from "../../scripts/app.js";

import {
    getSelectedNodes,
} from "./minimize.js";


export function fitView() {

    const canvas =
        app.canvas;

    if (!canvas) {
        return;
    }


    if (
        typeof canvas.fitViewToSelectionAnimated ===
        "function"
    ) {

        canvas.fitViewToSelectionAnimated();

        return;
    }

    if (
        typeof canvas.fitViewToSelection ===
        "function"
    ) {

        canvas.fitViewToSelection();

        return;
    }


    const nodes =
        getSelectedNodes();


    if (!nodes.length) {
        return;
    }


    if (
        typeof canvas.centerOnNode ===
        "function"
    ) {

        canvas.centerOnNode(
            nodes[0]
        );
    }
}