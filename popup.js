let map;
let marker;
let coordinates = null;
let debugElement;

function debug(message) {
    if (!debugElement) {
        debugElement = document.getElementById('debug');
    }
    debugElement.innerHTML = message;
}

async function injectContentScriptAndGetCoordinates() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        debug('Injecting content script...');
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: function() {
                console.log('Extracting coordinates...');
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
                }
                return null;
            }
        });
        
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: function() {
                const iframe = document.evaluate('/html/body/div/main/div[1]/iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (iframe) {
                    const src = iframe.getAttribute('src');
                    if (src) {
                        const urlParams = new URLSearchParams('?' + src.split('?')[1]);
                        const lat = urlParams.get('lat');
                        const long = urlParams.get('long');
                        if (lat && long) {
                            return {
                                lat: parseFloat(lat),
                                lng: parseFloat(long)
                            };
                        }
                    }
                }
                return null;
            }
        });
        
        if (results && results[0] && results[0].result) {
            coordinates = results[0].result;
            debug('Coordinates found: ' + JSON.stringify(coordinates));
            if (!map) {
                initMap();
            } else {
                updateMap();
            }
            // Enable the open window button
            document.getElementById('openWindow').disabled = false;
        } else {
            debug('No coordinates found in the page');
            showNoCoordinates();
            // Disable the open window button
            document.getElementById('openWindow').disabled = true;
        }
    } catch (error) {
        debug('Error: ' + error.message);
        showNoCoordinates();
        // Disable the open window button
        document.getElementById('openWindow').disabled = true;
    }
}

function initMap() {
    debug('Initializing map...');
    // Default to Paris if no coordinates are available yet
    const defaultLocation = { lat: 48.8566, lng: 2.3522 };
    const location = coordinates || defaultLocation;
    
    try {
        map = L.map('map').setView([location.lat, location.lng], 15);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            opacity: 0.3
        }).addTo(map);
        if (coordinates) {
            updateMap();
        }
        debug('Map initialized successfully');
    } catch (error) {
        debug('Error initializing map: ' + error.message);
    }
}

function updateMap() {
    if (!coordinates) {
        debug('No coordinates available for update');
        return;
    }
    
    try {
        map.setView([coordinates.lat, coordinates.lng], 15);
        
        if (marker) {
            map.removeLayer(marker);
        }
        
        marker = L.marker([coordinates.lat, coordinates.lng])
            .bindPopup(`Lat: ${coordinates.lat}<br>Lng: ${coordinates.lng}`)
            .addTo(map);
            
        debug('Map updated with new coordinates');
    } catch (error) {
        debug('Error updating map: ' + error.message);
    }
}

function showNoCoordinates() {
    document.getElementById('map').style.display = 'none';
    document.getElementById('no-coordinates').style.display = 'block';
}

// Add reload button functionality
document.getElementById('reload').addEventListener('click', function() {
    debug('Reloading...');
    injectContentScriptAndGetCoordinates();
});

// Add open window button functionality
document.getElementById('openWindow').addEventListener('click', function() {
    if (coordinates) {
        const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no';
        window.open(`map.html?lat=${coordinates.lat}&lng=${coordinates.lng}`, 'WorldGuessrMap', windowFeatures);
    }
});

// Initialize on load
debug('Extension popup opened');
injectContentScriptAndGetCoordinates(); 