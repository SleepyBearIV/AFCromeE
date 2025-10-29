(function(){
  // AF Queue Monitor v1.2.0 - Page Hook
  // Runs in page context. Intercepts writeToElement function calls and console.log as fallback.
  
  const originalConsoleLog = console.log.bind(console);
  const debugPrefix = '🔧 AF Queue Monitor (Page Hook)';
  
  try {
    originalConsoleLog(`${debugPrefix} - Initializing v1.2.0...`);
  } catch (e) {}

  // Primary method: Intercept writeToElement function directly
  function interceptWriteToElement() {
    let attempts = 0;
    const maxAttempts = 50; // ~5 seconds
    
    const checkForFunction = setInterval(() => {
      attempts++;
      
      if (window.writeToElement || attempts >= maxAttempts) {
        clearInterval(checkForFunction);
        
        if (window.writeToElement) {
          const originalWriteToElement = window.writeToElement;
          
          window.writeToElement = function(num, el) {
            try {
              const minutes = num / 60;
              
              // Send data to content script BEFORE they process it
              if (el === '#phoneQueueAS' && minutes > 0) {
                window.postMessage({
                  source: 'af-queue-monitor',
                  el: el,
                  minutes: minutes,
                  method: 'function-intercept',
                  rawSeconds: num,
                  timestamp: Date.now()
                }, '*');
                
                originalConsoleLog(`${debugPrefix} - Function intercepted:`, minutes.toFixed(2), 'min');
              }
            } catch (err) {
              originalConsoleLog(`${debugPrefix} - Function intercept error:`, err);
            }
            
            // Call original function to maintain site functionality
            return originalWriteToElement.apply(this, arguments);
          };
          
          originalConsoleLog(`${debugPrefix} - writeToElement function successfully intercepted ✅`);
        } else {
          originalConsoleLog(`${debugPrefix} - writeToElement function not found, using console fallback 📝`);
        }
      }
    }, 100);
  }

  // Backup method: Console log interception (robust fallback)
  console.log = function(...args) {
    try {
      // Always forward to original to maintain site functionality
      originalConsoleLog.apply(console, args);
    } catch (e) {}

    try {
      // Check for Arbetsförmedlingen's queue time log pattern
      if (args.length >= 4 && 
          args[0] === '#phoneQueueAS' && 
          args[1] === '-' && 
          args[3] === 'min') {
        
        const minutes = parseFloat(args[2]);
        
        if (Number.isFinite(minutes) && minutes > 0) {
          // Send structured message to content script
          window.postMessage({
            source: 'af-queue-monitor',
            el: args[0],
            minutes: minutes,
            method: 'console-intercept',
            raw: args,
            timestamp: Date.now()
          }, '*');
          
          originalConsoleLog(`${debugPrefix} - Console intercepted:`, minutes.toFixed(2), 'min ✅');
        }
      }
    } catch (err) {
      originalConsoleLog(`${debugPrefix} - Console intercept error:`, err);
    }
  };

  // Enhanced DOM monitoring for additional reliability
  function setupDOMMonitoring() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.id === 'phoneQueueAS' && 
            mutation.type === 'childList') {
          originalConsoleLog(`${debugPrefix} - DOM update detected on #phoneQueueAS`);
        }
      });
    });
    
    // Start observing when DOM is ready
    function startObserving() {
      const phoneElement = document.querySelector('#phoneQueueAS');
      if (phoneElement) {
        observer.observe(phoneElement, { 
          childList: true, 
          subtree: true, 
          characterData: true 
        });
        originalConsoleLog(`${debugPrefix} - DOM monitoring active on #phoneQueueAS`);
      } else {
        // Try again in a moment if element not found
        setTimeout(startObserving, 1000);
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserving);
    } else {
      startObserving();
    }
  }

  // Initialize all monitoring methods
  try {
    interceptWriteToElement();
    setupDOMMonitoring();
    originalConsoleLog(`${debugPrefix} - All monitoring systems initialized ✅`);
  } catch (err) {
    originalConsoleLog(`${debugPrefix} - Initialization error:`, err);
  }
})();