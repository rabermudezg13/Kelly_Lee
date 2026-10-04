# Bitácora de cambios

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
