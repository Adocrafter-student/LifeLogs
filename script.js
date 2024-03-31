window.onload = function() {
    let basePath = window.location.href.includes('localhost') ? '/LifeLogs/#/' : '/#/';

    let pageFromHash = window.location.hash.replace('#/', '') || 'featured';
    handleNavigation(pageFromHash);

    document.querySelectorAll("a.nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            let newHash = this.getAttribute("href").replace('./', '');
            window.location.hash = newHash;
            let pageName = newHash.replace('#/', '').replace('.html', '') || 'featured';
            handleNavigation(pageName);
        });
    });

    window.addEventListener('hashchange', function() {
        let page = window.location.hash.replace('#/', '').replace('.html', '') || 'featured';
        handleNavigation(page);
    });

    function handleNavigation(pageName) {
        loadPage(pageName);
    }

    function loadPage(page) {
        const container = document.getElementById("container");
        const url = `${window.location.origin}${basePath}${page}.html`.replace('#/', '');
        fetch(url).then(response => {
            if (response.status === 200) {
                return response.text();
            }
            return fetch(`${window.location.origin}${basePath}404.html`.replace('#/', '')).then(response => response.text());
        }).then(html => {
            container.innerHTML = html;
            document.title = page.charAt(0).toUpperCase() + page.slice(1) + " | LifeLogs";
        }).catch(error => {
            console.error('Failed to load page', error);
        });
    }
}
