# Plan — 2026-10-03
Crear app independiente React/Vite basada en los flujos de recepción y staff de kelly-app-v2 (referencia 1589e02). Destino Kelly_Lee vacío; conservar original.
Aceptación: pantalla visitante con nombre, motivo y anfitrión; registro/login staff; aprobación de staff por administrador; roster en tiempo real para staff aprobado con hora America/New_York; búsqueda y salida; errores visibles; diseño responsive. Firebase Authentication y Firestore con reglas que impiden autoaprobarse. Registro público con sesión anónima, sin lectura de visitantes. Demo explícita con datos ficticios solo en memoria.
Verificación: tipos/build, pruebas UI demo y reglas en emulador si disponible. Configuración/despliegue real bloqueados hasta acceso Firebase. Sin migración de datos ni modificación del proyecto original.

## 2026-10-03 — Creación de staff solo por administrador
Alcance: retirar registro público, impedir signup de usuarios en Authentication mediante client.permissions.disabledUserSignup, denegar creación/modificación de perfiles leeStaff desde clientes. Administrador del proyecto crea cuentas desde Firebase Console y perfiles mediante acceso administrativo. Mantener login y verificación email; añadir envío de verificación para cuentas creadas por admin. Visitantes registran llegada directamente sin crear una cuenta anónima, con payload y hora de servidor estrictamente validados; nunca pueden leer el roster.
Aceptación/pruebas: ausencia de registro público; cliente no puede crear perfiles con approved false o true; signup Auth rechazado realmente; llegada pública válida aceptada en emulador y lectura denegada; checkout permanece reservado a staff verificado/aprobado. Build/UI/fechas/reglas, luego despliegue y verificación visual. No crear, eliminar ni modificar usuarios existentes para pruebas de producción.

## 2026-10-03 — Roster semanal e historial
Alcance: roster en vivo de lunes 00:00 a lunes siguiente 00:00 America/New_York, sin límite de 500; conservar todos los documentos. Búsqueda histórica por nombre parcial y/o rango de fechas inclusivo, paginada e independiente, de solo lectura y autorizada al staff aprobado. Compatible con registros existentes sin migración: consulta por checkIn y filtra texto sobre lotes; mostrar continuidad si todavía hay registros por revisar. Nombre sin distinción de mayúsculas/acentos. No filtrar solo los registros ya cargados en la semana.
Aceptación/pruebas: semana lunes/domingo y DST; historial encuentra registros antiguos y posteriores al antiguo límite de 500; páginas sin duplicados con horas idénticas; permisos existentes; buscar/cerrar no altera semana ni contadores; cambios rápidos no publican resultados obsoletos. Emulador con personas ficticias; sin modificar producción. Build y pruebas antes de publicación Hosting.

## Acceso directo para cuentas administrativas
Eliminar approval y verificación obligatoria: cualquier sesión email/password existente en Authentication Users accede al roster e historial sin perfil leeStaff. Mantener signup deshabilitado y rechazar sesiones anónimas. Probar reglas sin perfil, correo sin verificar, lectura pública/anónima denegada y checkout; desplegar reglas y Hosting.

## 2026-10-03 — Contacto de visitantes
Agregar email, teléfono y ZIP obligatorios al formulario y Firestore; ZIP de cinco dígitos o ZIP+4 como texto preservando ceros. Email validado, teléfono permite formato internacional y separadores habituales. Mostrar columnas en roster e historial; registros anteriores muestran — sin migrar ni borrar. Validar payload completo, rechazo de valores inválidos y conservación de contacto durante checkout en emulador; UI de envío/lectura, build y publicación Firebase. No escribir datos de prueba en producción.

## 2026-10-03 — Imagen en portada
Incorporar imagen adjunta sin modificarla, como ilustración junto al saludo principal; mantener imagen completa con proporción original y apilar en móvil. Conservar accesos visitante/staff visibles. Validar build, vista desktop/móvil y carga pública; publicar solo Hosting y guardar recurso en Git.
