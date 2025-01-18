// Log when background script is loaded
console.log("Background script loaded and running");

// Handle content script loaded message
chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("Background received message:", message, "from:", sender);
  
  if (message.type === 'CONTENT_SCRIPT_LOADED' && sender.tab?.id) {
    console.log("Setting badge for tab:", sender.tab.id);
    
    // Update extension badge
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: "OK"
    });

    chrome.action.setBadgeBackgroundColor({
      color: "#4CAF50"
    });
  }
  return true; // Keep message channel open for async response
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
