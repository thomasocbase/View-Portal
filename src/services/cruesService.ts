import * as cruesClient from '../clients/cruesClient';

export async function fetchCoordinates(stationId: string) {
    let resultDivContent: string = '';

    try {
        const stationCoordinates = await cruesClient.getCoordinates(stationId);

        resultDivContent = `
            <p>Station: ${stationCoordinates.stationName}</p>
            <p>Coordinates: ${stationCoordinates.coord[0]}, ${stationCoordinates.coord[1]}</p>
        `;
    } catch (error) {
        console.error('Error locating station: ' + error);
        resultDivContent = `
            <p>Error locating station.</p>
        `;
    }

    return resultDivContent;
}