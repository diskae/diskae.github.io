import { loadInstruments } from './instrumentsLoader.js';

const searchInput = document.getElementById('instrument-search');
const searchResults = document.getElementById('search-results');
const carouselTrack = document.getElementById('carousel-track');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');

let allInstruments = [];
let currentSlide = 0;
const itemsPerSlide = 3; // Number of items to show at a time, used for calculating the number of slides
const cardWidth = 320; // Width of each card, adjust if you change the card size

// Load all instruments from all categories for search and carousel
async function loadAllInstruments() {
    const categories = ['acoustic-guitars', 'bass-guitars', 'combo-amps', 'drums', 'e-drums', 'electric-guitars', 'guitars'];
    let instruments = [];
    for (const category of categories) {
        try {
            const snapshot = await fetchInstruments(category);
            console.log(`Loaded ${snapshot.length} instruments for category: ${category}`);
            instruments = instruments.concat(snapshot);
        } catch (error) {
            console.error('Error loading instruments for category', category, error);
        }
    }
    allInstruments = instruments;
    console.log(`Total instruments loaded: ${allInstruments.length}`);
}

// Fetch instruments data from Firebase for a category
async function fetchInstruments(category) {
    const response = await fetch(`https://webkafire-default-rtdb.firebaseio.com/Instruments/${category}.json`);
    const data = await response.json();
    if (!data) return [];
    return Object.entries(data).map(([id, instrument]) => ({
        id,
        name: instrument.Name,
        category,
        price: instrument.Cost,
        photoUrl: instrument.ImageUrl || '../images/instruments/icons/guitar.png'
    }));
}

// Search input event handler
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResults.innerHTML = '';
        searchResults.classList.add('hidden');
        return;
    }
    const filtered = allInstruments.filter(inst => inst.name.toLowerCase().includes(query));
    renderSearchResults(filtered);
});

// Render search results dropdown
function renderSearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<li class="p-2 text-gray-500">Инструменты не найдены</li>';
        searchResults.classList.remove('hidden');
        return;
    }
    searchResults.innerHTML = results.map(inst => `
        <li class="p-2 hover:bg-blue-100 cursor-pointer" data-category="${inst.category}" data-id="${inst.id}">
            ${inst.name}
        </li>
    `).join('');
    searchResults.classList.remove('hidden');
}

// Click on search result redirects to product page
searchResults.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const category = li.getAttribute('data-category');
    const id = li.getAttribute('data-id');
    if (category && id) {
        window.location.href = `html/product.html?category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`;
    }
});

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.classList.add('hidden');
    }
});

// Carousel functionality
let carouselItems = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadCarousel() {
    // Load instruments from all categories for carousel
    shuffleArray(allInstruments); // Shuffle before slicing

    // Get only the first 8 instruments
    carouselItems = allInstruments.slice(0, 8);
    renderCarousel();
}

function renderCarousel() {
    carouselTrack.innerHTML = '';
    carouselItems.forEach(inst => {
        const card = document.createElement('div');
        card.className = 'snap-start w-64 md:w-80 lg:w-96 p-4 bg-white rounded-lg shadow-md flex-shrink-0 mr-4';
        card.style.boxSizing = 'border-box';
        card.innerHTML = `
            <img src="${inst.photoUrl}" alt="${inst.name}" class="w-full h-48 object-cover rounded-md mb-4">
            <h3 class="text-xl font-semibold mb-2 text-center">${inst.name}</h3>
            <p class="text-blue-700 font-bold">${inst.price ? inst.price + ' ₽' : 'Цена не указана'}</p>
            <a href="html/product.html?category=${encodeURIComponent(inst.category)}&id=${encodeURIComponent(inst.id)}" class="mt-3 text-blue-600 hover:underline">Подробнее</a>
        `;
        carouselTrack.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;

    const scrollAmount = 320;

    carouselPrev.addEventListener('click', () => {
        carouselTrack.scrollLeft -= scrollAmount;
    });

    carouselNext.addEventListener('click', () => {
        carouselTrack.scrollLeft += scrollAmount;
    });

    carouselTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPos = e.clientX;
        currentTranslate = carouselTrack.scrollLeft;
        carouselTrack.classList.add('grabbing');
    });

    carouselTrack.addEventListener('mouseup', () => {
        isDragging = false;
        carouselTrack.classList.remove('grabbing');
    });

    carouselTrack.addEventListener('mouseleave', () => {
        isDragging = false;
        carouselTrack.classList.remove('grabbing');
    });

    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const distance = e.clientX - startPos;
        carouselTrack.scrollLeft = currentTranslate - distance;
    });
});
loadAllInstruments().then(() => {
    loadCarousel();
});