import * as cruesClient from '../clients/cruesClient';
import { filterDailyData } from '../helpers/hydroHelper';

export async function fetchCoordinates(stationId: string) {
    let resultDivContent: { html: string; coordinates: number[] } = {
        html: '',
        coordinates: []
    };

    try {
        const response = await cruesClient.getCoordinates(stationId);

        resultDivContent.html = `
            <p><strong>Station</strong>: ${response.stationName}</p>
            <p style="font-size: 0.6em;" color="gray">
                <strong>Coordinates</strong>: ${response.coord[0]}, ${response.coord[1]}
            </p>
        `;
        resultDivContent.coordinates = response.coord;
    } catch (error) {
        console.error('Error locating station: ' + error);
        resultDivContent.html = `
            <p>Error locating station.</p>
        `;
    }

    return resultDivContent;
}

export async function getDailyData(stationId: string) {
    try {
        const response = await cruesClient.getAllFromOneStation(stationId);
        return filterDailyData(response.Serie.ObssHydro);
    } catch (error) {
        console.error('Error fetching data: ' + error);
    }
}