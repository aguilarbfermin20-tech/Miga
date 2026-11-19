# 05 · Plan de desarrollo

Al terminar cada etapa: `npm run build` sin errores ni warnings, revisión en 390 px y 1280 px, criterios marcados. Frená y pedí revisión.

## Etapa 1 · Base del proyecto
- [ ] Proyecto Astro 5 + TS estricto creado; fuentes de Fontsource instaladas e importadas en `Base.astro`.
- [ ] `tokens.css` con todos los tokens de `02-diseno.md`; `global.css` con reset, `body` en `--paper`, foco visible, `overflow-x: clip`, bloque de movimiento reducido.
- [ ] `Base.astro`: `lang="es-AR"`, meta de `03-secciones.md`, OG, `theme-color` `#1A1512`, link "Saltar al contenido".
- [ ] `src/data/` con los JSON; tipos en `src/lib/types.ts`.
- [ ] Fotos en `src/assets/img/` usadas con `<Image />`.

## Etapa 2 · Estructura y contenido estático
- [ ] Todas las secciones de `03-secciones.md` en orden, con textos exactos y sin JS.
- [ ] Layout responsive completo (celular primero). Sin scroll horizontal en 360 px.
- [ ] Galería en celular ya funciona con scroll-snap (sin JS).
- [ ] Tabla de horarios desde JSON. Footer.
- [ ] Lighthouse ≥ 95 en Accesibilidad y SEO ya en esta etapa.

## Etapa 3 · Pedido (interacción central)
- [ ] `cart.ts` con add/change/totals/whatsappUrl y persistencia en localStorage (con try/catch).
- [ ] Botones de tarjeta, contador del nav con bump, toast, botón flotante.
- [ ] Cajón accesible: foco atrapado, Escape, clic afuera, foco de vuelta al cerrar.
- [ ] Mensaje de WhatsApp exacto al de `04-interacciones.md` §3, con `encodeURIComponent`.
- [ ] Prueba manual: sumar 2 hogazas + 1 medialuna → total "$ 14.550"; quitar hasta 0 elimina la línea; recargar mantiene el pedido.

## Etapa 4 · Hero en capas y titular variable
- [ ] Capas con parallax de puntero y de scroll (solo `hover: hover` y sin movimiento reducido).
- [ ] Titular de peso variable letra por letra con `aria-label` correcto.
- [ ] Entrada escalonada. Sello giratorio. Cinta.
- [ ] Nav que pasa a sólida; barra de progreso.

## Etapa 5 · Galería fija y proceso
- [ ] Galería horizontal fija en compu con contador y barra; carrusel en celular.
- [ ] Foco por teclado lleva la tarjeta a la vista.
- [ ] Proceso con reloj, pasos activos y fotos con fundido; versión celular con reloj fijo.
- [ ] Reseñas con anterior/siguiente. Estado abierto/cerrado en vivo.

## Etapa 6 · Pulido y publicación
- [ ] Revisión completa con `06-calidad.md`.
- [ ] Probado con movimiento reducido activado (DevTools → Rendering → Emulate CSS prefers-reduced-motion).
- [ ] Probado solo con teclado de punta a punta: armar pedido y abrir WhatsApp.
- [ ] Lighthouse celular ≥ 95 en las cuatro categorías.
- [ ] Deploy en Vercel y URL en el README.
