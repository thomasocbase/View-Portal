import * as newsClient from '../clients/newsClient';

export async function fetchAllNews() {

    try {
        const response = await newsClient.getAllNews();
        return response;
    } catch (error) {
        console.error('Error fetching news: ' + error);
    }
}

export async function fetchNewsBySport(sport: string) {
    try {
        const response = await newsClient.getNewsBySport(sport);
        return response;
    } catch (error) {
        console.error('Error fetching news by sport: ' + error);
    }
}