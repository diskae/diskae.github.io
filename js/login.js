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

// Функция для входа пользователя
async function loginUser() {
    console.log("loginUser called");
    const loginButton = document.getElementById("loginButton");
    loginButton.disabled = true;

    // Получение email и пароля из формы
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Простая валидация формы
    if (!email || !password) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Введите логин и пароль!",
          });
        loginButton.disabled = false;
        return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Введите корректный email!",
          });
        loginButton.disabled = false;
        return;
    }

    try {
        // Получение данных из коллекции "Authorization"
        const snapshot = await get(ref(database, 'Authorization'));
        const users = snapshot.val();

        // Фильтрация потенциальных пустых элементов
        const filteredUsers = Object.values(users).filter(u => u);

        // Поиск пользователя с соответствующим email и паролем (без учета регистра)
        const user = filteredUsers.find(u => u.Login.toLowerCase() === email.toLowerCase() && u.Password === password);

        if (user) {
            // Создание сессии в базе данных Firebase
            const sessionRef = ref(database, `sessions/${user.ID_Authorization}`);
            await set(sessionRef, {
                userID: user.ID_Authorization,
                loginTime: Date.now(),
                role: user.ID_Post
            });

            // Сохранение userID в sessionStorage для идентификации сессии
            sessionStorage.setItem('userID', user.ID_Authorization);

            // Проверка, является ли пользователь администратором
            console.log("User role ID_Post:", user.ID_Post);
            const isAdmin = user.ID_Post == "1" || user.ID_Post == 1;

            if (isAdmin) {
                // Перенаправление на страницу администратора
                window.location.href = '../html/adminpanel.html';
            } else {
                // Перенаправление на страницу личного кабинета
                window.location.href = '../html/personalaccount.html';
            }
        } else {
            // Пользователь не найден или неверный email/пароль
            console.error('Пользователь не найден или неверный логин/пароль.');
            Swal.fire({
                icon: "error",
                title: "Ошибка...",
                text: "Неправильный логин или пароль!",
              });
        }
    } catch (error) {
        // Обработка ошибок при получении данных пользователя
        console.error('Ошибка при получении данных пользователя:', error);
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Произошла ошибка при входе. Попробуйте позже.",
        });
    } finally {
        loginButton.disabled = false;
    }
}

document.getElementById('loginButton').addEventListener('click', loginUser);
