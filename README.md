# WorldGuessr Coordinates Extension

A Chrome extension that shows the exact location of WorldGuessr points on a map.

## Features

- Automatically detects coordinates from WorldGuessr game pages
- Shows both satellite imagery and street map overlay
- Displays a marker at the exact location
- Shows coordinates when hovering over the marker
- Reload button to refresh coordinates
- Works on any WorldGuessr game page

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension files

## Usage

1. Go to a WorldGuessr game page
2. Click the extension icon in your Chrome toolbar
3. The popup will show a map with the exact location
4. Hover over the marker to see the coordinates
5. Use the reload button if the coordinates don't load automatically

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Main popup interface
- `popup.js` - Coordinate detection and map handling
- `leaflet.js` - Custom map implementation
- `leaflet.css` - Map styling

## Technical Details

- Uses a custom implementation of map display to work within Chrome extension restrictions
- Extracts coordinates from the WorldGuessr iframe
- Combines satellite imagery with street map overlay for better location recognition
- Built with Manifest V3 specifications

## Privacy

This extension:
- Only activates on WorldGuessr game pages
- Does not collect any user data
- Does not send data to any external servers
- Only reads coordinates from the game page

## License

MIT License - Feel free to modify and distribute as needed.

## Support

If you encounter any issues or have suggestions:
1. Make sure you're on a WorldGuessr game page
2. Check that the coordinates are visible in the game
3. Try using the reload button
4. If issues persist, check the console for error messages
 
