// Log to verify content script is loaded
console.log("Content script loaded in webpage console");

// Add message listener for getting page title
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Content script received message:", message);

  if (message.type === 'GET_PAGE_TITLE') {
    console.log("Sending page title:", document.title);
    sendResponse({ title: document.title });
  }
  return true; // Keep message channel open for async response
});

// Notify background script that content script is loaded
chrome.runtime.sendMessage({
  type: 'CONTENT_SCRIPT_LOADED'
});

// For HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}
