import { app } from "../../scripts/app.js";

import {
    addRerouteIcon,
    isRerouteNode,
    updateRerouteTitleElement,
} from "./rerouteIcon.js";

const rerouteBaseTitles = new WeakMap();
const rerouteBaseSizes = new WeakMap();
const rerouteTitleHooks = new WeakSet();


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


function getTitleWidth(title, minimumWidth) {

    const context =
        app.canvas?.ctx;

    if (!context) {
        return minimumWidth;
    }

    const originalFont =
        context.font;

    context.font =
        "12px Inter, Arial, sans-serif";

    const width =
        Math.ceil(
            context.measureText(title).width
        ) + 20;

    context.font =
        originalFont;

    return Math.max(
        minimumWidth,
        width
    );
}


function updateRerouteTitle(node) {

    const graph =
        node.graph;

    const linkId =
        node.inputs?.[0]?.link;

    let inputNode = null;

    if (
        linkId !== null &&
        linkId !== undefined
    ) {

        const links =
            graph?.links;

        const link =
            typeof links?.get === "function"
                ? links.get(linkId)
                : links?.[linkId];

        if (link) {
            inputNode =
                graph.getNodeById?.(
                    link.origin_id
                );
        }
    }

    const inputTitle =
        inputNode?.title;

    const title =
        inputTitle ||
        rerouteBaseTitles.get(node);

    const baseSize =
        rerouteBaseSizes.get(node);

    if (title === undefined || !baseSize) {
        return;
    }

    const width =
        inputTitle
            ? getTitleWidth(
                title,
                baseSize[0]
            )
            : baseSize[0];

    const titleChanged =
        node.title !== title;

    const sizeChanged =
        node.size?.[0] !== width;

    if (titleChanged) {
        node.title = title;
    }

    if (sizeChanged) {
        node.setSize?.([
            width,
            node.size?.[1] ?? baseSize[1],
        ]);
    }

    updateRerouteTitleElement(node);

    if (!titleChanged && !sizeChanged) {
        return;
    }

    app.canvas?.setDirty?.(
        true,
        true
    );
}


export function installRerouteTitle(node) {

    if (
        !isRerouteNode(node) ||
        rerouteTitleHooks.has(node)
    ) {
        return;
    }

    rerouteBaseTitles.set(
        node,
        node.title || "Reroute"
    );

    rerouteBaseSizes.set(
        node,
        [
            node.size?.[0] ?? 75,
            node.size?.[1] ?? 26,
        ]
    );

    rerouteTitleHooks.add(node);

    const liteGraph =
        globalThis.LiteGraph;

    let titleModeChanged = false;

    if (
        typeof liteGraph?.NORMAL_TITLE ===
        "number"
    ) {
        titleModeChanged =
            node.constructor.title_mode !==
            liteGraph.NORMAL_TITLE;

        node.constructor.title_mode =
            liteGraph.NORMAL_TITLE;
    }

    const original =
        node.onConnectionsChange;

    node.onConnectionsChange =
        function(...args) {

            const result =
                original?.apply(
                    this,
                    args
                );

            updateRerouteTitle(this);

            return result;
        };

    updateRerouteTitle(node);

    if (titleModeChanged) {
        app.canvas?.setDirty?.(
            true,
            true
        );
    }
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