import * as almacen from "./almacen.js";
import { crearGestorFormulario } from "./formulario.js";
import {
  validarEmail,
  validarMensaje,
  validarMotivo,
  validarNombreContacto,
  validarTelefono,
} from "./validacion.js";

const COLECCION_MENSAJES = "mensajes";
const COLECCION_PREFERENCIAS = "preferencias";
const ID_ULTIMO_CONTACTO = "ultimo-contacto";
const DIAS_RECUERDO = 180;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function inicializarContacto() {
  const form = document.querySelector("#form-contacto");
  const lista = document.querySelector("#mensajes-lista");
  const vacio = document.querySelector("#mensajes-vacio");
  const estado = document.querySelector("#contacto-estado");
  const contador = document.querySelector("#contacto-mensaje-contador");

  if (!form || !lista) return { renderizarMensajes() {} };

  const campos = form.elements;
  const telefono = campos.telefono;
  const mensaje = campos.mensaje;
  let gestor = null;

  const reglas = {
    nombre: (valor, campo) => validarNombreContacto(valor, campo),
    email: (valor, campo) => validarEmail(valor, campo),
    telefono: (valor, campo) =>
      validarTelefono(valor, campo, {
        obligatorio: campos.prefiero_llamada.checked,
      }),
    motivo: (valor, campo) => validarMotivo(valor, campo),
    prefiero_llamada: () => null,
    mensaje: (valor, campo) => validarMensaje(valor, campo),
  };

  gestor = crearGestorFormulario(form, {
    reglas,
    alEnviar: guardarMensaje,
    alCambiar(campo) {
      if (campo.name === "prefiero_llamada") {
        gestor.marcarTocado(telefono);
        gestor.validarCampo(telefono);
      }
    },
  });

  lista.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion='borrar']");
    if (!boton) return;

    const enviado = almacen.obtenerPorId(COLECCION_MENSAJES, boton.dataset.id);
    if (!enviado) return;

    const confirmado = window.confirm(
      `¿Quieres borrar el mensaje de «${enviado.nombre}»? Esta acción no se puede deshacer.`,
    );
    if (!confirmado) return;

    almacen.borrar(COLECCION_MENSAJES, boton.dataset.id);
    renderizarMensajes();
  });

  mensaje.addEventListener("input", actualizarContador);

  function actualizarContador() {
    const maximo = Number(mensaje.maxLength);
    const longitud = mensaje.value.length;

    contador.textContent = `${longitud} / ${maximo} caracteres`;
    contador.classList.toggle(
      "campo__contador--limite",
      maximo > 0 && longitud >= maximo,
    );
  }

  function leerUltimoContacto() {
    const preferencia = almacen.obtenerPorId(
      COLECCION_PREFERENCIAS,
      ID_ULTIMO_CONTACTO,
    );
    if (!preferencia) return null;

    const caducidad = new Date(preferencia.expira);
    if (
      !preferencia.expira ||
      Number.isNaN(caducidad.getTime()) ||
      caducidad.getTime() <= Date.now()
    ) {
      almacen.borrar(COLECCION_PREFERENCIAS, ID_ULTIMO_CONTACTO);
      return null;
    }

    return preferencia;
  }

  function guardarUltimoContacto(nombre, email) {
    const datos = {
      id: ID_ULTIMO_CONTACTO,
      nombre,
      email,
      expira: new Date(Date.now() + DIAS_RECUERDO * MS_POR_DIA).toISOString(),
    };

    const existente = almacen.obtenerPorId(
      COLECCION_PREFERENCIAS,
      ID_ULTIMO_CONTACTO,
    );

    if (existente) {
      almacen.actualizar(COLECCION_PREFERENCIAS, ID_ULTIMO_CONTACTO, datos);
    } else {
      almacen.crear(COLECCION_PREFERENCIAS, datos);
    }
  }

  function recordarUltimoContacto() {
    const preferencia = leerUltimoContacto();
    if (!preferencia) return;

    campos.nombre.value = preferencia.nombre ?? "";
    campos.email.value = preferencia.email ?? "";
  }

  function guardarMensaje() {
    const motivoSeleccionado = campos.motivo.selectedOptions[0];

    const datos = {
      nombre: campos.nombre.value.trim(),
      email: campos.email.value.trim(),
      telefono: campos.telefono.value.trim(),
      motivo: campos.motivo.value,
      motivoTexto: motivoSeleccionado?.textContent?.trim() ?? campos.motivo.value,
      prefieroLlamada: campos.prefiero_llamada.checked,
      mensaje: campos.mensaje.value.trim(),
      fecha: new Date().toISOString(),
    };

    almacen.crear(COLECCION_MENSAJES, datos);
    guardarUltimoContacto(datos.nombre, datos.email);

    form.reset();
    gestor.reiniciar();
    actualizarContador();
    estado.textContent =
      "Mensaje enviado. Puedes consultarlo en «Mensajes enviados».";

    renderizarMensajes();
  }

  function formatearFecha(valor) {
    if (!valor) return "Sin fecha";

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;

    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(fecha);
  }

  function renderizarMensajes() {
    const enviados = almacen
      .obtenerTodos(COLECCION_MENSAJES)
      .slice()
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    lista.replaceChildren();

    const hayMensajes = enviados.length > 0;
    vacio.hidden = hayMensajes;

    enviados.forEach((enviado) => {
      const articulo = document.createElement("article");
      articulo.className = "mensaje-enviado";

      const cabecera = document.createElement("header");
      cabecera.className = "mensaje-enviado__cabecera";

      const titulo = document.createElement("h2");
      titulo.textContent = `${enviado.nombre ?? "Sin nombre"} · ${
        enviado.motivoTexto ?? enviado.motivo ?? "Sin motivo"
      }`;

      const botonBorrar = document.createElement("button");
      botonBorrar.type = "button";
      botonBorrar.className = "boton boton-peligro boton-pequeno";
      botonBorrar.textContent = "Borrar";
      botonBorrar.dataset.accion = "borrar";
      botonBorrar.dataset.id = enviado.id;

      cabecera.append(titulo, botonBorrar);

      const meta = document.createElement("p");
      meta.className = "mensaje-enviado__meta";

      const partes = [formatearFecha(enviado.fecha), enviado.email];
      if (enviado.telefono) partes.push(enviado.telefono);
      if (enviado.prefieroLlamada) partes.push("Prefiere que le llamen");
      meta.textContent = partes.filter(Boolean).join(" · ");

      const texto = document.createElement("p");
      texto.className = "mensaje-enviado__texto";
      texto.textContent = enviado.mensaje ?? "";

      articulo.append(cabecera, meta, texto);
      lista.append(articulo);
    });
  }

  recordarUltimoContacto();
  actualizarContador();
  renderizarMensajes();

  return { renderizarMensajes };
}
