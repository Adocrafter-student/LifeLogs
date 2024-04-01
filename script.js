window.onload = function() {
    let basePath = window.location.href.includes('localhost') ? '/LifeLogs/#/' : '/#/';
    
    ensureAdminUser();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    function updateNavigationState(currentUser) {
        // Dynamically update navbar based on user's login state
        document.querySelectorAll('a[href^="#/"]').forEach(link => {
            let pageName = link.getAttribute('href').replace('#/', '');
            if (pageName === 'profile' && !currentUser) {
                link.setAttribute('href', '#/login');
            } else {
                link.setAttribute('href', `#/${pageName}`);
            }
        });
    }

    updateNavigationState(currentUser);

    function navigateTo(page) {
        window.location.hash = page;
    }

    function handleNavigation(pageName, currentUser) {
        if (pageName === 'profile' && !currentUser) {
            navigateTo('login');
            return;
        }
        loadPage(pageName);
    }

    function loadPage(page) {
        const container = document.getElementById("container");
        const url = `${basePath}${page}.html`.replace('/#/', '/');
        fetch(url).then(response => {
            if (response.status === 200) {
                return response.text();
            }
            return fetch(`${basePath}404.html`).then(response => response.text());
        }).then(html => {
            container.innerHTML = html;
            document.title = page.charAt(0).toUpperCase() + page.slice(1) + " | LifeLogs";
            if (page === 'login' || page === 'registration') {
                attachFormListener(page);
            }
        }).catch(error => {
            console.error('Failed to load page', error);
        });
    }

    document.querySelectorAll("a.nav-link, a[href^='#']").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            let pageName = this.getAttribute("href").replace('#/', '');
            navigateTo(pageName);
        });
    });

    window.addEventListener('hashchange', function() {
        let page = window.location.hash.replace('#/', '') || 'featured';
        handleNavigation(page, currentUser);
    });

    // Load the initial page based on the current URL hash
    let initialPage = window.location.hash.replace('#/', '') || 'featured';
    handleNavigation(initialPage, currentUser);

    function handleAuth(page, userDetails) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userExists = users.some(user => user.username === userDetails.username);

        if (page === 'login') {
            let validLogin = users.some(user => user.username === userDetails.username && user.password === userDetails.password);
            if (validLogin) {
                localStorage.setItem('currentUser', JSON.stringify({username: userDetails.username, email: userDetails.email}));
                alert('Login successful');
                window.location.hash = '#/profile';
            } else {
                alert('Invalid credentials');
            }
        } else if (page === 'registration') {
            if (!userExists) {
                users.push(userDetails);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful. Please log in.');
                window.location.hash = '#/login';
            } else {
                alert('User already exists.');
            }
        }
    }

    function updateNavigationState(currentUser) {
        // Dynamically update navbar based on user's login state
        document.querySelectorAll('a[href="/profile"]').forEach(link => {
            link.setAttribute('href', currentUser ? '#/profile' : '#/login');
        });
    }

    function ensureAdminUser() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let adminExists = users.some(user => user.username === 'admin');
        if (!adminExists) {
            users.push({username: 'admin', password: 'admin', email: 'admin@admin.org'});
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function attachFormListener(page) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const userDetails = {
                    username: formData.get('username'),
                    password: formData.get('password'),
                    email: page === 'registration' ? formData.get('email') : null 
                };
                handleAuth(page, userDetails);
            });
        }
    }
};
