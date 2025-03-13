import L from 'leaflet';

const defaultZoom = 12;
let map: L.Map | null = null;

export function updateMap(coords: L.LatLngTuple) {
    if (map === null) {
        map = L.map('map').setView(coords, defaultZoom);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView(coords, defaultZoom);
    }

    const redIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.marker(coords, {icon: redIcon}).addTo(map).bindPopup(coords.toString());
}