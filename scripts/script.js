import 'bootstrap/dist/css/bootstrap.min.css';

async function loadComponent(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

loadComponent("header", "header.html");
loadComponent("footer", "footer.html");
