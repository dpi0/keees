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
    }
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
