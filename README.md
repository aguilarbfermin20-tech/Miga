# Miga · paquete para Claude Code

Todo lo necesario para programar la landing de Miga Panadería con Claude Code.

## Qué hay en la carpeta

| Ruta | Para qué |
| --- | --- |
| `CLAUDE.md` | Instrucciones que Claude Code lee solo al arrancar: stack, reglas y orden de lectura |
| `docs/01-brief.md` | Concepto, público, objetivo y tono |
| `docs/02-diseno.md` | Colores, tipografías, espaciado, radios y movimiento |
| `docs/03-secciones.md` | Cada sección con su contenido y estructura |
| `docs/04-interacciones.md` | Cada interacción: comportamiento, teclado, accesibilidad y celular |
| `docs/05-plan.md` | Etapas de desarrollo con criterios de aceptación |
| `docs/06-calidad.md` | Buenas prácticas de UX/UI, accesibilidad, SEO y rendimiento |
| `data/` | Productos, horarios y reseñas en JSON |
| `referencia/miga.html` | Prototipo funcional. Abrilo con doble clic para ver cómo tiene que quedar |
| `public/img/` | Fotos de Unsplash (licencia libre, uso comercial permitido) |

## Cómo arrancar

1. Creá una carpeta vacía `miga`, copiá adentro todo este paquete y abrí una terminal ahí.
2. Iniciá un repo: `git init`.
3. Abrí Claude Code (`claude`) y pegale esto:

> Leé CLAUDE.md y todos los archivos de docs/ en orden. Abrí referencia/miga.html para ver el diseño. Después armá el proyecto Astro siguiendo la Etapa 1 de docs/05-plan.md y frená cuando la termines para que la revise.

4. Revisá cada etapa en `npm run dev` antes de decirle que siga con la próxima.
5. Para publicar: subí el repo a GitHub e importalo en Vercel (detecta Astro solo).

## Créditos de fotos

Todas de Unsplash. Si querés acreditar a cada fotógrafo, buscá la foto en unsplash.com con el ID que figura en `data/fotos.json`.
