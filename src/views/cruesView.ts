import * as cruesService from '../services/cruesService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { updateMap } from '../services/mapService';
import { updateChart } from '../services/chartService';
import { vigicruesTemplate } from '../templates/vigicruesTemplate';

export function renderCoordinates(): void {
    const app: HTMLElement | null = document.getElementById('app');
    if (app === null) return;

    // ************
    // HTML STRUCTURE
    const container = document.createElement('section');
    container.innerHTML = vigicruesTemplate;
    app.appendChild(container);

    const resultDiv = document.getElementById('result');
    if (resultDiv === null) return;

    const error = document.getElementById('errorDisplay');
    if (error === null) return;

    // Default values
    let stationId: string = "F700000103";
    let coordinates: L.LatLngTuple = [0, 0];

    // Initial state
    (async () => {
        const resultDivContent = await cruesService.fetchCoordinates(stationId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;
        updateMap(coordinates);
        updateChart(stationId);
    })();

    // ************
    // MAJOR CITY DROPDOWN FEATURE
    const dropdown = document.getElementById('station-dropdown');
    if (dropdown === null) return;

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
        updateChart(stationId);
    });

    // ************
    // SEARCH BY STATION CODE FEATURE
    const form = document.getElementById('station-search-form');
    if (form === null) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Retrieve search station code & validate
        const stationSearchId: string = (document.getElementById('station-search') as HTMLInputElement).value;

        if (stationSearchId.length === 0) {
            error.innerHTML = `
                <p>Please provide a station code to search for.</p>
            `;
            return;
        }

        if (stationSearchId.length > 0 && stationSearchId.length !== 10) {
            error.innerHTML = `
                <p>A station code must be 10 characters long. Please provide a correct station code :)</p>
            `;
            return;
        }

        // Fetch station coordinates
        const resultDivContent = await cruesService.fetchCoordinates(stationSearchId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;

        updateMap(coordinates);
        updateChart(stationSearchId);
    });

    // ************
    // SEARCH BY STREAM FEATURE
    const streamForm = document.getElementById('course-search-form');
    const dropdownForm = document.getElementById('course-dropdown-form');
    const courseDropdown = document.getElementById('course-dropdown') as HTMLSelectElement;

    if (streamForm === null || dropdownForm == null) return;

    streamForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Retrieve search stream & validate
        const streamSearch: string = (document.getElementById('stream-search') as HTMLInputElement).value;

        if (error && streamSearch.length === 0) {
            error.innerHTML = `
                Please provide a stream to search for.
            `;
            return;
        }

        // Fetch stations by stream
        const streamDropdownOptions = await cruesService.filterStationsbyCourse(streamSearch);

        if (streamDropdownOptions.length === 0) {
            error.innerHTML = `
                <p>No results found for this stream. Please try again.</p>
            `;
            return;
        }

        // Fetch station coordinates of first option
        stationId = streamDropdownOptions[0].CdEntVigiCru;
        const resultDivContent = await cruesService.fetchCoordinates(stationId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;

        updateMap(coordinates);
        updateChart(stationId);

        // Display dropdown
        courseDropdown.innerHTML = `
            ${streamDropdownOptions.map((option: { CdEntVigiCru: any; LbEntVigiCru: any; }) => `<option value="${option.CdEntVigiCru}">${option.LbEntVigiCru}</option>`).join('')}
        `;

        dropdownForm.style.display = 'flex';

        // Reset error message
        error.innerHTML = '';
    });

    // ************
    // COURSE DROPDOWN FEATURE
    courseDropdown.addEventListener('change', async (event) => {
        const target = event.target as HTMLSelectElement;
        stationId = target.value;

        resultDiv.innerHTML = `
            <p>Loading...</p>
        `;
        const resultDivContent = await cruesService.fetchCoordinates(stationId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;

        updateMap(coordinates);
        updateChart(stationId);
    });
}