// Admin Panel Application
class AdminApp {
    constructor() {
        this.currentUser = null;
        this.stationData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.updateTranslations();
    }

    bindEvents() {
        // Auth tab switching
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        
        if (loginTab && registerTab) {
            loginTab.addEventListener('click', () => this.switchAuthTab('login'));
            registerTab.addEventListener('click', () => this.switchAuthTab('register'));
        }

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Modal forms
        const stationInfoForm = document.getElementById('stationInfoForm');
        const fuelPricesForm = document.getElementById('fuelPricesForm');
        const amenitiesForm = document.getElementById('amenitiesForm');

        if (stationInfoForm) {
            stationInfoForm.addEventListener('submit', (e) => this.saveStationInfo(e));
        }

        if (fuelPricesForm) {
            fuelPricesForm.addEventListener('submit', (e) => this.saveFuelPrices(e));
        }

        if (amenitiesForm) {
            amenitiesForm.addEventListener('submit', (e) => this.saveAmenities(e));
        }

        // Modal close on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    updateTranslations() {
        // Add admin-specific translations to the global translations object
        const adminTranslations = {
            en: {
                admin_page_title: "Gas Station Owner Portal | Gaspin.live",
                admin_page_description: "Update your gas station information, fuel prices, and amenities on Gaspin.live. Manage your station's visibility and attract more customers.",
                admin_portal: "Admin Portal",
                back_to_site: "Back to Site",
                admin_welcome_title: "Welcome to Gas Station Owner Portal",
                admin_welcome_desc: "Manage your gas station information, update fuel prices, and attract more customers to your location.",
                login: "Login",
                register: "Register",
                login_title: "Login to Your Account",
                register_title: "Register Your Gas Station",
                email: "Email Address",
                password: "Password",
                login_btn: "Login",
                forgot_password: "Forgot Password?",
                station_name: "Station Name",
                owner_name: "Owner Name",
                phone: "Phone Number",
                address: "Station Address",
                confirm_password: "Confirm Password",
                register_btn: "Register Station",
                dashboard_title: "Station Dashboard",
                logout: "Logout",
                station_info: "Station Information",
                fuel_prices: "Fuel Prices",
                amenities: "Amenities & Services",
                statistics: "Statistics",
                monthly_views: "Monthly Views",
                directions_requested: "Directions Requested",
                phone_calls: "Phone Calls",
                edit_station_info: "Edit Station Information",
                operating_hours: "Operating Hours",
                cancel: "Cancel",
                save_changes: "Save Changes",
                edit_fuel_prices: "Edit Fuel Prices",
                regular_price: "Regular Price",
                premium_price: "Premium Price",
                diesel_price: "Diesel Price",
                price_update_note: "Prices will be updated immediately and visible to all users.",
                update_prices: "Update Prices",
                edit_amenities: "Edit Amenities & Services",
                ev_charging_station: "EV Charging Station",
                car_wash: "Car Wash",
                convenience_store: "Convenience Store",
                restroom: "Restroom",
                atm: "ATM",
                air_pump: "Air Pump"
            }
        };

        // Merge admin translations with existing translations
        Object.keys(adminTranslations).forEach(lang => {
            if (window.translations && window.translations[lang]) {
                Object.assign(window.translations[lang], adminTranslations[lang]);
            }
        });
    }

    checkAuthStatus() {
        // Check if user is logged in (in real app, this would check JWT token or session)
        const savedUser = localStorage.getItem('gaspin_admin_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    }

    switchAuthTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simulate API call (in real app, this would authenticate with backend)
        try {
            // Mock authentication
            if (email && password) {
                this.currentUser = {
                    id: 1,
                    email: email,
                    stationName: "Demo Gas Station",
                    ownerName: "John Doe"
                };

                localStorage.setItem('gaspin_admin_user', JSON.stringify(this.currentUser));
                this.showDashboard();
            } else {
                alert('Please enter valid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            stationName: document.getElementById('stationName').value,
            ownerName: document.getElementById('ownerName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Simulate API call (in real app, this would register with backend)
        try {
            this.currentUser = {
                id: Date.now(),
                email: formData.email,
                stationName: formData.stationName,
                ownerName: formData.ownerName
            };

            localStorage.setItem('gaspin_admin_user', JSON.stringify(this.currentUser));
            this.showDashboard();
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    }

    handleLogout() {
        localStorage.removeItem('gaspin_admin_user');
        this.currentUser = null;
        this.stationData = null;
        this.showAuth();
    }

    showAuth() {
        const authSection = document.getElementById('authSection');
        const dashboardSection = document.getElementById('dashboardSection');
        
        if (authSection) authSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
    }

    showDashboard() {
        const authSection = document.getElementById('authSection');
        const dashboardSection = document.getElementById('dashboardSection');
        
        if (authSection) authSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');

        this.loadStationData();
        this.populateDashboard();
    }

    loadStationData() {
        // Load station data (in real app, this would fetch from API)
        const savedData = localStorage.getItem(`gaspin_station_${this.currentUser.id}`);
        
        if (savedData) {
            this.stationData = JSON.parse(savedData);
        } else {
            // Default station data
            this.stationData = {
                name: this.currentUser.stationName || "Demo Gas Station",
                address: "123 Main Street, Downtown, City 12345",
                phone: "+1-555-0123",
                hours: "24/7",
                prices: {
                    regular: 3.45,
                    premium: 3.85,
                    diesel: 3.65
                },
                amenities: {
                    evCharging: true,
                    carWash: false,
                    convenience: true,
                    restroom: true,
                    atm: true,
                    airPump: true
                },
                lastUpdated: new Date().toISOString()
            };
        }
    }

    populateDashboard() {
        this.populateStationInfo();
        this.populateFuelPrices();
        this.populateAmenities();
    }

    populateStationInfo() {
        const container = document.getElementById('stationInfoDisplay');
        if (!container || !this.stationData) return;

        container.innerHTML = `
            <div class="info-item">
                <span class="info-label">${window.languageManager.translate('station_name')}</span>
                <span class="info-value">${this.stationData.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${window.languageManager.translate('address')}</span>
                <span class="info-value">${this.stationData.address}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${window.languageManager.translate('phone')}</span>
                <span class="info-value">${this.stationData.phone}</span>
            </div>
            <div class="info-item">
                <span class="info-label">${window.languageManager.translate('operating_hours')}</span>
                <span class="info-value">${this.stationData.hours}</span>
            </div>
        `;
    }

    populateFuelPrices() {
        const container = document.getElementById('fuelPricesDisplay');
        if (!container || !this.stationData) return;

        const lastUpdated = new Date(this.stationData.lastUpdated).toLocaleDateString();

        container.innerHTML = `
            <div class="price-item">
                <div class="fuel-type-label">${window.languageManager.translate('regular')}</div>
                <div class="price-value">$${this.stationData.prices.regular}</div>
                <div class="price-updated">Updated ${lastUpdated}</div>
            </div>
            <div class="price-item">
                <div class="fuel-type-label">${window.languageManager.translate('premium')}</div>
                <div class="price-value">$${this.stationData.prices.premium}</div>
                <div class="price-updated">Updated ${lastUpdated}</div>
            </div>
            <div class="price-item">
                <div class="fuel-type-label">${window.languageManager.translate('diesel')}</div>
                <div class="price-value">$${this.stationData.prices.diesel}</div>
                <div class="price-updated">Updated ${lastUpdated}</div>
            </div>
        `;
    }

    populateAmenities() {
        const container = document.getElementById('amenitiesDisplay');
        if (!container || !this.stationData) return;

        const amenities = [
            { key: 'evCharging', icon: 'fas fa-bolt', label: window.languageManager.translate('ev_charging_station') },
            { key: 'carWash', icon: 'fas fa-car', label: window.languageManager.translate('car_wash') },
            { key: 'convenience', icon: 'fas fa-store', label: window.languageManager.translate('convenience_store') },
            { key: 'restroom', icon: 'fas fa-restroom', label: window.languageManager.translate('restroom') },
            { key: 'atm', icon: 'fas fa-credit-card', label: window.languageManager.translate('atm') },
            { key: 'airPump', icon: 'fas fa-wind', label: window.languageManager.translate('air_pump') }
        ];

        container.innerHTML = amenities.map(amenity => `
            <div class="amenity-item ${this.stationData.amenities[amenity.key] ? 'active' : ''}">
                <i class="${amenity.icon}"></i>
                <span>${amenity.label}</span>
            </div>
        `).join('');
    }

    editStationInfo() {
        const modal = document.getElementById('stationInfoModal');
        if (!modal || !this.stationData) return;

        // Populate form with current data
        document.getElementById('editStationName').value = this.stationData.name;
        document.getElementById('editAddress').value = this.stationData.address;
        document.getElementById('editPhone').value = this.stationData.phone;
        document.getElementById('editHours').value = this.stationData.hours;

        modal.classList.remove('hidden');
    }

    editFuelPrices() {
        const modal = document.getElementById('fuelPricesModal');
        if (!modal || !this.stationData) return;

        // Populate form with current prices
        document.getElementById('regularPrice').value = this.stationData.prices.regular;
        document.getElementById('premiumPrice').value = this.stationData.prices.premium;
        document.getElementById('dieselPrice').value = this.stationData.prices.diesel;

        modal.classList.remove('hidden');
    }

    editAmenities() {
        const modal = document.getElementById('amenitiesModal');
        if (!modal || !this.stationData) return;

        // Populate form with current amenities
        Object.keys(this.stationData.amenities).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = this.stationData.amenities[key];
            }
        });

        modal.classList.remove('hidden');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveStationInfo(e) {
        e.preventDefault();

        this.stationData.name = document.getElementById('editStationName').value;
        this.stationData.address = document.getElementById('editAddress').value;
        this.stationData.phone = document.getElementById('editPhone').value;
        this.stationData.hours = document.getElementById('editHours').value;

        this.saveStationData();
        this.populateStationInfo();
        this.closeModal('stationInfoModal');
        
        this.showSuccessMessage('Station information updated successfully!');
    }

    saveFuelPrices(e) {
        e.preventDefault();

        this.stationData.prices.regular = parseFloat(document.getElementById('regularPrice').value);
        this.stationData.prices.premium = parseFloat(document.getElementById('premiumPrice').value);
        this.stationData.prices.diesel = parseFloat(document.getElementById('dieselPrice').value);
        this.stationData.lastUpdated = new Date().toISOString();

        this.saveStationData();
        this.populateFuelPrices();
        this.closeModal('fuelPricesModal');
        
        this.showSuccessMessage('Fuel prices updated successfully!');
    }

    saveAmenities(e) {
        e.preventDefault();

        const amenityKeys = ['evCharging', 'carWash', 'convenience', 'restroom', 'atm', 'airPump'];
        amenityKeys.forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                this.stationData.amenities[key] = checkbox.checked;
            }
        });

        this.saveStationData();
        this.populateAmenities();
        this.closeModal('amenitiesModal');
        
        this.showSuccessMessage('Amenities updated successfully!');
    }

    saveStationData() {
        localStorage.setItem(`gaspin_station_${this.currentUser.id}`, JSON.stringify(this.stationData));
    }

    showSuccessMessage(message) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
            ">
                <i class="fas fa-check-circle"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize admin app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
});

