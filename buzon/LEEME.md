# Buzón en el repo

Envíos de noticias pendientes de publicar en «Qué pasa en Canvas». Cualquier agente (Claude, Codex, Gemini) puede publicarlos siguiendo `AGENTS.md`.

## Formato

Una carpeta por envío: `buzon/<id>/` (id corto sin espacios, por ejemplo `20261020-guerrero`).

- `envio.json`:

```json
{
  "title": "El camino del Guerrero",
  "category": "Artes Marciales",
  "eventDate": "2026-10-23",
  "place": "Canvas 90 · Metepec",
  "text": "Texto tal como lo escribió quien envía…",
  "autor": "Javier",
  "createdAt": "2026-10-13T23:50:06Z"
}
```

- Fotos: `foto-1.jpg`, `foto-2.jpg`… en el orden en que deben aparecer (la primera es la principal).

## Cómo llega un envío aquí

- Desde el Buzón Canvas (artefacto): Claude lo copia.
- Directo: Javier, Clara o ChatGPT crean la carpeta desde GitHub (app o web) con ese formato.

Al publicar la noticia, la carpeta del envío se borra en la misma PR.
