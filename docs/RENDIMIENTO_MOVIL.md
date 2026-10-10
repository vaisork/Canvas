# Optimización móvil de Canvas90.mx — 2026-10-10

Base: `dd1712f`. Sitio estático publicado por GitHub Pages; 15 páginas HTML.

## Resultado medido

Comparación local de la misma revisión antes/después en Chromium, viewport 390 × 844, DPR 2, caché desactivada, latencia 150 ms, descarga 200 000 bytes/s y CPU ralentizada 4×. Se recorrió cada página hasta el final para activar la carga diferida. Los bytes incluyen recursos externos y cabeceras observadas por el navegador. Una ejecución por versión: son medidas de laboratorio, no percentiles de visitantes reales.

| Descarga | Antes | Después | Reducción |
| --- | ---: | ---: | ---: |
| Portada completa | 1 240 933 bytes | 900 692 bytes | 27.4% |
| Imágenes de la portada | 901 730 bytes | 560 581 bytes | 37.8% |
| Novedades completa | 2 453 636 bytes | 1 520 627 bytes | 38.0% |
| Portada antes de desplazarse | 547 848 bytes | 544 137 bytes | 0.7% |
| Novedades antes de desplazarse | 480 887 bytes | 411 947 bytes | 14.3% |

El primer contenido de la portada apareció a 1056 ms antes y 972 ms después. Esa diferencia aislada no demuestra una mejora estable de velocidad. La mayor ganancia comprobada está en las fotografías al recorrer el sitio. La portada pública respondió HTTP 200; una carga real registró aproximadamente 1.20 MB. Esto no descarta problemas intermitentes de DNS, operador móvil o conexión.

## Cambios

- Mismas fotografías y encuadres, con variantes de 480 y 800 píxeles cuando reducen el tamaño. El navegador elige mediante `srcset` según pantalla y densidad.
- WebP calidad 78 para fotos. Se conserva el original cuando es más pequeño; íconos convertidos sin pérdida. Los originales siguen disponibles para enlaces existentes y metadatos sociales.
- Tipografías originales Cormorant Garamond, Inter y Patrick Hand alojadas localmente en WOFF2, con sus licencias OFL. Subconjunto latino con acentos y ñ; mismas versiones de Google Fonts observadas durante la auditoría.
- Cinco fotografías de actividades ahora se sirven desde el sitio, con sus URLs originales documentadas en `assets/img/activity-sources.md`.
- Miniaturas del estudio y tarjetas con tamaños acordes a su espacio. Las ampliaciones conservan su fuente de mayor resolución.
- Videos con `preload="none"`: descarga al reproducir.
- Galería de Canvas 90 reparada: antes descargaba toda la portada y buscaba imágenes `data:image/` que ya no existían. Ahora contiene directamente las tres fotografías disponibles del salón, jardín y deck, con carga diferida y ampliación por clic o teclado.
- Sin cambios al CSS de diseño, textos, paleta, distribución ni seguimiento de Analytics.

## Verificación

- `python3 -m unittest discover -s tests -v`: tres pruebas correctas de recursos locales, fuentes y galería.
- `node --check assets/js/site-shell.js` y `git diff --check`: correctos.
- Chromium: 15 páginas abiertas sin errores JavaScript; menú móvil abre/cierra; galería abre/cierra mediante Escape.
- Portada a 390 y 1440 px: límites geométricos de secciones y encabezados idénticos antes/después, después de cargar fuentes. Capturas revisadas visualmente.
- Novedades: misma altura móvil, ninguna imagen fallida en el recorrido.

## Pendiente independiente del peso

Desde la revisión original, cuatro JPEG de Origen no se pueden decodificar: `foto-origen.jpg`, `canvas-origen-real.jpg`, `origen-interior.jpg` y `origen-acceso.jpg`. `origen-recorrido.mp4` tiene 2497 bytes y ffprobe informa datos H.264 inválidos y archivo parcial. La versión antigua de `foto-origen.jpg` en Git es una imagen diferente de 320 × 240; no se sustituyó la foto actual por otra sin confirmar el contenido.

Al actualizar GitHub apareció la rama paralela `fix/origen-media-real-20261010` (commit `1f35e64`), que recupera tres fotografías y el video. Se verificó que su foto principal sí se decodifica. Esa reparación no está aún en `main` y se mantiene separada para no pisar trabajo concurrente. La rama de rendimiento conserva los archivos base; deben integrar la reparación y volver a medir el conjunto, pues los originales recuperados pesan más que los archivos dañados. `canvas-origen-real.jpg` no tiene referencias activas en HTML/JS.

No se probó un teléfono físico ni diferentes operadores, y no se validaron las respuestas de la API externa de disponibilidad. La prueba de esa página cubrió carga, cabecera y ausencia de errores JavaScript, no la exactitud del calendario.
