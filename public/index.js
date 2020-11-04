let almacenTodo = "";

function mostrarProducto(data, tipo) {

    for (let i = 0; i < data[tipo].length; i++) {

        almacenTodo += `
        <div class="producto">
        <img src="${data[tipo][i].img}" alt="${data[tipo][i].nombre}">
        <div class="info-producto">
        <h4>${data[tipo][i].nombre}</h4>
          <p>${data[tipo][i].descripccion}</p>
            <p>Precio: ${data[tipo][i].precio}</p>
            <p>Stock: ${data[tipo][i].stock}</p>
            <div id="comprar">
                <input type="number" class="unidades" id="${data[tipo][i].nombre}">
                <button id="botonComprar" onclick=addCesta("${data[tipo][i].nombre}")>Comprar</button>
            </div>
            </div>
            </div>
        `
    }
}


fetch('/almacen').then(function(res) {
    return res.json();
}).then(function(data) {
    
    mostrarProducto(data.almacen, "armarios");
    mostrarProducto(data.almacen, "mesas");
    mostrarProducto(data.almacen, "sillas");

    document.getElementById('resultado').innerHTML = almacenTodo;
})

let seccion

function buscarProducto() {
    seccion = document.getElementById("productoBuscar").value
    fetch(`/almacen/${seccion}`)
        .then(response => response.json())
        .then(data => {

            let almacenSeccion = "";

            if (data.error == true) {
                document.getElementById("resultado").innerHTML = `
                <h2>${data.mensaje}</h2>
                `
            } else {

                for (let i = 0; i < data.length; i++) {

                    almacenSeccion += `
                        <div class="producto">
                            <img src="${data[i].img}" alt="${data[i].nombre}">
                            <div class="info-producto">
                                <h4>${data[i].nombre}</h4>
                                <p>${data[i].descripccion}</p>
                                <p>Precio: ${data[i].precio}</p>
                                <p>Stock: ${data[tipo][i].stock}</p>
                                <div id="comprar">
                                    <input type="number" id="unidades">
                                    <button id="botonComprar" onclick=addCesta("${data[tipo][i].nombre}")>Comprar</button>
                                </div>
                            </div>
                        </div>
                        `
                }
                document.getElementById('resultado').innerHTML = almacenSeccion;
            }
        });
}

function addProducto() {

    let seccion = document.getElementById("categorias").value
    let nombre = document.getElementById("nombreProducto").value
    let descripccion = document.getElementById("descripcionProducto").value
    let img = document.getElementById("fotoProducto").value
    let precio = parseInt(document.getElementById("precioProducto").value)

    let add = { seccion: seccion, nombre: nombre, descripccion: descripccion, img: img, precio: precio }

    fetch("/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(add),
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            almacenTodo = ""
            document.getElementById("nombreProducto").value = ""
            document.getElementById("precioProducto").value = ""
            document.getElementById("fotoProducto").value = ""
            document.getElementById("descripcionProducto").value = ""
            mostrarProducto(data, "armarios");
            mostrarProducto(data, "mesas");
            mostrarProducto(data, "sillas");

            document.getElementById('resultado').innerHTML = almacenTodo;

        });
}

function editProducto() {
    let seccion = document.getElementById("categoriasEdit").value
    let nombre = document.getElementById("nombreEdit").value
    let descripccion = document.getElementById("descripcionEdit").value
    let img = document.getElementById("fotoEdit").value
    let precio = parseInt(document.getElementById("precioEdit").value)

    let producto = {
        seccion: seccion,
        nombre: nombre,
        descripccion: descripccion,
        img: img,
        precio: precio
    }


    fetch('/editar', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        })
        .then(response => response.json())
        .then(function(data) {

            almacenTodo = "";
            mostrarProducto(data, "armarios");
            mostrarProducto(data, "mesas");
            mostrarProducto(data, "sillas");
            document.getElementById('resultado').innerHTML = almacenTodo;

        });
}

function deleteProducto() {
    let nombre = document.getElementById("nombreBorrar").value

    let producto = {
        nombre: nombre,
    }

    fetch('/borrar', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        })
        .then(response => response.json())
        .then(data => {
            almacenTodo = "";
            mostrarProducto(data, "armarios");
            mostrarProducto(data, "mesas");
            mostrarProducto(data, "sillas");
            document.getElementById('resultado').innerHTML = almacenTodo;
        });
}

let mensajeCesta = ""

fetch('/cesta').then(function(res) {
    return res.json();
}).then(function(data) {

    numeroCesta = data.length
    document.getElementById("contador").innerHTML = numeroCesta
    

    for (let i = 0; i < data.length; i++) {
        mensajeCesta += `
        <div class="producto">
        <img src="${data[i].img}" alt="${data[i].nombre}">
        <div class="info-producto">
        <h4>${data[i].nombre}</h4>
          <p>${data[i].descripccion}</p>
            <p>Precio: ${data[i].precio}</p>
            <p>Stock: ${data[i].stock}</p>
            <p>Unidades: ${data[i].cantidad}</p>
            <button id="botonEliminar" onclick=deleteProductoCesta("${data[i].nombre}")>Eliminar</button>
            </div>
            </div>
        `
    }

    document.getElementById("cesta").innerHTML = mensajeCesta;
})

let productoCesta

function addCesta(nombre) {
    let cantidad = parseInt(document.getElementById(nombre).value)
    productoCesta = { nombre: nombre, cantidad: cantidad }

    fetch("/cesta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productoCesta),
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {

            if (data.error == true) {
                window.alert(`${data.mensaje}`)
            }
            document.getElementById("contador").innerHTML = data.cesta.length

            for (let i = 0; i < data.cesta.length; i++) {
                mensajeCesta += `
                <div class="producto">
                <img src="${data.cesta[i].img}" alt="${data.cesta[i].nombre}">
                <div class="info-producto">
                <h4>${data.cesta[i].nombre}</h4>
                  <p>${data.cesta[i].descripccion}</p>
                    <p>Precio: ${data.cesta[i].precio}</p>
                    <p>Stock: ${data.cesta[i].stock}</p>
                    <p>Unidades: ${data.cesta[i].cantidad}</p>
                    <button id="botonEliminar" onclick=deleteProductoCesta("${data.cesta[i].nombre}")>Eliminar</button>
                </div>
            </div>
                `
            }

            window.alert(`${data.mensaje}`)
            document.getElementById("cesta").innerHTML = mensajeCesta;

        });
}

function deleteProductoCesta(nombre) {
    productoCesta = {
        nombre: nombre,
    }

    fetch("/cesta", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productoCesta),
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            for (let i = 0; i < data.cesta.length; i++) {

                mensajeCesta += `
                <div class="producto">
                <img src="${data.cesta[i].img}" alt="${data.cesta[i].nombre}">
                    <div class="info-producto">
                        <h4>${data.cesta[i].nombre}</h4>
                        <p>${data.cesta[i].descripccion}</p>
                        <p>Precio: ${data.cesta[i].precio}</p>
                        <p>Stock: ${data.cesta[i].stock}</p>
                        <p>Unidades: ${data.cesta[i].cantidad}</p>
                        <button id="botonEliminar" onclick=deleteProductoCesta("${data.cesta[i].nombre}")>Eliminar</button>
                        </div>
                </div>
                `
                
            }
            window.alert(`${data.mensaje}`)
            location.reload();
        })
    document.getElementById("cesta").innerHTML = mensajeCesta;
}

function comprar() {

    let comprar = { compra: true }

    fetch("/cesta", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comprar),
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {


            mensajeCesta = ""
            window.alert(`${data.mensaje}`)
            location.reload();


        })
    document.getElementById("cesta").innerHTML = mensajeCesta;
}