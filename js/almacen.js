const PREFIJO = "raidfinder:";

function clave(coleccion) {
  return `${PREFIJO}${coleccion}`;
}

function leer(coleccion) {
  try {
    const guardado = localStorage.getItem(clave(coleccion));
    if (!guardado) return [];
    const datos = JSON.parse(guardado);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error(`No se pudo leer la colección «${coleccion}».`, error);
    return [];
  }
}

function guardar(coleccion, datos) {
  try {
    localStorage.setItem(clave(coleccion), JSON.stringify(datos));
  } catch (error) {
    console.error(`No se pudo guardar la colección «${coleccion}».`, error);
  }
}

function generarId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function obtenerTodos(coleccion) {
  return leer(coleccion);
}

export function obtenerPorId(coleccion, id) {
  return leer(coleccion).find((dato) => dato.id === id) ?? null;
}

export function crear(coleccion, dato) {
  const datos = leer(coleccion);
  const ahora = new Date().toISOString();
  const nuevo = {
    ...dato,
    id: dato.id ?? generarId(),
    creadoEn: dato.creadoEn ?? ahora,
    actualizadoEn: ahora,
  };

  datos.push(nuevo);
  guardar(coleccion, datos);
  return nuevo;
}

export function actualizar(coleccion, id, dato) {
  const datos = leer(coleccion);
  const indice = datos.findIndex((elemento) => elemento.id === id);
  if (indice === -1) return null;

  const actualizado = {
    ...datos[indice],
    ...dato,
    id,
    actualizadoEn: new Date().toISOString(),
  };

  datos[indice] = actualizado;
  guardar(coleccion, datos);
  return actualizado;
}

export function borrar(coleccion, id) {
  const datos = leer(coleccion);
  const indice = datos.findIndex((elemento) => elemento.id === id);
  if (indice === -1) return false;

  datos.splice(indice, 1);
  guardar(coleccion, datos);
  return true;
}
