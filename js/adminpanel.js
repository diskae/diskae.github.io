  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getDatabase, ref, onValue, remove, update, set, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
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


const categorySelect = document.getElementById('category-select');
const instrumentList = document.getElementById('instrument-list');
const instrumentForm = document.getElementById('instrument-form');
const instrumentIdInput = document.getElementById('instrument-id');
const instrumentNameInput = document.getElementById('instrument-name');
const instrumentPriceInput = document.getElementById('instrument-price');
const instrumentDescriptionInput = document.getElementById('instrument-description');
const instrumentImageUrlInput = document.getElementById('instrument-image-url');
const cancelEditButton = document.getElementById('cancel-edit');

let currentCategory = '';
let editingInstrumentId = null;

function loadInstruments(category) {
    instrumentList.innerHTML = '';
    if (!category) return;

    const instrumentsRef = ref(database, 'Instruments/' + category);
    onValue(instrumentsRef, (snapshot) => {
        instrumentList.innerHTML = '';
        const instruments = snapshot.val();
        if (instruments) {
            Object.entries(instruments).forEach(([id, instrument]) => {
                const li = document.createElement('li');
                li.className = 'bg-white dark:bg-gray-800 p-3 rounded shadow flex justify-between items-center';

                const infoDiv = document.createElement('div');
                infoDiv.innerHTML = `<strong>${instrument.Name}</strong> - ${instrument.Cost} ₽<br/><small>${instrument.Descryption}</small><br/><img src="${instrument.ImageUrl || ''}" alt="${instrument.Name}" class="w-20 h-20 object-contain mt-2 rounded" />`;

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'space-x-2 rtl:space-x-reverse';

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Изменить';
                editBtn.className = 'bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600';
                editBtn.addEventListener('click', () => {
                    editingInstrumentId = id;
                    instrumentIdInput.value = id;
                    instrumentNameInput.value = instrument.Name;
                    instrumentPriceInput.value = instrument.Cost;
                    instrumentDescriptionInput.value = instrument.Descryption;
                    instrumentImageUrlInput.value = instrument.ImageUrl || '';
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Удалить';
                deleteBtn.className = 'bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700';
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Удалить инструмент "${instrument.Name}"?`)) {
                        remove(ref(database, `Instruments/${category}/${id}`));
                    }
                });

                buttonsDiv.appendChild(editBtn);
                buttonsDiv.appendChild(deleteBtn);

                li.appendChild(infoDiv);
                li.appendChild(buttonsDiv);

                instrumentList.appendChild(li);
            });
        }
    });
}

// Handle category change
categorySelect.addEventListener('change', () => {
    currentCategory = categorySelect.value;
    editingInstrumentId = null;
    instrumentForm.reset();
    loadInstruments(currentCategory);
});

// Handle form submit for add/edit
instrumentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentCategory) {
        alert('Пожалуйста, выберите категорию.');
        return;
    }
    const id = editingInstrumentId || instrumentNameInput.value.toLowerCase().replace(/\s+/g, '-');
    const instrumentData = {
        Name: instrumentNameInput.value,
        Cost: Number(instrumentPriceInput.value),
        Descryption: instrumentDescriptionInput.value,
        ImageUrl: instrumentImageUrlInput.value.trim()
    };
    const instrumentRef = ref(database, `Instruments/${currentCategory}/${id}`);

    if (editingInstrumentId) {
        update(instrumentRef, instrumentData).then(() => {
            alert('Инструмент обновлен');
            instrumentForm.reset();
            editingInstrumentId = null;
        });
    } else {
        set(instrumentRef, instrumentData).then(() => {
            alert('Инструмент добавлен');
            instrumentForm.reset();
        });
    }
});

// Cancel edit button
cancelEditButton.addEventListener('click', () => {
    editingInstrumentId = null;
    instrumentForm.reset();
});



