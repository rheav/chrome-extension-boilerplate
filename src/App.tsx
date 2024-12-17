import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleGetTitle = async () => {
    try {
      setIsLoading(true);
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab?.id) {
        // First inject the content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });

        // Then send message to get title
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: "GET_PAGE_TITLE",
        });
        setPageTitle(response.title);
        
        // Notify background script
        chrome.runtime.sendMessage({
          type: "CONTENT_SCRIPT_LOADED",
          tabId: tab.id
        });
      }
    } catch (error) {
      console.error("Error getting page title:", error);
      setPageTitle("Error getting page title");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px] h-[500px] bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-3 h-3 text-white">⚡</div>
          </div>
          <span className="font-semibold">Pullweb</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      {/* Welcome Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        <p className="text-sm text-gray-600 mb-4">
          Get the content of any web page in a simple and effective way.
        </p>

        <div className="space-y-4">
          <div className="text-sm">
            <h3 className="font-medium mb-2">How to use:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Go to the webpage that you want to get content</li>
              <li>• Click on the web page</li>
              <li>• Wait until the extension displays the required content</li>
              <li>• Yay! you get the content</li>
            </ul>
          </div>

          <Button 
            onClick={handleGetTitle} 
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? "Getting content..." : "Get all content"}
          </Button>
        </div>
      </div>

      {/* Content Display */}
      {pageTitle && (
        <div className="p-4 border-t">
          <div className="flex gap-2 mb-4 border-b">
            {['General', 'Font', 'Color', 'Assets'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab.toLowerCase()
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'general' && (
              <div>
                <h3 className="font-medium mb-2">Page Title:</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">{pageTitle}</p>
              </div>
            )}
            {activeTab === 'font' && (
              <div className="text-sm text-gray-600">Font information will be displayed here</div>
            )}
            {activeTab === 'color' && (
              <div className="text-sm text-gray-600">Color information will be displayed here</div>
            )}
            {activeTab === 'assets' && (
              <div className="text-sm text-gray-600">Assets information will be displayed here</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
