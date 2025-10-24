// Content script (isolated world). Injects page-hook.js into page context, listens for window messages,
// and updates the DOM (#phoneQueueAS) + shows a floating indicator with color coding.

console.log('📞 Queue Monitor Extension Loaded (content script)');

(function () {
  // Inject the page-hook into the page context so we can intercept console.log there.
  function injectPageHook() {
    try {
      const s = document.createElement('script');
      s.src = chrome.runtime.getURL('page-hook.js');
      s.onload = function () { this.remove(); };
      (document.head || document.documentElement).appendChild(s);
      console.log('🎯 Console interception injected');
    } catch (e) {
      console.error('Failed to inject page-hook', e);
    }
  }

  injectPageHook();

  // Create floating indicator element once
  let indicator = null;
  function ensureIndicator() {
    if (indicator) return indicator;
    indicator = document.createElement('div');
    indicator.id = 'af-queue-indicator';
    indicator.style.position = 'fixed';
    indicator.style.right = '16px';
    indicator.style.bottom = '16px';
    indicator.style.zIndex = 999999;
    indicator.style.minWidth = '160px';
    indicator.style.padding = '10px 12px';
    indicator.style.borderRadius = '8px';
    indicator.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
    indicator.style.fontFamily = 'Arial, sans-serif';
    indicator.style.fontSize = '13px';
    indicator.style.color = '#fff';
    indicator.style.cursor = 'pointer';
    indicator.style.transition = 'transform 160ms ease, opacity 160ms ease';
    indicator.style.opacity = '0.95';
    indicator.title = 'Click for queue details';
    indicator.addEventListener('click', () => {
      // Toggle a tiny details tooltip inside it
      const details = indicator.querySelector('.af-details');
      if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
      }
    });
    document.documentElement.appendChild(indicator);
    return indicator;
  }

  function colorForMinutes(minutes) {
    if (minutes <= 5) return { color: '#198754', label: 'Mycket kort' }; // green
    if (minutes <= 15) return { color: '#ffc107', label: 'Kort' }; // yellow
    if (minutes <= 30) return { color: '#fd7e14', label: 'Medel' }; // orange
    return { color: '#dc3545', label: 'Lång' }; // red
  }

  function updateFloatingIndicator(minutes) {
    const node = ensureIndicator();
    const c = colorForMinutes(minutes);
    node.style.background = c.color;
    node.innerHTML = `
      <div style="font-weight:700;line-height:1">Kötid: ${minutes.toFixed(1)} min</div>
      <div style="font-size:11px;opacity:0.95">${c.label}</div>
      <div class="af-details" style="display:none;margin-top:6px;font-size:11px;opacity:0.95">Uppdateras i realtid från servern</div>
    `;
  }

  // Core: handle queue time messages from page-hook
  function handleQueueTime(minutes, elSelector) {
    console.log('🎯 Extracted queue time:', minutes);
    // Update floating indicator immediately
    updateFloatingIndicator(minutes);

    // Wait for their script to finish and then override their DOM content.
    setTimeout(() => {
      try {
        const phoneElement = document.querySelector(elSelector || '#phoneQueueAS');
        if (!phoneElement) {
          console.warn('phone element not found for selector', elSelector);
          return;
        }
        // Build display text per spec: "Just nu kan det vara <strong>lång</strong> kötid (154.4 min)"
        const c = colorForMinutes(minutes);
        const strongColor = c.color;
        const text = `Just nu kan det vara <strong style="color:${strongColor};">lång</strong> kötid (${minutes.toFixed(1)} min)`;
        phoneElement.innerHTML = text;
        console.log('✅ Updated queue display:', minutes.toFixed(1), 'min');
      } catch (e) {
        console.error('Failed to override #phoneQueueAS', e);
      }
    }, 600); // small delay to allow their script to run and finish
  }

  // Listen to messages from page-hook
  window.addEventListener('message', (ev) => {
    const msg = ev.data;
    if (!msg || msg.source !== 'af-queue-monitor') return;
    const minutes = parseFloat(msg.minutes);
    if (Number.isFinite(minutes)) {
      console.log(`🎯 Received queue data via ${msg.method}:`, minutes, 'min');
      handleQueueTime(minutes, msg.el);
    }
  });

  // Expose a small debug on page so dev can trigger an update manually in console (optional)
  try {
    window.__afQueueMonitor = {
      simulate(minutes) { handleQueueTime(minutes, '#phoneQueueAS'); }
    };
  } catch (e) {}
})();
