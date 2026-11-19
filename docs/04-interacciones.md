# 04 · Interacciones

Regla general: cada interacción define su comportamiento normal, con teclado, con lector de pantalla, en celular y con movimiento reducido. Helper `prefersReducedMotion()` en `src/lib/motion.ts`, leído una vez y escuchando cambios.

## 1. Titular de peso variable + capas del hero

**Normal (puntero fino, `(hover: hover)`):**
- El H1 se divide en letras (`<span class="ch">`). En `pointermove` sobre el hero, cada letra calcula la distancia al puntero y ajusta `font-variation-settings: "wght"` entre 300 (lejos) y 900 (a ≤ 0 px), con radio de influencia 260 px. Transición CSS 250 ms. En `pointerleave` vuelve a 300.
- Las capas con `data-depth` se desplazan `x * depth`, `y * depth` px según la posición normalizada del puntero (−0.5 a 0.5) usando la propiedad `translate`: foto 18, palabra "miga" −28, sello 40.
- Al hacer scroll: foto `translateY(scrollY * .25)`, palabra `translateY(scrollY * -.12)`.
- Entrada: cada letra entra desde `translateY(60%)` con opacidad 0, 700 ms, retraso `200 ms + i * 28 ms` (Web Animations API, `fill: backwards`).

**Accesibilidad:** el H1 lleva `aria-label` con el texto completo; los `span` de letras van dentro de contenedores `aria-hidden="true"`. Las capas decorativas `aria-hidden`.

**Rendimiento:** un solo listener; agrupá lecturas de `getBoundingClientRect` antes de escribir estilos, o cacheá las posiciones de las letras en `resize`. Usá `requestAnimationFrame` para aplicar.

**Movimiento reducido / táctil:** sin efecto de peso, sin parallax, sin entrada. Titular estático en 300.

## 2. Galería horizontal fija ("Hoy en el horno")

**Compu (≥ 821 px):**
- La sección mide `100vh + (anchoDelTrack − anchoDeVentana)` (calcular en carga y `resize`, guardar en `--rail-h`).
- Interior `position: sticky; top: 0; height: 100vh`.
- En scroll: `progreso = clamp(-rect.top / (alturaSeccion − innerHeight), 0, 1)`; el track se mueve `translateX(−progreso × extra)`.
- Contador "0n / 06" y barra con `scaleX(progreso)`.
- **Teclado:** al recibir foco una tarjeta fuera de vista (`focusin`), calcular el progreso que la deja a 30 % del borde izquierdo y hacer `scrollTo` a esa posición. Sin esto, el foco queda en algo invisible.
- Tilt en hover sobre la foto: `perspective(800px) rotateY(x*8deg) rotateX(-y*8deg)`; la imagen escala 1.06; el nombre sube a peso 650.

**Celular (≤ 820 px):** sección de alto automático, track con `overflow-x: auto; scroll-snap-type: x mandatory`, tarjetas al 78 % de ancho con `scroll-snap-align: start`. Sin sticky ni transform. Sin contador.

**Movimiento reducido:** igual que compu pero sin tilt ni zoom.

## 3. Pedido (bolsa + cajón + WhatsApp) — interacción central

Estado en `src/lib/cart.ts`: `Record<idProducto, cantidad>`. Funciones: `add(id)`, `change(id, delta)` (si llega a 0, se elimina), `totals()`, `whatsappUrl(pickup)`. Guardar en `localStorage` (envuelto en try/catch) para que no se pierda al recargar.

**Sumar:** el botón de la tarjeta llama `add`, actualiza su texto a "✓ En tu pedido (n)", hace "bump" del contador del nav (escala 1.4 y vuelve, 300 ms) y muestra un toast "Hogaza de campo sumado al pedido" (1.8 s, `role="status"`).

**Botón flotante:** verde WhatsApp abajo a la derecha, entra desde abajo cuando hay ≥ 1 producto: "Ver pedido · $ 14.550". Respeta `safe-area-inset`.

**Cajón:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Entra desde la derecha (450 ms). Fondo oscuro 45 % que cierra al hacer clic. Cierra con Escape y con el botón ✕. Al abrir, foco en ✕; al cerrar, foco vuelve al botón que lo abrió. Atrapá el foco dentro mientras está abierto.
- Líneas: nombre, controles − n + (botones de 32 px con `aria-label` "Quitar uno de …" / "Sumar uno de …"), subtotal mono.
- Vacío: "Todavía no sumaste nada. Elegí del horno de hoy."
- Total (mono, 18 px).
- Select "¿Cuándo pasás a buscarlo?": Hoy antes de las 20 h · Mañana a la mañana · Mañana a la tarde.
- Botón **"Enviar pedido por WhatsApp"** → `https://wa.me/5491100000000?text=` + `encodeURIComponent(mensaje)`, en pestaña nueva. Deshabilitado si el pedido está vacío.
- Mensaje:
```
Hola Miga, quiero encargar:
• 2 × Hogaza de campo
• 1 × Medialunas
Total: $ 14.550
Paso a buscarlo: Hoy antes de las 20 h
```
- Nota debajo: "Se abre WhatsApp con el pedido escrito. Si no se abre, escribinos al 11 0000-0000."

Formato de precios: `"$ " + n.toLocaleString("es-AR")`.

## 4. Proceso con reloj (scrollytelling)

- `IntersectionObserver` sobre cada paso con `rootMargin: "-45% 0px -45% 0px"`: el paso que cruza el centro de la pantalla queda activo (opacidad 1, los otros 0.28).
- El reloj muestra `data-time` y `data-day` del paso activo (`aria-live="polite"`). Las 4 fotos se superponen y la activa hace fundido (700 ms) con un leve zoom de 1.08 a 1.
- Compu: columna izquierda `position: sticky; top: 96px`.
- Celular: el reloj queda fijo arriba (debajo del nav) en una franja oscura, sin fotos; los pasos ocupan 46vh cada uno.

## 5. Reseñas

Botones anterior/siguiente con `aria-label`. Cambio con fundido + subida de 10 px (250 ms). Puntos de posición `aria-hidden`. Sin autoplay.

## 6. Horario en vivo

En carga: día y hora local → fila de hoy resaltada y estado "Abierto ahora · cierra a las 20:00" / "Cerrado ahora · tomamos encargos por WhatsApp". Lunes cerrado.

## 7. Nav, progreso, cinta, sello

- Nav sólida cuando `scrollY > alturaHero − 80`.
- Barra de progreso: `scrollY / (scrollHeight − innerHeight)`.
- Cinta: animación CSS, pausa en hover.
- Sello: rotación CSS 22 s infinita.
- Todo el scroll en un solo listener `{ passive: true }` que agenda un `requestAnimationFrame`.

## 8. Movimiento reducido (resumen)

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
}
```
Más: en JS, no registrar parallax, peso variable, tilt ni entrada del titular.
