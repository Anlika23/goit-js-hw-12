'use strict';


import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchImages } from "./js/pixabay-api";
import { renderImages, updateGallery, hideLoadingIndicator, clearGallery, showLoadingIndicator } from "./js/render-functions";

let currentPage = 1;
let currentKeyword = '';

document.addEventListener("DOMContentLoaded", async function () {
    const searchForm = document.querySelector('.search-form');
    const loadMoreButton = document.querySelector('.load-more-btn');
   
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        currentKeyword = event.target.querySelector('input[type="text"]').value.trim();
        currentPage = 1;
        await handleSearch();
    });

    loadMoreButton.addEventListener('click', async function () {
        currentPage++;
        await handleSearch();
    });

    const defaultQuery = 'your_default_query_here'; 
    const imagesData = await searchImages(defaultQuery);

    renderImages(imagesData);
    updateGallery(); 
});

async function handleSearch() {
    showLoadingIndicator();

    const searchInput = document.querySelector('.search-form input[type="text"]');
    const query = searchInput.value.trim();
    const gallery = document.querySelector('.gallery');

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
        const images = await searchImages(query, currentPage);

        if (images.hits.length === 0) {
            iziToast.warning({
                title: 'Attention',
                message: 'Sorry, no search results found. Please try another query.',
                position: 'topCenter',
            });
        } else {
            renderImages(images);
            // gallery.style.display = 'block'; // Ensure gallery is displayed
            toggleLoadMoreButton(images.totalHits);
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

function toggleLoadMoreButton(totalHits) {
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

function smoothScroll() {
    const cardHeight = document.querySelector('.card').getBoundingClientRect().height;
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth'
    });
}