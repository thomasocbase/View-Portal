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

export const vigicruesTemplate = `
        <h1>VigiCrues</h1>
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
                <label for="search">Search by stream <span style="font-size: 0.8rem">(ex: Seine)</span></label>
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
        <div id="map" style="width: 100%; height: 300px;"></div>
        <div style="width: 100%; height: 390px; margin-block: 25px;">
            <canvas id="chart"  style="margin: 0 auto; width: 100%"></canvas>
            <p><em>Source: vigicrues.gouv.fr - Period: last 30 days</em></p>
        </div>
    `;