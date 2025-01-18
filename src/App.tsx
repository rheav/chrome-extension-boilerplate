import { useEffect } from "react";
import { Button } from "./components/ui/button";
import { useStore } from "./lib/store";

function App() {
  const { 
    pageTitle, 
    isLoading, 
    activeTab, 
    settings,
    setPageTitle, 
    setLoading, 
    setActiveTab,
    initializeFromStorage 
  } = useStore();

  // Initialize settings from storage when component mounts
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  const handleGetTitle = async () => {
    try {
      setLoading(true);
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab?.id) {
        // Send message to get title
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: 'GET_PAGE_TITLE'
        });
        
        if (response && response.title) {
          setPageTitle(response.title);
        }
      }
    } catch (error) {
      console.error("Error getting page title:", error);
      setPageTitle("Error getting page title");
    } finally {
      setLoading(false);
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
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Theme:</h3>
                  <p className="text-sm">Current theme: {settings.theme}</p>
                </div>
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
