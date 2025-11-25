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


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function fetchProductByCategoryAndId(category, id) {
    try {
        const snapshot = await get(ref(database, `Instruments/${category}/${id}`));
        return snapshot.val();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

function renderProduct(product) {
    if (!product) {
        document.getElementById('product-detail').textContent = 'Товар не найден.';
        return;
    }

    const photoContainer = document.getElementById('product-photo');
    photoContainer.innerHTML = ''; // Clear previous image if any
    const img = document.createElement('img');
    img.src = product.ImageUrl || '../images/instruments/icons/guitar.png';
    img.alt = product.Name || 'Product';
    img.className = 'w-full h-96 object-contain rounded-lg shadow';
    photoContainer.appendChild(img);

    document.getElementById('product-name').textContent = product.Name || 'Название';
    document.getElementById('product-description').textContent = product.Descryption || 'Описание отсутствует.';
    document.getElementById('product-price').textContent = product.Cost ? `${product.Cost} ₽` : 'Цена не указана';
}

document.addEventListener('DOMContentLoaded', async () => {
    const category = getQueryParam('category');
    const id = getQueryParam('id');
    if (!category || !id) {
        document.getElementById('product-detail').textContent = 'Параметры category и id не указаны.';
        return;
    }
    const product = await fetchProductByCategoryAndId(category, id);
    renderProduct(product);
});