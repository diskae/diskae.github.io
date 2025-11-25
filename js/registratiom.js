  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getDatabase, get, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
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


function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

async function getNextId(nodeName) {
    const snapshot = await get(ref(database, nodeName));
    const data = snapshot.val() || {};
    const ids = Object.keys(data).map(key => parseInt(key, 10)).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
}

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    if (!registerButton) {
        console.log("registerButton not found");
        return;
    }
    console.log("registratiom.js loaded and registerButton found");

    registerButton.addEventListener('click', async () => {
        console.log("registerButton clicked");
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const nameInput = document.getElementById('name');
        const surnameInput = document.getElementById('surname');
        const dateofbirthInput = document.getElementById('dateofbirth');

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const name = nameInput.value.trim();
        const surname = surnameInput.value.trim();
        const dateofbirthRaw = dateofbirthInput.value;
        const dateofbirth = formatDateToDDMMYYYY(dateofbirthRaw);

        if (!email || !password || !confirmPassword || !name || !surname || !dateofbirthRaw) {
            Swal.fire('Ошибка', 'Пожалуйста, заполните все поля', 'error');
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire('Ошибка', 'Пароли не совпадают', 'error');
            return;
        }

        try {
            const snapshot = await get(ref(database, 'Authorization'));
            const users = snapshot.val() || {};
            const userExists = Object.values(users).some(user => user.Login.toLowerCase() === email.toLowerCase());
            if (userExists) {
                Swal.fire('Ошибка', 'Пользователь с таким email уже существует', 'error');
                return;
            }

            const newAuthorizationId = await getNextId('Authorization');
            const newClientId = await getNextId('Client');

            await set(ref(database, `Authorization/${newAuthorizationId}`), {
                ID_Authorization: newAuthorizationId.toString(),
                Login: email,
                Password: password,
                ID_Post: "0"
            });

            await set(ref(database, `Client/${newClientId}`), {
                ID_Client: newClientId.toString(),
                ID_Authorization: newAuthorizationId.toString(),
                Name: name,
                Surname: surname,
                Dateofbirth: dateofbirth
            });

            Swal.fire('Успех', 'Регистрация прошла успешно', 'success').then(() => {
                window.location.href = 'login.html';
            });
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            Swal.fire('Ошибка', 'Произошла ошибка при регистрации. Попробуйте позже.', 'error');
        }
    });
});
