import { renderCoordinates } from "./views/cruesView";
import { renderNews } from "./views/newsView";
import './style.css';

function router() {
    const path = window.location.pathname;
    const app: HTMLElement | null = document.getElementById('app');
    if (app === null) return;

    app.innerHTML = '';

    if (path === '/news') {
        renderNews();
    } else {
        renderCoordinates();
    }
}

window.addEventListener('popstate', router);
window.addEventListener('load', router);

router();
