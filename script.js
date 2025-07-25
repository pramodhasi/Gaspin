// Global variables
let map;
let userLocation = null;
let gasStations = [];
let markers = [];

// API Configuration
const API_CONFIG = {
    // CollectAPI for gas prices (you'll need to get an API key)
    COLLECT_API_KEY: 'YOUR_COLLECT_API_KEY',
    COLLECT_API_BASE: 'https://api.collectapi.com/gasPrice',
    
    // Google Maps API key (already included in HTML)
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY'
};

// Sample data for demonstration (replace with real API calls)
const SAMPLE_GAS_STATIONS = [
    {
        id: 1,
        name: "Shell Station",
        address: "123 Main St, Anytown, USA",
        distance: 0.5,
        lat: 40.7128,
        lng: -74.0060,
        prices: {
            regular: 3.45,
            midgrade: 3.65,
            premium: 3.85,
            diesel: 3.55
        },
        evCharging: {
            available: true,
            connectors: ['CCS', 'CHAdeMO'],
            maxSpeed: 150,
            price: 0.35
        },
        amenities: ['convenience_store', 'restrooms', 'atm', 'car_wash'],
        phone: "(555) 123-4567",
        hours: "24/7"
    },
    {
        id: 2,
        name: "Exxon Mobile",
        address: "456 Oak Ave, Anytown, USA",
        distance: 0.8,
        lat: 40.7589,
        lng: -73.9851,
        prices: {
            regular: 3.42,
            midgrade: 3.62,
            premium: 3.82,
            diesel: 3.52
        },
        evCharging: {
            available: false
        },
        amenities: ['convenience_store', 'restrooms', 'food_service'],
        phone: "(555) 234-5678",
        hours: "6:00 AM - 10:00 PM"
    },
    {
        id: 3,
        name: "BP Gas Station",
        address: "789 Pine St, Anytown, USA",
        distance: 1.2,
        lat: 40.7505,
        lng: -73.9934,
        prices: {
            regular: 3.48,
            midgrade: 3.68,
            premium: 3.88,
            diesel: 3.58
        },
        evCharging: {
            available: true,
            connectors: ['Type2', 'CCS'],
            maxSpeed: 75,
            price: 0.32
        },
        amenities: ['convenience_store', 'restrooms', 'atm', 'wifi'],
        phone: "(555) 345-6789",
        hours: "5:00 AM - 11:00 PM"
    }
];

// DOM Elements
const findGasBtn = document.getElementById('findGasBtn');
const searchLocationBtn = document.getElementById('searchLocationBtn');
const locationInput = document.getElementById('locationInput');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const mapSection = document.getElementById('mapSection');
const resultsGrid = document.getElementById('resultsGrid');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

findGasBtn.addEventListener('click', function() {
    findNearbyGasStations();
});

searchLocationBtn.addEventListener('click', function() {
    const location = locationInput.value.trim();
    if (location) {
        searchByLocation(location);
    }
});

locationInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            searchByLocation(location);
        }
    }
});

// Initialize the application
function initializeApp() {
    console.log('Gaspin.live initialized');
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }
    
    // Initialize Google Maps when API is loaded
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    }
}

// Initialize Google Maps
function initMap() {
    // Default location (New York City)
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: defaultLocation,
        styles: [
            {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.gas_station',
                stylers: [{ visibility: 'on' }]
            }
        ]
    });
}

// Get user's current location
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                userLocation = location;
                resolve(location);
            },
            (error) => {
                console.error('Geolocation error:', error);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

// Find nearby gas stations using current location
async function findNearbyGasStations() {
    showLoading();
    
    try {
        // Get user's current location
        const location = await getCurrentLocation();
        console.log('User location:', location);
        
        // Fetch nearby gas stations
        const stations = await fetchNearbyGasStations(location.lat, location.lng);
        
        // Display results
        displayGasStations(stations);
        updateMap(location, stations);
        
        hideLoading();
        showResults();
        
    } catch (error) {
        console.error('Error finding gas stations:', error);
        hideLoading();
        showError('Unable to find your location. Please try entering your address manually.');
    }
}

// Search by location (address, city, ZIP code)
async function searchByLocation(locationQuery) {
    showLoading();
    
    try {
        // Geocode the location
        const location = await geocodeLocation(locationQuery);
        console.log('Geocoded location:', location);
        
        // Fetch nearby gas stations
        const stations = await fetchNearbyGasStations(location.lat, location.lng);
        
        // Display results
        displayGasStations(stations);
        updateMap(location, stations);
        
        hideLoading();
        showResults();
        
    } catch (error) {
        console.error('Error searching location:', error);
        hideLoading();
        showError('Unable to find the specified location. Please try a different address.');
    }
}

// Geocode location using Google Maps API
function geocodeLocation(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng()
                });
            } else {
                reject(new Error('Geocoding failed: ' + status));
            }
        });
    });
}

// Fetch nearby gas stations (using sample data for now)
async function fetchNearbyGasStations(lat, lng) {
    // In a real implementation, you would call actual APIs here
    // For now, we'll use sample data and simulate API delay
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    // Calculate distances and sort by proximity
    const stationsWithDistance = SAMPLE_GAS_STATIONS.map(station => {
        const distance = calculateDistance(lat, lng, station.lat, station.lng);
        return {
            ...station,
            distance: distance
        };
    }).sort((a, b) => a.distance - b.distance);
    
    gasStations = stationsWithDistance.slice(0, 3); // Return top 3 closest stations
    return gasStations;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Display gas stations in the results grid
function displayGasStations(stations) {
    resultsGrid.innerHTML = '';
    
    stations.forEach(station => {
        const stationCard = createStationCard(station);
        resultsGrid.appendChild(stationCard);
    });
}

// Create a station card element
function createStationCard(station) {
    const card = document.createElement('div');
    card.className = 'station-card';
    
    const fuelPricesHTML = Object.entries(station.prices)
        .map(([type, price]) => `
            <div class="fuel-price">
                <span class="fuel-type">${formatFuelType(type)}</span>
                <span class="price">$${price.toFixed(3)}</span>
            </div>
        `).join('');
    
    const evChargingHTML = station.evCharging.available ? `
        <div class="ev-charging available">
            <span>⚡</span>
            <span>EV Charging: ${station.evCharging.connectors.join(', ')} - ${station.evCharging.maxSpeed}kW - $${station.evCharging.price}/kWh</span>
        </div>
    ` : `
        <div class="ev-charging unavailable">
            <span>❌</span>
            <span>No EV Charging Available</span>
        </div>
    `;
    
    card.innerHTML = `
        <div class="station-header">
            <h3 class="station-name">${station.name}</h3>
            <span class="station-distance">${station.distance} mi</span>
        </div>
        <p class="station-address">${station.address}</p>
        <div class="fuel-prices">
            ${fuelPricesHTML}
        </div>
        ${evChargingHTML}
        <div class="station-actions">
            <button class="btn btn-directions" onclick="getDirections(${station.lat}, ${station.lng}, '${station.name}')">
                🗺️ Get Directions
            </button>
            <button class="btn btn-details" onclick="showStationDetails(${station.id})">
                ℹ️ Details
            </button>
        </div>
    `;
    
    return card;
}

// Format fuel type for display
function formatFuelType(type) {
    const typeMap = {
        regular: 'Regular',
        midgrade: 'Mid-Grade',
        premium: 'Premium',
        diesel: 'Diesel',
        e85: 'E85'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

// Update map with user location and gas stations
function updateMap(userLocation, stations) {
    if (!map) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Center map on user location
    map.setCenter(userLocation);
    map.setZoom(13);
    
    // Add user location marker
    const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
        }
    });
    markers.push(userMarker);
    
    // Add gas station markers
    stations.forEach((station, index) => {
        const marker = new google.maps.Marker({
            position: { lat: station.lat, lng: station.lng },
            map: map,
            title: station.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8V2z" fill="#059669"/>
                        <path d="M14 2v20l6-2V4l-6-2z" fill="#047857"/>
                        <circle cx="10" cy="8" r="2" fill="white"/>
                        <text x="10" y="18" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${index + 1}</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        
        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 250px;">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b;">${station.name}</h4>
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">${station.address}</p>
                    <p style="margin: 0 0 8px 0; color: #059669; font-weight: 600;">Regular: $${station.prices.regular.toFixed(3)}</p>
                    <button onclick="getDirections(${station.lat}, ${station.lng}, '${station.name}')" 
                            style="background: #059669; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                        Get Directions
                    </button>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            // Close all other info windows
            markers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });
            infoWindow.open(map, marker);
        });
        
        marker.infoWindow = infoWindow;
        markers.push(marker);
    });
}

// Get directions to a gas station
function getDirections(lat, lng, stationName) {
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${encodeURIComponent(stationName)}`;
    window.open(url, '_blank');
}

// Show station details (placeholder for future implementation)
function showStationDetails(stationId) {
    const station = gasStations.find(s => s.id === stationId);
    if (station) {
        alert(`Station Details:\n\nName: ${station.name}\nAddress: ${station.address}\nPhone: ${station.phone}\nHours: ${station.hours}\n\nAmenities: ${station.amenities.join(', ')}`);
    }
}

// UI Helper Functions
function showLoading() {
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    mapSection.style.display = 'none';
}

function hideLoading() {
    loadingSection.style.display = 'none';
}

function showResults() {
    resultsSection.style.display = 'block';
    mapSection.style.display = 'block';
    
    // Smooth scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fef2f2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border: 1px solid #fecaca;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    // Insert after hero section
    const heroSection = document.querySelector('.hero');
    heroSection.parentNode.insertBefore(errorDiv, heroSection.nextSibling);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active navigation link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Initialize Google Maps callback
window.initMap = initMap;

