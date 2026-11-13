import { app } from "../../scripts/app.js";

import {
    REROUTE_ICON_URL,
} from "./config.js";

import {
    getRerouteIcon,
    setRerouteIcon,
    iconInstalled,
} from "./state.js";

let rerouteDOMObserver = null;

export const REROUTE_TITLE_BAR_HEIGHT = 30;


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
    const width = node?.size?.[0] || 0;
    const height = node?.size?.[1] || 0;
    const titleHeight =
        node?.title_mode === globalThis.LiteGraph?.NO_TITLE
            ? 0
            : globalThis.LiteGraph?.NODE_TITLE_HEIGHT ||
                REROUTE_TITLE_BAR_HEIGHT;


    ctx.save();


    ctx.globalAlpha = 0.9;


    ctx.drawImage(
        icon,
        (width - size) / 2,
        titleHeight + (height - size) / 2,
        size,
        size
    );


    ctx.restore();
}


function addRerouteTitleBar(element, node) {

    const wrapper =
        element.querySelector(
            '[data-testid="node-inner-wrapper"]'
        );

    if (!wrapper) {
        return;
    }

    let titleBar =
        wrapper.querySelector(
            "[data-htmutilitty-reroute-title]"
        );

    if (!titleBar) {

        titleBar =
            document.createElement("div");

        titleBar.dataset.htmutilittyRerouteTitle =
            "true";

        titleBar.className =
            "lg-node-header w-full min-w-0 " +
            "p-1 text-xs rounded-t-xl";

        Object.assign(
            titleBar.style,
            {
                boxSizing: "border-box",
                display: "flex",
                flex: `0 0 ${REROUTE_TITLE_BAR_HEIGHT}px`,
                alignItems: "center",
                height: `${REROUTE_TITLE_BAR_HEIGHT}px`,
                minHeight: `${REROUTE_TITLE_BAR_HEIGHT}px`,
                overflow: "hidden",
            }
        );

        const label =
            document.createElement("div");

        label.dataset.htmutilittyRerouteTitleText =
            "true";

        label.className =
            "min-w-0 flex-1 truncate";

        titleBar.appendChild(label);

        wrapper.insertBefore(
            titleBar,
            wrapper.firstElementChild
        );
    }

    const label =
        titleBar.querySelector(
            "[data-htmutilitty-reroute-title-text]"
        );

    const title =
        node.title || "Reroute";

    if (
        label &&
        label.textContent !== title
    ) {
        label.textContent = title;
        label.title = title;
    }
}


function addRerouteIconToElement(
    element,
    nodes
) {

    const nodeId =
        element.getAttribute("data-node-id");

    if (nodeId === null) {
        return;
    }

    const node =
        nodes.find(
            candidate =>
                String(candidate.id) === nodeId
        );

    if (!isRerouteNode(node)) {
        return;
    }

    addRerouteTitleBar(
        element,
        node
    );

    const existingIcon =
        element.querySelector(
            "[data-htmutilitty-reroute-icon]"
        );

    if (existingIcon) {
        existingIcon.style.top =
            `calc(50% + ${
                REROUTE_TITLE_BAR_HEIGHT / 2
            }px)`;

        return;
    }

    const icon =
        document.createElement("img");

    icon.dataset.htmutilittyRerouteIcon =
        "true";

    icon.src =
        REROUTE_ICON_URL;

    icon.alt = "";

    icon.setAttribute(
        "aria-hidden",
        "true"
    );

    Object.assign(
        icon.style,
        {
            position: "absolute",
            left: "50%",
            top: `calc(50% + ${
                REROUTE_TITLE_BAR_HEIGHT / 2
            }px)`,
            width: "24px",
            height: "24px",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: "10",
            opacity: "0.9",
        }
    );

    element.appendChild(icon);
}


export function updateRerouteTitleElement(node) {

    if (!node || !document.body) {
        return;
    }

    const nodeId =
        String(node.id);

    for (
        const element of
        document.querySelectorAll("[data-node-id]")
    ) {

        if (
            element.getAttribute("data-node-id") ===
            nodeId
        ) {
            addRerouteTitleBar(
                element,
                node
            );

            return;
        }
    }
}


function addRerouteIconsInElement(element) {

    if (element.nodeType !== 1) {
        return;
    }

    const nodes =
        app.graph?._nodes || [];

    if (
        element.matches("[data-node-id]")
    ) {
        addRerouteIconToElement(
            element,
            nodes
        );
    }

    for (
        const nodeElement of
        element.querySelectorAll(
            "[data-node-id]"
        )
    ) {

        addRerouteIconToElement(
            nodeElement,
            nodes
        );
    }
}


export function installRerouteIconDOMObserver() {

    if (
        rerouteDOMObserver ||
        !document.body
    ) {
        return;
    }

    rerouteDOMObserver =
        new MutationObserver(records => {

            for (const record of records) {

                if (
                    record.target instanceof Element
                ) {

                    const nodeElement =
                        record.target.matches(
                            "[data-node-id]"
                        )
                            ? record.target
                            : record.target.closest(
                                "[data-node-id]"
                            );

                    if (nodeElement) {
                        addRerouteIconsInElement(
                            nodeElement
                        );
                    }
                }

                for (
                    const addedNode of
                    record.addedNodes
                ) {

                    addRerouteIconsInElement(
                        addedNode
                    );
                }
            }
        });

    rerouteDOMObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true,
        }
    );

    addRerouteIconsInElement(
        document.body
    );
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