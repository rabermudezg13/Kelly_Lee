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
- Registro visitante, login/registro staff, roster con actualizaciones Firestore y checkout implementados; build y diez pruebas locales aprobados; permisos y conexión real pendientes.
- Staff interpretado provisionalmente como creación de cuentas de acceso; pendiente respuesta sobre registro de entrada/salida de staff.
- Nuevas cuentas requieren correo verificado y aprobación administrativa; aprobación mediante consola Firebase.
- Configuración Firebase declarada mediante variables VITE_FIREBASE; app web existente confirmada en consola; servicios habilitados y conexión real pendientes de revisar.
- Sin despliegue ni escritura de visitantes reales. Publicado en rama `codex/lee-county-firebase`, PR borrador #1.
- Demo explícita con personas ficticias en memoria para pruebas locales.

## Historial

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
