# TECHNICAL SPECIFICATION: Arbetsförmedling Queue Time Extension

## 🎯 PROJECT GOAL
Create a Chrome extension that displays exact queue waiting times in minutes instead of "lång kötid" on Arbetsförmedlingen's contact page.

## 🔍 THE CORE PROBLEM

### What Arbetsförmedlingen Does:
1. Their website calculates exact queue times (e.g., 154.37 minutes)
2. They log this to console: `console.log("#phoneQueueAS", "-", 154.376666666667, "min")`
3. But they only show users "lång kötid" (long queue) for anything over 15 minutes
4. Users never see the actual waiting time

### What We Need:
Intercept their console logs and display the exact time to users instead of "lång kötid"

## 📋 EXACT REQUIREMENTS

### Input Data Source:
- **Console Log Format**: `console.log("#phoneQueueAS", "-", 154.376666666667, "min")`
- **Note**: This is 4 separate arguments, NOT a single string
- **Element ID**: `#phoneQueueAS` (the DOM element that shows queue info)

### Expected Behavior:
1. **Intercept** the console.log call that contains queue time data
2. **Extract** the minutes value (3rd argument)
3. **Replace** their "lång kötid" text with exact time: "Just nu kan det vara **lång** kötid (154.4 min)"
4. **Show floating indicator** with color-coded status
5. **Update in real-time** when queue times change

### Color Coding:
- 🟢 Green: ≤5 minutes (Mycket kort)
- 🟡 Yellow: ≤15 minutes (Kort)
- 🟠 Orange: ≤30 minutes (Medel)
- 🔴 Red: >30 minutes (Lång)

## 🔧 TECHNICAL DETAILS

### Their JavaScript Code (from page source):
```javascript
const writeToElement = (num, el) => {
   if (document.querySelector(el)) {
      const minutes = num / 60;
      console.log(el,"-", minutes, 'min');  // ← THIS IS OUR DATA SOURCE
      
      let string = 'Just nu kan det vara <strong>lång</strong> kötid';
      if (minutes <= 15) {
         string = ' ';  // ← They show NOTHING for short queues
      }
      document.querySelector(el).innerHTML = string;
   }
};
```

### Console Log Analysis:
- **Arguments Array**: `["#phoneQueueAS", "-", 154.376666666667, "min"]`
- **Target Element**: `document.querySelector('#phoneQueueAS')`
- **Timing**: Their script runs after DOMContentLoaded with 1 second delay

### Key Challenge:
Their script overwrites the DOM content AFTER we try to update it. We need to:
1. Capture the console log data
2. Wait for their script to finish updating the DOM
3. Override their content with our enhanced version

## 🚨 CRITICAL ISSUES WITH CURRENT CODE

### Problem 1: Console Interception Format
```javascript
// WRONG - treats as single string
const message = args.join(' ');
if (message.includes('#phoneQueueAS')) {
    // This won't work reliably
}

// CORRECT - check individual arguments
if (args.length >= 4 && 
    args[0] === '#phoneQueueAS' && 
    args[1] === '-' && 
    args[3] === 'min') {
    const minutes = parseFloat(args[2]);
}
```

### Problem 2: Timing Issues
```javascript
// WRONG - immediate update gets overwritten
updateQueueDisplay(minutes);

// CORRECT - wait for their script to finish
setTimeout(() => {
    updateQueueDisplay(minutes);
}, 500); // Give their script time to finish
```

### Problem 3: DOM Update Prevention
```javascript
// WRONG - prevents necessary updates
if (!phoneElement.hasAttribute('data-af-modified')) {
    // Only update once
}

// CORRECT - always update when we have new data
// Always override their content
phoneElement.innerHTML = displayText;
```

## 📁 FILE STRUCTURE NEEDED

```
AFCromeE/
├── manifest.json          # Manifest V3 configuration
├── content-script.js      # Main interception logic
├── popup.html            # Extension popup
├── popup.css             # Popup styling
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎯 IMPLEMENTATION STRATEGY

### Step 1: Manifest Configuration
```json
{
  "manifest_version": 3,
  "content_scripts": [{
    "matches": ["*://arbetsformedlingen.se/kontakt*"],
    "js": ["content-script.js"],
    "run_at": "document_start"  // ← CRITICAL: Start early
  }]
}
```

### Step 2: Console Interception
```javascript
const originalConsoleLog = console.log;
console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    
    if (args.length >= 4 && 
        args[0] === '#phoneQueueAS' && 
        args[1] === '-' && 
        args[3] === 'min') {
        const minutes = parseFloat(args[2]);
        handleQueueTime(minutes);
    }
};
```

### Step 3: DOM Update Strategy
```javascript
function handleQueueTime(minutes) {
    // Update floating indicator immediately
    updateFloatingIndicator(minutes);
    
    // Wait for their script to finish, then override
    setTimeout(() => {
        const phoneElement = document.querySelector('#phoneQueueAS');
        if (phoneElement) {
            phoneElement.innerHTML = `Just nu kan det vara <strong style="color: #dc3545;">lång</strong> kötid (${minutes.toFixed(1)} min)`;
        }
    }, 500);
}
```

## 🧪 TESTING REQUIREMENTS

### Test Cases:
1. **Load page** → Should show "Laddar kötid..." initially
2. **Queue time received** → Should update to exact time and color
3. **Short queue (≤15 min)** → Should show green/yellow with exact time
4. **Long queue (>30 min)** → Should show red with exact time
5. **Page refresh** → Should work consistently
6. **Multiple updates** → Should handle real-time changes

### Debug Verification:
Look for these console messages:
- "📞 Queue Monitor Extension Loaded"
- "🎯 Console interception activated"
- "🎯 Extracted queue time: X minutes"
- "✅ Updated queue display: X min"

## 🔍 CURRENT STATUS ANALYSIS

Based on the screenshot provided:
- ✅ Extension loads successfully
- ✅ Console interception is active
- ✅ Queue time is being captured (154.29 minutes)
- ❌ DOM is not being updated (still shows "Laddar kötid...")
- ❌ Floating indicator not visible or updating

**Root Cause**: The DOM update logic is failing due to timing and update prevention issues.

## 🎯 SUCCESS CRITERIA

### Must Have:
1. Show exact queue time instead of "lång kötid"
2. Color-coded floating indicator
3. Real-time updates when queue changes
4. No interference with site functionality

### Should Have:
1. Click indicator for more details
2. Smooth animations
3. Error handling for edge cases
4. Clean console logging

## 🚨 CONSTRAINTS

1. **No Script Injection**: Cannot inject scripts due to CSP
2. **No External APIs**: Must use only console log data
3. **No Site Breaking**: Must not interfere with site functionality
4. **Chrome Only**: Focus on Chrome extension compatibility

---

## 📝 IMPLEMENTATION NOTES FOR AI

1. **Focus on console.log interception** - this is the ONLY reliable data source
2. **Use setTimeout delays** - their script needs time to update DOM first
3. **Always override DOM content** - don't prevent updates with flags
4. **Test with real data** - queue times like 154.37 minutes
5. **Handle edge cases** - what if element doesn't exist, multiple calls, etc.

This specification should give any AI developer the complete context needed to build a working solution.