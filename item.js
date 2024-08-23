const tipo = new URLSearchParams(window.location.search).get("type");
const id = new URLSearchParams(window.location.search).get("id");

fetch(`https://swapi.dev/api/${tipo}/${id}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("h1").textContent = data.name;

        let lista = document.querySelector(".details div");
        lista.innerHTML = '';

        for (const clave in data) {
            if (data.hasOwnProperty(clave)) {
                const div = document.createElement("div");
                const span = document.createElement("span");
                const parrafo = document.createElement("p");

                span.textContent = `${clave.charAt(0).toUpperCase() + clave.slice(1)}: `;
                
                if (Array.isArray(data[clave])) {
                    data[clave].forEach(url => {
                        fetch(url)
                            .then(response => response.json())
                            .then(dato => {
                                parrafo.innerHTML += `- ${dato.name || dato.title}<br>`;
                            });
                    });
                } else if (/^https:\/\/swapi/.test(data[clave])) {
                    fetch(data[clave])
                        .then(response => response.json())
                        .then(dato => {
                            parrafo.textContent = `${dato.name || dato.title}`;
                        });
                } else {
                    parrafo.textContent = data[clave];
                }

                div.appendChild(span);
                div.appendChild(parrafo);
                lista.appendChild(div);
            }
        }
    })
    .catch(error => console.error('Error:', error));
