import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchImages, handleSubmit  } from "./js/pixabay-api";
import { renderImages, updateGallery, hideLoadingIndicator, clearGallery, showLoadingIndicator, toggleLoadMoreButton } from "./js/render-functions";

let currentPage = 1;

document.addEventListener("DOMContentLoaded", async function () {
    const searchForm = document.querySelector('.search-form');
    const loadMoreButton = document.querySelector('.load-more-btn');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const query = event.target.querySelector('input[type="text"]').value.trim();
        currentPage = 1;
        await handleSearch(query, true); 
    });

    loadMoreButton.addEventListener('click', async function () {
        currentPage++;
        const query = document.querySelector('.search-form input[type="text"]').value.trim();
        await handleSearch(query, false); 
    });

    updateGallery(); 
});

async function handleSearch(query, clearGalleryBefore) {
    showLoadingIndicator();

    if (clearGalleryBefore) {
        clearGallery(); 
    }

    if (!query) {
        hideLoadingIndicator();
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query',
            position: 'topCenter',
        });
        return;
    }

    try {
        const images = await searchImages(query, currentPage);

        if (images.hits.length === 0) {
            iziToast.warning({
                title: 'Attention',
                message: 'Sorry, no search results found. Please try another query.',
                position: 'topCenter',
            });
        } else {
            renderImages(images);
            toggleLoadMoreButton(images.totalHits, currentPage);
            if (currentPage * 15 >= images.totalHits) {
                iziToast.info({
                    title: 'End of Results',
                    message: "We're sorry, but you've reached the end of search results.",
                    position: 'topCenter',
                });
            }
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
        smoothScroll();
    }
}

function smoothScroll() {
    const card = document.querySelector('.card');
    if (card) {
        const cardHeight = card.getBoundingClientRect().height;
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth'
        });
    }
}

