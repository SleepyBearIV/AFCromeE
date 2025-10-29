// Content script (isolated world). Injects page-hook.js into page context, listens for window messages,
// and updates the DOM (#phoneQueueAS) + shows a floating indicator with color coding.

console.log('📞 AF Queue Monitor Extension v1.0.0 - Loading...');

(function () {
  // Inject the page-hook into the page context so we can intercept console.log there.
  function injectPageHook() {
    try {
      const s = document.createElement('script');
      s.src = chrome.runtime.getURL('page-hook.js');
      s.onload = function () { this.remove(); };
      (document.head || document.documentElement).appendChild(s);
      console.log('✅ AF Queue Monitor - Page hook injected successfully');
    } catch (e) {
      console.error('❌ AF Queue Monitor - Failed to inject page-hook:', e);
    }
  }

  injectPageHook();

  // Remove the entire floating indicator system and just focus on updating the DOM
  function handleQueueTime(minutes, elSelector) {
    console.log('🎯 AF Queue Monitor - Extracted queue time:', minutes, 'minutes');
    
    // Wait for their script to finish and then override their DOM content.
    setTimeout(() => {
      try {
        const phoneElement = document.querySelector(elSelector || '#phoneQueueAS');
        if (!phoneElement) {
          console.warn('⚠️ AF Queue Monitor - Phone element not found for selector:', elSelector);
          return;
        }
        
        // Simply replace "lång kötid" with exact time
        const timeFormatted = minutes.toFixed(1);
        const originalText = phoneElement.textContent || phoneElement.innerHTML;
        
        // Replace the vague text with exact time
        const updatedText = originalText.replace(
          /lång kötid/gi, 
          `lång kötid (${timeFormatted} min)`
        );
        
        phoneElement.innerHTML = updatedText;
        
        console.log('✅ AF Queue Monitor - Updated queue display:', timeFormatted, 'min');
      } catch (e) {
        console.error('❌ AF Queue Monitor - Failed to update display:', e);
      }
    }, 600);
  }

  // Listen to messages from page-hook
  window.addEventListener('message', (ev) => {
    const msg = ev.data;
    if (!msg || msg.source !== 'af-queue-monitor') return;
    
    const minutes = parseFloat(msg.minutes);
    if (Number.isFinite(minutes) && minutes > 0) {
      handleQueueTime(minutes, '#phoneQueueAS');
    }
  });

  // Enhanced debug interface for developers
  try {
    window.__afQueueMonitor = {
      version: '1.2.0',
      simulate(minutes) { 
        console.log('🧪 AF Queue Monitor - Simulating queue time:', minutes);
        handleQueueTime(minutes, '#phoneQueueAS'); 
      },
      getStatus() {
        const ind = document.querySelector('#af-queue-indicator');
        return {
          loaded: true,
          indicatorVisible: !!ind,
          lastUpdate: ind?.getAttribute('data-last-update'),
          currentMinutes: ind?.getAttribute('data-minutes')
        };
      }
    };
  } catch (e) {
    console.warn('⚠️ AF Queue Monitor - Debug interface setup failed:', e);
  }
})();
