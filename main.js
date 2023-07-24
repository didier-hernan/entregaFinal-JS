function ordenarProductos() {
    const orden = document.getElementById("orden").value;
  
    if (orden === "precioAscendente") {
      productos.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precioDescendente") {
      productos.sort((a, b) => b.precio - a.precio);
    }
  
    mostrarResultados(productos);
  }

  function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
  }
// Array de productos
let productos = [
  { id: 1, nombre: "Fender Stratocaster", precio: 10, cantidad: 0, imagen: "1.jpg", stock: 5 },
  { id: 2, nombre: "Gibson Les Paul", precio: 15, cantidad: 0, imagen: "2.png", stock: 5 },
  { id: 3, nombre: "Ibanez RG550", precio: 20, cantidad: 0, imagen: "producto3.jpg", stock: 3},
  { id: 4, nombre: "PRS Custom 24", precio: 25, cantidad: 0, imagen: "producto4.jpg", stock: 5 },
  { id: 5, nombre: "Jackson Soloist", precio: 30, cantidad: 0, imagen: "producto5.png", stock: 6 },
  { id: 6, nombre: "ESP Eclipse", precio: 35, cantidad: 0, imagen: "producto6.webp" , stock: 5},
];

  let agregarGuitarraBtn = document.getElementById("guardarProductoBtn")

// Función para guardar los datos de los productos en el localStorage
function guardarProductos() {
  localStorage.setItem('productos', JSON.stringify(productos));
}

// Función para cargar los datos de los productos desde el localStorage
function cargarProductos() {
  const productosGuardados = localStorage.getItem('productos');
  if (productosGuardados) {
    productos = JSON.parse(productosGuardados);
    mostrarResultados(productos);
  }
  limpiarCampos();
  actualizarStockCatalogo(); // Actualizar el stock en el catálogo
}

// Llamada a la función cargarProductos al cargar la página
window.addEventListener('load', cargarProductos);

// Función para agregar un producto al stock
function agregarStock() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;

  const nuevoProducto = {
    id: generarIdUnico(),
    nombre: nombre,
    precio: parseFloat(precio),
    cantidad: 0,
    stock: parseInt(stock),
    imagen: "nuevo.jpg"
  };

  productos.push(nuevoProducto);

  // Guardar los cambios en el localStorage
  guardarProductos();

  // Resetear los campos de nombre, precio y stock
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";

mostrarResultados(productos);
  limpiarCampos();
}
function generarIdUnico() {
  return productos.length + 1; // Generar el ID basado en la longitud del array de productos
}
// Función para eliminar un producto del stock
function eliminarStock() {
  const nombreProducto = document.getElementById("nombreEliminar").value.toLowerCase();

  const productoIndex = productos.findIndex((producto) => producto.nombre.toLowerCase() === nombreProducto);
  if (productoIndex !== -1) {
    productos.splice(productoIndex, 1);
    guardarProductos(); // Guardar los cambios en el localStorage
    mostrarResultados(productos); // Actualizar el catálogo en la interfaz
    document.getElementById("formularioEliminar").reset(); // Resetear el formulario
    actualizarStockCatalogo(); // Actualizar el stock en el catálogo
  } else {
    alert("No se encontró un producto con ese nombre");
  }
}

function actualizarStockCatalogo() {
  const catalogo = document.getElementById("catalogo");

  productos.forEach((producto) => {
    const productoEnCatalogo = catalogo.querySelector(`[data-id="${producto.id}"]`);

    if (productoEnCatalogo) {
      const stockElement = productoEnCatalogo.querySelector(".stock");
      stockElement.textContent = producto.stock;
    }
  });
}
//carrito de compras
const carrito = [];

function mostrarCatalogo(array) {
  const catalogo = document.getElementById("catalogo");

  if (catalogo.style.display === "none") {
    catalogo.style.display = "block";
    mostrarResultados(productos);
  } else {
    catalogo.style.display = "none";
  }
}

function agregarProducto(id) {
  const producto = productos.find((p) => p.id === id);

  if (producto) {
    const carritoIndex = carrito.findIndex((item) => item.id === producto.id);

    if (carritoIndex !== -1) {
      // Validar si se ha alcanzado el stock máximo
      if (carrito[carritoIndex].cantidad + 1 <= producto.stock) {
        carrito[carritoIndex].cantidad++;
      } else {
        alert('No hay suficiente stock disponible');
      }
    } else {
      // Validar si hay stock disponible
      if (producto.stock > 0) {
        // Validar si se ha alcanzado el stock máximo
        if (producto.cantidad < producto.stock) {
          producto.cantidad++;
          carrito.push(producto);
        } else {
          alert('No hay suficiente stock disponible');
        }
      } else {
        alert('No hay stock disponible');
      }
    }

    actualizarCarrito();
  } else {
    alert('Producto no encontrado');
  }
}
// Función para eliminar un producto del carrito de compra
function eliminarProductoCarrito(id) {
  const producto = carrito.find((item) => item.id === id);

  if (producto) {
    producto.cantidad--;

    // Aumentar el stock disponible al eliminar del carrito
    producto.stock++;

    if (producto.cantidad === 0) {
      const index = carrito.findIndex((item) => item.id === id);
      carrito.splice(index, 1);
    }

    actualizarCarrito();
  }
}


  // Función para confirmar la compra
  function confirmarCompra() {
    alert("Compra confirmada. ¡Gracias por tu compra!");
    carrito.length = 0; // Vaciar el carrito
    actualizarCarrito();
  }
  
  // Función para buscar productos
  function buscarProductos() {
    const busqueda = document.getElementById("busqueda").value.toLowerCase();
    const resultados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda)
    );
    mostrarResultados(resultados);
  }
  
  // Función para mostrar los resultados de búsqueda en el catálogo
  function mostrarResultados(resultados) {
    const catalogo = document.getElementById("catalogo");
    let htmlCatalogo = "";
  
    resultados.forEach((producto) => {
      htmlCatalogo += `
        <div class="col-md-6">
          <div class="producto">
          <img src="img/${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio}</p>
            <button class="btn btn-primary" onclick="agregarProducto(${producto.id})">+</button>
          </div>
        </div>
      `;
    });
  
    catalogo.innerHTML = htmlCatalogo;
  }
  
  // Función para actualizar el contenido del carrito en la página
  function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalPrecio = document.getElementById("total-precio");
    let htmlCarrito = "";
    let total = 0;
  
    carrito.forEach((producto) => {
      htmlCarrito += `<li>${producto.nombre} - $${producto.precio} x ${producto.cantidad} <button onclick="eliminarProductoCarrito(${producto.id})">-</button></li>`;
      total += producto.precio * producto.cantidad;
    });
  
    listaCarrito.innerHTML = htmlCarrito;
    totalPrecio.textContent = total;
  }
  
  // Mostrar todos los productos en el catálogo inicialmente
  mostrarResultados(productos);