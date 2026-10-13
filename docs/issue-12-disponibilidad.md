# Issue #12: disponibilidad confirmada o bloqueo

Fecha de ejecución: 2026-10-13. Base oficial consultada: `main` en
`14f7dbe0d6572e451883c4c81a2c65cdc7a24480`.

## Causa y decisión

La página convertía `ok:false` y ocupaciones ausentes en una lista vacía.
Un fallo de `Promise.all` conservaba listas vacías o datos de otra semana.
La vista general imprimía «Disponible» sin comprobar los horarios libres.

Cada espacio tiene ahora su propio estado `loading`, `confirmed` o `error`.
Solo `confirmed` permite dibujar franjas libres, indicadores de disponibilidad
y horarios en el resumen. Un error borra los datos del espacio afectado y
presenta la advertencia solicitada, WhatsApp y un botón de reintento.

Cada consulta verifica HTTP, JSON, `ok === true`, el arreglo `ocupados` y todos
sus intervalos (`desde`/`hasta`, fechas válidas y fin posterior al inicio).
Una lista vacía solo es válida con ese contrato confirmado. Las fechas admitidas
son ISO: fecha de día completo o fecha/hora, con zona opcional como antes.
Los días completos se interpretan como fechas locales; los intervalos que
terminan a medianoche se conservan y los minutos parciales se bloquean de
forma conservadora. Se mantienen los horarios de operación y reglas comerciales.

El límite de 15 segundos cubre tanto la conexión como la lectura del JSON.
Cada espacio puede terminar o fallar sin esperar los otros. Al cambiar de semana
se invalidan los datos anteriores; una generación y la identidad de la consulta
impiden que respuestas tardías vuelvan a confirmar otra semana. Los reintentos
consultan únicamente el espacio afectado, sin recargar la página.

## Pruebas ejecutadas

Comando reproducible, sin dependencias externas:

```sh
node tests/disponibilidad.test.cjs
```

Resultado: **25 pruebas, 25 aprobadas, 0 fallidas**. Node `v22.22.1`.
También se ejecutaron `node --test tests/disponibilidad.test.cjs` y
`git diff --check`, con salida exitosa.

La suite ejecuta el script real de `disponibilidad/index.html` en `node:vm`
con DOM mínimo, `fetch` simulado y reloj controlado. Comprueba los estados,
HTML de ambas vistas, resúmenes, botón de reintento y resultados de los horarios.
No es una prueba de renderizado en navegador ni una consulta real a Google.

| Escenario | Resultado |
| --- | --- |
| Carga pendiente | Bloqueo sin franjas libres ni rangos en resumen |
| Éxito sin reservas | 07:00–22:00 confirmado |
| Éxito con ocupaciones y día totalmente ocupado | Franjas descontadas; sin «Disponible» si no hay horarios libres |
| Red, HTTP 503, JSON inválido, `ok:false` | Bloqueo y advertencia |
| Ocupaciones ausentes, tipo inválido, intervalos incompletos/invertidos, fechas imposibles | Bloqueo |
| Timeout de conexión y lectura del cuerpo | Bloqueo, aborto; límite comprobado con reloj simulado |
| Fallo de un espacio / fallo de los tres | Estados independientes; sin falsa disponibilidad |
| Un espacio pendiente, otros exitosos | Los exitosos se muestran inmediatamente |
| Recuperación mediante botón | Carga bloqueada y luego confirmación del espacio reintentado |
| Cambio de semana y respuestas tardías | Sin reutilización de datos previos |
| Medianoche, días completos y segundos parciales | Ocupaciones conservadas |

## Pendientes y límites antes de fusionar

- **Validación visual en móvil y escritorio pendiente.** Se intentó iniciar
  Chrome y agent-browser; el sandbox impide crear sockets del sistema. No se
  obtuvieron capturas ni se afirma haber aprobado esa prueba. Revisar ambas
  vistas en 390×844, 768×1024 y 1440×900, incluyendo carga, error, confirmación,
  ocupación completa y reintento. El aviso vive dentro de la tarjeta y no depende
  del panel lateral o resumen, ocultos por las reglas móviles preexistentes.
- No se consultó el servicio real de Google Calendar ni se modificó su
  configuración. El cliente depende de que una respuesta válida `ok:true`
  represente datos completos: una omisión del servidor dentro de una respuesta
  aparentemente válida requiere corrección del servidor, fuera de este encargo.
- Se conserva la interpretación local de horas del sitio; no se cambia la zona
  horaria comercial. Verificar el formato real del servicio en la revisión.
- Se aumentaron avisos, estados y leyenda móvil a 14–16 px. Se conserva la
  tipografía compacta preexistente fuera de estos estados, sin supresiones de
  reglas ni rediseño general.
- Sin despliegue, fusión automática, cambios de tarifas, credenciales o cobro.

La PR debe permanecer abierta para revisión y validación visual.
