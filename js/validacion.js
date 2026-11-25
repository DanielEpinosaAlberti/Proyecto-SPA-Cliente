const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_USUARIO = /^[\p{L}0-9_]+$/u;
const RE_MAYUSCULA = /[A-Z]/;
const RE_NUMERO = /\d/;

function texto(valor) {
  return String(valor ?? "");
}

function esObligatorio(campo) {
  return campo.required !== false;
}

export function validarRequerido(valor, mensaje, { checkbox = false } = {}) {
  const vacio = checkbox ? !valor : texto(valor).trim() === "";
  return vacio ? mensaje : null;
}

export function validarLongitud(valor, campo, etiqueta) {
  if (!campo) return null;

  const contenido = texto(valor);
  const minimo = Number(campo.minLength);
  const maximo = Number(campo.maxLength);

  if (minimo > 0 && contenido.length < minimo) {
    return `${etiqueta} debe tener al menos ${minimo} caracteres.`;
  }

  if (maximo > 0 && contenido.length > maximo) {
    return `${etiqueta} no puede superar los ${maximo} caracteres.`;
  }

  return null;
}

export function validarNombreUsuario(valor, campo = {}) {
  const contenido = texto(valor).trim();

  if (contenido === "") {
    return esObligatorio(campo)
      ? "El nombre de usuario es obligatorio."
      : null;
  }

  return (
    validarLongitud(contenido, campo, "El nombre de usuario") ??
    (RE_USUARIO.test(contenido)
      ? null
      : "El nombre de usuario solo puede contener letras, números y guiones bajos.")
  );
}

export function validarEmail(valor, campo = {}) {
  const contenido = texto(valor).trim();

  if (contenido === "") {
    return esObligatorio(campo)
      ? "El correo electrónico es obligatorio."
      : null;
  }

  return (
    validarLongitud(contenido, campo, "El correo electrónico") ??
    (RE_EMAIL.test(contenido)
      ? null
      : "El correo electrónico no tiene un formato válido.")
  );
}

export function validarContrasena(
  valor,
  campo = {},
  { opcional = false } = {},
) {
  const contenido = texto(valor);
  const esOpcional = opcional || campo.required === false;

  if (esOpcional && contenido === "") return null;
  if (contenido === "") return "La contraseña es obligatoria.";

  const longitud = validarLongitud(contenido, campo, "La contraseña");
  if (longitud) return longitud;

  if (!RE_MAYUSCULA.test(contenido)) {
    return "La contraseña debe incluir al menos una letra mayúscula.";
  }

  if (!RE_NUMERO.test(contenido)) {
    return "La contraseña debe incluir al menos un número.";
  }

  return null;
}

export function validarRepeticion(
  valor,
  contrasena,
  campo = {},
  { opcional = false } = {},
) {
  const contenido = texto(valor);
  const clave = texto(contrasena);
  const esOpcional = opcional || (campo.required === false && clave === "");

  if (esOpcional && contenido === "") return null;
  if (contenido === "") return "Debes repetir la contraseña.";

  return contenido === clave ? null : "Las contraseñas no coinciden.";
}

export function calcularEdad(fechaISO, referencia = new Date()) {
  const fecha =
    fechaISO instanceof Date ? fechaISO : new Date(`${fechaISO}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return null;

  const hoy = new Date(referencia);
  hoy.setHours(0, 0, 0, 0);

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const diferenciaMes = hoy.getMonth() - fecha.getMonth();

  if (
    diferenciaMes < 0 ||
    (diferenciaMes === 0 && hoy.getDate() < fecha.getDate())
  ) {
    edad -= 1;
  }

  return edad;
}

export function validarFechaNacimiento(valor, campo = {}) {
  const contenido = texto(valor);

  if (contenido === "") {
    return esObligatorio(campo)
      ? "La fecha de nacimiento es obligatoria."
      : null;
  }

  const fecha = new Date(`${contenido}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) {
    return "La fecha de nacimiento no es válida.";
  }

  if (campo.min && contenido < campo.min) {
    return "La fecha de nacimiento no es válida.";
  }

  if (campo.max && contenido > campo.max) {
    return "La fecha de nacimiento no puede ser futura.";
  }

  const edad = calcularEdad(fecha);
  const edadMinima = Number(campo.dataset?.edadMinima);

  if (Number.isFinite(edadMinima) && edadMinima > 0 && edad < edadMinima) {
    return `Debes tener al menos ${edadMinima} años para registrarte.`;
  }

  return null;
}

export function validarCondiciones(aceptado, campo = {}) {
  if (!esObligatorio(campo)) return null;
  return aceptado ? null : "Debes aceptar las condiciones para registrarte.";
}

export function validarNombreContacto(valor, campo = {}) {
  const contenido = texto(valor).trim();

  if (contenido === "") {
    return esObligatorio(campo) ? "El nombre es obligatorio." : null;
  }

  return validarLongitud(contenido, campo, "El nombre");
}

export function validarTelefono(valor, campo = {}, { obligatorio = false } = {}) {
  const contenido = texto(valor).trim();

  if (contenido === "") {
    return obligatorio
      ? "El teléfono es obligatorio si prefieres que te llamemos."
      : null;
  }

  const longitud = validarLongitud(contenido, campo, "El teléfono");
  if (longitud) return longitud;

  if (campo.pattern) {
    try {
      const patron = new RegExp(campo.pattern);
      if (!patron.test(contenido)) {
        return "El teléfono no tiene un formato válido.";
      }
    } catch {
      
    }
  }

  return null;
}

export function validarMotivo(valor, campo = {}) {
  if (texto(valor).trim() === "") {
    return esObligatorio(campo)
      ? "Selecciona un motivo de contacto."
      : null;
  }
  return null;
}

export function validarMensaje(valor, campo = {}) {
  const contenido = texto(valor);

  if (contenido.trim() === "") {
    return esObligatorio(campo) ? "El mensaje es obligatorio." : null;
  }

  return validarLongitud(contenido, campo, "El mensaje");
}
