console.log("Background script loaded");

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "CONTENT_SCRIPT_LOADED") {
    // Update extension badge
    chrome.action.setBadgeText({
      tabId: sender.tab?.id,
      text: "ON"
    });

    chrome.action.setBadgeBackgroundColor({
      color: "#4CAF50"
    });

    // Send notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon-48.png",
      title: "Extension Active",
      message: "Chrome Extension is now active on this page",
      priority: 2
    });
  }
});

// For HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}

export {};
