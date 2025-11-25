  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getDatabase, get, ref, remove } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
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


    document.addEventListener('DOMContentLoaded', async function () {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const userMenuContent = document.getElementById('user-menu-content');

    // Clear existing menu items to prevent duplicates
    userMenuContent.innerHTML = '';

    // Check session from sessionStorage
    const userID = sessionStorage.getItem('userID');

    if (userID) {
        // Check session in Firebase
        try {
            const sessionSnapshot = await get(ref(database, `sessions/${userID}`));
            const sessionData = sessionSnapshot.val();

            if (sessionData) {  
                // User is logged in, show user menu with logout and profile links
                const isAdmin = sessionData.role == "1" || sessionData.role == 1;

                // Create profile link
                const profileLi = document.createElement('li');
                const profileA = document.createElement('a');
                profileA.className = 'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer';
                profileA.href = isAdmin ? '../html/adminpanel.html' : '../html/personalaccount.html';
                profileA.textContent = isAdmin ? 'Админ панель' : 'Личный кабинет';
                profileLi.appendChild(profileA);
                userMenuContent.appendChild(profileLi);

                // Create logout link
                const logoutLi = document.createElement('li');
                const logoutA = document.createElement('a');
                logoutA.className = 'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer';
                logoutA.href = '#';
                logoutA.textContent = 'Выйти';
                logoutA.addEventListener('click', async (e) => {
                    e.preventDefault();
                    // Remove session from Firebase
                    await remove(ref(database, `sessions/${userID}`));
                    // Clear sessionStorage
                    sessionStorage.removeItem('userID');
                    // Redirect to login page
                    window.location.href = './index.html';
                });
                logoutLi.appendChild(logoutA);
                userMenuContent.appendChild(logoutLi);
            } else {
                // Session not found, show login/register links
                addLoginRegisterLinks();
            }
        } catch (error) {
            console.error('Ошибка при проверке сессии:', error);
            addLoginRegisterLinks();
        }
    } else {
        // No userID in sessionStorage, show login/register links
        addLoginRegisterLinks();
    }

    // Toggle dropdown visibility
userMenuButton.addEventListener('click', function () {
    userMenu.classList.toggle('hidden');
});

// Close dropdown if clicked outside
document.addEventListener('click', function (event) {
    if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
        if (!userMenu.classList.contains('hidden')) {
            userMenu.classList.add('hidden');
        }
    }
});

function addLoginRegisterLinks() {
    const menuItems = [
        { text: 'Вход', href: 'html/login.html' },
        { text: 'Регистрация', href: 'html/registration.html' } // Adjust if registration page differs
    ];

    // Clear existing items
    userMenuContent.innerHTML = '';

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        // Apply Tailwind classes for styling
        a.className = 'block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200';
        a.href = item.href;
        a.textContent = item.text;
        li.appendChild(a);
        userMenuContent.appendChild(li);
    });
}
});
