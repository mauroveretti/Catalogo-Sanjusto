/**
 * CONFIGURACIÓN DE SECTOR SAN JUSTO
 */
const miTelefono = "5491168830666"; // Reemplazalo con tu número (sin + ni espacios)
const contenedor = document.getElementById('contenedor-productos');
const buscador = document.getElementById('buscador');

let productosData = []; // Aquí guardaremos la lista completa del JSON

/**
 * 1. CARGA INICIAL DE DATOS
 */
fetch('productos.json?v=' + Date.now())
    .then(response => response.json())
    .then(productos => {
        productosData = productos;
        mostrarProductos(productosData); // Al inicio mostramos todos
    })
    .catch(error => {
        console.error('Error cargando catálogo:', error);
        contenedor.innerHTML = '<p style="color:white;">Error al cargar productos. Por favor, reintentá.</p>';
    });

/**
 * 2. FUNCIÓN PARA RENDERIZAR LAS TARJETAS
 */
function mostrarProductos(lista) {
    contenedor.innerHTML = ''; // Limpiar pantalla antes de dibujar
    
    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; padding: 40px; color: #aaa;">
                <p>No encontramos lo que buscás en el stock de Sector San Justo 😅</p>
                <button onclick="limpiarBuscador()" class="btn-ws" style="display:inline-block; width:auto; padding: 10px 20px; cursor:pointer;">Ver todo el catálogo</button>
            </div>
        `;
        return;
    }
    
    lista.forEach(prod => {
        // Configuramos el mensaje de WhatsApp (Sin precio, pide talle)
        const textoMensaje = `*CONSULTA - SECTOR SAN JUSTO*\n\n` +
                             `🙌 ¡Hola! Me interesa este artículo:\n` +
                             `🛍️ *${prod.nombre.toUpperCase()}*\n\n` +
                             `¿Me podrías pasar el precio y los talles disponibles?`;
        
        const mensajeFinal = encodeURIComponent(textoMensaje);
        
        // Creamos el elemento HTML de la tarjeta
        const card = document.createElement('div');
        card.classList.add('card');
        
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/400x500?text=Sector+San+Justo'">
            <div class="info">
                <h3>${prod.nombre}</h3>
                <p class="consulta-texto">Consultar precio y talles</p>
                <a href="https://wa.me/${miTelefono}?text=${mensajeFinal}" class="btn-ws" target="_blank">
                    Preguntar por WhatsApp
                </a>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

/**
 * 3. LÓGICA DEL BUSCADOR (FILTRO POR NOMBRE)
 */
buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    
    const filtrados = productosData.filter(prod => 
        prod.nombre.toLowerCase().includes(termino)
    );
    
    mostrarProductos(filtrados);
    resetearBotonesCategoria(); // Quitamos el estado "activo" de las categorías al buscar
});

/**
 * 4. LÓGICA DE CATEGORÍAS
 */
function filtrarCategoria(cat) {
    // Manejo visual de botones
    const botones = document.querySelectorAll('.btn-cat');
    botones.forEach(btn => btn.classList.remove('active'));
    
    // Marcamos como activo el botón clickeado
    event.target.classList.add('active');

    // Limpiamos buscador para evitar conflictos
    buscador.value = '';

    if (cat === 'todos') {
        mostrarProductos(productosData);
    } else {
        const filtrados = productosData.filter(prod => prod.categoria === cat);
        mostrarProductos(filtrados);
    }
}

/**
 * FUNCIONES AUXILIARES
 */
function limpiarBuscador() {
    buscador.value = '';
    mostrarProductos(productosData);
    resetearBotonesCategoria();
    document.querySelector('.btn-cat[onclick*="todos"]').classList.add('active');
}

function resetearBotonesCategoria() {
    document.querySelectorAll('.btn-cat').forEach(btn => btn.classList.remove('active'));

}
