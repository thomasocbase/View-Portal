type HydroData = {
    DtObsHydro: number;
    ResObsHydro: number;
};

type DailyData = {
    date: string;
    hydroLevel: number;
};

export function filterDailyData(data: HydroData[]): DailyData[] {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const recentData = data.filter(entry => entry.DtObsHydro >= now - THIRTY_DAYS);

    const dailyData = new Map<string, HydroData>();

    for (const entry of recentData) {
        const dateKey = new Date(entry.DtObsHydro).toISOString().split("T")[0];
        if (!dailyData.has(dateKey)) {
            dailyData.set(dateKey, entry);
        }
    }

    let oldFormat = Array.from(dailyData.values());
    let newFormat = oldFormat.map((entry) => {
        return {
            date: new Date(entry.DtObsHydro).toLocaleDateString(),
            hydroLevel: entry.ResObsHydro
        };
    });

    return newFormat;
}