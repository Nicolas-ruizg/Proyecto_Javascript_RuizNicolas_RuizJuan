document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const speedControl = document.getElementById('speed');

    // Establece la velocidad inicial del video
    video.playbackRate = speedControl.value;

    // Cambia la velocidad del video cuando se ajusta el control
    speedControl.addEventListener('input', function() {
        video.playbackRate = this.value;
    });
});





let pagina = 1;
let informacion;

function listarElementos() {
    // Obtener la categoría seleccionada
    let categoria = document.querySelector("#category").value;
    let lista = document.querySelector("#list");

    // Mostrar u ocultar el filtro de color de piel según la categoría seleccionada
    if (categoria === "people") {
        document.querySelector("#Category section").style.display = "block";
    } else {
        document.querySelector("#Category section").style.display = "none";
    }

    // Obtener el color de piel seleccionado
    let color = document.querySelector("#options").value;

    // Realizar la solicitud de la API
    fetch(`https://swapi.dev/api/${categoria}/?page=${pagina}`)
        .then(response => response.json())
        .then(data => {
            informacion = data.results;
            lista.innerHTML = '';

            // Mostrar los elementos filtrados
            informacion.forEach(elemento => {
                if (color === "default" || elemento.skin_color === color) {
                    const div = document.createElement('div');
                    div.classList.add('elemento');

                    const p = document.createElement('p');
                    p.textContent = elemento.name || elemento.title;
                    div.appendChild(p);

                    const botonInfo = document.createElement('a');
                    botonInfo.innerHTML = '<img src="assets/more.svg" alt="Más información">';
                    botonInfo.href = `item.html?type=${categoria}&id=${elemento.url.split('/').filter(Boolean).pop()}`;
                    botonInfo.classList.add('info');
                    div.appendChild(botonInfo);

                    lista.appendChild(div);
                }
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

document.querySelector("#searchForm button").addEventListener('click', () => {
    let busqueda = document.querySelector("#searchField").value;
    let categoria = document.querySelector("#filter").value;
    
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
