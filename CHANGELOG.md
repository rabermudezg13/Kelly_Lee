# Bitácora de cambios

## 2026-10-03 — Crédito de creación
- Objetivo: añadir crédito en inglés de Rodrigo Bermudez / Cafe Cultura LLC para Kelly Education con corazón.
- Cambios: footer compartido y estilo responsive; crédito visible también en móvil.
- Verificación: build y git diff --check aprobados; Firebase Hosting publicado; navegador confirma crédito en /visit.
- Estado: publicado en https://kelly-education-lee.web.app.


## 2026-10-03 — Publicación en Firebase
- Objetivo: desplegar por solicitud expresa del usuario.
- Cambios: Hosting apunta al sitio separado kelly-education-lee; Firestore default creado en us-east1 y reglas publicadas; Authentication Anonymous habilitado junto a Email/Password existente, dominios del sitio autorizados. Configuración web en .env.local ignorado.
- Pruebas: build correcto, diez UI/fechas aprobadas; seis reglas aprobadas en emulador demo con Java 21; Firebase compiló/publicó reglas y Hosting. Navegador confirma home, formulario visitante y login/registro staff.
- Estado: publicado https://kelly-education-lee.web.app. Sitio original preservado.
- Límites: aceptación con staff real pendiente; sin visitas escritas en producción.


## 2026-10-03 — .agents y fechas originales
- Cambios: `.agents/skills/.gitkeep`, `.agents/date-format.md`, `src/utils/dateUtils.ts` y adaptación del roster. Reglas copiadas de utilidades originales en `1589e02`; preservación de offsets y DST.
- Verificación: diez pruebas UI/fechas aprobadas, build correcto y git diff --check correcto.
- Estado: local, sin despliegue.


## 2026-10-03 — Estructura de Codex
- Cambios: `.codex/commands`, `.codex/commands/.gitkeep` y `.codex/fearures.md` vacío, respetando nombre solicitado.
- Verificación: carpeta y archivo existen localmente.
- Estado: creado, sin cambio funcional; pendiente publicación Git.


## 2026-10-03 — App Firebase para Kelly Education Lee County
- Objetivo: registro visitante y staff con roster de llegadas visible al staff general aprobado.
- Cambios: React/Vite/TypeScript, Firebase Authentication/Firestore, reglas de acceso, pantallas responsive, demo ficticia, búsqueda y checkout. Hosting configurado para frontdeskbase. Backend sin Railway.
- Continuidad: creación de AGENTS.md y memory.md por instrucción del usuario; plan y operación en PLAN.md y README.md.
- Verificación: `npm run build` aprobado, cuatro pruebas UI aprobadas, `git diff --check` aprobado. Reglas y conexión Firebase aún no verificadas.
- Estado: local, sin publicación Git ni despliegue Firebase.
- Pendientes: build, pruebas UI/permisos, configuración y validación Firebase.

## 2026-10-03 — Publicación de revisión
- Estado: publicado en rama codex/lee-county-firebase y PR borrador #1, commit remoto 380f5fc.
- Verificación: build y diez pruebas locales aprobados; conexión y reglas Firebase pendientes.
- Pendientes: revisión, validación de permisos y despliegue.
- Referencia: https://github.com/rabermudezg13/Kelly_Lee/pull/1.
