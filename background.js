browser.commands.onCommand.addListener(function(command) {
    switch (command) {
        case "next-tab":
            switchToNextTab();
            break;
        case "previous-tab":
            switchToPreviousTab();
            break;
        case "new-tab":
            openNewTab();
            break;
        case "close-tab":
            closeCurrentTab();
            break;
        case "reload-page":
            reloadPage(false);
            break;
        case "hard-reload-page":
            reloadPage(true);
            break;
        case "reopen-tab":
            reopenLastClosedTab();
            break;
        case "duplicate-tab":
            duplicateCurrentTab();
            break;
        case "pin-tab":
            pinCurrentTab();
            break;
        case "open-in-new-window":
            openInNewWindow();
            break;
        case "move-tab-left":
            moveTabLeft();
            break;
        case "move-tab-right":
            moveTabRight();
            break;
        case "toggle-mute":
            toggleMute();
            break;
        case "switch-to-last-tab":
            switchToLastUsedTab();
            break;
    }
});

// Store the last active tab ID
let lastActiveTabId = null;
let currentActiveTabId = null;

// Track tab activations to implement last-used tab functionality
browser.tabs.onActivated.addListener(function(activeInfo) {
    lastActiveTabId = currentActiveTabId;
    currentActiveTabId = activeInfo.tabId;
});

async function switchToNextTab() {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (tabs.length > 0 && activeTab.length > 0) {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab[0].id);
        const nextIndex = (currentIndex + 1) % tabs.length;

        await browser.tabs.update(tabs[nextIndex].id, { active: true });
    }
}

async function switchToPreviousTab() {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (tabs.length > 0 && activeTab.length > 0) {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab[0].id);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;

        await browser.tabs.update(tabs[prevIndex].id, { active: true });
    }
}

async function openNewTab() {
    await browser.tabs.create({});
}

async function closeCurrentTab() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        await browser.tabs.remove(activeTab[0].id);
    }
}

async function reloadPage(bypassCache) {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        await browser.tabs.reload(activeTab[0].id, { bypassCache: bypassCache });
    }
}

async function reopenLastClosedTab() {
    const sessions = await browser.sessions.getRecentlyClosed({ maxResults: 1 });

    if (sessions.length > 0 && sessions[0].tab) {
        await browser.sessions.restore(sessions[0].tab.sessionId);
    }
}

async function duplicateCurrentTab() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        await browser.tabs.duplicate(activeTab[0].id);
    }
}

async function pinCurrentTab() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        const isPinned = activeTab[0].pinned;
        await browser.tabs.update(activeTab[0].id, { pinned: !isPinned });
    }
}

async function openInNewWindow() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        // Create a new window with the current tab
        const newWindow = await browser.windows.create({
            tabId: activeTab[0].id,
        });
    }
}

async function moveTabLeft() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        const currentIndex = activeTab[0].index;

        // Only move if not at the leftmost position
        if (currentIndex > 0) {
            await browser.tabs.move(activeTab[0].id, { index: currentIndex - 1 });
        }
    }
}

async function moveTabRight() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        const currentIndex = activeTab[0].index;
        await browser.tabs.move(activeTab[0].id, { index: currentIndex + 1 });
    }
}

async function toggleMute() {
    const activeTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab.length > 0) {
        const muted = activeTab[0].mutedInfo?.muted || false;
        await browser.tabs.update(activeTab[0].id, { muted: !muted });
    }
}

async function switchToLastUsedTab() {
    if (lastActiveTabId) {
        // Check if the tab still exists
        try {
            const tab = await browser.tabs.get(lastActiveTabId);
            await browser.tabs.update(lastActiveTabId, { active: true });
        } catch (error) {
            // Tab doesn't exist anymore, do nothing or handle the error
            console.log("Last active tab no longer exists");
        }
    }
}
