# Proyecto-SPA-Cliente

## Backlog

Propuesta de trabajo priorizada a partir de los mockups. Cada tarea debe poder implementarse y comprobarse por separado. **P0** es imprescindible para el flujo principal; **P1** completa la coordinación de grupos; **P2** añade gestión de perfil y reputación.

| Prioridad | Tarea | Comprobación independiente |
|---|---|---|
| P0 | Registro de cuenta | Se puede crear una cuenta con los datos obligatorios y se muestran errores si faltan o no son válidos. |
| P0 | Inicio y cierre de sesión | Un usuario registrado puede iniciar sesión con correo o nombre de usuario y contraseña, mantener la sesión y cerrarla. |
| P0 | Alta de personaje | Se puede crear un personaje indicando nombre, nivel, raza, clase y rol; los campos obligatorios se validan. |
| P0 | Listado de grupos publicados | Inicio muestra las raids disponibles con nombre, fecha, idioma, plazas y datos principales del grupo. |
| P0 | Solicitud para unirse | Un usuario puede enviar una solicitud a un grupo y consultar si está pendiente, aceptada o rechazada. |
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