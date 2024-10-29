document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('seguimiento-form');
    const seguimientoList = document.getElementById('seguimiento-list');

    // Cargar la lista de seguimientos al inicio
    fetch('/lista-seguimiento')
        .then(response => response.json())
        .then(data => {
            data.data.items.forEach(item => {
                agregarFila(item);
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    // Agregar un nuevo seguimiento
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const animalNombre = document.getElementById('animalNombre').value;
        const animalId = document.getElementById('animalId').value;

        const nuevoSeguimiento = {
            nombre: animalNombre,
            id: animalId,
            coordenadas: {
                lat: (Math.random() * (10 - -10) + -10).toFixed(6),
                lon: (Math.random() * (10 - -10) + -10).toFixed(6)
            },
            fecha: new Date().toISOString()
        };

        fetch('/agregar-seguimiento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoSeguimiento)
        })
        .then(response => response.json())
        .then(data => {
            agregarFila(data);
            form.reset(); // Reinicia el formulario
        })
        .catch(error => console.error('Error al agregar el seguimiento:', error));
    });

    function agregarFila(item) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>Lat: ${item.coordenadas.lat}, Lon: ${item.coordenadas.lon}</td>
            <td>${item.fecha}</td>
        `;
        seguimientoList.appendChild(fila);
    }
});
