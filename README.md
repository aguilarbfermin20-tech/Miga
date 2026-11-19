# Miga · Panadería de masa madre

Landing de una panadería ficticia de Villa Crespo (CABA). Objetivo único: que la persona **arme un pedido y lo mande por WhatsApp**. Proyecto de portfolio: marca, datos y número de WhatsApp son de ejemplo.

**Demo:** _pendiente de deploy en Vercel_

## Stack

- Astro 5 + TypeScript estricto, salida estática (una sola página).
- CSS propio con tokens (`src/styles/tokens.css`) y estilos con scope por componente.
- Interacciones en TypeScript vanilla (~5,5 KB comprimido en total).
- Fuentes autohospedadas con Fontsource: Fraunces (variable), Hanken Grotesk y JetBrains Mono.
- Imágenes con `astro:assets` → AVIF/WebP con `srcset`.

## Comandos

```
npm install
npm run dev       # http://localhost:4321
npm run build
npm run preview
```

## Estructura

```
src/
  pages/index.astro            página única
  pages/robots.txt.ts          robots.txt
  pages/sitemap.xml.ts         sitemap
  layouts/Base.astro           head, meta, OG, JSON-LD Bakery, fuentes, skip link
  components/                  Nav, Hero, Ticker, Rail, ProductCard, Process,
                               Reviews, Visit, Footer, OrderDrawer
  lib/cart.ts                  estado del pedido + mensaje de WhatsApp (localStorage)
  lib/motion.ts                movimiento reducido, hover, un único listener de scroll
  lib/types.ts  lib/format.ts  lib/images.ts
  data/*.json                  productos, horarios, reseñas (fuente de contenido)
  assets/img/                  fotos que procesa astro:assets
docs/                          especificación (brief, diseño, secciones, interacciones, plan, calidad)
referencia/miga.html           prototipo aprobado
scripts/og.html                plantilla de la imagen OG (public/og.jpg)
```

## Decisiones respecto de la especificación

- **Producto agotado:** la foto baja al 55 % de opacidad, pero el texto no, para mantener contraste AA.
- **Pasos del proceso inactivos:** se atenúan con un color que sigue cumpliendo 4.5:1, en lugar de opacidad 0.28.
- **Fraunces sin `preload`:** en Chrome, precargar la fuente bloqueaba el primer pintado (FCP de ~0,5 s a ~1,1 s). Se usan fuentes de respaldo con `size-adjust` para que el cambio de fuente no mueva el layout.
- **Estado abierto/cerrado:** se calcula con la hora de Buenos Aires, no con la del navegador.
- **Sin JS**, la galería funciona como carrusel con scroll-snap en todos los tamaños; la versión fija se activa con JS en ≥ 821 px.

## Deploy

Importar el repo en Vercel (detecta Astro, no necesita adaptador). La URL de producción se toma de `VERCEL_PROJECT_PRODUCTION_URL` para canonical, OG y sitemap. Después del primer deploy, completar el link de la demo arriba y correr PageSpeed Insights en celular.

## Créditos de fotos

Todas de Unsplash (licencia Unsplash). Los IDs de cada foto están en `data/fotos.json`.
