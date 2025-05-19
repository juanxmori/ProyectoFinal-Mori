// mostrarAlerta.js

const mostrarAlerta = (titulo, texto, icono = "info") => {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    confirmButtonText: "Aceptar",
  });
};
