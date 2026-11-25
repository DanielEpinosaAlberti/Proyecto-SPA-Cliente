import * as almacen from "./almacen.js";
import { crearGestorFormulario } from "./formulario.js";
import {
  calcularEdad,
  validarCondiciones,
  validarContrasena,
  validarEmail,
  validarFechaNacimiento,
  validarNombreUsuario,
  validarRepeticion,
} from "./validacion.js";

const COLECCION = "usuarios";
const AYUDA_CONTRASENA =
  "Mínimo 8 caracteres, una mayúscula y un número. La contraseña no se guarda en el navegador.";
const AYUDA_EDICION =
  "Deja la contraseña en blanco para no cambiarla. No se guarda en el navegador.";

function fechaHoyLocalISO() {
  const ahora = new Date();
  const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function inicializarUsuarios() {
  const form = document.querySelector("#form-registro");
  const tabla = document.querySelector("#usuarios-tabla");
  const tablaElemento = document.querySelector("#tabla-usuarios");
  const vacio = document.querySelector("#usuarios-vacio");
  const tituloFormulario = document.querySelector(
    "#titulo-formulario-usuario",
  );
  const ayudaContrasena = document.querySelector(
    "#registro-contrasena-ayuda",
  );
  const obligatorioContrasena = document.querySelector(
    "#registro-contrasena-obligatorio",
  );
  const obligatorioRepetir = document.querySelector(
    "#registro-repetir-obligatorio",
  );
  const botonGuardar = document.querySelector("#registro-guardar");
  const botonCancelar = document.querySelector("#registro-cancelar");
  const estado = document.querySelector("#registro-estado");

  if (!form || !tabla) return { renderizar() {} };

  const campos = form.elements;
  campos.nacimiento.max = fechaHoyLocalISO();

  let idEditando = null;
  let gestor = null;

  const reglas = {
    usuario: (valor, campo) => validarNombreUsuario(valor, campo),
    email: (valor, campo) => validarEmail(valor, campo),
    contrasena: (valor, campo) =>
      validarContrasena(valor, campo, { opcional: idEditando !== null }),
    repetir: (valor, campo) =>
      validarRepeticion(valor, campos.contrasena.value, campo, {
        opcional: idEditando !== null && !campos.contrasena.value,
      }),
    nacimiento: (valor, campo) => validarFechaNacimiento(valor, campo),
    condiciones: (valor, campo) => validarCondiciones(valor, campo),
  };

  gestor = crearGestorFormulario(form, {
    reglas,
    alEnviar: guardarUsuario,
    alCambiar(campo) {
      if (
        campo.name === "contrasena" &&
        gestor.estaTocado(campos.repetir)
      ) {
        gestor.validarCampo(campos.repetir);
      }
    },
  });

  tabla.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const { accion, id } = boton.dataset;
    if (accion === "editar") cargarParaEditar(id);
    if (accion === "borrar") borrarUsuario(id);
  });

  botonCancelar.addEventListener("click", () => {
    resetearFormulario();
    estado.textContent = "";
  });

  function guardarUsuario() {
    const datos = {
      usuario: campos.usuario.value.trim(),
      email: campos.email.value.trim(),
      nacimiento: campos.nacimiento.value,
      condiciones: campos.condiciones.checked,
    };

    let mensaje;

    if (idEditando) {
      const actualizado = almacen.actualizar(COLECCION, idEditando, datos);
      if (!actualizado) {
        estado.textContent = "No se encontró el usuario que intentabas editar.";
        return;
      }
      mensaje = "Usuario actualizado correctamente.";
    } else {
      almacen.crear(COLECCION, datos);
      mensaje = "Usuario creado correctamente.";
    }

    resetearFormulario();
    estado.textContent = mensaje;
    renderizar();
  }

  function resetearFormulario() {
    form.reset();
    idEditando = null;
    campos.contrasena.required = true;
    campos.repetir.required = true;
    obligatorioContrasena.hidden = false;
    obligatorioRepetir.hidden = false;
    ayudaContrasena.textContent = AYUDA_CONTRASENA;
    tituloFormulario.textContent = "Nuevo usuario";
    botonGuardar.textContent = "Crear usuario";
    botonCancelar.hidden = true;
    gestor.reiniciar();
  }

  function cargarParaEditar(id) {
    const usuario = almacen.obtenerPorId(COLECCION, id);
    if (!usuario) return;

    idEditando = id;
    gestor.reiniciar();

    campos.usuario.value = usuario.usuario ?? "";
    campos.email.value = usuario.email ?? "";
    campos.nacimiento.value = usuario.nacimiento ?? "";
    campos.condiciones.checked = Boolean(usuario.condiciones);
    campos.contrasena.value = "";
    campos.repetir.value = "";
    campos.contrasena.required = false;
    campos.repetir.required = false;
    obligatorioContrasena.hidden = true;
    obligatorioRepetir.hidden = true;

    ayudaContrasena.textContent = AYUDA_EDICION;
    tituloFormulario.textContent = `Editar usuario: ${usuario.usuario}`;
    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.hidden = false;
    estado.textContent = "";

    form.scrollIntoView({ behavior: "smooth", block: "start" });
    campos.usuario.focus({ preventScroll: true });
  }

  function borrarUsuario(id) {
    const usuario = almacen.obtenerPorId(COLECCION, id);
    if (!usuario) return;

    const confirmado = window.confirm(
      `¿Quieres borrar al usuario «${usuario.usuario}»? Esta acción no se puede deshacer.`,
    );
    if (!confirmado) return;

    almacen.borrar(COLECCION, id);

    if (idEditando === id) resetearFormulario();

    estado.textContent = "Usuario borrado correctamente.";
    renderizar();
  }

  function crearBoton(texto, accion, id, clase) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = `boton boton-pequeno ${clase}`;
    boton.textContent = texto;
    boton.dataset.accion = accion;
    boton.dataset.id = id;
    return boton;
  }

  function formatearFechaNacimiento(valor) {
    if (!valor) return "—";

    const fecha = new Date(`${valor}T00:00:00`);
    if (Number.isNaN(fecha.getTime())) return valor;

    return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(
      fecha,
    );
  }

  function formatearEdad(valor) {
    const edad = calcularEdad(valor);
    return edad === null || edad < 0 ? "—" : `${edad} años`;
  }

  function renderizar() {
    const usuarios = almacen
      .obtenerTodos(COLECCION)
      .slice()
      .sort((a, b) =>
        (a.usuario ?? "").localeCompare(b.usuario ?? "", "es"),
      );

    tabla.replaceChildren();

    const hayUsuarios = usuarios.length > 0;
    vacio.hidden = hayUsuarios;
    if (tablaElemento) tablaElemento.hidden = !hayUsuarios;

    usuarios.forEach((usuario) => {
      const fila = document.createElement("tr");

      [
        usuario.usuario ?? "",
        usuario.email ?? "",
        formatearFechaNacimiento(usuario.nacimiento),
        formatearEdad(usuario.nacimiento),
      ].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.append(celda);
      });

      const celdaAcciones = document.createElement("td");
      const acciones = document.createElement("div");
      acciones.className = "acciones";
      acciones.append(
        crearBoton("Editar", "editar", usuario.id, "boton-neutro"),
        crearBoton("Borrar", "borrar", usuario.id, "boton-peligro"),
      );
      celdaAcciones.append(acciones);
      fila.append(celdaAcciones);

      tabla.append(fila);
    });
  }

  renderizar();

  return { renderizar };
}
