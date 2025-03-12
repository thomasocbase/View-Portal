import * as cruesService from '../services/cruesService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { updateMap } from '../services/mapService';
import { updateChart } from '../services/chartService';

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
        <h2 style="text-transform: uppercase;">VigiCrues</h2>
        <div id="search-container">
            <h3>Select a station</h3>
            <form id="station-dropdown-form" class="search-item">
                <label for="dropdown">Select a major city</label>
                <select id="station-dropdown" name="dropdown">
                    ${dropdownOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
                </select>
            </form>
            <hr />
            <p style="margin-block: 0"><strong>Advanced research</strong></p>
            <form id="station-search-form" class="search-item">
                <label for="search">Search by station code <span style="font-size: 0.8rem">(ex: E366601001)</span></label>
                <input type="text" id="station-search" name="search">
                <button type="submit">Search</button>
            </form>
            <form id="course-search-form" class="search-item">
                <label for="search">Search by stream</label>
                <input type="text" id="stream-search" name="search">
                <button type="submit">Filter</button>
            </form>
            <form id="course-dropdown-form" class="search-item" style="display: none">
                <label for="dropdown">Select a station</label>
                <select id="course-dropdown" name="dropdown"></select>
            </form>
            <p id="errorDisplay" style="font-size: 0.8rem; color: yellow"></p>
        </div>
        <div id="result"></div>
        <div id="map" style="width: 100%; height: 300px; border-radius: 15px"></div>
        <div style="width: 100%; height: 300px; margin-block: 25px;">
            <canvas id="chart"  style="margin: 0 auto; width: 100%"></canvas>
            <p><em>Period: last 30 days</em></p>
        </div>
    `;
    app.appendChild(container);

    const resultDiv = document.getElementById('result');
    if (resultDiv === null) return;

    const error = document.getElementById('errorDisplay');
    if (error === null) return;

    // Default values
    let stationId: string = dropdownOptions[0].value;
    let coordinates: L.LatLngTuple = [0, 0];

    // Initial state
    (async () => {
        const resultDivContent = await cruesService.fetchCoordinates(stationId);
        resultDiv.innerHTML = resultDivContent.html;
        coordinates = resultDivContent.coordinates as L.LatLngTuple;
        updateMap(coordinates);
        updateChart(stationId);
    })();

    // Major cities dropdown feature
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

    // Search by code feature
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

    // Search by stream feature
    const streamForm = document.getElementById('course-search-form');
    const dropdownForm = document.getElementById('course-dropdown-form');
    const courseDropdown = document.getElementById('course-dropdown') as HTMLSelectElement;

    if (streamForm === null || dropdownForm == null ) return;

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

    // Course dropdown feature
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