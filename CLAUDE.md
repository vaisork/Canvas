# Canvas 90 — sitio web

Sitio estático (HTML/CSS/JS plano, sin build) para Canvas 90, espacio de eventos en Metepec. Se publica en GitHub Pages desde la rama `main`.

- `index.html` — home
- `espacios/`, `estudio-fotografico/`, `contacto/`, `disponibilidad/` — páginas del sitio
- `novedades/` — "Qué pasa en Canvas", timeline de posts de eventos (ver sistema de diseño abajo)
- `assets/` — CSS/JS/imágenes compartidas

## Buzón Canvas (fuente de noticias)

El dueño del sitio manda noticias de eventos desde su celular usando un Artifact llamado **Buzón Canvas**: https://claude.ai/artifact/1C1YchGzwhBYJ6PTnto45B

Es una página que sube fotos (comprimidas en el navegador) y guarda texto/categoría/fecha en una base de datos propia del Artifact (capacidades `assets` + `db`, colección `submissions`). Para leer lo que hay pendiente:

- Listar envíos: `ArtifactData` `action: "list"`, `collection: "submissions"`, `url` del artifact de arriba.
- Bajar cada foto: `Artifact` `action: "read"` con `path` = el `id` del asset (32 hex), no la url `/_blob/...` completa.
- Cuando ya se publicó un envío en el sitio real, marcarlo con `ArtifactData` `action: "update"` poniendo `status: "publicado"` (así el historial del Buzón refleja la realidad).

### Al convertir un envío del Buzón en post real, SIEMPRE:

1. **Corregir ortografía y puntuación, y mejorar la redacción** del texto enviado (suele venir dictado o escrito rápido desde el celular, sin acentos/comas). Conservar el tono informal y los hechos tal cual — no inventar ni exagerar, solo pulir la forma.
2. **Igualar el diseño real de `novedades/index.html`**, no una versión simplificada: misma tipografía (Cormorant Garamond para títulos, Inter para cuerpo), misma paleta (`--teal:#167E8C`, `--yellow:#E0A51E`, `--coral:#E8644F`, fondo `--paper:#fffefb`), mismo layout de intro (flyer/foto principal al lado del texto, no apilado), cuadrícula `.shots` de fotos con `<figcaption>` por imagen, y agregar la entrada correspondiente al menú `.timeline` de arriba.
3. **Optimizar las fotos** antes de subirlas al repo (redimensionar a ~1400-1600px de ancho, JPEG calidad ~78-82%) — las que vienen del Buzón ya llegan comprimidas pero conviene revisar tamaño final.
4. La categoría la escribe libremente quien envía (chips + opción "Otro" con texto libre) — usarla tal cual como la etiqueta de categoría (`.meta .cat`) del post.

## Flujo de publicación

Los cambios se desarrollan en una rama y se suben a `main` vía Pull Request (`git push` directo a `main` está bloqueado por política). GitHub Pages sirve desde `main`, así que nada se ve en vivo hasta que el PR se fusiona.
