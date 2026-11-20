export function renderizarGrupos(grupos, contenedor, alVerDetalle) {
  contenedor.replaceChildren();

  if (grupos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "mensaje-vacio";
    mensaje.textContent = "No hay grupos disponibles.";
    contenedor.append(mensaje);
    return;
  }

  grupos.forEach((grupo) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-grupo";

    const titulo = document.createElement("h2");
    titulo.textContent = `${grupo.raid} — ${grupo.nombre}`;

    const lider = document.createElement("p");
    lider.textContent = `Líder: ${grupo.lider}`;

    const fecha = document.createElement("p");
    fecha.textContent = grupo.fecha;

    const resumen = document.createElement("p");
    resumen.textContent = `${grupo.capacidad} plazas · ${grupo.idioma} · ${grupo.estado}`;

    const boton = document.createElement("button");
    boton.className = "boton";
    boton.textContent = "Ver detalles";

    boton.type = "button";
    boton.addEventListener("click", () => alVerDetalle(grupo));
    tarjeta.append(titulo, lider, fecha, resumen, boton);
    contenedor.append(tarjeta);
  });
}

export function renderizarDetalle(grupo, solicitudes, contenedor, alVolver) {
  contenedor.replaceChildren();

  const botonVolver = document.createElement("button");
  botonVolver.className = "boton boton-secundario";
  botonVolver.textContent = "Volver al listado";
  botonVolver.type = "button";
  botonVolver.addEventListener("click", alVolver);

  const titulo = document.createElement("h1");
  titulo.textContent = `${grupo.raid} — ${grupo.nombre}`;

  const datos = document.createElement("dl");
  datos.className = "datos-grupo";
  const campos = [
    ["Líder", grupo.lider],
    ["Fecha", grupo.fecha],
    ["Idioma", grupo.idioma],
    ["Capacidad", `${grupo.capacidad} jugadores`],
    ["Estado", grupo.estado],
    ["Tanques", `${grupo.roles.tanques} plazas`],
    ["Sanadores", `${grupo.roles.sanadores} plazas`],
    ["DPS", `${grupo.roles.dps} plazas`],
    ["Notas", grupo.notas || "Sin notas"],
  ];

  campos.forEach(([etiqueta, valor]) => {
    const termino = document.createElement("dt");
    termino.textContent = etiqueta;

    const descripcion = document.createElement("dd");
    descripcion.textContent = valor;
    datos.append(termino, descripcion);
  });

  const tituloSolicitudes = document.createElement("h2");
  tituloSolicitudes.textContent = "Solicitudes relacionadas";

  const listaSolicitudes = document.createElement("ul");
  listaSolicitudes.className = "solicitudes";

  if (solicitudes.length === 0) {
    const mensaje = document.createElement("li");
    mensaje.textContent = "Todavía no hay solicitudes.";
    listaSolicitudes.append(mensaje);
  } else {
    solicitudes.forEach((solicitud) => {
      const texto = `${solicitud.personaje} · ${solicitud.raza} ${solicitud.clase} · ${solicitud.rol} · nivel ${solicitud.nivel} · Gear Score ${solicitud.gearScore} · valoración ${solicitud.valoracion}/5 · ${solicitud.estado}. ${solicitud.mensaje}`;
      const elemento = document.createElement("li");
      elemento.textContent = texto;
      listaSolicitudes.append(elemento);
    });
  }

  contenedor.append(botonVolver, titulo, datos, tituloSolicitudes, listaSolicitudes);
}
