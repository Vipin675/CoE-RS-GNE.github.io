// Fetch the CSV file using Fetch API
fetch('data.csv')
  .then(response => response.text())
  .then(data => {
    // Parse the CSV data
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const jsonData = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      const rowData = {};
      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j]] = row[j];
      }
      jsonData.push(rowData);
    }

    // Create Leaflet map
    const map = L.map('map').setView([30.788823, 75.8498616], 13); // Set initial map view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Add OpenStreetMap tile layer
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Define custom icon
    const customIcon = L.icon({
      iconUrl: 'coe2.jpeg', // Specify the URL of the custom icon image
      iconSize: [32, 32], // Specify the size of the icon
      iconAnchor: [16, 16] // Specify the anchor point of the icon
    });

    // Loop through the data and add markers to the map with custom icon
    for (let i = 0; i < jsonData.length; i++) {
      // Check for valid latitude and longitude values
      if (jsonData[i].lat !== undefined && jsonData[i].lon !== undefined && !isNaN(jsonData[i].lat) && !isNaN(jsonData[i].lon)) {
        const lat = parseFloat(jsonData[i].lat); // Convert latitude string to number
        const lon = parseFloat(jsonData[i].lon); // Convert longitude string to number
        const marker = L.marker([lat, lon], {icon: customIcon}).addTo(map); // Add marker with custom icon
        marker.bindPopup(`<b>${jsonData[i].name}</b><br>${jsonData[i].description}`); // Add popup with data
      }
    }
  })
  .catch(error => {
    console.error('Error fetching CSV file:', error);
  });