// Admin Panel JavaScript for Gaspin.live
// Handles authentication, data management, and form submissions for gas station owners

// Global variables
let currentStation = null;
let isLoggedIn = false;

// Sample station data (in a real app, this would come from a database)
const STATION_DATABASE = {
    'SHELL001': {
        id: 'SHELL001',
        password: 'demo123',
        name: 'Shell Station Downtown',
        address: '123 Main St, Anytown, USA 12345',
        phone: '(555) 123-4567',
        operatingHours: '24/7',
        prices: {
            regular: 3.45,
            midgrade: 3.65,
            premium: 3.85,
            diesel: 3.55,
            e85: 3.25,
            lpg: 2.95
        },
        evCharging: {
            available: true,
            chargerCount: 4,
            connectorTypes: ['CCS', 'CHAdeMO', 'Type2'],
            maxChargingSpeed: 150,
            chargingPrice: 0.35
        },
        amenities: ['convenience_store', 'restrooms', 'atm', 'car_wash', 'wifi'],
        lastUpdated: {
            prices: new Date('2025-01-15T10:30:00'),
            info: new Date('2025-01-10T14:20:00'),
            evCharging: new Date('2025-01-12T09:15:00'),
            amenities: new Date('2025-01-08T16:45:00')
        }
    },
    'EXXON002': {
        id: 'EXXON002',
        password: 'demo456',
        name: 'Exxon Mobile Express',
        address: '456 Oak Ave, Anytown, USA 12345',
        phone: '(555) 234-5678',
        operatingHours: '6:00 AM - 10:00 PM',
        prices: {
            regular: 3.42,
            midgrade: 3.62,
            premium: 3.82,
            diesel: 3.52,
            e85: 0,
            lpg: 0
        },
        evCharging: {
            available: false,
            chargerCount: 0,
            connectorTypes: [],
            maxChargingSpeed: 0,
            chargingPrice: 0
        },
        amenities: ['convenience_store', 'restrooms', 'food_service', '24_hour'],
        lastUpdated: {
            prices: new Date('2025-01-14T15:45:00'),
            info: new Date('2025-01-05T11:30:00'),
            evCharging: new Date('2025-01-01T00:00:00'),
            amenities: new Date('2025-01-03T13:20:00')
        }
    }
};

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// Station info elements
const stationInfo = document.getElementById('stationInfo');
const stationName = document.getElementById('stationName');
const stationAddress = document.getElementById('stationAddress');

// Form elements
const fuelPricesForm = document.getElementById('fuelPricesForm');
const stationInfoForm = document.getElementById('stationInfoForm');
const evChargingForm = document.getElementById('evChargingForm');
const amenitiesForm = document.getElementById('amenitiesForm');

// Last updated elements
const pricesLastUpdated = document.getElementById('pricesLastUpdated');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
});

logoutBtn.addEventListener('click', function() {
    handleLogout();
});

fuelPricesForm.addEventListener('submit', function(e) {
    e.preventDefault();
    updateFuelPrices();
});

stationInfoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    updateStationInfo();
});

evChargingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    updateEvChargingInfo();
});

amenitiesForm.addEventListener('submit', function(e) {
    e.preventDefault();
    updateAmenities();
});

// EV charging checkbox handler
document.getElementById('hasEvCharging').addEventListener('change', function() {
    const evDetails = document.getElementById('evDetails');
    evDetails.style.display = this.checked ? 'block' : 'none';
});

// Initialize admin panel
function initializeAdmin() {
    console.log('Admin panel initialized');
    
    // Check if user is already logged in (in a real app, check session/token)
    const savedSession = localStorage.getItem('gaspin_admin_session');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            if (session.stationId && STATION_DATABASE[session.stationId]) {
                currentStation = STATION_DATABASE[session.stationId];
                isLoggedIn = true;
                showDashboard();
            }
        } catch (error) {
            console.error('Invalid session data:', error);
            localStorage.removeItem('gaspin_admin_session');
        }
    }
}

// Handle login
function handleLogin() {
    const stationId = document.getElementById('stationId').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    
    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        if (STATION_DATABASE[stationId] && STATION_DATABASE[stationId].password === password) {
            // Successful login
            currentStation = STATION_DATABASE[stationId];
            isLoggedIn = true;
            
            // Save session (in a real app, use secure tokens)
            localStorage.setItem('gaspin_admin_session', JSON.stringify({ stationId }));
            
            showSuccess('Login successful! Welcome back.');
            showDashboard();
        } else {
            // Failed login
            showError('Invalid Station ID or password. Please try again.');
        }
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Handle logout
function handleLogout() {
    currentStation = null;
    isLoggedIn = false;
    localStorage.removeItem('gaspin_admin_session');
    
    // Reset forms
    loginForm.reset();
    resetAllForms();
    
    // Show login section
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    
    showSuccess('You have been logged out successfully.');
}

// Show dashboard
function showDashboard() {
    if (!currentStation) return;
    
    // Hide login, show dashboard
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    
    // Populate station information
    populateStationInfo();
    populateFuelPrices();
    populateEvChargingInfo();
    populateAmenities();
    updateLastUpdatedTimes();
}

// Populate station information
function populateStationInfo() {
    stationName.textContent = currentStation.name;
    stationAddress.textContent = currentStation.address;
    
    // Populate station info form
    document.getElementById('stationNameInput').value = currentStation.name;
    document.getElementById('stationAddressInput').value = currentStation.address;
    document.getElementById('phoneNumber').value = currentStation.phone;
    document.getElementById('operatingHours').value = currentStation.operatingHours;
}

// Populate fuel prices
function populateFuelPrices() {
    const prices = currentStation.prices;
    
    document.getElementById('regularPrice').value = prices.regular || '';
    document.getElementById('midgradePrice').value = prices.midgrade || '';
    document.getElementById('premiumPrice').value = prices.premium || '';
    document.getElementById('dieselPrice').value = prices.diesel || '';
    document.getElementById('e85Price').value = prices.e85 || '';
    document.getElementById('lpgPrice').value = prices.lpg || '';
}

// Populate EV charging information
function populateEvChargingInfo() {
    const evCharging = currentStation.evCharging;
    
    document.getElementById('hasEvCharging').checked = evCharging.available;
    document.getElementById('evDetails').style.display = evCharging.available ? 'block' : 'none';
    
    if (evCharging.available) {
        document.getElementById('evChargerCount').value = evCharging.chargerCount;
        document.getElementById('maxChargingSpeed').value = evCharging.maxChargingSpeed;
        document.getElementById('chargingPrice').value = evCharging.chargingPrice;
        
        // Set connector types
        const connectorCheckboxes = document.querySelectorAll('input[name="connectorTypes"]');
        connectorCheckboxes.forEach(checkbox => {
            checkbox.checked = evCharging.connectorTypes.includes(checkbox.value);
        });
    }
}

// Populate amenities
function populateAmenities() {
    const amenities = currentStation.amenities;
    
    const amenityCheckboxes = document.querySelectorAll('input[name="amenities"]');
    amenityCheckboxes.forEach(checkbox => {
        checkbox.checked = amenities.includes(checkbox.value);
    });
}

// Update last updated times
function updateLastUpdatedTimes() {
    const lastUpdated = currentStation.lastUpdated;
    
    if (lastUpdated.prices) {
        pricesLastUpdated.textContent = `Last updated: ${formatDateTime(lastUpdated.prices)}`;
    }
}

// Update fuel prices
function updateFuelPrices() {
    const formData = new FormData(fuelPricesForm);
    const submitBtn = fuelPricesForm.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update prices
        currentStation.prices = {
            regular: parseFloat(formData.get('regularPrice')) || 0,
            midgrade: parseFloat(formData.get('midgradePrice')) || 0,
            premium: parseFloat(formData.get('premiumPrice')) || 0,
            diesel: parseFloat(formData.get('dieselPrice')) || 0,
            e85: parseFloat(formData.get('e85Price')) || 0,
            lpg: parseFloat(formData.get('lpgPrice')) || 0
        };
        
        // Update timestamp
        currentStation.lastUpdated.prices = new Date();
        
        // Update display
        updateLastUpdatedTimes();
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        showSuccess('Fuel prices updated successfully!');
    }, 1500);
}

// Update station information
function updateStationInfo() {
    const formData = new FormData(stationInfoForm);
    const submitBtn = stationInfoForm.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update station info
        currentStation.name = formData.get('stationName');
        currentStation.address = formData.get('stationAddress');
        currentStation.phone = formData.get('phoneNumber');
        currentStation.operatingHours = formData.get('operatingHours');
        
        // Update timestamp
        currentStation.lastUpdated.info = new Date();
        
        // Update display
        stationName.textContent = currentStation.name;
        stationAddress.textContent = currentStation.address;
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        showSuccess('Station information updated successfully!');
    }, 1500);
}

// Update EV charging information
function updateEvChargingInfo() {
    const formData = new FormData(evChargingForm);
    const submitBtn = evChargingForm.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const hasEvCharging = formData.get('hasEvCharging') === 'on';
        
        currentStation.evCharging = {
            available: hasEvCharging,
            chargerCount: hasEvCharging ? parseInt(formData.get('evChargerCount')) || 0 : 0,
            connectorTypes: hasEvCharging ? formData.getAll('connectorTypes') : [],
            maxChargingSpeed: hasEvCharging ? parseInt(formData.get('maxChargingSpeed')) || 0 : 0,
            chargingPrice: hasEvCharging ? parseFloat(formData.get('chargingPrice')) || 0 : 0
        };
        
        // Update timestamp
        currentStation.lastUpdated.evCharging = new Date();
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        showSuccess('EV charging information updated successfully!');
    }, 1500);
}

// Update amenities
function updateAmenities() {
    const formData = new FormData(amenitiesForm);
    const submitBtn = amenitiesForm.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update amenities
        currentStation.amenities = formData.getAll('amenities');
        
        // Update timestamp
        currentStation.lastUpdated.amenities = new Date();
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        showSuccess('Station amenities updated successfully!');
    }, 1500);
}

// Reset all forms
function resetAllForms() {
    fuelPricesForm.reset();
    stationInfoForm.reset();
    evChargingForm.reset();
    amenitiesForm.reset();
    document.getElementById('evDetails').style.display = 'none';
}

// Utility Functions
function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message at the top of the main content
    const mainContent = document.querySelector('.admin-main');
    const firstChild = mainContent.firstElementChild;
    mainContent.insertBefore(messageDiv, firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
    
    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Demo credentials helper
function showDemoCredentials() {
    const demoInfo = `
Demo Station Credentials:

Station ID: SHELL001
Password: demo123

Station ID: EXXON002  
Password: demo456

These are demo accounts for testing purposes.
    `;
    
    alert(demoInfo);
}

// Add demo credentials link to login form
document.addEventListener('DOMContentLoaded', function() {
    const loginHelp = document.querySelector('.login-help');
    if (loginHelp) {
        const demoLink = document.createElement('p');
        demoLink.innerHTML = '<a href="#" onclick="showDemoCredentials(); return false;">View Demo Credentials</a>';
        demoLink.style.marginTop = '10px';
        loginHelp.appendChild(demoLink);
    }
});

// Auto-save functionality (optional)
function enableAutoSave() {
    const forms = [fuelPricesForm, stationInfoForm, evChargingForm, amenitiesForm];
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                // Save to localStorage as draft
                const formData = new FormData(form);
                const draftKey = `gaspin_draft_${form.id}_${currentStation.id}`;
                const draftData = {};
                
                for (let [key, value] of formData.entries()) {
                    draftData[key] = value;
                }
                
                localStorage.setItem(draftKey, JSON.stringify(draftData));
            });
        });
    });
}

// Load drafts (optional)
function loadDrafts() {
    if (!currentStation) return;
    
    const forms = [fuelPricesForm, stationInfoForm, evChargingForm, amenitiesForm];
    
    forms.forEach(form => {
        const draftKey = `gaspin_draft_${form.id}_${currentStation.id}`;
        const draftData = localStorage.getItem(draftKey);
        
        if (draftData) {
            try {
                const data = JSON.parse(draftData);
                Object.entries(data).forEach(([key, value]) => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = value === 'on';
                        } else {
                            input.value = value;
                        }
                    }
                });
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    });
}

// Clear drafts after successful submission
function clearDrafts(formId) {
    if (!currentStation) return;
    
    const draftKey = `gaspin_draft_${formId}_${currentStation.id}`;
    localStorage.removeItem(draftKey);
}

// Export station data (for backup/reporting)
function exportStationData() {
    if (!currentStation) return;
    
    const dataStr = JSON.stringify(currentStation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${currentStation.id}_station_data.json`;
    link.click();
}

// Make functions available globally for onclick handlers
window.showDemoCredentials = showDemoCredentials;
window.exportStationData = exportStationData;

