const mapElement = document.getElementById("map");
const [longitude, latitude] = JSON.parse(mapElement.dataset.coordinates);
const mapCoordinates = [latitude, longitude]; //leaflet format

const map = L.map("map");
map.setView(mapCoordinates, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const marker = L.marker(mapCoordinates, {
  draggable: true,
})
  .addTo(map)
  .bindPopup("listing location");

marker.on("dragend", () => {
  console.log(marker.getLatLng());
});
