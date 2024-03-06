'use strict';

import axios from 'axios';

const KEY = '42598538-444db408f0d8256d557c709b2';
const BASE_URI = 'https://pixabay.com/api/';

// Функція для виконання HTTP-запиту до API Pixabay
export async function searchImages(keyword, page = 1) {
   const perPage = 15;

    const url = `${BASE_URI}?key=${KEY}&q=${encodeURIComponent(keyword)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    
    try {
       const { data } = await axios.get(url);
        return data;
        
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
                title: 'Помилка',
                message: 'Будь ласка, введіть текст для пошуку',
                position: 'topCenter',
            });
            return;
        }

        try {
            const images = await searchImages(query);

            if (images.hits.length === 0) {
                iziToast.warning({
                    title: 'Увага',
                    message: 'Вибачте, результатів пошуку не знайдено. Спробуйте інший запит.',
                    position: 'topCenter',
                });
            } else {
                renderImages(images);
            }
        } catch (error) {
            console.error(error.message);
            iziToast.error({
                title: 'Помилка',
                message: 'Під час виконання запиту сталася помилка. Будь ласка, спробуйте ще раз.',
                position: 'topCenter',
            });
        } finally {
            hideLoadingIndicator();
        }
    }

