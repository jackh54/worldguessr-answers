/* Simplified Leaflet implementation */
(function(window) {
    window.L = {
        map: function(id) {
            return new L.Map(id);
        },
        
        tileLayer: function(url, options) {
            return new L.TileLayer(url, options);
        },
        
        marker: function(latlng) {
            return new L.Marker(latlng);
        },
        
        Map: class {
            constructor(id) {
                this.container = typeof id === 'string' ? document.getElementById(id) : id;
                this.container.style.position = 'relative';
                this._layers = [];
                this._zoom = 15;
                this._center = null;
                this._markers = [];
            }
            
            setView(center, zoom) {
                this._center = center;
                this._zoom = zoom || this._zoom;
                this._updateView();
                return this;
            }
            
            addLayer(layer) {
                layer.addTo(this);
                this._layers.push(layer);
                return this;
            }
            
            removeLayer(layer) {
                const index = this._layers.indexOf(layer);
                if (index > -1) {
                    layer.remove();
                    this._layers.splice(index, 1);
                }
            }
            
            _updateView() {
                this._layers.forEach(layer => layer.update(this._center, this._zoom));
            }
        },
        
        TileLayer: class {
            constructor(url, options) {
                this._url = url;
                this._options = options || {};
            }
            
            addTo(map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.style.position = 'absolute';
                this._container.style.width = '100%';
                this._container.style.height = '100%';
                this._container.style.zIndex = '100';
                map.container.appendChild(this._container);
                
                // Create an iframe for the tile layer
                this._iframe = document.createElement('iframe');
                this._iframe.style.width = '100%';
                this._iframe.style.height = '100%';
                this._iframe.style.border = 'none';
                this._container.appendChild(this._iframe);
                
                this.update(map._center, map._zoom);
                return this;
            }
            
            update(center, zoom) {
                if (center && this._iframe) {
                        const url = `https://www.openstreetmap.org/export/embed.html`
                            + `?bbox=${center[1]-0.01},${center[0]-0.01},${center[1]+0.01},${center[0]+0.01}`
                            + `&layer=mapnik&marker=${center[0]},${center[1]}`
                            + `&lang=en`;
                        this._iframe.src = url;

                }
            }
            
            remove() {
                if (this._container && this._container.parentNode) {
                    this._container.parentNode.removeChild(this._container);
                }
            }
        },
        
        Marker: class {
            constructor(latlng) {
                this._latlng = latlng;
                this._map = null;
                this._container = null;
            }
            
            addTo(map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.style.position = 'absolute';
                this._container.style.width = '20px';
                this._container.style.height = '20px';
                this._container.style.marginLeft = '-10px';
                this._container.style.marginTop = '-20px';
                this._container.style.zIndex = '1000';
                this._container.innerHTML = `
                    <svg viewBox="0 0 24 24" style="width: 100%; height: 100%;">
                        <path fill="red" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        <circle fill="white" cx="12" cy="9" r="2.5"/>
                    </svg>
                `;
                
                if (this._popupContent) {
                    const popup = document.createElement('div');
                    popup.style.position = 'absolute';
                    popup.style.backgroundColor = 'white';
                    popup.style.padding = '5px';
                    popup.style.borderRadius = '3px';
                    popup.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
                    popup.style.bottom = '25px';
                    popup.style.left = '50%';
                    popup.style.transform = 'translateX(-50%)';
                    popup.style.display = 'none';
                    popup.innerHTML = this._popupContent;
                    
                    this._container.addEventListener('mouseenter', () => {
                        popup.style.display = 'block';
                    });
                    
                    this._container.addEventListener('mouseleave', () => {
                        popup.style.display = 'none';
                    });
                    
                    this._container.appendChild(popup);
                }
                
                map.container.appendChild(this._container);
                return this;
            }
            
            bindPopup(content) {
                this._popupContent = content;
                return this;
            }
            
            remove() {
                if (this._container && this._container.parentNode) {
                    this._container.parentNode.removeChild(this._container);
                }
            }
        }
    };
})(window); 