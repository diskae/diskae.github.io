  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCVqmUfhu4AbUtqCY8M1RBwGcqYaVMYavg",
    authDomain: "webkafire.firebaseapp.com",
    databaseURL: "https://webkafire-default-rtdb.firebaseio.com",
    projectId: "webkafire",
    storageBucket: "webkafire.firebasestorage.app",
    messagingSenderId: "1018606117854",
    appId: "1:1018606117854:web:0d4d590c80cb339246334f",
    measurementId: "G-W4SYG6Y9L1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);


let cachedInstruments = [];

export async function loadInstruments(category, containerId) {
    console.log(`Loading instruments for category: ${category}`);
    const instrumentsList = document.getElementById(containerId);
    if (!instrumentsList) {
        console.error(`Container with id '${containerId}' not found.`);
        return;
    }

    try {
        const snapshot = await get(ref(database, `Instruments/${category}`));
        const instrumentsData = snapshot.val() || {};
        console.log(`Fetched instruments data for category ${category}:`, instrumentsData);

        cachedInstruments = Object.entries(instrumentsData).map(([id, instrument]) => ({
            id,
            name: instrument.Name,
            description: instrument.Descryption,
            price: instrument.Cost,
            photoUrl: instrument.ImageUrl || '../images/instruments/icons/guitar.png'
        }));

        if (cachedInstruments.length === 0) {
            instrumentsList.textContent = 'Инструменты не найдены.';
            return;
        }

        renderInstruments(cachedInstruments, instrumentsList, category);
    } catch (error) {
        console.error('Error fetching instruments:', error);
        instrumentsList.textContent = 'Ошибка загрузки инструментов.';
    }
}

function renderInstruments(instruments, container, category) {
    container.innerHTML = '';
    instruments.forEach(instrument => {
        const card = createInstrumentCard(instrument, category);
        container.appendChild(card);
    });
}

function sortInstrumentsByPriceAsc() {
    if (!cachedInstruments.length) return;
    const sorted = [...cachedInstruments].sort((a, b) => a.price - b.price);
    const instrumentsList = document.getElementById('instruments-list');
    renderInstruments(sorted, instrumentsList, 'electric-guitars');
}

function sortInstrumentsByPriceDesc() {
    if (!cachedInstruments.length) return;
    const sorted = [...cachedInstruments].sort((a, b) => b.price - a.price);
    const instrumentsList = document.getElementById('instruments-list');
    renderInstruments(sorted, instrumentsList, 'electric-guitars');
}

document.addEventListener('DOMContentLoaded', () => {
    const sortAscBtn = document.getElementById('sort-price-asc');
    const sortDescBtn = document.getElementById('sort-price-desc');

    if (sortAscBtn) {
        sortAscBtn.addEventListener('click', () => {
            sortInstrumentsByPriceAsc();
        });
    }

    if (sortDescBtn) {
        sortDescBtn.addEventListener('click', () => {
            sortInstrumentsByPriceDesc();
        });
    }
});

function createInstrumentCard(instrument, category) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow p-4 flex flex-col items-center';

    const img = document.createElement('img');
    img.src = instrument.photoUrl;
    img.alt = instrument.name || 'Instrument';
    img.className = 'w-full h-48 object-contain mb-4';
    card.appendChild(img);

    const name = document.createElement('h2');
    name.textContent = instrument.name || 'Название';
    name.className = 'text-lg font-semibold mb-2';
    card.appendChild(name);

    const price = document.createElement('p');
    price.textContent = instrument.price ? `${instrument.price} ₽` : 'Цена не указана';
    price.className = 'text-blue-700 font-bold';
    card.appendChild(price);


    // Link to detailed page based on category
    let detailPage = 'product.html'; // use generic product page for all categories
    const link = document.createElement('a');
    link.href = `${detailPage}?category=${encodeURIComponent(category)}&id=${encodeURIComponent(instrument.id)}`;
    link.className = 'mt-3 text-blue-600 hover:underline';
    link.textContent = 'Подробнее';
    card.appendChild(link);

    return card;
}
