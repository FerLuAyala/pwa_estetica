//Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrado:', reg))
      .catch(err => console.error('Error al registrar el Service Worker:', err));
  }
  
  // Obtener referencias a los elementos del DOM
  const boton = document.getElementById("botonTarea");
  const inputTarea = document.getElementById("tarea");
  const inputCliente = document.getElementById("cliente");
  const selectorDia = document.getElementById("dia");
  
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  const listasPorDia = {};
  
  dias.forEach(dia => {
    listasPorDia[dia] = document.getElementById(`lista${dia}`);
  });
  
  
  // Función para cargar tareas desde localStorage
  function cargarTareas() {
    const tareasGuardadasStr = localStorage.getItem('tareas');

    const tareasGuardadas = JSON.parse(tareasGuardadasStr) || {};

    for (const dia in tareasGuardadas) {
        const lista = listasPorDia[dia];
        if (lista) {
            tareasGuardadas[dia].forEach(tarea => {
                crearTareaEnLista(tarea, lista);
              
            });
        }
    }
}

  
  // Función para guardar tareas en localStorage
  function guardarTareas() {
    const tareasPorDia = {};
    for (const dia in listasPorDia) {
        const lista = listasPorDia[dia];
        const tareas = [];
        lista.querySelectorAll('li').forEach(li => {
            // Obtener los datos del LI
            const clienteYtarea = li.firstChild.textContent; // "cliente - Tarea: tarea"
            const cliente = clienteYtarea.split(' - ')[0];
            const tareaText = clienteYtarea.split('Tarea: ')[1];
            const estadoBtn = li.querySelector('button.marcarTerminado');
            const estado = estadoBtn ? estadoBtn.textContent : "Pendiente";
            tareas.push({ cliente, tarea: tareaText, estado });
        });
        tareasPorDia[dia] = tareas;
    }
    
    localStorage.setItem('tareas', JSON.stringify(tareasPorDia));
    console.log('Tareas guardadas:', tareasPorDia);
}

  
  // Función para crear y agregar una tarea a una lista
  function crearTareaEnLista(tareaObj, lista) {
      const { cliente, tarea, estado } = tareaObj;
  
      // Crear elemento <li> para la tarea
      const li = document.createElement("li");
      li.textContent = `${cliente} - Tarea: ${tarea}`;
  
      // Crear botón eliminar
      const botonEliminar = document.createElement('button');    
      const icono = document.createElement('i');
      icono.classList.add('fa-solid', 'fa-trash-can');
      botonEliminar.textContent = ' ';
      botonEliminar.prepend(icono);
      botonEliminar.addEventListener("click", () => {
          lista.removeChild(li);
          guardarTareas(); // Actualizar localStorage
      });
      li.appendChild(botonEliminar);
  
      // Crear botón marcar como terminado/pendiente
      const marcarTerminado = document.createElement("button");
      marcarTerminado.textContent = estado === "Terminado" ? "Terminado" : "Pendiente";
      if (estado === "Terminado") {
          marcarTerminado.classList.add('terminada');
      }
  
      marcarTerminado.addEventListener("click", () => {
          if (marcarTerminado.textContent === "Pendiente") {
              marcarTerminado.textContent = "Terminado";
              marcarTerminado.classList.add('terminada');
          } else {
              marcarTerminado.textContent = "Pendiente";
              marcarTerminado.classList.remove('terminada');
          }
          guardarTareas(); // Actualizar localStorage
      });
  
      li.appendChild(marcarTerminado);
  
      // Agregar la tarea a la lista
      lista.appendChild(li);
  }
  
  // Evento del botón para agregar tarea
  boton.addEventListener("click", () => {
      const tarea = inputTarea.value.trim();
      const cliente = inputCliente.value.trim();
      const dia = selectorDia.value;
  
      // Obtener los elementos <small> para mostrar los mensajes
      const smallTarea = document.getElementById('smallTarea');
      const smallCliente = document.getElementById('smallCliente');
      const smallDia = document.getElementById('smallDia');
  
      // Limpiar mensajes anteriores
      smallTarea.textContent = "";
      smallCliente.textContent = "";
      smallDia.textContent = "";
  
      // Validar campos
      if (tarea === "" || cliente === "" || dia === "") {
          if (tarea === "") {
              smallTarea.textContent = "Por favor, ingresa una tarea.";
          }
          if (cliente === "") {
              smallCliente.textContent = "Por favor, ingresa un cliente.";
          }
          if (dia === "") {
              smallDia.textContent = "Por favor, selecciona un día.";
          }
          return;
      }
  
      // Obtener la lista correspondiente al día
      const listaDia = listasPorDia[dia];
      if (!listaDia) {
          smallDia.textContent = "Por favor, selecciona un día.";
          return;
      }
  
      // Crear objeto de tarea
      const tareaNueva = {
          cliente,
          tarea,
          estado: "Pendiente"
      };
  
      // Crear la tarea en la lista
      crearTareaEnLista(tareaNueva, listaDia);
  
      // Guardar en localStorage
      guardarTareas();
  
      // Limpiar campos después de agregar
      inputTarea.value = "";
      inputCliente.value = "";
      selectorDia.value = "";
  });
  
  // Cargar tareas guardadas al cargar la página
  window.addEventListener('load', cargarTareas);