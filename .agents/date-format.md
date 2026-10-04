# Manejo de fechas — heredado de Kelly App v2

Referencia comprobada: `rabermudezg13/kelly-app-v2`, commit `1589e02`,
`kelly-app-v2/frontend/src/utils/dateUtils.ts` y `pages/StaffDashboard.tsx`.
Implementación adaptada: `src/utils/dateUtils.ts` en Kelly_Lee.

## Reglas
- Guardar instantes de ingreso y salida en UTC; en Firebase usar `serverTimestamp()`.
- Mostrar fechas siempre en `America/New_York`, que corresponde a Miami y Lee County.
- `Intl.DateTimeFormat` resuelve EST/EDT; nunca restar manualmente cuatro o cinco horas.
- Locale de presentación `en-US`; fecha `MM/DD/YYYY`, hora de 12 horas con AM/PM y segundos, como la app original.
- `formatMiamiTime` muestra fecha y hora; `formatMiamiDate` solo fecha; `formatMiamiTimeOnly` solo hora.
- `getMiamiDateKey` devuelve `YYYY-MM-DD` mediante `formatToParts` para agrupar y filtrar días locales; no usar el día UTC de `toISOString()`.
- `formatMiamiDateDisplay` produce separadores con día de semana, mes, día y año.
- Compatibilidad con datos originales: ISO sin zona enviado por Python/SQLite representa UTC, por lo que se añade Z; formato SQLite se normaliza a ISO.
- Respetar Z y offsets explícitos, incluso con fracciones de segundo. No sustituir un offset por Z.
- Firebase `Timestamp.toMillis()` proporciona el instante sin necesidad de corregir zona. Los valores en milisegundos se aceptan directamente.
- Un valor ausente o inválido nunca debe convertirse en hora actual ni alterar agrupaciones. Mostrar N/A / Invalid Date; clave vacía cuando no es válido.
- No interpretar una fecha calendario sin hora como un instante: tratarla aparte si se añaden filtros de calendario.

## Verificación
Probar UTC sin zona, offsets con fracciones, medianoche local, días anterior/siguiente,
inicio y fin del horario de verano y entradas inválidas. Fixtures ficticios, sin datos de producción.

Se conservan nombres de utilidades de la app original para facilitar continuidad.
La adaptación centraliza el parseo y conserva offsets, corrigiendo inconsistencias de las variantes originales.
