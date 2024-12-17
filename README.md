# Chrome Extension Boilerplate

A modern Chrome extension boilerplate built with TypeScript, React, and Tailwind CSS, featuring a clean and maintainable architecture.

## 🚀 Features

- **Modern Tech Stack**

  - TypeScript for type safety and better developer experience
  - React for building interactive UI components
  - Tailwind CSS for styling
  - Manifest V3 compliant
- **Core Components**

  - Popup interface with analyze and clear functionality
  - Content script for webpage interaction
  - Background service worker for extension management
  - UI components using shadcn/ui
- **Developer Experience**

  - Hot Module Replacement (HMR) support
  - Clean architecture with separated concerns
  - Built-in console logging for debugging

## 🛠️ Technical Architecture

### 1. Popup (App.tsx)

- Main interface built with React
- Features:
  - Page analysis trigger
  - Clear analysis function
  - Responsive UI with Tailwind CSS
  - Integration with Chrome extension APIs

### 2. Content Script (content.ts)

- Injects into web pages
- Functionality:
  - Page analysis capabilities
  - Communication with popup and background script
  - DOM manipulation and data extraction

### 3. Background Script (background.ts)

- Service worker implementation
- Features:
  - Badge management
  - Notification system
  - Message handling between components

### 4. Manifest (manifest.json)

- Extension configuration
- Permissions:
  - activeTab
  - scripting
  - notifications
- Asset definitions and content script injection rules

## 🔧 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## 💻 Development

- Start development server:
  ```bash
  npm run dev
  ```
- The extension will auto-reload when you make changes
- Check console logs in:
  - Popup DevTools
  - Background script console
  - Webpage console (for content script logs)

## 🔐 Permissions

This extension requires the following permissions:

- `activeTab`: For accessing the current tab's content
- `scripting`: For injecting content scripts
- `notifications`: For sending system notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
