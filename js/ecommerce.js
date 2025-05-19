// ecommerce.js

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

const listadoProductos = document.getElementById("listadoProductos");
const carritoItems = document.getElementById("carritoItems");
const totalCarritoSpan = document.getElementById("totalCarrito");
const btnRealizarCompra = document.getElementById("btnRealizarCompra");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    productos = await fetch("./datos/productos.json").then((res) => res.json());
    mostrarProductos();
    mostrarCarrito();
  } catch (error) {
    mostrarAlerta("Error", "No se pudieron cargar los productos.", "error");
    console.error(error);
  }
});

function mostrarProductos() {
  listadoProductos.innerHTML = "";
  productos.forEach(({ id, nombre, precio, imagen }) => {
    const div = document.createElement("div");
    div.className = "col-md-3 mb-3";

    div.innerHTML = `
      <div class="card h-100">
        <img src="${imagen}" class="card-img-top" alt="${nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text">Precio: $${precio}</p>
          <button class="btn btn-primary mt-auto btnAgregar" data-id="${id}">Agregar al carrito</button>
        </div>
      </div>
    `;
    listadoProductos.appendChild(div);
  });

  document.querySelectorAll(".btnAgregar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idProducto = parseInt(btn.dataset.id);
      agregarAlCarrito(idProducto);
    });
  });
}

function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  const productoEnCarrito = carrito.find((p) => p.id === idProducto);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  mostrarCarrito();

  mostrarAlerta(
    "Producto agregado",
    `${producto.nombre} fue agregado al carrito.`,
    "success"
  );
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarCarrito() {
  carritoItems.innerHTML = "";
  if (carrito.length === 0) {
    carritoItems.innerHTML = "<p>El carrito está vacío.</p>";
    btnRealizarCompra.disabled = true;
    totalCarritoSpan.textContent = "0";
    return;
  }

  carrito.forEach(({ id, nombre, precio, cantidad }) => {
    const div = document.createElement("div");
    div.className = "d-flex justify-content-between align-items-center mb-2";

    div.innerHTML = `
      <div>${nombre} x ${cantidad}</div>
      <div>$${precio * cantidad}</div>
      <button class="btn btn-danger btn-sm btnEliminar" data-id="${id}">&times;</button>
    `;
    carritoItems.appendChild(div);
  });

  document.querySelectorAll(".btnEliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idProducto = parseInt(btn.dataset.id);
      eliminarDelCarrito(idProducto);
    });
  });

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  totalCarritoSpan.textContent = total;
  btnRealizarCompra.disabled = false;
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter((p) => p.id !== idProducto);
  guardarCarrito();
  mostrarCarrito();
}

btnRealizarCompra.addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarAlerta("Atención", "No hay productos en el carrito.", "warning");
    return;
  }

  mostrarAlerta("Compra realizada", "Gracias por tu compra.", "success");

  carrito = [];
  guardarCarrito();
  mostrarCarrito();
});
