// turnos.js

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

const formTurnos = document.getElementById("formTurnos");
const listaTurnos = document.getElementById("listaTurnos");
const selectServicioTurno = document.getElementById("servicioTurno");
const inputFechaTurno = document.getElementById("fechaTurno");
const inputNombreCliente = document.getElementById("nombreCliente");
const inputTelefonoCliente = document.getElementById("telefonoCliente");

let servicios = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    servicios = await fetch("./datos/servicios.json").then((res) => res.json());
    selectServicioTurno.length = 1;
    servicios.forEach(({ id, nombre, precio }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${nombre} ($${precio})`;
      selectServicioTurno.appendChild(option);
    });

    const hoy = new Date().toISOString().split("T")[0];
    inputFechaTurno.min = hoy;

    mostrarTurnosGuardados();
  } catch (error) {
    mostrarAlerta("Error", "No se pudieron cargar los servicios.", "error");
    console.error(error);
  }
});

function mostrarTurnosGuardados() {
  listaTurnos.innerHTML = "";
  turnos.forEach(mostrarTurnoEnHTML);
}

function mostrarTurnoEnHTML(turno) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.innerHTML = `
    <strong>${turno.nombreCliente}</strong> - Tel: ${turno.telefonoCliente}<br/>
    Servicio: ${turno.servicio} | Fecha: ${turno.fecha}
  `;
  listaTurnos.appendChild(li);
}

formTurnos.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!formTurnos.checkValidity()) {
    formTurnos.classList.add("was-validated");
    return;
  }

  const fechaSeleccionada = new Date(inputFechaTurno.value).setHours(
    0,
    0,
    0,
    0
  );
  const hoy = new Date().setHours(0, 0, 0, 0);
  if (fechaSeleccionada < hoy) {
    mostrarAlerta(
      "Error",
      "No puedes seleccionar una fecha anterior a hoy.",
      "error"
    );
    return;
  }

  const nombreCliente = inputNombreCliente.value.trim();
  const telefonoCliente = inputTelefonoCliente.value.trim();
  const servicioId = parseInt(selectServicioTurno.value);

  const servicio = servicios.find((s) => s.id === servicioId);
  if (!servicio) {
    mostrarAlerta("Error", "Selecciona un servicio válido.", "error");
    return;
  }

  const nuevoTurno = {
    id: Date.now(),
    nombreCliente,
    telefonoCliente,
    servicio: servicio.nombre,
    fecha: inputFechaTurno.value,
  };

  turnos.push(nuevoTurno);
  localStorage.setItem("turnos", JSON.stringify(turnos));

  mostrarTurnoEnHTML(nuevoTurno);
  mostrarAlerta(
    "Turno reservado",
    "Tu turno fue reservado con éxito.",
    "success"
  );

  formTurnos.reset();
  formTurnos.classList.remove("was-validated");
});
