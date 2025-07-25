# Gaspin.live - Real-Time Gas Price Finder

A comprehensive web application that helps users find real-time gas prices near their location and provides an admin portal for gas station owners to manage their information.

## Features

### Main Website (index.html)
- **Real-time Gas Station Finder**: Find the 3 nearest gas stations based on user location
- **Multilingual Support**: Available in 10 languages (English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Arabic)
- **Geolocation Integration**: Uses browser geolocation API to find user's current location
- **Google Maps Integration**: Interactive map showing gas station locations with directions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Fuel Price Comparison**: Compare Regular, Premium, and Diesel prices
- **EV Charging Information**: Shows which stations have electric vehicle charging facilities

### Admin Portal (admin.html)
- **Station Owner Authentication**: Login and registration system for gas station owners
- **Dashboard Management**: Comprehensive dashboard to manage station information
- **Real-time Price Updates**: Update fuel prices that are immediately visible to users
- **Station Information Management**: Edit station details, address, phone, and operating hours
- **Amenities Management**: Manage services like EV charging, car wash, convenience store, etc.
- **Statistics Tracking**: View monthly views, directions requested, and phone calls
- **Multilingual Admin Interface**: Admin panel available in multiple languages

## File Structure

```
gaspin-live/
├── index.html              # Main website homepage
├── admin.html              # Admin portal for gas station owners
├── README.md               # This file
├── assets/
│   ├── css/
│   │   ├── style.css       # Main website styles
│   │   └── admin.css       # Admin portal styles
│   ├── js/
│   │   ├── app.js          # Main website functionality
│   │   ├── admin.js        # Admin portal functionality
│   │   └── translations.js # Multilingual support
│   └── images/
│       └── favicon.png     # Website favicon
```

## Setup Instructions

### 1. Basic Setup
1. Download all files and maintain the folder structure
2. Place all files in your web server directory
3. Ensure the `assets` folder structure is preserved

### 2. Google Maps API Configuration
1. Get a Google Maps JavaScript API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geolocation API
3. Replace `YOUR_API_KEY` in `index.html` (line 87) with your actual API key:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places&callback=initMap"></script>
   ```

### 3. Local Development
For local testing, you can use Python's built-in server:
```bash
cd gaspin-live
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### 4. Production Deployment
- Upload all files to your web hosting service
- Ensure HTTPS is enabled (required for geolocation API)
- Configure your domain and SSL certificate
- Test all functionality after deployment

## API Integration

### Real Gas Station Data
The current implementation uses mock data for demonstration. To integrate with real gas station APIs:

1. **Recommended APIs**:
   - GasBuddy API
   - HERE Fuel Prices API
   - TomTom Fuel Prices API
   - CollectAPI Gas Prices

2. **Integration Points**:
   - Modify `searchGasStations()` function in `assets/js/app.js`
   - Replace `generateMockGasStations()` with actual API calls
   - Update data structure to match API response format

### Example API Integration
```javascript
async searchGasStations() {
    try {
        const response = await fetch(`https://api.example.com/gas-stations?lat=${this.userLocation.lat}&lng=${this.userLocation.lng}&radius=5`);
        const data = await response.json();
        this.gasStations = data.stations.slice(0, 3); // Get top 3 nearest
    } catch (error) {
        console.error('Error fetching gas stations:', error);
        // Fallback to mock data
        this.gasStations = this.generateMockGasStations();
    }
}
```

## Customization

### Adding New Languages
1. Open `assets/js/translations.js`
2. Add new language object to the `translations` object
3. Add the language option to both HTML files' language selectors

### Styling Customization
- Main website styles: `assets/css/style.css`
- Admin portal styles: `assets/css/admin.css`
- Color scheme can be modified by changing CSS custom properties

### Adding New Features
- Gas station amenities: Modify the amenities array in `admin.js`
- Additional fuel types: Update the price structure in both frontend and admin
- New statistics: Add to the statistics display in the admin dashboard

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Required Features**: 
  - Geolocation API support
  - ES6 JavaScript support
  - CSS Grid and Flexbox support

## Security Considerations

### For Production Use:
1. **API Key Security**: Restrict Google Maps API key to your domain
2. **HTTPS Required**: Geolocation API requires secure context
3. **Input Validation**: Validate all user inputs on both client and server side
4. **Authentication**: Implement proper server-side authentication for admin portal
5. **Data Storage**: Use secure database instead of localStorage for production

## Performance Optimization

1. **Image Optimization**: Compress favicon and any additional images
2. **CSS/JS Minification**: Minify CSS and JavaScript files for production
3. **CDN Usage**: Consider using CDN for external libraries
4. **Caching**: Implement proper browser caching headers
5. **Lazy Loading**: Implement lazy loading for map and images

## Testing

### Manual Testing Checklist:
- [ ] Geolocation permission request works
- [ ] Gas stations display with correct information
- [ ] Map loads and shows markers correctly
- [ ] Language switching works for all supported languages
- [ ] Admin login/registration functions properly
- [ ] Price updates reflect immediately
- [ ] Mobile responsiveness on various screen sizes
- [ ] All links and buttons are functional

### Automated Testing:
Consider implementing:
- Unit tests for JavaScript functions
- Integration tests for API calls
- End-to-end tests for user workflows

## Troubleshooting

### Common Issues:

1. **Geolocation not working**:
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Test on different browsers

2. **Google Maps not loading**:
   - Verify API key is correct
   - Check API key restrictions
   - Ensure billing is enabled on Google Cloud

3. **Language switching not working**:
   - Check browser console for JavaScript errors
   - Verify translations.js is loaded properly

4. **Admin portal not saving data**:
   - Check browser localStorage support
   - Verify JavaScript is enabled

## Future Enhancements

### Potential Features:
- Push notifications for price changes
- User accounts and favorite stations
- Price history and trends
- Mobile app development
- Integration with navigation apps
- Loyalty program integration
- Real-time fuel availability status
- Price prediction algorithms

## Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all setup steps were completed correctly
4. Test with different browsers and devices

## License

This project is provided as-is for educational and commercial use. Please ensure compliance with all third-party service terms of use (Google Maps API, etc.).

---

**Created by**: Manus AI Assistant  
**Version**: 1.0  
**Last Updated**: July 2025

