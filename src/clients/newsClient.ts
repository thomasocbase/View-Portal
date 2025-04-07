import ky from 'ky';

const newsAPI = ky.create({
    prefixUrl: import.meta.env.VITE_NEWS_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function getAllNews(): Promise<any> {
    return newsAPI.get("news").json();
}

export async function getNewsBySport(sport: string): Promise<any> {
    return newsAPI.get(`news/${sport}`).json();
}