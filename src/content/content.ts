// Log to verify content script is loaded
console.log("Content script loaded in webpage console");

// Send initial message to background script
chrome.runtime.sendMessage({
  type: "CONTENT_SCRIPT_LOADED",
  url: window.location.href
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "ANALYZE_PAGE") {
    console.log("%cAnalyzing page...", "color: blue; font-weight: bold");
    const pageTitle = document.title;
    const headings = Array.from(document.querySelectorAll("h1, h2, h3")).map(
      (h) => h.textContent
    );
    console.log("Page Title:", pageTitle);
    console.log("Headings:", headings);
  } else if (message.type === "CLEAR_ANALYSIS") {
    console.log("%cClearing analysis...", "color: orange; font-weight: bold");
  }
});

// For HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}
