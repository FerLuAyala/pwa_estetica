window.addEventListener('DOMContentLoaded', function () {
    // Registro del Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('El SW se registró correctamente', reg))
            .catch(err => console.error('Error al registrar el Service Worker:', err));
    }

    // Elementos del DOM
    const boton = document.getElementById("botonTarea");
    const inputCliente = document.getElementById("cliente");
    const selectorTarea = document.getElementById("tarea");
    const selectorDia = document.getElementById("dia");

    const smallTarea = document.getElementById('smallTarea');
    const smallCliente = document.getElementById('smallCliente');
    const smallDia = document.getElementById('smallDia');

    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const listasPorDia = {};

    dias.forEach(dia => {
        const id = `lista${dia.charAt(0).toUpperCase() + dia.slice(1)}`;
        listasPorDia[dia] = document.getElementById(id);
    });

    // Evento del botón para agregar tareas
    boton.addEventListener("click", agregarTarea);

    // Función para crear tarea y agregar al DOM
    function crearTareaHtml(cliente, tarea, dia, estado = "pendiente") {
        const listaDia = listasPorDia[dia];
        if (!listaDia) return;

        const li = document.createElement("li");
        li.textContent = `${cliente} - Tarea: ${tarea} `;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = estado === "terminado";

        const labelEstado = document.createElement("span");
        labelEstado.textContent = checkbox.checked ? "Terminado" : "Pendiente";
        if (checkbox.checked) li.classList.add("tarea-terminada");

        checkbox.addEventListener("change", () => {
            labelEstado.textContent = checkbox.checked ? "Terminado" : "Pendiente";
            li.classList.toggle("tarea-terminada", checkbox.checked);
            guardarTareasEnLocalStorage();
        });

        const botonEliminar = document.createElement('button');
        const icono = document.createElement('i');
        icono.classList.add('fa-solid', 'fa-trash-can');
        botonEliminar.prepend(icono);
        botonEliminar.addEventListener("click", () => {
            listaDia.removeChild(li);
            guardarTareasEnLocalStorage();
        });

        li.appendChild(checkbox);
        li.appendChild(labelEstado);
        li.appendChild(botonEliminar);
        listaDia.appendChild(li);
    }

    // Función para agregar tarea desde inputs
    function agregarTarea() {
        const cliente = inputCliente.value.trim();
        const tarea = selectorTarea.value;
        const dia = selectorDia.value;

        // Validación
        smallCliente.textContent = cliente ? "" : "Por favor, ingresa un cliente.";
        smallTarea.textContent = tarea ? "" : "Por favor, selecciona una tarea.";
        smallDia.textContent = dia ? "" : "Por favor, selecciona un día.";

        if (!cliente || !tarea || !dia) return;

        crearTareaHtml(cliente, tarea, dia);
        guardarTareasEnLocalStorage();

        // Limpiar inputs
        inputCliente.value = "";
        selectorTarea.value = "";
        selectorDia.value = "";
        inputCliente.focus();
    }

    // Guardar tareas en localStorage
    function guardarTareasEnLocalStorage() {
        const tareasGuardadas = [];

        dias.forEach(dia => {
            const listaDia = listasPorDia[dia];
            [...listaDia.querySelectorAll('li')].forEach(li => {
                const texto = li.firstChild.textContent || "";
                const [cliente, tareaTexto] = texto.split(" - Tarea: ").map(str => str.trim());
                const checkbox = li.querySelector('input[type="checkbox"]');
                const estado = checkbox && checkbox.checked ? "terminado" : "pendiente";
                tareasGuardadas.push({ cliente, tarea: tareaTexto, dia, estado });
            });
        });

        localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));
    }

    // Cargar tareas desde localStorage
    function cargarTareasDesdeLocalStorage() {
        const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

        // Limpiar listas
        dias.forEach(dia => {
            const listaDia = listasPorDia[dia];
            if (listaDia) listaDia.innerHTML = "";
        });

        tareasGuardadas.forEach(({ cliente, tarea, dia, estado }) => {
            crearTareaHtml(cliente, tarea, dia, estado);
        });
    }

    // Cargar tareas al iniciar
    cargarTareasDesdeLocalStorage();
});
