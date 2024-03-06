import axios from 'axios';

const KEY = '42598538-444db408f0d8256d557c709b2';
const BASE_URI = 'https://pixabay.com/api/';

export async function searchImages(keyword, page = 1) {
    const perPage = 15;

    const url = `${BASE_URI}?key=${KEY}&q=${encodeURIComponent(keyword)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error('HTTP Error: ' + response.status);
        }
        return response.data;

    } catch (error) {
        throw new Error('Error fetching images: ' + error.message);
    }
}

export async function handleSubmit(event) {
    event.preventDefault();

    showLoadingIndicator();
    clearGallery();

    const searchInput = document.querySelector('.search-form input[type="text"]');
    const query = searchInput.value.trim();

    if (query === '') {
        hideLoadingIndicator();
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query',
            position: 'topCenter',
        });
        return;
    }

    try {
        const images = await searchImages(query);

        if (images.hits.length === 0) {
            iziToast.warning({
                title: 'Attention',
                message: 'Sorry, no search results found. Please try another query.',
                position: 'topCenter',
            });
        } else {
            renderImages(images);
        }
    } catch (error) {
        console.error(error.message);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while executing the request. Please try again.',
            position: 'topCenter',
        });
    } finally {
        hideLoadingIndicator();
    }
}