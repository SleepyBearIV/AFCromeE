(function(){
  // AF Queue Monitor - Page Hook
  // Intercepts CallGuide.api.getQueueStatus and calculates average
  
  let phoneQueueResults = [];
  let phoneQueueTimer = null;
  
  function interceptCallGuideAPI() {
    let attempts = 0;
    const maxAttempts = 100;
    
    const checkForAPI = setInterval(() => {
      attempts++;
      
      if (window.CallGuide && window.CallGuide.api && window.CallGuide.api.getQueueStatus) {
        clearInterval(checkForAPI);
        
        const originalGetQueueStatus = window.CallGuide.api.getQueueStatus;
        
        window.CallGuide.api.getQueueStatus = function(param1, queueName) {
          const result = originalGetQueueStatus.call(this, param1, queueName);
          
          if (result && typeof result.then === 'function') {
            return result.then(data => {
              try {
                if (data && data.resultData && data.resultData.queueStatus && data.resultData.queueStatus.eqt) {
                  const seconds = data.resultData.queueStatus.eqt;
                  const minutes = seconds / 60;
                  
                  // Collect phone queue results
                  if (queueName && (queueName.includes('akts') || queueName.includes('aktK2ASInkUppf') || queueName.includes('aktS4'))) {
                    phoneQueueResults.push(minutes);
                    
                    // Clear existing timer and set new one
                    if (phoneQueueTimer) clearTimeout(phoneQueueTimer);
                    
                    phoneQueueTimer = setTimeout(() => {
                      if (phoneQueueResults.length > 0) {
                        // Calculate average
                        const sum = phoneQueueResults.reduce((prev, curr) => prev + curr, 0);
                        const averageMinutes = sum / phoneQueueResults.length;
                        
                        // Send average to content script
                        window.postMessage({
                          source: 'af-queue-monitor',
                          minutes: averageMinutes,
                          method: 'api-average'
                        }, '*');
                        
                        // Reset for next batch
                        phoneQueueResults = [];
                      }
                    }, 500);
                  }
                }
              } catch (err) {
                // Silent fail
              }
              
              return data;
            });
          }
          
          return result;
        };
        
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(checkForAPI);
      }
    }, 100);
  }

  // Initialize
  interceptCallGuideAPI();
})();