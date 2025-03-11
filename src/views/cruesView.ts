import * as cruesService from '../services/cruesService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { updateMap } from '../helpers/mapHelper';

export function renderCoordinates(): void {
    const app: HTMLElement | null = document.getElementById('app');
    if (app === null) return;

    interface DropdownOption {
        value: string;
        label: string;
    }

    const dropdownOptions: DropdownOption[] = [
        { value: 'F700000103', label: 'Paris' },
        { value: 'Y442501301', label: 'Marseille' },
        { value: 'U472002001', label: 'Lyon' },
        { value: 'O200004001', label: 'Toulouse' },
        { value: 'O972001001', label: 'Bordeaux' },
        { value: 'A061005051', label: 'Strasbourg' },
        { value: 'M800001010', label: 'Nantes' },
    ];

    // HTML structure
    const container = document.createElement('section');
    container.innerHTML = `
        <h2>Locate a Station</h2>
        <div style="display: flex; gap: 1rem;">
            <form id="station-dropdown-form">
                <label for="dropdown">Select a station:</label>
                <select id="station-dropdown" name="dropdown">
                    ${dropdownOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
                </select>
                </form>
            <form id="station-search-form">
                <span>OR</span>
                <label for="search">Search by code:</label>
                <input type="text" id="station-search" name="search">
                <button type="submit">Search</button>
            </form>
        </div>
        <div id="result"></div>
        <div id="map" style="width: 100%; height: 300px;"></div>
    `;
    app.appendChild(container);

    const dropdown = document.getElementById('station-dropdown');
    const form = document.getElementById('station-search-form');
    const resultDiv = document.getElementById('result');
    if (dropdown === null || form === null || resultDiv === null) return;

    // Defaault values
    let stationId: string = dropdownOptions[0].value;
    let coordinates: L.LatLngTuple = [0, 0];

    // Initial fetch
    (async () => {
        const resultDivContent = await cruesService.fetchCoordinates(stationId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;
        updateMap(coordinates);
    })();

    // Leaflet map
    // document.addEventListener('DOMContentLoaded', () => {
    //     if (Array.isArray(coordinates) && coordinates.length === 2) {
    //         const map = L.map('map').setView(coordinates, 11);

    //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //             attribution: '&copy; OpenStreetMap contributors'
    //         }).addTo(map);

    //         L.marker(coordinates as L.LatLngTuple)
    //             .addTo(map)
    //             .bindPopup('Station location')
    //     } else {
    //         console.error('Les coordonnées ne sont pas valides :', coordinates);
    //     }
    // });

    // Dropdown feature
    dropdown.addEventListener('change', async (event) => {
        const target = event.target as HTMLSelectElement;
        stationId = target.value;

        resultDiv.innerHTML = `
            <p>Loading...</p>
        `;
        const resultDivContent = await cruesService.fetchCoordinates(stationId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;

        updateMap(coordinates);
    });

    // Search feature
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Retrieve search station code & validate
        const stationSearchId: string = (document.getElementById('station-search') as HTMLInputElement).value;

        if (stationSearchId.length === 0) {
            resultDiv.innerHTML = `
                <p>Please provide a station code to search for.</p>
            `;
            return;
        }

        if (stationSearchId.length > 0 && stationSearchId.length !== 10) {
            resultDiv.innerHTML = `
                <p>A station code must be 10 characters long. Not shorter, not longer (I don't make the rules!). Please provide a correct station code :)</p>
            `;
            return;
        }

        // Fetch station coordinates
        const resultDivContent = await cruesService.fetchCoordinates(stationSearchId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;

        updateMap(coordinates);
    });
}