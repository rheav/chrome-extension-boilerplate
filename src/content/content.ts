// Log to verify content script is loaded
console.log("Content script loaded in webpage console");

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_TITLE") {
    sendResponse({ title: document.title });
    return true;
  }
});

// For HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}
