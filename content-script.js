// Content script (isolated world). Injects page-hook.js into page context, listens for window messages,
// and updates the DOM (#phoneQueueAS) + shows a floating indicator with color coding.

(function () {
  // Inject the page-hook into the page context so we can intercept console.log there.
  function injectPageHook() {
    try {
      const s = document.createElement('script');
      s.src = chrome.runtime.getURL('page-hook.js');
      s.onload = function () { this.remove(); };
      (document.head || document.documentElement).appendChild(s);
    } catch (e) {
      // Silent fail for production
    }
  }

  injectPageHook();

  // Create floating indicator element once
  let indicator = null;
  function ensureIndicator() {
    if (indicator && document.contains(indicator)) return indicator;
    
    indicator = document.createElement('div');
    indicator.id = 'af-queue-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      min-width: 180px;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.95;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      user-select: none;
    `;
    
    indicator.title = 'Klicka för mer information • AF Queue Monitor';
    
    // Enhanced click handler
    indicator.addEventListener('click', () => {
      const minutes = indicator.getAttribute('data-minutes');
      const lastUpdate = indicator.getAttribute('data-last-update');
      if (minutes) {
        const timeFormatted = parseFloat(minutes);
        const hours = Math.floor(timeFormatted / 60);
        const mins = Math.round(timeFormatted % 60);
        const timeString = hours > 0 ? `${hours}h ${mins}min` : `${mins} minuter`;
        
        alert(`🕐 Aktuell kötid: ${timeString}\n\n📊 Exakt tid: ${minutes} minuter\n⏰ Senast uppdaterad: ${lastUpdate || 'Nu'}\n\n✨ Data hämtas i realtid från Arbetsförmedlingens system\n🔄 Uppdateras automatiskt när kötiden ändras`);
      }
    });
    
    // Hover effects
    indicator.addEventListener('mouseenter', () => {
      indicator.style.transform = 'translateY(-2px) scale(1.02)';
      indicator.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)';
    });
    
    indicator.addEventListener('mouseleave', () => {
      indicator.style.transform = 'translateY(0) scale(1)';
      indicator.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)';
    });
    
    document.documentElement.appendChild(indicator);
    return indicator;
  }

  function colorForMinutes(minutes) {
    if (minutes <= 5) return { 
      color: 'linear-gradient(135deg, #10b981, #059669)', 
      label: 'Mycket kort kö',
      icon: '🟢'
    };
    if (minutes <= 15) return { 
      color: 'linear-gradient(135deg, #f59e0b, #d97706)', 
      label: 'Kort kö',
      icon: '🟡'
    };
    if (minutes <= 30) return { 
      color: 'linear-gradient(135deg, #f97316, #ea580c)', 
      label: 'Medellång kö',
      icon: '🟠'
    };
    return { 
      color: 'linear-gradient(135deg, #ef4444, #dc2626)', 
      label: 'Lång kö',
      icon: '🔴'
    };
  }

  function updateFloatingIndicator(minutes) {
    const node = ensureIndicator();
    const c = colorForMinutes(minutes);
    const timeFormatted = minutes.toFixed(1);
    const now = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    
    node.style.background = c.color;
    node.setAttribute('data-minutes', timeFormatted);
    node.setAttribute('data-last-update', now);
    
    node.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span style="font-size: 16px;">${c.icon}</span>
        <div style="font-weight: 600; font-size: 15px; line-height: 1;">Kötid</div>
      </div>
      <div style="font-size: 18px; font-weight: 700; margin-bottom: 2px;">${timeFormatted} min</div>
      <div style="font-size: 11px; opacity: 0.9; font-weight: 500;">${c.label}</div>
      <div style="font-size: 10px; opacity: 0.7; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px;">
        Uppdaterad: ${now}
      </div>
    `;
  }

  // Core: handle queue time messages from page-hook
  function handleQueueTime(minutes, elSelector) {
    // Update floating indicator immediately
    updateFloatingIndicator(minutes);

    // Wait for their script to finish and then override their DOM content.
    setTimeout(() => {
      try {
        const phoneElement = document.querySelector(elSelector || '#phoneQueueAS');
        if (!phoneElement) return;
        
        // Build enhanced display text
        const c = colorForMinutes(minutes);
        const timeFormatted = minutes.toFixed(1);
        const strongColor = c.color.includes('gradient') ? 
          c.color.match(/135deg, ([^,]+)/)[1] : c.color;
        
        const text = `Just nu är det <strong style="color:${strongColor};">${timeFormatted} min</strong> kötid `;
        phoneElement.innerHTML = text;
      } catch (e) {
        // Silent fail for production
      }
    }, 600); // Allow their script to complete first
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
})();
