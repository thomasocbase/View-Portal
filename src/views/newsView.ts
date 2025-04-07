import * as newsService from '../services/newsService';

interface DropdownOption {
    value: string;
    label: string;
}

const dropdownOptions: DropdownOption[] = [
    { value: 'all', label: 'All' },
    { value: 'football', label: 'Football' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'basket', label: 'Basketball' },
    { value: 'rugby', label: 'Rugby' },
    { value: 'handball', label: 'Handball' },
];

export function renderNews(): void {
    const app: HTMLElement | null = document.getElementById('app');
    if (app === null) return;

    // ************
    // HTML STRUCTURE
    const container = document.createElement('section');
    container.innerHTML = `
        <h1>News</h1>
        <form id="news-filter-form" class="search-item">
            <label for="news-dropdown">Filter by sport</label>
            <select id="news-dropdown" name="news-dropdown">
                ${dropdownOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
        </form>
        <div id="news-content"></div>
        <button id="load-more">Load more</button>
    `;
    app.appendChild(container);

    const newsContentDiv = document.getElementById('news-content');
    const loadMoreBtn = document.getElementById('load-more') as HTMLButtonElement;
    if (!newsContentDiv || !loadMoreBtn) return;

    let allNews: any[] = [];
    let currentIndex = 0;
    const batchSize = 8;

    function renderBatch() {
        const nextBatch = allNews.slice(currentIndex, currentIndex + batchSize);
        if (!newsContentDiv) return;
        newsContentDiv.innerHTML += nextBatch.map((item) => `
            <div class="news-item">
                <h2>${item.title}</h2>
                <img src="${item.enclosure.$?.url}" alt="${item.title}" />
                <p><em>${new Date(item.pubDate).toLocaleDateString()}</em></p>
                <a href="${item.link}" target="_blank">Lire l'article</a>
            </div>
        `).join('');
        currentIndex += batchSize;

        if (currentIndex >= allNews.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    loadMoreBtn.addEventListener('click', renderBatch);

    (async () => {
        allNews = await newsService.fetchAllNews();
        renderBatch();
    })();

    // ************
    // DROPDOWN FEATURE
    const dropdown = document.getElementById('news-dropdown') as HTMLSelectElement;
    if (!dropdown) return;

    dropdown.addEventListener('change', async (event) => {
        const target = event.target as HTMLSelectElement;
        const selectedValue = target.value;

        newsContentDiv.innerHTML = `
            <p>Loading...</p>
        `;
        currentIndex = 0;
        loadMoreBtn.style.display = 'block';

        if (selectedValue === 'all') {
            allNews = await newsService.fetchAllNews();
        } else {
            allNews = await newsService.fetchNewsBySport(selectedValue);
        }

        newsContentDiv.innerHTML = '';
        renderBatch();
    });

}