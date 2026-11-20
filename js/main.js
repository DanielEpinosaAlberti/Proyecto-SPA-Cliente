import { grupos, solicitudes } from "./datos.js";
import { renderizarDetalle, renderizarGrupos } from "./ui.js";

const listado = document.querySelector("#listado");
const contenedorGrupos = document.querySelector("#grupos");
const detalle = document.querySelector("#detalle");

function mostrarListado() {
  detalle.hidden = true;
  listado.hidden = false;
}

function mostrarDetalle(grupo) {
  const solicitudesDelGrupo = solicitudes.filter(
    (solicitud) => solicitud.grupoId === grupo.id,
  );

  renderizarDetalle(grupo, solicitudesDelGrupo, detalle, mostrarListado);
  listado.hidden = true;
  detalle.hidden = false;
}

renderizarGrupos(grupos, contenedorGrupos, mostrarDetalle);
