# Arbetsförmedling Queue Time Extension

A Chrome extension that displays exact queue times in minutes instead of just "lång kötid" (long queue) on Arbetsförmedlingen's contact page.

## 🎯 The Problem
Arbetsförmedlingen's website shows "lång kötid" for any queue time over 15 minutes, but their system actually calculates exact times. This extension captures those exact times and displays them to users.

## ✨ How It Works
The extension intercepts console log messages from Arbetsförmedlingen's own scripts that contain exact queue times in the format:
```
#phoneQueueAS - 109.54333333333 min
```

## 🔧 Recent Fixes (v1.1.0)

### Major Issues Fixed:
1. **❌ Hardcoded queue times** → **✅ Real-time console interception**
   - Removed hardcoded `149` minute value
   - Implemented proper console.log interception to capture actual queue times

2. **❌ Missing core functionality** → **✅ Proper console monitoring**
   - Added `interceptConsole()` function to capture queue time logs
   - Implemented `extractQueueTime()` to parse console messages

3. **❌ Poor error handling** → **✅ Robust error handling**
   - Added proper null checks and validation
   - Implemented fallback mechanisms for element detection

4. **❌ Infinite loops** → **✅ Safe DOM updates**
   - Added `data-af-modified` attribute to prevent duplicate updates
   - Improved MutationObserver implementation

5. **❌ Limited URL matching** → **✅ Comprehensive URL support**
   - Extended manifest to support multiple Arbetsförmedlingen URLs
   - Changed run timing to `document_start` for better interception

### Technical Improvements:
- **Console Interception**: Properly wraps `console.log` to capture queue data
- **Queue Time Extraction**: Regex pattern matching for "#phoneQueueAS - X min" format
- **Safe DOM Updates**: Prevents modification loops with attribute flags
- **Better Timing**: Runs at document start to catch all console logs
- **Cleanup**: Proper resource cleanup on page unload

## 🚀 Features
- **Real-time queue monitoring**: Captures exact times from Arbetsförmedlingen's system
- **Visual indicators**: Color-coded floating indicator (green/yellow/orange/red)
- **Page integration**: Updates the actual page content with exact times
- **Click for details**: Click the floating indicator for more information

## 📦 Installation
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. Visit [Arbetsförmedlingen's contact page](https://arbetsformedlingen.se/kontakt/for-arbetssokande)

## 🎨 Color Coding
- 🟢 **Green**: Very short queue (≤5 minutes)
- 🟡 **Yellow**: Short queue (≤15 minutes)  
- 🟠 **Orange**: Medium queue (≤30 minutes)
- 🔴 **Red**: Long queue (>30 minutes)

## 🔍 How the Console Interception Works
```javascript
// The extension intercepts console.log calls
originalConsoleLog = console.log;
console.log = function(...args) {
    // Call original console.log first
    originalConsoleLog.apply(console, args);
    
    // Check for queue time messages
    const message = args.join(' ');
    if (message.includes('#phoneQueueAS') && message.includes('min')) {
        extractQueueTime(message);
    }
};
```

## 📝 Version History
- **v1.1.0**: Complete rewrite with proper console interception
- **v1.0.0**: Initial version (had hardcoded values and issues)

## ⚠️ Disclaimer
This extension is not officially associated with Arbetsförmedlingen. It simply reads publicly available console log data to provide better user experience.

## 🐛 Debug Information
If the extension isn't working:
1. Open Developer Tools (F12)
2. Check Console tab for extension messages starting with 📞
3. Look for messages like "Queue Monitor Extension Loaded" and "Extracted queue time: X minutes"
4. Ensure you're on the correct Arbetsförmedlingen contact page

## 🔧 Technical Details
- **Manifest Version**: 3
- **Permissions**: Host permissions for arbetsformedlingen.se
- **Content Script**: Runs at document_start for optimal console interception
- **No external dependencies**: Pure JavaScript implementation