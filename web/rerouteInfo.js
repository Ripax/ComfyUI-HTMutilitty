import {
    GITHUB_REPOSITORY_URL,
} from "./config.js";

const REROUTE_INFO_PREFIX =
    "Node Name: Reroute Node";

const REROUTE_NAME_BREAK_ATTRIBUTE =
    "data-htmutilitty-reroute-name-break";

const REROUTE_METADATA_ATTRIBUTE =
    "data-htmutilitty-reroute-metadata";

let rerouteInfoObserver = null;


function addRerouteNameBreak(infoParagraph) {

    const text =
        infoParagraph.textContent.trim();

    if (
        !text.startsWith(REROUTE_INFO_PREFIX) ||
        infoParagraph.querySelector(
            `[${REROUTE_NAME_BREAK_ATTRIBUTE}]`
        )
    ) {
        return;
    }

    const purpose =
        text
            .slice(REROUTE_INFO_PREFIX.length)
            .trimStart();

    const lineBreak =
        document.createElement("br");

    lineBreak.dataset.htmutilittyRerouteNameBreak =
        "true";

    infoParagraph.replaceChildren(
        document.createTextNode(
            REROUTE_INFO_PREFIX
        ),
        lineBreak,
        document.createTextNode(purpose)
    );
}


function addRerouteMetadata(infoParagraph) {

    if (
        infoParagraph.parentElement?.querySelector(
            `[${REROUTE_METADATA_ATTRIBUTE}]`
        )
    ) {
        return;
    }

    const metadata =
        document.createElement("p");

    metadata.dataset.htmutilittyRerouteMetadata =
        "true";

    metadata.style.marginTop =
        "1em";

    metadata.append(
        document.createTextNode(
            "override : HTMLDigger"
        ),
        document.createElement("br"),
        document.createTextNode(
            "date : 2026-11-14"
        ),
        document.createElement("br"),
        document.createTextNode("github : ")
    );

    const link =
        document.createElement("a");

    link.href =
        GITHUB_REPOSITORY_URL;

    link.target =
        "_blank";

    link.rel =
        "noopener noreferrer";

    link.textContent =
        "More details on GitHub";

    metadata.appendChild(link);

    infoParagraph.insertAdjacentElement(
        "afterend",
        metadata
    );
}


function addRerouteMetadataInElement(element) {

    if (element.nodeType !== 1) {
        return;
    }

    for (
        const paragraph of [
            ...(element.matches("p") ? [element] : []),
            ...element.querySelectorAll("p"),
        ]
    ) {

        if (
            paragraph.textContent
                .trim()
                .startsWith(REROUTE_INFO_PREFIX)
        ) {
            addRerouteNameBreak(
                paragraph
            );

            addRerouteMetadata(
                paragraph
            );
        }
    }
}


export function installRerouteInfoMetadata() {

    if (
        rerouteInfoObserver ||
        !document.body
    ) {
        return;
    }

    rerouteInfoObserver =
        new MutationObserver(records => {

            for (const record of records) {
                for (
                    const addedNode of
                    record.addedNodes
                ) {
                    addRerouteMetadataInElement(
                        addedNode
                    );
                }
            }
        });

    rerouteInfoObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true,
        }
    );

    addRerouteMetadataInElement(
        document.body
    );
}
