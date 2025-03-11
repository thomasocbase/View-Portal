import * as cruesService from '../services/cruesService';

export function renderCoordinates(): void {
    const app: HTMLElement | null = document.getElementById('app');
    if (app === null) return;

    const container = document.createElement('section');
    container.innerHTML = `
        <h2>Locate a Station</h2>
        <form id="station-form">
            <label for="station">Station:</label>
            <input type="text" id="station" name="station" required>
            <button type="submit">Locate</button>
        </form>
        <div id="result"></div>
    `;
    app.appendChild(container);

    const form = document.getElementById('station-form');
    if (form === null) return;   

    const resultDiv = document.getElementById('result');
    if (resultDiv === null) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Retrieve station code & validate
        const stationId = (document.getElementById('station') as HTMLInputElement).value;
        if (stationId.length === 0) {
            resultDiv.innerHTML = `
                <p>Please enter a station code.</p>
            `;
            return;
        }
        if (stationId.length !== 10) {
            resultDiv.innerHTML = `
                <p>A station code must be 10 characters long. Not shorter, not longer (I don't make the rules!). Please provide a correct station code :)</p>
            `;
            return;
        }

        // Fetch station coordinates
        try {
            const stationCoordinates = await cruesService.getCoordinates(stationId);

            resultDiv.innerHTML = `
                <p>Station: ${stationCoordinates.stationName}</p>
                <p>Coordinates: ${stationCoordinates.coord[0]}, ${stationCoordinates.coord[1]}</p>
            `;
        } catch (error) {
            console.error('Error locating station:', error);
            resultDiv.innerHTML = `
                <p>Error locating station.</p>
            `;
        }
    });
    
}