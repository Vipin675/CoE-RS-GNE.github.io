// Initialize the map and set its view to our chosen geographical coordinates and a zoom level:
var map = L.map("map").setView([30.900965, 75.857277], 12);

// tileLayer: Used to load and display tile layers on the map, in this case it’s a OpenStreetMap tile layer.
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// NOTE: Make sure all the code is called after the div and leaflet.js inclusion.

// ----------------------------------------------------------------------------------------------------------------------------------

fetch("./data.csv")
  .then((response) => response.text())
  .then((data) => {
    const dataArray = data.split("\n").map((row) => row.split(","));
    const [headings, ...others] = dataArray;

    const coeDataArray = others.map((item) => ({
      lat: parseFloat(item[0]),
      lon: parseFloat(item[1]),
      title: item[2],
      description: item[3],
      icon: item[4],
      iconSize: item[5].split(",").map((iItem) => parseFloat(iItem)),
      iconOffset: item[6].split(",").map((iItem) => parseFloat(iItem)),
    }));

    const low_severity_group = L.layerGroup().addTo(map);
    const medium_severity_group = L.layerGroup().addTo(map);
    const high_severity_group = L.layerGroup().addTo(map);

    coeDataArray.map((data_item) => {
      var low_severity_icon = L.icon({
        iconUrl: "./assets/coe2_low.svg",
        iconSize: data_item.iconSize,
        iconOffset: data_item.iconOffset,
      });

      var medium_severity_icon = L.icon({
        iconUrl: "./assets/coe2_medium.svg",
        iconSize: data_item.iconSize,
        iconOffset: data_item.iconOffset,
      });

      var high_severity_icon = L.icon({
        iconUrl: "./assets/coe2_high.svg",
        iconSize: data_item.iconSize,
        iconOffset: data_item.iconOffset,
      });

      let severity_score = data_item.title.split(" ")[2];

      if (severity_score < 50) {
        L.marker([data_item.lat, data_item.lon], { icon: low_severity_icon })
          .bindPopup(
            `<b>${data_item.title}</b> <br/> <b>${data_item.description}</b>`
          )
          .addTo(low_severity_group);
      } else if (severity_score >= 50 && severity_score < 100) {
        L.marker([data_item.lat, data_item.lon], { icon: medium_severity_icon })
          .bindPopup(
            `<b>${data_item.title}</b> <br/> <b>${data_item.description}</b>`
          )
          .addTo(medium_severity_group);
      } else if (severity_score >= 100) {
        L.marker([data_item.lat, data_item.lon], { icon: high_severity_icon })
          .bindPopup(
            `<b>${data_item.title}</b> <br/> <b>${data_item.description}</b>`
          )
          .addTo(high_severity_group);
      }
    });

    const overlays = {
      "Low Severity": low_severity_group,
      "Medium Severity": medium_severity_group,
      "High Severity": high_severity_group,
    };

    const layerControl = L.control.layers(null, overlays).addTo(map);
  })
  .catch((error) => console.error(error));
