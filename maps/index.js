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
    const map = L.map('map').setView([30.91, 75.86], 11); // Set initial map view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Add OpenStreetMap tile layer
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Define custom icon
    const customIcon = L.icon({
      iconUrl: 'https://gndec.ac.in/~hsrai/maps/coe/coe2.jpeg', // Specify the URL of the custom icon image
      iconSize: [20, 20], // Specify the size of the icon
      iconAnchor: [16, 16] // Specify the anchor point of the icon
    });

    // Loop through the data and add markers to the map with custom icon
    for (let i = 0; i < jsonData.length; i++) {
      // Check for valid latitude and longitude values
      if (jsonData[i].lat !== undefined && jsonData[i].lon !== undefined && !isNaN(jsonData[i].lat) && !isNaN(jsonData[i].lon)) {
        const lat = parseFloat(jsonData[i].lat); // Convert latitude string to number
        const lon = parseFloat(jsonData[i].lon); // Convert longitude string to number
        const marker = L.marker([lat, lon], {icon: customIcon}).addTo(map); // Add marker with custom icon
        marker.bindPopup(`<b>${jsonData[i].title}</b><br>${jsonData[i].description}`); // Add popup with data

      // Add circle with specified radius
      
      L.circle([lat, lon], {        
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 100,}).addTo(map);
      }
    }
  })
  .catch(error => {
    console.error('Error fetching CSV file:', error);
  });
