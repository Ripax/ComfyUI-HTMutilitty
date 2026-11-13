import { app } from "../../scripts/app.js";

import {
    EXTENSION_NAME,
    COMMAND_ID,
    SETTING_ID,
} from "./config.js";

import {
    toggleSelectedNodes,
} from "./minimize.js";

import {
    addRerouteIcon,
    installRerouteIconDOMObserver,
} from "./rerouteIcon.js";

import {
    registerKeyboardShortcuts,
} from "./shortcuts.js";


app.registerExtension({

    name: EXTENSION_NAME,


    // ========================================================
    // Settings
    // ========================================================

    settings: [

        {
            id: SETTING_ID,

            name:
                "Minimize Shortcut: " +
                "Show Right Click Menu",

            type: "boolean",

            defaultValue: true,
        },
    ],


    // ========================================================
    // Commands
    // ========================================================

    commands: [

        {
            id: COMMAND_ID,

            label:
                "Minimize / Expand " +
                "Selected Nodes",

            function() {

                toggleSelectedNodes();
            },
        },
    ],


    // ========================================================
    // Keyboard Binding
    // ========================================================

    keybindings: [

        {
            combo: {
                key: "m",
                ctrl: true,
                shift: true,
            },

            commandId: COMMAND_ID,
        },
    ],


    // ========================================================
    // Node Created
    // ========================================================

    nodeCreated(node) {

        // Install Reroute icon if applicable.
        addRerouteIcon(node);
    },

    loadedGraphNode(node) {

        addRerouteIcon(node);
    },


    // ========================================================
    // Setup
    // ========================================================

    setup() {

        installRerouteIconDOMObserver();

        registerKeyboardShortcuts();


        console.log(
            `%c[${EXTENSION_NAME}] Loaded`,
            "color: #50fa7b; font-weight: bold"
        );


        console.log(
            `%cShortcuts`,
            "color: #8be9fd; font-weight: bold"
        );


        console.log(
            "  .  → Create Reroute"
        );


        console.log(
            "  f  → Fit View"
        );


        console.log(
            "  Ctrl+Shift+M → Minimize / Expand"
        );
    },
});