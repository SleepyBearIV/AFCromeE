// AF Queue Monitor - Popup JavaScript
// Handles popup interactions and status updates

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 AF Queue Monitor popup loaded');
    
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
            console.log('🚀 Opened Arbetsförmedlingen contact page');
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
    
    // Add some interactive animations
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        });
    });
    
    // Add hover effects to color boxes
    const colorBoxes = document.querySelectorAll('.color-box');
    colorBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Analytics (optional - for development)
    console.log('📊 AF Queue Monitor popup interaction logged');
});