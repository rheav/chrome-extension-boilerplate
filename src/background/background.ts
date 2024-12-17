// Log when background script is loaded
console.log("Background script loaded and running");

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message) => {
  console.log("Background received message:", message.type);
  
  if (message.type === "CONTENT_SCRIPT_LOADED" && message.tabId) {
    // Update extension badge
    chrome.action.setBadgeText({
      tabId: message.tabId,
      text: "OK"
    });

    chrome.action.setBadgeBackgroundColor({
      color: "#4CAF50"
    });

    console.log("Set badge for tab:", message.tabId);
  }
});

// Log when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed/updated:", details.reason);
});

// Clear badge when switching tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated:", activeInfo);
  chrome.action.setBadgeText({
    tabId: activeInfo.tabId,
    text: ""
  });
});

// For HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}

export {};
