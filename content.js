// Log that content script is loaded
console.log('WorldGuessr Coordinates content script loaded');

function extractCoordinates() {
    console.log('Attempting to extract coordinates...');
    const iframe = document.evaluate('/html/body/div/main/div[1]/iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    if (iframe) {
        console.log('Found iframe:', iframe);
        const src = iframe.getAttribute('src');
        console.log('Iframe src:', src);
        
        if (src) {
            const urlParams = new URLSearchParams('?' + src.split('?')[1]);
            const lat = urlParams.get('lat');
            const long = urlParams.get('long');
            
            console.log('Extracted coordinates:', { lat, long });
            
            if (lat && long) {
                return {
                    lat: parseFloat(lat),
                    lng: parseFloat(long)
                };
            }
        }
    } else {
        console.log('No iframe found with the specified XPath');
    }
    return null;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    
    if (request.type === "GET_COORDINATES") {
        const coordinates = extractCoordinates();
        console.log('Sending response with coordinates:', coordinates);
        sendResponse({ coordinates: coordinates });
    }
    
    // Required for async response
    return true;
});

// Initial check for coordinates
const initialCoords = extractCoordinates();
if (initialCoords) {
    console.log('Initial coordinates found:', initialCoords);
}

// Set up a mutation observer to detect when the iframe might be added dynamically
const observer = new MutationObserver((mutations) => {
    console.log('DOM mutation detected, checking for coordinates');
    const coordinates = extractCoordinates();
    if (coordinates) {
        console.log('Coordinates found after DOM mutation:', coordinates);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
}); 