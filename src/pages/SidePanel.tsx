import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

export const SidePanel: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_PAGE' });
      }
    });
    setTimeout(() => setIsAnalyzing(false), 1000);
  };

  const handleClear = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_ANALYSIS' });
      }
    });
  };

  return (
    <div className="w-full h-full p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Chrome Extension</h1>
      
      <div className="space-y-4">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Current Page</h2>
          <p className="text-sm text-muted-foreground">
            Analyze the current page structure and content
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <div className="space-x-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              variant="default"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Page'}
            </Button>
            
            <Button
              onClick={handleClear}
              variant="secondary"
            >
              Clear Analysis
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-sm text-muted-foreground">
            This extension helps you analyze web pages and their structure.
            Open the browser console to see the analysis results.
          </p>
        </div>
      </div>
    </div>
  );
};
