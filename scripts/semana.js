
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado:', reg))
      .catch(err => console.error('Error al registrar el Service Worker:', err));
  }


  //elementos del DOM
  const boton = document.getElementById("botonTarea"); 
  const inputCliente = document.getElementById("cliente");
  const selectorTarea = document.getElementById("tarea");  
  const selectorDia = document.getElementById("dia");

  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  const listasPorDia = {};

  const tareas=['unias' , 'pestañas', 'depilacion', 'cejas', 'pigmentacion'];
  const listasTareas = {};

  dias.forEach(dia => {
    const id = `lista${dia.charAt(0).toUpperCase() + dia.slice(1)}`;
    listasPorDia[dia] = document.getElementById(id);
  });

  tareas.forEach(tarea => {
    const idT = `lista${tarea.charAt(0).toUpperCase() + tarea.slice(1)}`;
    listasTareas[tarea] = document.getElementById(idT);
  });

  boton.addEventListener("click", () => {
    agregarTarea();
  });

// Función para crear una tarea y agregarla al DOM
function crearTareaHtml(cliente, tarea, dia, estado = "pendiente") {
    const listaDia = listasPorDia[dia];

    const li = document.createElement("li");
    li.textContent = `${cliente} - Tarea: ${tarea} `;

    const botonEliminar = document.createElement('button');
    const icono = document.createElement('i');
    icono.classList.add('fa-solid', 'fa-trash-can');
    botonEliminar.textContent = ' ';
    botonEliminar.prepend(icono);
    botonEliminar.addEventListener("click", () => {
        listaDia.removeChild(li);
        guardarTareasEnLocalStorage();
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = estado === "terminado";

    const labelEstado = document.createElement("span");
    labelEstado.textContent = checkbox.checked ? "Terminado" : "Pendiente";

    // Aplica la clase visual
    if (checkbox.checked) {
        li.classList.add("tarea-terminada");
    }

    checkbox.addEventListener("change", () => {
        labelEstado.textContent = checkbox.checked ? "Terminado" : "Pendiente";

        if (checkbox.checked) {
            li.classList.add("tarea-terminada");
        } else {
            li.classList.remove("tarea-terminada");
        }

        guardarTareasEnLocalStorage();
    });

    li.appendChild(checkbox);
    li.appendChild(labelEstado);
    li.appendChild(botonEliminar);
    listaDia.appendChild(li);
}


// Función para agregar tarea
function agregarTarea() {
    const tarea = selectorTarea.value;
    const cliente = inputCliente.value.trim();
    const dia = selectorDia.value;

    const smallTarea = document.getElementById('smallTarea');
    const smallCliente = document.getElementById('smallCliente');
    const smallDia = document.getElementById('smallDia');

    smallTarea.textContent = "";
    smallCliente.textContent = "";
    smallDia.textContent = "";

    if (tarea === "" || cliente === "" || dia === "") {
        if (tarea === "") smallTarea.textContent = "Por favor, ingresa una tarea.";
        if (cliente === "") smallCliente.textContent = "Por favor, ingresa un cliente.";
        if (dia === "") smallDia.textContent = "Por favor, selecciona un día.";
        return;
    }

    // Crear y agregar tarea a la lista
    crearTareaHtml(cliente, tarea, dia);

    // Guardar las tareas en Local Storage
    guardarTareasEnLocalStorage();

    selectorTarea.value = "";
    inputCliente.value = "";
    selectorDia.value = "";
}

// Función para cargar tareas desde localStorage
function cargarTareasDesdeLocalStorage() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(tarea => {
        crearTareaHtml(tarea.cliente, tarea.tarea, tarea.dia, tarea.estado);
    });
}


// Función para guardar tareas en localStorage
function guardarTareasEnLocalStorage() {
    const tareas = [];
    dias.forEach(dia => {
        const listaDia = listasPorDia[dia];
        const tareasDia = Array.from(listaDia.getElementsByTagName('li')).map(li => {
            const text = li.firstChild.textContent.trim(); // cliente - Tarea: tarea
            const [cliente, tareaRaw] = text.split(' - Tarea: ');
            const tarea = tareaRaw?.trim();
            const checkbox = li.querySelector('input[type="checkbox"]');
            const estado = checkbox?.checked ? "terminado" : "pendiente";
            return { cliente, tarea, dia, estado };
        });
        tareas.push(...tareasDia);
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}


// Ejecutar cuando la página se cargue
document.addEventListener("DOMContentLoaded", cargarTareasDesdeLocalStorage);
