let pagina = 1;
let informacion;

function listarElementos() {
    // Obtener la categoría seleccionada
    let categoria = document.querySelector("#category").value;
    let lista = document.querySelector("#list");

    // Realizar la solicitud de la API
    fetch(`https://swapi.dev/api/${categoria}/?page=${pagina}`)
        .then(response => response.json())
        .then(data => {
            informacion = data.results;
            lista.innerHTML = '';
            informacion.forEach(elemento => {
                const div = document.createElement('div');
                div.classList.add('elemento');

                const p = document.createElement('p');
                p.textContent = elemento.name || elemento.title;
                div.appendChild(p);

                const botonInfo = document.createElement('a');
                botonInfo.innerHTML = '<img src="./imagenes/icono-removebg-preview.png" alt="Más información">';
                botonInfo.href = `item.html?type=${categoria}&id=${elemento.url.split('/').filter(Boolean).pop()}`;
                botonInfo.classList.add('info');
                div.appendChild(botonInfo);

                lista.appendChild(div);
            });

            gestionarPaginacion(data);
        })
        .catch(error => console.error('Error:', error));
}

function gestionarPaginacion(data) {
    const botones = document.querySelector("#buttons");
    botones.innerHTML = '';

    if (data.previous) {
        const botonAnterior = document.createElement('button');
        botonAnterior.textContent = 'Anterior';
        botonAnterior.addEventListener('click', () => {
            pagina--;
            listarElementos();
        });
        botones.appendChild(botonAnterior);
    }

    if (data.next) {
        const botonSiguiente = document.createElement('button');
        botonSiguiente.textContent = 'Siguiente';
        botonSiguiente.addEventListener('click', () => {
            pagina++;
            listarElementos();
        });
        botones.appendChild(botonSiguiente);
    }
}

document.querySelector("#category").addEventListener('change', () => {
    pagina = 1;
    listarElementos();
});

document.querySelector("#filter").addEventListener('change', () => {
    pagina = 1;
    listarElementos();
});

document.querySelector("#searchForm button").addEventListener('click', (event) => {
    event.preventDefault();  // Previene el comportamiento predeterminado del botón

    let busqueda = document.querySelector("#searchField").value;
    let categoria = document.querySelector("#category").value;

    fetch(`https://swapi.dev/api/${categoria}/?search=${busqueda}`)
        .then(response => response.json())
        .then(data => {
            informacion = data.results;
            if (informacion.length > 0) {
                window.location.href = `item.html?type=${categoria}&id=${informacion[0].url.split('/').filter(Boolean).pop()}`;
            } else {
                alert("No se encontró ningún resultado.");
            }
        })
        .catch(error => console.error('Error:', error));
});
