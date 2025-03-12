import L from 'leaflet';

const defaultZoom = 10;
let map: L.Map | null = null;

export function updateMap(coords: L.LatLngTuple) {
    if (map === null) {
        map = L.map('map').setView(coords, defaultZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView(coords, defaultZoom);
    }

    L.marker(coords).addTo(map).bindPopup(coords.toString());
}