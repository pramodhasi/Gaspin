function findNearbyGasStations() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const location = new google.maps.LatLng(lat, lng);

    const request = {
      location: location,
      radius: '5000',
      type: ['gas_station']
    };

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const display = document.getElementById('stations');
        display.innerHTML = '';
        results.slice(0, 3).forEach((place, index) => {
          const fuelData = localStorage.getItem('station_' + place.name);
          const fuel = fuelData ? JSON.parse(fuelData) : null;

          display.innerHTML += `
            <div class="station">
              <h3>${place.name}</h3>
              <p><strong>Address:</strong> ${place.vicinity}</p>
              ${fuel ? `
                <p>Petrol: Rs.${fuel.petrol}</p>
                <p>Diesel: Rs.${fuel.diesel}</p>
                ${fuel.premium ? `<p>Premium: Rs.${fuel.premium}</p>` : ''}
                <p>EV Charging: ${fuel.ev ? '✅ Available' : '❌ Not Available'}</p>
              ` : '<p><em>No real-time price data yet.</em></p>'}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">📍 Get Directions</a>
            </div>`;
        });
      }
    });
  }, () => {
    alert('Unable to retrieve your location.');
  });
}
