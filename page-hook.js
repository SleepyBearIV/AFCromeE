(function(){
  // AF Queue Monitor - Page Hook
  // Intercepts CallGuide.api.getQueueStatus and calculates average exactly like their system
  
  let phoneQueueResults = [];
  const expectedPhoneQueues = ['akts5', 'akts6', 'akts1', 'aktK2ASInkUppf', 'aktS4'];
  
  function interceptCallGuideAPI() {
    let attempts = 0;
    const maxAttempts = 100;
    
    const checkForAPI = setInterval(() => {
      attempts++;
      
      if (window.CallGuide && window.CallGuide.api && window.CallGuide.api.getQueueStatus) {
        clearInterval(checkForAPI);
        
        const originalGetQueueStatus = window.CallGuide.api.getQueueStatus;
        
        window.CallGuide.api.getQueueStatus = function(param1, queueName) {
          try {
            const result = originalGetQueueStatus.call(this, param1, queueName);
            
            if (result && typeof result.then === 'function') {
              return result.then(data => {
                try {
                  if (data && data.resultData && data.resultData.queueStatus && data.resultData.queueStatus.eqt) {
                  const seconds = data.resultData.queueStatus.eqt;
                  
                  // Only collect phone queue results from expected queues
                  if (expectedPhoneQueues.includes(queueName)) {
                    phoneQueueResults.push(seconds); // Store raw seconds, not minutes
                    
                    // Check if we have all 5 phone queue results
                    if (phoneQueueResults.length === expectedPhoneQueues.length) {
                      // Calculate average exactly like their reducer function
                      const sum = phoneQueueResults.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
                      const averageSeconds = sum / phoneQueueResults.length;
                      const averageMinutes = averageSeconds / 60; // Convert to minutes ONCE
                      
                      // Send average to content script
                      window.postMessage({
                        source: 'af-queue-monitor',
                        minutes: averageMinutes,
                        method: 'api-average'
                      }, '*');
                      
                    }
                  }
                }
              } catch (err) {
                console.error('AF Queue Monitor - API intercept error:', err);
                console.error('Queue name:', queueName, 'Data:', data);
              }
              
              return data;
            }).catch(promiseErr => {
              console.error('AF Queue Monitor - Promise rejection:', promiseErr);
              throw promiseErr; // Re-throw to maintain original behavior
            });
          }
          
          return result;
        } catch (apiErr) {
          console.error('AF Queue Monitor - API call error:', apiErr);
          console.error('Parameters:', param1, queueName);
          throw apiErr; // Re-throw to maintain original behavior
        }
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