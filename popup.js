// AF Queue Monitor - Popup JavaScript
// Handles popup interactions and status updates

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const openAFButton = document.getElementById('openAF');
    const statusElement = document.getElementById('status');
    
    // Handle "Open Arbetsförmedlingen" button click
    openAFButton.addEventListener('click', function() {
        const url = 'https://arbetsformedlingen.se/kontakt/for-arbetssokande';
        
        // Animate button
        openAFButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            openAFButton.style.transform = 'scale(1)';
        }, 150);
        
        // Open the page
        chrome.tabs.create({ url: url }, function(tab) {
            // Close popup after opening
            window.close();
        });
    });
    
    // Check extension status
    function checkExtensionStatus() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const currentTab = tabs[0];
            
            if (currentTab && currentTab.url) {
                if (currentTab.url.includes('arbetsformedlingen.se')) {
                    if (currentTab.url.includes('/kontakt')) {
                        statusElement.textContent = 'Aktiv och redo';
                        statusElement.style.color = '#10b981';
                    } else {
                        statusElement.textContent = 'Redo (gå till kontaktsidan)';
                        statusElement.style.color = '#f59e0b';
                    }
                } else {
                    statusElement.textContent = 'Väntar (besök Arbetsförmedlingen)';
                    statusElement.style.color = '#6b7280';
                }
            }
        });
    }
    
    // Check status on popup open
    checkExtensionStatus();
});