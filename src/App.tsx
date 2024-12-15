import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { ArrowRight, Activity, XCircle } from "lucide-react";

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: "ANALYZE_PAGE",
        });
      } else {
        console.error("No active tab found or no tab ID.");
      }
    } catch (error) {
      console.error("Error in popup:", error);
    } finally {
      setTimeout(() => setIsAnalyzing(false), 1000);
    }
  };

  const handleClear = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: "CLEAR_ANALYSIS",
        });
      }
    } catch (error) {
      console.error("Error clearing analysis:", error);
    }
  };

  return (
    <div className="w-[350px] h-[500px] bg-background text-foreground antialiased">
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Chrome Extension</h1>
              <p className="text-sm text-muted-foreground">Boilerplate v1.0.0</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Page Analysis</CardTitle>
              <CardDescription>
                Analyze the structure and content of the active tab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleClear}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Clear Analysis
              </Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-sm font-medium mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" className="h-auto py-4 flex flex-col items-center justify-center">
                <span className="text-xs">View Logs</span>
              </Button>
              <Button variant="secondary" className="h-auto py-4 flex flex-col items-center justify-center">
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </div>
        </main>

        <footer className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Built with shadcn/ui
            </p>
            <Button variant="ghost" size="sm" className="text-xs">
              Documentation
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
