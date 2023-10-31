let menu = [];
let productosFacturar = [];
const IVA = 1.21;

function mostrarMenu(arr) {
  let container =
    document.getElementById(
      "container"
    );
  container.innerHTML = "";

  for (const menu of arr) {
    let card =
      document.createElement("div");

    card.innerHTML = `
        <div class="card text-center card-combo" style="width: 18rem;">
            <div class="card-body">
            <img src="${menu.img}" id="" class="card-img-top img-fluid" alt="">
            <h2 class="card-title">${menu.id}</h2>
            <h5 class="card-subtitle mb-2 text-muted">${menu.descripcion}</h5>
            <p class="card-text">$${menu.precio}</p>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button id="agregar${menu.id}" type="button" class="btn btn-dark"> Agregar </button>
            </div>
            </div>
        </div>      
    `;

    container.appendChild(card);

    let boton = document.getElementById(`agregar${menu.id}`);
    boton.addEventListener("click", () => agregarCombo(menu.id));
  }
}

function agregarCombo(idProducto) {
  let existeProducto = productosFacturar.find((x) => x.id === idProducto);

  if (existeProducto) {
    productosFacturar.forEach((x) => {
      if (x.id === idProducto) {
        x.cantidad++;
      }
    });
  } else {
    let producto = menu.find((menu) => menu.id === idProducto);
    producto.cantidad = 1;
    productosFacturar.push(producto);
  };

  localStorage.setItem(
    "productoEnStorage",
    JSON.stringify(productosFacturar)
  );

  emitirFactura(); 
}

function eliminarCombo(idProducto) {
  let eliminarItem = null;

  productosFacturar.forEach((x, index) => {
    if (x.id === idProducto) {
      if (x.cantidad > 1) {
        x.cantidad--;
      } else {
        eliminarItem = index;
      }
    }
  });

  if (eliminarItem !== null) {
    productosFacturar.splice(eliminarItem, 1);
  }

  localStorage.setItem(
    "productoEnStorage",
    JSON.stringify(productosFacturar)
  );

  emitirFactura();
}

function aplicarIVA(monto, IVA) {
  return monto * IVA;
}

function emitirFactura() {
  let total = 0;
  let totalConIva = 0;
  let table = document.getElementById("table");
  let facturaCard = document.getElementById("factura-card");
  let contenidoEnStorage = JSON.parse(
    localStorage.getItem("productoEnStorage")
  );

  if (contenidoEnStorage.length > 0) {
    table.classList.remove("hidden");
    facturaCard.classList.remove("hidden");
    let tablaContenido = document.getElementById("tablaContenido");
    tablaContenido.innerHTML = "";

    contenidoEnStorage.forEach((x) => {
      let fila = document.createElement("tr");
      let totalItem = x.precio * x.cantidad;
      total += totalItem;

      fila.innerHTML = `
            <td>${x.descripcion}</td>
            <td class="col-cantidad"><button type="button" class="btn btn-dark btn-carrito" id="eliminar${x.id}">-</button> ${x.cantidad} <button type="button" class="btn btn-dark btn-carrito" id="sumar${x.id}">+</button> </td>
            <td>$ ${x.precio}</td>
            <td>$ ${totalItem}</td>
            `;

      tablaContenido.appendChild(fila);

      let botonEliminar = document.getElementById(`eliminar${x.id}`);
      botonEliminar.addEventListener("click", () => eliminarCombo(x.id));

      let botonAgregar = document.getElementById(`sumar${x.id}`);
      botonAgregar.addEventListener("click", () => agregarCombo(x.id));
    });

    totalConIva = aplicarIVA(total, IVA);

    let totalConIvaHTML = document.getElementById("totalConIvaHTML");

    totalConIvaHTML.innerHTML = `
        <span>$ ${totalConIva}</span>
         `;

    let confirmarCombo = document.getElementById("confirmarCombo");
    confirmarCombo.addEventListener("click", () => confirmarPedido());
  } else {
    table.classList.add("hidden");
    facturaCard.classList.add("hidden");
  }
}

function limpiarCarrito() {
  productosFacturar = [];

  localStorage.setItem(
    "productoEnStorage",
    JSON.stringify(productosFacturar)
  );

  emitirFactura();
}

function obtenerMenu() {
  fetch("menu.json")
    .then((res) => res.json())
    .then((data) => (menu = data))
    .then(() => {
      mostrarMenu(menu);
    });
}

function confirmarPedido() {
  Swal.fire({
    title: 'Desea confirmar su pedido?',
    text: "",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Pedido confirmado',
        'Realizado con exito',
        'success'
      )
      
      limpiarCarrito()

    }
  })
}

obtenerMenu();