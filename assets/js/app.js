// Gaspin.live Main Application
class GaspinApp {
    constructor() {
        this.userLocation = null;
        this.map = null;
        this.gasStations = [];
        this.markers = [];
        this.infoWindows = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.hideLoadingOverlay();
    }

    bindEvents() {
        const findGasBtn = document.getElementById('findGasBtn');
        if (findGasBtn) {
            findGasBtn.addEventListener('click', () => this.findNearbyGasStations());
        }
    }

    hideLoadingOverlay() {
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }, 1000);
    }

    showLocationStatus(message, isError = false) {
        const locationStatus = document.getElementById('locationStatus');
        const locationText = document.getElementById('locationText');
        
        if (locationStatus && locationText) {
            locationStatus.classList.remove('hidden');
            locationText.textContent = message;
            
            if (isError) {
                locationStatus.style.color = '#ef4444';
            } else {
                locationStatus.style.color = '#10b981';
            }
        }
    }

    async findNearbyGasStations() {
        try {
            this.showLocationStatus(window.languageManager.translate('getting_location'));
            
            // Get user location
            const position = await this.getCurrentPosition();
            this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.showLocationStatus(window.languageManager.translate('location_found'));

            // Simulate finding nearby gas stations (in real implementation, this would call an API)
            await this.searchGasStations();
            
            // Display results
            this.displayGasStations();
            this.initializeMap();

        } catch (error) {
            console.error('Error finding gas stations:', error);
            this.showLocationStatus(window.languageManager.translate('location_error'), true);
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    async searchGasStations() {
        // Simulate API call with mock data
        // In real implementation, this would call a gas station API
        this.gasStations = this.generateMockGasStations();
    }

    generateMockGasStations() {
        const stations = [
            {
                id: 1,
                name: "Shell Station",
                address: "123 Main Street, Downtown",
                distance: 0.3,
                phone: "+1-555-0123",
                isOpen24h: true,
                hasEvCharging: true,
                prices: {
                    regular: 3.45,
                    premium: 3.85,
                    diesel: 3.65
                },
                coordinates: {
                    lat: this.userLocation.lat + 0.002,
                    lng: this.userLocation.lng + 0.001
                }
            },
            {
                id: 2,
                name: "BP Gas Station",
                address: "456 Oak Avenue, Midtown",
                distance: 0.7,
                phone: "+1-555-0456",
                isOpen24h: false,
                hasEvCharging: false,
                prices: {
                    regular: 3.42,
                    premium: 3.82,
                    diesel: 3.62
                },
                coordinates: {
                    lat: this.userLocation.lat - 0.003,
                    lng: this.userLocation.lng + 0.004
                }
            },
            {
                id: 3,
                name: "Chevron Express",
                address: "789 Pine Road, Uptown",
                distance: 1.2,
                phone: "+1-555-0789",
                isOpen24h: true,
                hasEvCharging: true,
                prices: {
                    regular: 3.48,
                    premium: 3.88,
                    diesel: 3.68
                },
                coordinates: {
                    lat: this.userLocation.lat + 0.005,
                    lng: this.userLocation.lng - 0.002
                }
            }
        ];

        // Sort by distance
        return stations.sort((a, b) => a.distance - b.distance);
    }

    displayGasStations() {
        const gasStationsSection = document.getElementById('gasStationsSection');
        const gasStationsList = document.getElementById('gasStationsList');

        if (!gasStationsSection || !gasStationsList) return;

        gasStationsSection.classList.remove('hidden');
        gasStationsList.innerHTML = '';

        this.gasStations.forEach(station => {
            const stationCard = this.createStationCard(station);
            gasStationsList.appendChild(stationCard);
        });
    }

    createStationCard(station) {
        const card = document.createElement('div');
        card.className = 'gas-station-card';
        
        const distanceUnit = window.languageManager.translate('miles');
        const priceUnit = window.languageManager.translate('per_gallon');

        card.innerHTML = `
            <div class="station-header">
                <div class="station-info">
                    <h3>${station.name}</h3>
                    <p class="station-address">${station.address}</p>
                </div>
                <div class="station-distance">${station.distance} ${distanceUnit}</div>
            </div>
            
            <div class="fuel-prices">
                <div class="fuel-price">
                    <div class="fuel-type">${window.languageManager.translate('regular')}</div>
                    <div class="price">$${station.prices.regular}${priceUnit}</div>
                </div>
                <div class="fuel-price">
                    <div class="fuel-type">${window.languageManager.translate('premium')}</div>
                    <div class="price">$${station.prices.premium}${priceUnit}</div>
                </div>
                <div class="fuel-price">
                    <div class="fuel-type">${window.languageManager.translate('diesel')}</div>
                    <div class="price">$${station.prices.diesel}${priceUnit}</div>
                </div>
            </div>
            
            <div class="station-features">
                ${station.isOpen24h ? `<span class="feature-badge"><i class="fas fa-clock"></i> ${window.languageManager.translate('open_24h')}</span>` : ''}
                ${station.hasEvCharging ? `<span class="feature-badge ev-charging"><i class="fas fa-bolt"></i> ${window.languageManager.translate('ev_charging')}</span>` : ''}
            </div>
            
            <div class="station-actions">
                <button class="btn-directions" onclick="gaspinApp.getDirections(${station.coordinates.lat}, ${station.coordinates.lng})">
                    <i class="fas fa-route"></i> ${window.languageManager.translate('directions')}
                </button>
                <button class="btn-call" onclick="gaspinApp.callStation('${station.phone}')">
                    <i class="fas fa-phone"></i> ${window.languageManager.translate('call')}
                </button>
            </div>
        `;

        return card;
    }

    getDirections(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    }

    callStation(phone) {
        window.location.href = `tel:${phone}`;
    }

    initializeMap() {
        const mapSection = document.getElementById('mapSection');
        if (mapSection) {
            mapSection.classList.remove('hidden');
        }

        // Initialize map when Google Maps API is loaded
        if (typeof google !== 'undefined' && google.maps) {
            this.createMap();
        } else {
            // Wait for Google Maps API to load
            window.initMap = () => this.createMap();
        }
    }

    createMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || !this.userLocation) return;

        // Create map
        this.map = new google.maps.Map(mapContainer, {
            center: this.userLocation,
            zoom: 14,
            styles: [
                {
                    featureType: 'poi.business',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Add user location marker
        new google.maps.Marker({
            position: this.userLocation,
            map: this.map,
            title: 'Your Location',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            }
        });

        // Add gas station markers
        this.gasStations.forEach((station, index) => {
            const marker = new google.maps.Marker({
                position: station.coordinates,
                map: this.map,
                title: station.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="14" fill="#f97316" stroke="#ffffff" stroke-width="2"/>
                            <path d="M12 10h4v8h-4v-8zm6 2h2v6h-2v-6zm-6 10h8v2h-8v-2z" fill="#ffffff"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16)
                }
            });

            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: this.createInfoWindowContent(station)
            });

            // Add click listener
            marker.addListener('click', () => {
                // Close all other info windows
                this.infoWindows.forEach(iw => iw.close());
                infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
            this.infoWindows.push(infoWindow);
        });
    }

    createInfoWindowContent(station) {
        const distanceUnit = window.languageManager.translate('miles');
        const priceUnit = window.languageManager.translate('per_gallon');

        return `
            <div style="max-width: 250px; font-family: 'Inter', sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">${station.name}</h3>
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">${station.address}</p>
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">${station.distance} ${distanceUnit} away</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                    <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 6px;">
                        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">${window.languageManager.translate('regular')}</div>
                        <div style="font-size: 14px; font-weight: 600; color: #1e293b;">$${station.prices.regular}</div>
                    </div>
                    <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 6px;">
                        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">${window.languageManager.translate('premium')}</div>
                        <div style="font-size: 14px; font-weight: 600; color: #1e293b;">$${station.prices.premium}</div>
                    </div>
                    <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 6px;">
                        <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">${window.languageManager.translate('diesel')}</div>
                        <div style="font-size: 14px; font-weight: 600; color: #1e293b;">$${station.prices.diesel}</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    ${station.isOpen24h ? `<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 12px; font-size: 12px;">24/7</span>` : ''}
                    ${station.hasEvCharging ? `<span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 12px; font-size: 12px;">EV</span>` : ''}
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button onclick="gaspinApp.getDirections(${station.coordinates.lat}, ${station.coordinates.lng})" 
                            style="flex: 1; background: #2563eb; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                        ${window.languageManager.translate('directions')}
                    </button>
                    <button onclick="gaspinApp.callStation('${station.phone}')" 
                            style="flex: 1; background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                        ${window.languageManager.translate('call')}
                    </button>
                </div>
            </div>
        `;
    }
}

// Global map initialization function for Google Maps API
function initMap() {
    if (window.gaspinApp && window.gaspinApp.userLocation) {
        window.gaspinApp.createMap();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gaspinApp = new GaspinApp();
});

// Handle Google Maps API load errors
window.gm_authFailure = function() {
    console.error('Google Maps API authentication failed. Please check your API key.');
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8fafc; border-radius: 16px; color: #64748b;">
                <div style="text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #f59e0b;"></i>
                    <p>Map unavailable. Please check Google Maps API configuration.</p>
                </div>
            </div>
        `;
    }
};

