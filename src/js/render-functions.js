import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'izitoast/dist/css/iziToast.min.css';

export function renderImages(images) {
    const gallery = document.querySelector('.gallery');

    images.hits.forEach(image => {
        const cardLink = document.createElement('a');
        cardLink.href = image.largeImageURL;
        cardLink.rel = "noopener noreferrer";
        cardLink.classList.add('card');

        cardLink.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}">
            <div class="metrics">
                ${createMetricContainer('Likes', image.likes).outerHTML}
                ${createMetricContainer('Views', image.views).outerHTML}
                ${createMetricContainer('Comments', image.comments).outerHTML}
                ${createMetricContainer('Downloads', image.downloads).outerHTML}
            </div>
        `;

        gallery.appendChild(cardLink);
    });

    updateGallery();
}

export function toggleLoadMoreButton(totalHits, currentPage) {
    const loadMoreButton = document.querySelector('.load-more-btn');
    loadMoreButton.style.display = currentPage * 15 < totalHits ? 'block' : 'none';

    if (currentPage * 15 >= totalHits) {
        iziToast.info({
            title: 'End of Results',
            message: "We're sorry, but you've reached the end of search results.",
            position: 'topCenter',
        });
    }
}

function createMetricContainer(label, value) {
    const container = document.createElement('div');
    container.classList.add('metric-container');

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    labelSpan.classList.add('metric-label');
    labelSpan.style.fontWeight = 'bold';
    container.appendChild(labelSpan);

    const valueSpan = document.createElement('span');
    valueSpan.textContent = value;
    valueSpan.classList.add('metric-value');
    container.appendChild(valueSpan);

    return container;
}

export function showLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    loadingIndicator.textContent = 'Loading images, please wait...';
    loadingIndicator.style.display = 'block';
}

export function hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    loadingIndicator.style.display = 'none';
}

export function clearGallery() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
}

export function updateGallery() {
    const gallery = new SimpleLightbox('.gallery a', {
        captionDelay: 250
    });
    gallery.refresh();
}