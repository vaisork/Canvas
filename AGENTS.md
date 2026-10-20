# Canvas 90 — sitio web (reglas para todos los agentes)

Este archivo es la fuente única de reglas para Claude, Codex y Gemini (Antigravity). `CLAUDE.md` solo lo importa.

Sitio estático (HTML/CSS/JS plano, sin build) para Canvas 90, espacio de eventos en Metepec. Se publica en GitHub Pages desde la rama `main` (https://canvas90.mx).

- `index.html` — home
- `espacios/`, `estudio-fotografico/`, `contacto/`, `disponibilidad/` — páginas del sitio
- `novedades/` — «Qué pasa en Canvas», timeline de noticias de eventos
- `buzon/` — envíos pendientes de publicar (ver `buzon/LEEME.md`)
- `assets/` — CSS/JS/imágenes compartidas

## De dónde llegan las noticias

1. **Buzón Canvas (artefacto de Claude):** https://claude.ai/artifact/1C1YchGzwhBYJ6PTnto45B. Javier y Clara lo usan desde el celular. Solo Claude puede leerlo, así que **Claude copia cada envío pendiente a `buzon/<id>/`** (ver abajo) y lo marca `status: "en_repo"` en el artefacto.
2. **Directo al repo:** Javier, Clara o ChatGPT pueden crear `buzon/<id>/` desde GitHub con el formato de `buzon/LEEME.md`.

Cualquier agente publica desde `buzon/`. No hace falta Claude para publicar.

### Solo Claude: copiar del artefacto a `buzon/`

- Listar envíos: `ArtifactData` `action: "list"`, `collection: "submissions"`, `url` del artefacto.
- Para cada envío con `status: "pendiente"`: bajar cada foto con `Artifact` `action: "read"` y `path` = `id` del asset (32 hex, una por llamada), no la url `/_blob/...`.
- Guardar `buzon/<id>/envio.json` (campos del envío, sin `photos`) y las fotos como `foto-1.jpg`, `foto-2.jpg`… en su orden. No hace falta mirar las fotos para copiarlas.
- Marcar el envío en el artefacto con `ArtifactData` `action: "update"`, `status: "en_repo"`.

## Al convertir un envío en noticia, SIEMPRE

1. **Corregir ortografía y puntuación, y mejorar la redacción** del texto enviado (suele venir dictado o escrito rápido desde el celular, sin acentos ni comas). Conservar el tono informal y los hechos tal cual: no inventar ni exagerar, solo pulir la forma. Si el texto y una imagen se contradicen, manda el texto y se avisa a Javier.
2. **Igualar el diseño real de `novedades/index.html`**, no una versión simplificada: misma tipografía (Cormorant Garamond para títulos, Inter para cuerpo), misma paleta (`--teal:#167E8C`, `--yellow:#E0A51E`, `--coral:#E8644F`, fondo `--paper:#fffefb`), mismo layout de intro (flyer o foto principal al lado del texto, no apilado), cuadrícula `.shots` de fotos con `<figcaption>` por imagen, y agregar la entrada al menú `.timeline` de arriba (la más reciente primero, con clase `current`).
3. **Optimizar las fotos** antes de subirlas a `novedades/img/` (redimensionar a ~1400-1600 px de ancho, JPEG calidad ~78-82 %). Recortar franjas negras o vacías.
4. La categoría la escribe libremente quien envía: usarla tal cual como etiqueta (`.meta .cat`) y en `data-cat` del `<article>`.
5. **Crear `novedades/SLUG/index.html` para compartir la noticia**, siguiendo el formato de las páginas existentes: título, descripción del `.deck`, `og:type=article`, `og:site_name=Canvas`, `og:locale=es_MX`, `og:title`, `og:description`, `og:image` absoluta de la foto principal, `og:url` y canonical `https://canvas90.mx/novedades/SLUG/`, y `twitter:card=summary_large_image`. Redirigir con JavaScript `location.replace('../#SLUG')`, sin meta refresh, e incluir el enlace visible «Ver la noticia» a `../#SLUG`. Agregar también el botón `.share-news` en la `.meta` del artículo para usar el script compartido.
6. **Escribir `novedades/SLUG/post.txt`: el texto de venta para Facebook e Instagram.** El botón «Compartir» copia este texto y comparte las fotos de la noticia. Formato (texto plano UTF-8, máximo ~1 200 caracteres):
   - Gancho de una línea con emoji.
   - 2-3 líneas: qué es y por qué venir, con los hechos del envío.
   - Fechas y horarios (📅) si el evento es próximo; si ya pasó, una línea de cierre o agradecimiento.
   - 📍 Canvas 90, Metepec.
   - 👉 `canvas90.mx/novedades/SLUG/`
   - 4-6 hashtags, siempre `#Canvas90` y `#Metepec`.
   - Mismas reglas que la noticia: no inventar precios, cupos ni datos que no vengan en el envío.
7. **Borrar `buzon/<id>/`** en la misma PR que publica la noticia (las fotos ya quedaron en `novedades/img/`; el historial de git conserva el original).

## Flujo de publicación

Los cambios se desarrollan en una rama (`<agente>/<tarea>`) y se suben a `main` vía Pull Request (`git push` directo a `main` está bloqueado por política). GitHub Pages sirve desde `main`, así que nada se ve en vivo hasta que el PR se fusiona. Identidad de commit en este repo: `git -c user.name=vaisork -c user.email=vaisork@gmail.com commit`.

Pruebas: `node --test tests/disponibilidad.test.cjs`.
