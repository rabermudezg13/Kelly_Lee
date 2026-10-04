# Reglas de trabajo — Kelly Education Lee County

## Antes de trabajar
- Leer `.agents/date-format.md`, `memory.md`, `PLAN.md`, `README.md` y las entradas recientes de `CHANGELOG.md`.
- Contrastar la memoria con Git y evidencia actual. La memoria no prueba que producción esté sana.
- Planificar funciones nuevas: alcance, criterios de aceptación y pruebas antes de editar. Trabajar en una rama aislada.

## Arquitectura y alcance
- Backend exclusivamente Firebase Authentication y Cloud Firestore; hosting previsto Firebase Hosting. No introducir Railway ni endpoints del proyecto original.
- Repositorio destino: `rabermudezg13/Kelly_Lee`. `kelly-app-v2` es una referencia; no modificar su producción.
- Mantener registro de visitantes, login staff y creación administrativa de cuentas y roster en tiempo real para todo staff aprobado.
- Registrar llegada/salida con `serverTimestamp()` y mostrar en `America/New_York`, considerando horario de verano.
- Reglas de Firestore son la autoridad de acceso. Staff no puede registrarse ni autoaprobarse; cuentas y perfiles se crean mediante consola/Admin SDK por administradores del proyecto. Mantener client.permissions.disabledUserSignup=true y correo verificado. Visitantes registran llegada sin crear cuenta Auth.
- Visitantes no pueden leer el roster. No ampliar acceso para solucionar un fallo de interfaz.

## Datos y configuración
- Nunca guardar tokens, claves privadas, contraseñas ni datos personales reales en Git, pruebas, documentación o capturas.
- No incorporar `.env.local`; usar `.env.example` para documentar configuración.
- Demo únicamente con personas ficticias y memoria local; marcarla claramente y no activarla en producción.
- No modificar datos reales para probar. Usar emuladores o un proyecto de pruebas.
- Antes de publicar reglas o Hosting, comprobar lo que ya existe en frontdeskbase para evitar reemplazar políticas o una app ajena.

## Verificación y entrega
- Ejecutar `npm run build`, pruebas de comportamiento relevantes y `git diff --check`.
- Probar permisos de Firestore en emulador cuando cambien reglas. Distinguir build, prueba local, publicación y verificación en producción.
- No declarar conectado o desplegado sin evidencia. Registrar verificaciones bloqueadas y su causa.
- Respetar cambios ajenos; no borrar ni limpiar masivamente.

## Continuidad obligatoria
- Al terminar cada tarea, actualizar `memory.md` y `CHANGELOG.md` con objetivo, cambios, pruebas/resultados, estado real y pendientes.
- Conservar historial y usar referencias Git/PR reales. No inventar releases o despliegues.
- Actualizar README cuando cambie configuración, arquitectura u operación.
