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


async function checkUserSession() {
    const userID = sessionStorage.getItem('userID');
    if (!userID) {
        // No session, redirect to login
        window.location.href = 'login.html';
        return;
    }
    try {
        const sessionSnapshot = await get(ref(database, `sessions/${userID}`));
        const sessionData = sessionSnapshot.val();
        if (!sessionData) {
            // Session not found, redirect to login
            window.location.href = 'login.html';
            return;
        }
        // Load user-specific data here and display
        await loadUserData(userID);
    } catch (error) {
        console.error('Ошибка при проверке сессии пользователя:', error);
        window.location.href = 'login.html';
    }
}

async function loadUserData(userID) {
    try {
        const clientSnapshot = await get(ref(database, 'Client'));
        const clients = clientSnapshot.val();
        if (clients) {
            const clientArray = Object.values(clients).filter(c => c);
            const user = clientArray.find(c => c.ID_Authorization === userID);
            if (user) {
                document.getElementById('user-name').textContent = user.Name || 'Не указано';
                document.getElementById('user-surname').textContent = user.Surname || 'Не указано';
                document.getElementById('user-dob').textContent = user.Dateofbirth || 'Не указано';
            } else {
                console.warn('Пользователь не найден в Client');
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
    }
}

checkUserSession();
