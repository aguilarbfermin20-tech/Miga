# 03 · Secciones y contenido

Orden de la página. Cada sección es un componente en `src/components/`. Los textos van tal cual.

## 0. Barra de progreso (`Progress` dentro de `Nav.astro`)
Línea de 4 px fija arriba, degradé `--yolk` → `--hot`, `transform: scaleX(progreso)`. Decorativa (`aria-hidden`).

## 1. Nav (`Nav.astro`)
- Fija arriba. Transparente con texto claro sobre el hero; cuando el scroll pasa el hero se vuelve sólida (`--paper` 86 % + `backdrop-filter: blur(14px)`) con texto `--ink`.
- Izquierda: logo "miga." (Fraunces 34 px, punto en `--yolk`).
- Centro (oculto < 760 px): Hoy en el horno · Cómo lo hacemos · Horarios. Subrayado amarillo que crece en hover.
- Derecha: botón **"Tu pedido"** con contador (pastilla amarilla). Abre el cajón del pedido.

## 2. Hero (`Hero.astro`)
Capas (de atrás hacia adelante): foto `hero.jpg` · palabra **"miga"** gigante calada (borde amarillo 45 %) · sombra en degradé · sello giratorio · contenido.
- Kicker: no lleva.
- H1: **"Pan de verdad,"** / **"a las 7."** (segunda línea en itálica `--yolk`). Fraunces peso 300 en reposo.
- Bajada: "Masa madre, harina de molino chico, agua, sal y tiempo. Horneamos todos los días en Villa Crespo."
- Botones: **"Armar mi pedido"** (amarillo, lleva a la galería) y **"Cómo lo hacemos"** (borde).
- Sello: texto circular "MASA MADRE · 36 HORAS · HORNO DE PISO ·" y "36h" al centro.
- Indicador "Bajá" con línea que gotea (oculto en celular).
- Alto mínimo 680 px (620 en celular). Contenido alineado abajo.

## 3. Cinta (`Ticker.astro`)
Banda amarilla con borde `--ink` arriba y abajo. Mono 13 px mayúsculas. Contenido desde `data/productos.json` → "7:00 hogaza de campo ✶ 7:40 medialunas ✶ … ✶ Encargos hasta las 20 h". Desplazamiento infinito 40 s, se pausa en hover. Lista duplicada con `aria-hidden` para el loop.

## 4. Hoy en el horno (`Rail.astro` + `ProductCard.astro`)
- H2: "Hoy en el *horno*" (itálica `--olive`). Texto: "Sumá lo que quieras a tu pedido y mandalo por WhatsApp. Te lo guardamos hasta las 20 h."
- Galería horizontal fija en compu (ver `04-interacciones.md` §2). En celular, carrusel con scroll-snap.
- Tarjeta: etiqueta de horario arriba a la izquierda sobre la foto (punto naranja que late si es "recién salido"), foto 4:5, nombre (Fraunces 32 px), precio (mono), descripción, botón **"+ Sumar al pedido"**. Cuando está en el pedido: **"✓ En tu pedido (n)"** con fondo `--olive`.
- Producto agotado (baguette): opacidad 55 %, botón con borde punteado; igual se puede sumar como encargo para mañana.
- Contador abajo: "01 / 06" + barra de progreso de la galería.

## 5. Cómo lo hacemos (`Process.astro`)
Banda `--ink`. Intro: kicker "Cómo lo hacemos" + H2 "Veinte horas / para *un pan.*"
Dos columnas: izquierda fija (reloj grande mono amarillo + "DÍA 1/2" + foto que cambia), derecha 4 pasos:

| Paso | Hora | Título | Texto |
| --- | --- | --- | --- |
| 1 | 10:00 · Día 1 | Despertamos la masa madre | La alimentamos con harina y agua, y cuando duplica su tamaño amasamos con harina de molino chico. |
| 2 | 14:00 · Día 1 | Pliegues y formado a mano | Cada media hora estiramos y plegamos la masa. Después la formamos una por una, sin máquinas. |
| 3 | 18:00 · Día 1 | Una noche en frío | La fermentación lenta en la cámara le da sabor, una miga abierta y hace que dure toda la semana. |
| 4 | 06:00 · Día 2 | Horno de piso a 250 °C | Cuarenta minutos de horno con vapor. A las 7 la hogaza está en la vidriera, todavía crujiendo. |

Fotos por paso: `panes-surtidos.jpg`, `centeno.jpg`, `hogaza.jpg`, `hero.jpg`.

## 6. Reseñas (`Reviews.astro`)
Kicker "Lo que dicen en el barrio". Una reseña grande por vez (Fraunces 36–80 px, final en itálica `--olive`), botones ← → (48 px, circulares), autor y puntos de posición. Contenido en `data/resenas.json`.

## 7. Visitanos (`Visit.astro`)
Dos columnas: foto `local.jpg` a sangre + panel `--crumb`.
- Estado en vivo: "● Abierto ahora · cierra a las 20:00" o "● Cerrado ahora · tomamos encargos por WhatsApp" (calculado con la hora local y `data/horarios.json`).
- H2 "Thames 1240, Villa Crespo".
- Tabla de horarios (mono), fila de hoy en negrita con "· hoy".
- "WhatsApp para encargos: **11 0000-0000**. Tomamos pedidos hasta las 20 h para el día siguiente."
- Botones: **"Ver mi pedido"** (abre el cajón) y **"Cómo llegar"** (Google Maps en pestaña nueva).

## 8. Footer
"Miga Panadería · Thames 1240, CABA" · "Proyecto de portfolio. Marca y datos ficticios. Fotos: Unsplash."

## 9. Cajón del pedido (`OrderDrawer.astro`) y botón flotante
Ver `04-interacciones.md` §3.

## SEO y meta
- `<title>`: "Miga · Panadería de masa madre en Villa Crespo"
- Descripción: "Pan de masa madre horneado todos los días en Villa Crespo. Armá tu pedido y mandalo por WhatsApp."
- OG image: recorte 1200×630 de `hero.jpg` con el logo.
- Schema.org `Bakery` con dirección, horarios (`openingHoursSpecification`) y teléfono de ejemplo.
