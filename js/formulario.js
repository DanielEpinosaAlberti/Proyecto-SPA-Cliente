export function crearGestorFormulario(form, { reglas, alEnviar, alCambiar }) {
  const campos = Array.from(form.elements).filter(
    (campo) =>
      campo.name &&
      Object.prototype.hasOwnProperty.call(reglas, campo.name) &&
      (campo.tagName === "INPUT" ||
        campo.tagName === "SELECT" ||
        campo.tagName === "TEXTAREA"),
  );
  const tocados = new Set();

  function errorElemento(campo) {
    return document.getElementById(`${campo.id}-error`);
  }

  function mensajeDe(campo) {
    const valor = campo.type === "checkbox" ? campo.checked : campo.value;
    return reglas[campo.name](valor, campo) || null;
  }

  function pintar(campo, mensaje) {
    const error = errorElemento(campo);
    campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
    if (error) error.textContent = mensaje ?? "";
  }

  function validarCampo(campo) {
    const mensaje = mensajeDe(campo);
    pintar(campo, mensaje);
    return !mensaje;
  }

  function marcarTocado(campo) {
    tocados.add(campo.name);
  }

  function validarTodo() {
    let primeroConError = null;

    campos.forEach((campo) => {
      tocados.add(campo.name);
      const mensaje = mensajeDe(campo);
      pintar(campo, mensaje);

      if (mensaje && !primeroConError) primeroConError = campo;
    });

    if (primeroConError) primeroConError.focus();
    return !primeroConError;
  }

  campos.forEach((campo) => {
    const esEleccion = campo.type === "checkbox" || campo.tagName === "SELECT";

    campo.addEventListener("blur", () => {
      tocados.add(campo.name);
      validarCampo(campo);
    });

    campo.addEventListener(esEleccion ? "change" : "input", () => {
      if (esEleccion) tocados.add(campo.name);
      if (tocados.has(campo.name)) validarCampo(campo);
      if (alCambiar) alCambiar(campo);
    });
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!validarTodo()) return;
    alEnviar();
  });

  return {
    campos,
    validarCampo,
    validarTodo,
    marcarTocado,
    estaTocado(campo) {
      return tocados.has(campo.name);
    },
    reiniciar() {
      tocados.clear();
      campos.forEach((campo) => pintar(campo, null));
    },
  };
}
