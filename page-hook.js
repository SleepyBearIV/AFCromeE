(function(){
  // Runs in page context. Intercepts writeToElement function calls directly.
  const originalConsoleLog = console.log.bind(console);
  try {
    originalConsoleLog('📞 AF Queue Monitor (page-hook) initialized');
  } catch (e) {}

  // Primary method: Intercept writeToElement function directly
  function interceptWriteToElement() {
    // Wait for their script to define writeToElement
    let attempts = 0;
    const checkForFunction = setInterval(() => {
      attempts++;
      if (window.writeToElement || attempts > 50) {
        clearInterval(checkForFunction);
        
        if (window.writeToElement) {
          const originalWriteToElement = window.writeToElement;
          window.writeToElement = function(num, el) {
            try {
              const minutes = num / 60;
              
              // Send data to content script BEFORE they process it
              if (el === '#phoneQueueAS') {
                window.postMessage({
                  source: 'af-queue-monitor',
                  el: el,
                  minutes: minutes,
                  method: 'function-intercept',
                  rawSeconds: num
                }, '*');
                originalConsoleLog('🎯 AF page-hook intercepted writeToElement:', minutes, 'min');
              }
            } catch (err) {
              originalConsoleLog('AF function intercept error:', err);
            }
            
            // Call original function
            return originalWriteToElement.apply(this, arguments);
          };
          originalConsoleLog('✅ AF writeToElement function intercepted');
        } else {
          originalConsoleLog('❌ AF writeToElement function not found, falling back to console intercept');
        }
      }
    }, 100);
  }

  // Backup method: Console log interception (in case function intercept fails)
  console.log = function(...args) {
    try {
      // Always forward to original
      originalConsoleLog.apply(console, args);
    } catch (e) {}

    try {
      if (args.length >= 4 && args[0] === '#phoneQueueAS' && args[1] === '-' && args[3] === 'min') {
        const minutes = parseFloat(args[2]);
        // Send structured message to content script
        window.postMessage({
          source: 'af-queue-monitor',
          el: args[0],
          minutes: minutes,
          method: 'console-intercept',
          raw: args
        }, '*');
        try { originalConsoleLog('🎯 AF page-hook detected queue time (console):', minutes, 'min'); } catch (e) {}
      }
    } catch (err) {
      try { originalConsoleLog('af page-hook console error', err); } catch (e) {}
    }
  };

  // Start function interception immediately
  interceptWriteToElement();

  // Also try to intercept DOM manipulation as a third fallback
  function interceptDOMUpdates() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.id === 'phoneQueueAS' && mutation.type === 'childList') {
          // Their script just updated the DOM - we can override it now
          originalConsoleLog('🔄 AF detected DOM update to #phoneQueueAS');
        }
      });
    });
    
    // Start observing when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const phoneElement = document.querySelector('#phoneQueueAS');
        if (phoneElement) {
          observer.observe(phoneElement, { childList: true, subtree: true });
        }
      });
    } else {
      const phoneElement = document.querySelector('#phoneQueueAS');
      if (phoneElement) {
        observer.observe(phoneElement, { childList: true, subtree: true });
      }
    }
  }

  interceptDOMUpdates();
})();