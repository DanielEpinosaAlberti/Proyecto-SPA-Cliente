# Proyecto-SPA-Cliente

## Backlog

Propuesta de trabajo priorizada a partir de los mockups. Cada tarea debe poder implementarse y comprobarse por separado. **P0** es imprescindible para el flujo principal; **P1** completa la coordinación de grupos; **P2** añade gestión de perfil y reputación. Las tareas marcadas con ✅ están terminadas.

| Prioridad | Tarea | Comprobación independiente |
|---|---|---|
| P0 | ✅ Registro de cuenta | Se puede crear una cuenta con los datos obligatorios y se muestran errores si faltan o no son válidos. |
| P0 | Inicio y cierre de sesión | Un usuario registrado puede iniciar sesión con correo o nombre de usuario y contraseña, mantener la sesión y cerrarla. |
| P0 | Alta de personaje | Se puede crear un personaje indicando nombre, nivel, raza, clase y rol; los campos obligatorios se validan. |
| P0 | Listado de grupos publicados | Inicio muestra las raids disponibles con nombre, fecha, idioma, plazas y datos principales del grupo. |
| P0 | Solicitud para unirse | Un usuario puede enviar una solicitud a un grupo y consultar si está pendiente, aceptada o rechazada. |
| P1 | ✅ Formulario de contacto y mensajes enviados | Se puede enviar un mensaje con nombre, correo, motivo y texto; queda guardado y se puede borrar. |
| P1 | Búsqueda y filtros de raids | Se puede buscar por texto y filtrar por raid, idioma y fecha; los resultados se actualizan según los criterios elegidos. |
| P1 | Creación de grupo | El líder puede indicar raid, capacidad, fecha, idioma y notas, y definir cuántos tanques, sanadores y DPS necesita. |
| P1 | Composición de plazas | El líder puede revisar y completar las plazas del grupo según los roles requeridos antes de publicarlo. |
| P1 | Guardar plantilla o publicar grupo | Se puede guardar una composición como plantilla o publicar el grupo para recibir solicitudes. |
| P1 | Gestión de solicitudes | El líder consulta candidatos, valoración, equipo y mensaje; puede aceptar o rechazar cada solicitud y actualizar las plazas. |
| P1 | Chat y miembros del grupo | Los miembros ven el roster agrupado por rol y el contador de plazas, y pueden leer y enviar mensajes. |
| P1 | Salir de un grupo | Un miembro puede abandonar el grupo y el roster y las plazas se actualizan. |
| P2 | Perfil de personaje | El perfil muestra raza, clase, rol, especialización, habilidad principal, profesiones, Gear Score y valoraciones. |
| P2 | Edición del perfil | El propietario puede actualizar los datos del personaje y guardar los cambios. |
| P2 | Personajes alternativos | Se pueden consultar los personajes de la cuenta, añadir otro y elegir cuál está activo. |
| P2 | Valorar a un jugador | Tras compartir un grupo, se puede enviar una puntuación, etiquetas de experiencia y un comentario. |
| P2 | Consultar reseñas | El perfil muestra la valoración resumida y reseñas con autor, contexto, puntuación y comentario. |

## Hito 2 · Formularios, validación y persistencia

### Qué está hecho

- **Capa de datos centralizada** en `js/almacen.js`: `obtenerTodos`, `obtenerPorId`, `crear`, `actualizar` y `borrar`. Todo se serializa en `localStorage` y el resto de la aplicación pasa por este módulo.
- **Datos iniciales**: los grupos y las solicitudes de `js/datos.js` se siembran una vez en `localStorage` si las colecciones están vacías. El listado y el detalle ya leen a través de `almacen`.
- **Formulario de registro / vista «Usuarios»**: creación, edición y borrado con confirmación. El mismo formulario se rellena al editar y se vacía al guardar. La contraseña nunca se almacena.
- **Formulario de contacto**: nombre, correo, teléfono opcional, motivo, casilla «Prefiero que me llaméis» y mensaje con contador de caracteres.
- **Vista «Mensajes enviados»**: los mensajes se guardan, se ordenan por fecha y se pueden borrar con confirmación.
- **Recordatorio del último contacto**: se guarda nombre y correo del último envío en `localStorage` con caducidad de 180 días. Es la adaptación del enunciado de cookies: no se usa `document.cookie`, sino una preferencia con fecha de caducidad, como se pidió.
- **Validación accesible**: todos los formularios llevan `novalidate`; se leen los atributos `required`, `type`, `min`, `max`, `minlength`, `maxlength` y `pattern` del HTML. Los errores se muestran junto al campo con `aria-invalid` y `aria-describedby`, sin `alert()`.
- **Borrado y edición con delegación de eventos**: no hay ningún `onclick` en el HTML.
- **Persistencia**: al recargar la página se mantienen usuarios, mensajes, grupos y solicitudes.

### Qué falta

- Inicio y cierre de sesión reales, con contraseña hasheada en un backend.
- Gestión de personajes, solicitudes, chats y valoraciones del resto del backlog.
- CRUD visual de grupos y solicitudes (ahora se leen de `localStorage`, pero solo se siembran desde `datos.js`).
- Envío real de correos o mensajes a un servidor; actualmente el contacto es local.
- Pruebas automatizadas y revisión de accesibilidad con lector de pantalla real.

### Qué me ha costado más

- Diseñar un gestor de validación común que leyera las restricciones del HTML sin duplicarlas y que, a la vez, permitiera reglas cruzadas como «teléfono obligatorio si prefieres que te llamen».
- Mantener la coherencia de la edición de usuarios: la contraseña no se guarda, así que al editar queda en blanco y es opcional; el resto de campos sí se rellena con los datos guardados.
- La accesibilidad: asociar cada error con su campo, enfocar el primer campo inválido al enviar y no ensuciar la vista con mensajes cuando el campo todavía no se ha tocado.
- La persistencia y la sincronización de las vistas sin recargar la página.

### Mapa de validación

| Formulario | Campo | Regla | Mensaje de error |
|---|---|---|---|
| Registro | Nombre de usuario | Obligatorio; entre 3 y 20 caracteres; solo letras, números y `_` (`required`, `minlength="3"`, `maxlength="20"`). | «El nombre de usuario es obligatorio.» / «El nombre de usuario debe tener al menos 3 caracteres.» / «El nombre de usuario no puede superar los 20 caracteres.» / «El nombre de usuario solo puede contener letras, números y guiones bajos.» |
| Registro | Correo electrónico | Obligatorio; máximo 120 caracteres; expresión regular `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`. | «El correo electrónico es obligatorio.» / «El correo electrónico no puede superar los 120 caracteres.» / «El correo electrónico no tiene un formato válido.» |
| Registro | Contraseña | Obligatoria al crear; en edición es opcional si se deja en blanco; mínimo 8 y máximo 64 caracteres; al menos una mayúscula y un número. | «La contraseña es obligatoria.» / «La contraseña debe tener al menos 8 caracteres.» / «La contraseña no puede superar los 64 caracteres.» / «La contraseña debe incluir al menos una letra mayúscula.» / «La contraseña debe incluir al menos un número.» |
| Registro | Repetir contraseña | Obligatoria si hay contraseña; debe coincidir exactamente con la contraseña. | «Debes repetir la contraseña.» / «Las contraseñas no coinciden.» |
| Registro | Fecha de nacimiento | Obligatoria; `min="1900-01-01"`; `max` se actualiza al cargar con la fecha de hoy; no puede ser futura; edad mínima de 18 años (`data-edad-minima="18"`). | «La fecha de nacimiento es obligatoria.» / «La fecha de nacimiento no es válida.» / «La fecha de nacimiento no puede ser futura.» / «Debes tener al menos 18 años para registrarte.» |
| Registro | Aceptar condiciones | Casilla obligatoria (`required`). | «Debes aceptar las condiciones para registrarte.» |
| Contacto | Nombre | Obligatorio; entre 2 y 60 caracteres (`required`, `minlength="2"`, `maxlength="60"`). | «El nombre es obligatorio.» / «El nombre debe tener al menos 2 caracteres.» / «El nombre no puede superar los 60 caracteres.» |
| Contacto | Correo electrónico | Obligatorio; máximo 120 caracteres; misma expresión regular que en el registro. | «El correo electrónico es obligatorio.» / «El correo electrónico no puede superar los 120 caracteres.» / «El correo electrónico no tiene un formato válido.» |
| Contacto | Teléfono | Opcional por defecto; si se rellena, máximo 16 caracteres y expresión regular `^\+?[0-9][0-9\s-]{5,13}[0-9]$` leída de `pattern`. | «El teléfono no puede superar los 16 caracteres.» / «El teléfono no tiene un formato válido.» |
| Contacto | «Prefiero que me llaméis» | Validación cruzada: si la casilla está marcada, el teléfono pasa a ser obligatorio. | «El teléfono es obligatorio si prefieres que te llamemos.» |
| Contacto | Motivo | Obligatorio; debe elegirse una de las opciones del desplegable. | «Selecciona un motivo de contacto.» |
| Contacto | Mensaje | Obligatorio; entre 20 y 500 caracteres (`minlength="20"`, `maxlength="500"`); contador visible. | «El mensaje es obligatorio.» / «El mensaje debe tener al menos 20 caracteres.» / «El mensaje no puede superar los 500 caracteres.» |

### Cómo se guardan los datos

- Claves de `localStorage`: `raidfinder:grupos`, `raidfinder:solicitudes`, `raidfinder:usuarios`, `raidfinder:mensajes` y `raidfinder:preferencias`.
- Los usuarios guardan `usuario`, `email`, `nacimiento` (ISO `AAAA-MM-DD`) y `condiciones` (booleano). **No se guarda la contraseña.**
- Los mensajes guardan los datos del formulario, el motivo legible, la preferencia de llamada y la fecha de envío en ISO.
- La preferencia `raidfinder:preferencias` guarda `{ id: "ultimo-contacto", nombre, email, expira }`. Al cargar el formulario de contacto se comprueba la fecha; si ha caducado, se borra y no se rellena nada.

### Cómo probarlo

Al usar módulos ES, conviene abrir el proyecto con un servidor local (por ejemplo, `python3 -m http.server 8000`) en lugar de con `file://`. Las vistas están enlazadas por hash: `#listado`, `#usuarios`, `#contacto` y `#mensajes`.

## Mapa de pantallas

| Vista | Datos que muestra | Acciones principales |
|---|---|---|
| **01 · Inicio** | Grupos/raids disponibles, fecha, idioma, plazas, requisitos y resumen de cada grupo. Incluye filtros de raid, idioma y fecha, además de búsqueda. | Buscar y filtrar grupos, abrir un grupo, solicitar plaza y empezar a crear un grupo. |
| **02 · Plantilla de grupo** | Raid, capacidad, fecha, idioma, notas, requisitos por rol y composición de las plazas. | Preparar o guardar una plantilla y crear/publicar el grupo. |
| **03 · Chat del grupo** | Miembros agrupados en tanques, sanadores y DPS, plazas ocupadas, aviso del líder y conversación. | Enviar mensajes, valorar compañeros y abandonar el grupo. |
| **04 · Perfil** | Retrato y nombre del personaje, raza, clase, rol, especialización, estado, habilidad principal, profesiones, Gear Score y reseñas. | Editar el perfil y consultar todas las reseñas. |
| **05 · Inicio de sesión** | Campos de correo o usuario y contraseña, opción para recordar la sesión y enlaces de recuperación y registro. | Iniciar sesión, recordar la sesión, recuperar la contraseña o ir al registro. |
| **06 · Solicitudes de unión** | Raid, plazas, solicitudes pendientes y una tabla de candidatos con valoración, Gear Score y mensaje; también muestra progreso de plazas por rol. | Revisar, aceptar o rechazar solicitudes. |
| **07 · Valorar jugador** | Jugador valorado, puntuación de una a cinco estrellas, etiquetas de experiencia y campo de comentario. | Seleccionar puntuación y etiquetas, escribir una reseña, enviarla o cancelar. |
| **08 · Personajes alternativos** | Lista de personajes de la cuenta con nombre, raza, clase, nivel, valoración, Gear Score y estado activo. | Cambiar el personaje activo y añadir uno nuevo. |
| **09 · Añadir personaje** | Nombre, nivel y Gear Score; opciones de raza, clase y rol; profesiones y notas. | Completar los datos y crear el personaje. |
