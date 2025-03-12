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
            <h3>Current Station</h3>
            <p> ${response.stationName} </p>
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

export async function filterStationsbyCourse(searchValue: string) {
    try {
        const response = await cruesClient.getAllStations();

        let stations = response.ListEntVigiCru
        
        stations = stations.filter((station: any) => {
            return station.LbCoursEau.toLowerCase().includes(searchValue.toLowerCase());
        });

        return stations;
    } catch (error) {
        console.error('Error fetching data: ' + error);
    }
}