import Chart from 'chart.js/auto';
import * as cruesService from '../services/cruesService';

let chartInstance: Chart | null = null;

export async function updateChart(stationId: string): Promise<void> {
    if (stationId === '') return;

    const chartCanvas = document.getElementById('chart') as HTMLCanvasElement;
    if (chartCanvas === null) return;

    if (chartInstance) {
        chartInstance.destroy();
    }

    try {
        const data = await cruesService.getDailyData(stationId);
        if (data) {
            chartInstance = new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: data.map((d) => d.date),
                    datasets: [{
                        label: 'Hydro level',
                        data: data.map((d) => d.hydroLevel),
                        fill: false,
                        borderColor: '#f11048',
                        tension: 0.1
                    }]
                }
            });
        } else {
            console.error('No data available for the given station ID');
        }
    }
    catch (error) {
        console.error('Error updating chart: ' + error);
    }
}