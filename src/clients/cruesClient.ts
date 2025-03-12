import ky from 'ky';

const cruesAPI = ky.create({
    prefixUrl: import.meta.env.VITE_CRUES_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

type StationCoordinates = {
    stationCode: string;
    stationName: string;
    coord: Array<number>;
};

export async function getAllFromOneStation(stationId: string): Promise<any> {
    return cruesAPI.get("station/" + stationId).json();
}

export async function getCoordinates(stationId: string): Promise<StationCoordinates> {
    return cruesAPI.get("station/coord/" + stationId).json();
}

export async function getAllStations(): Promise<any> {
    return cruesAPI.get("stations").json();
}