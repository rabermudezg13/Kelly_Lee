# Memoria — Kelly Education Lee County

Última actualización: 2026-10-03 (America/New_York).

## Decisiones del usuario
- Crear una app de Kelly Education Lee County basada en `rabermudezg13/kelly-app-v2`.
- Guardar el proyecto en `https://github.com/rabermudezg13/Kelly_Lee.git`.
- Backend en Firebase, sin Railway. Proyecto indicado: `frontdeskbase`.
- Pantallas de registro para staff y visitantes; staff general debe ver roster con hora de ingreso.
- Crear `AGENTS.md` y `memory.md` para continuidad.

## Estado real
- Repositorio Kelly_Lee clonado; remoto estaba vacío. App independiente React/TypeScript/Vite creada localmente.
- Registro visitante, login/registro staff, roster con actualizaciones Firestore y checkout implementados; build y diez pruebas locales aprobados; seis pruebas de reglas aprobadas en emulador; backend configurado y desplegado. Aceptación con cuenta staff real pendiente.
- Staff interpretado provisionalmente como creación de cuentas de acceso; pendiente respuesta sobre registro de entrada/salida de staff.
- La nueva decisión sustituye el registro público: cuentas/perfiles solo por administradores en Firebase Console; se mantiene correo verificado.
- Configuración Firebase declarada mediante variables VITE_FIREBASE; app web existente configurada localmente; Email/Password habilitado; signup cliente deshabilitado; Firestore (default) creado en us-east1.
- Desplegado en https://kelly-education-lee.web.app; sin escritura de visitantes reales. Staff: creación administrativa solamente. Publicado en rama `codex/lee-county-firebase`, PR borrador #1.
- Demo explícita con personas ficticias en memoria para pruebas locales.

## Historial

### 2026-10-03 — Creación de usuarios solo por administrador
- Objetivo: restringir registro staff a administradores.
- Cambios: retirada del registro público y API cliente; perfiles leeStaff deniegan toda escritura cliente; login conserva acceso existente y envío de verificación. Visitantes registran llegada sin crear cuenta Auth, con reglas estrictas y sin lectura.
- Plan: PLAN.md; elección de administración desde Firebase Console.
- Verificación: diez pruebas UI/fechas y build aprobados; seis reglas en emulador aprobadas; disabledUserSignup=true confirmado; API signup rechaza ADMIN_ONLY_OPERATION; Hosting/reglas publicadas y navegador confirma login sin registro.
- Estado: publicado en Firebase.
- Pendientes: administrador crea cuentas y perfiles reales desde Firebase Console.
- Detalle: CHANGELOG.md.


### 2026-10-03 — Crédito de creación
- Objetivo: añadir “Created by Rodrigo Bermudez · Cafe Cultura LLC for Kelly Education, with lots of love ❤️”.
- Cambios: pie de página compartido y visible en móvil.
- Verificación: build y git diff --check aprobados; Firebase Hosting publicado; navegador confirma crédito en /visit.
- Estado: publicado en https://kelly-education-lee.web.app.
- Detalle: CHANGELOG.md.


### 2026-10-03 — Despliegue Firebase autorizado
- Objetivo: publicar app por petición expresa del usuario.
- Cambios: Hosting separado `kelly-education-lee`, Firestore (default) en us-east1, reglas publicadas, Anonymous habilitado y dominios autorizados; configuración web local ignorada por Git. El sitio original `frontdeskbase` conserva su release.
- Verificación: build de producción correcto sin demo; diez pruebas UI/fechas y seis pruebas de reglas en emulador aprobadas; compilación/publicación Firebase correcta; navegador confirma home, visitante y login/registro staff públicos.
- Estado: publicado en https://kelly-education-lee.web.app.
- Límites: sin pruebas con staff real verificado/aprobado; sin escribir visitas ficticias en producción.
- Pendientes: crear/aprobar las cuentas staff reales.
- Referencia: sitio kelly-education-lee, proyecto frontdeskbase; PR #1.
- Detalle: CHANGELOG.md.


### 2026-10-03 — .agents y manejo de fechas original
- Objetivo: crear `.agents/skills` y `.agents/date-format.md`; copiar manejo de fechas de app original.
- Cambios: documentación y utilidades adaptadas de `kelly-app-v2@1589e02`; UTC, America/New_York, AM/PM con segundos, clave local YYYY-MM-DD. Conservación de offsets explícitos y parseo centralizado. Roster usa estas utilidades.
- Verificación: diez pruebas aprobadas (cuatro UI y seis fechas); build TypeScript/Vite correcto; git diff --check correcto.
- Estado: implementado localmente; publicado en PR borrador #1.
- Referencia: commit remoto `380f5fc`; PR https://github.com/rabermudezg13/Kelly_Lee/pull/1.
- Pendientes: revisar PR #1; conexión/despliegue Firebase aún sin validar.
- Detalle: `CHANGELOG.md`.


### 2026-10-03 — Estructura .codex solicitada
- Objetivo: crear `.codex/commands` y `.codex/fearures.md` con el nombre exacto indicado.
- Cambios: carpeta, archivo vacío fearures.md y .gitkeep para conservar commands en Git.
- Verificación: existencia local comprobada. Sin cambios funcionales.
- Estado: creado localmente; publicado en PR borrador #1.
- Pendientes: ninguno para esta estructura.
- Detalle: `CHANGELOG.md`.


### 2026-10-03 — Inicio de app y documentos de continuidad
- Objetivo: crear front desk Lee County usando Firebase y alojar código en Kelly_Lee.
- Referencia base real: `kelly-app-v2` commit `1589e02`; Kelly_Lee inicialmente vacío.
- Cambios: plan explícito, app, reglas Firestore, configuración Hosting, README, pruebas UI, AGENTS.md y esta memoria.
- Verificación: instalación npm completada usando caché temporal; `npm run build` correcto; cuatro pruebas UI aprobadas; `git diff --check` correcto. Reglas Firestore y flujo real aún no verificados.
- Estado: implementación local en curso; no publicada, no desplegada.
- Pendientes: verificar UI y reglas; revisar frontdeskbase; configurar web app; publicar código y luego validar conexión real.
- Detalle: `CHANGELOG.md`.

## Publicación de esta revisión
Código y estructura publicados en PR borrador #1 (`380f5fc`). Sin integración a main ni despliegue Firebase. Pruebas de reglas/emulador y aceptación autenticada pendientes; no declaradas como verificadas.
