let map;
let marker;

// Get coordinates from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const lat = parseFloat(urlParams.get('lat'));
const lng = parseFloat(urlParams.get('lng'));

function initMap() {
    if (!lat || !lng) {
        document.body.innerHTML = '<div style="padding: 20px; text-align: center;">No coordinates provided</div>';
        return;
    }

    // Show coordinates in the bottom bar
    document.getElementById('coordinates').textContent = `Latitude: ${lat}, Longitude: ${lng}`;

    // Initialize map
    map = L.map('map').setView([lat, lng], 15);
    
    // Add the OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        opacity: 0.7
    }).addTo(map);
    
    // Add marker
    marker = L.marker([lat, lng])
        .bindPopup(`Lat: ${lat}<br>Lng: ${lng}`)
        .addTo(map);
}

// Initialize when the page loads
window.addEventListener('load', initMap); 