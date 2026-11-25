import { grupos, solicitudes } from "./datos.js";
import * as almacen from "./almacen.js";
import { renderizarDetalle, renderizarGrupos } from "./ui.js";
import { inicializarUsuarios } from "./registro.js";
import { inicializarContacto } from "./contacto.js";

const secciones = Array.from(document.querySelectorAll("main > .vista"));
const contenedorGrupos = document.querySelector("#grupos");
const detalle = document.querySelector("#detalle");
const enlacesNavegacion = Array.from(
  document.querySelectorAll(".navigation a"),
);

const usuarios = inicializarUsuarios();
const contacto = inicializarContacto();

function sembrarDatosIniciales() {
  if (almacen.obtenerTodos("grupos").length === 0) {
    grupos.forEach((grupo) => almacen.crear("grupos", grupo));
  }

  if (almacen.obtenerTodos("solicitudes").length === 0) {
    solicitudes.forEach((solicitud) => almacen.crear("solicitudes", solicitud));
  }
}

function mostrarSolo(id) {
  secciones.forEach((seccion) => {
    seccion.hidden = seccion.id !== id;
  });

  enlacesNavegacion.forEach((enlace) => {
    if (enlace.getAttribute("href") === `#${id}`) {
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.removeAttribute("aria-current");
    }
  });
}

function mostrarListado() {
  renderizarGrupos(
    almacen.obtenerTodos("grupos"),
    contenedorGrupos,
    mostrarDetalle,
  );
  mostrarSolo("listado");
}

function mostrarDetalle(grupo) {
  const solicitudesDelGrupo = almacen
    .obtenerTodos("solicitudes")
    .filter((solicitud) => solicitud.grupoId === grupo.id);

  renderizarDetalle(grupo, solicitudesDelGrupo, detalle, mostrarListado);
  mostrarSolo("detalle");
}

function mostrarVista(id) {
  if (id === "usuarios") {
    usuarios.renderizar();
    mostrarSolo("usuarios");
    return;
  }

  if (id === "contacto") {
    mostrarSolo("contacto");
    return;
  }

  if (id === "mensajes") {
    contacto.renderizarMensajes();
    mostrarSolo("mensajes");
    return;
  }

  mostrarListado();
}

function manejarRuta() {
  const id = window.location.hash.replace("#", "");
  const vistasConocidas = ["usuarios", "contacto", "mensajes"];

  mostrarVista(vistasConocidas.includes(id) ? id : "listado");
}

sembrarDatosIniciales();
window.addEventListener("hashchange", manejarRuta);
manejarRuta();
