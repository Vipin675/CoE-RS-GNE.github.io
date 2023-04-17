// Initialize the map and set its view to our chosen geographical coordinates and a zoom level:
var map = L.map("map").setView([30.900965, 75.857277], 12);

// tileLayer: Used to load and display tile layers on the map, in this case it’s a OpenStreetMap tile layer.
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// NOTE: Make sure all the code is called after the div and leaflet.js inclusion.

// POPUP Lat and Lng on click on anywhere on map
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

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

    coeDataArray.map((data_item) => {
      var myIcon = L.icon({
        iconUrl: `./${data_item.icon}`,
        iconSize: data_item.iconSize,
        iconOffset: data_item.iconOffset,
      });

      var marker = L.marker([data_item.lat, data_item.lon], {
        icon: myIcon,
      })
        .addTo(map)
        .bindPopup(
          `<b>${data_item.title}</b> <br/> <b>${data_item.description}</b>`
        );
    });
  })
  .catch((error) => console.error(error));
