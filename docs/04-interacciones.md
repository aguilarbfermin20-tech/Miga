# 04 · Interacciones

Regla general: cada interacción define su comportamiento normal, con teclado, con lector de pantalla, en celular y con movimiento reducido. Helper `prefersReducedMotion()` en `src/lib/motion.ts`, leído una vez y escuchando cambios.

## 1. Hero: capas quietas y entrada del titular

El hero no reacciona al puntero ni al scroll: foto, palabra "miga", sombra, sello y contenido quedan fijos.

**Entrada (puntero fino, `(hover: hover)`):** el H1 se divide en letras (`<span class="ch">`) y cada una entra desde `translateY(60%)` con opacidad 0, 700 ms, retraso `200 ms + i * 28 ms` (Web Animations API, `fill: backwards`). Es el único momento orquestado de la página.

**Accesibilidad:** el H1 lleva `aria-label` con el texto completo; los `span` de letras van dentro de contenedores `aria-hidden="true"`. Las capas decorativas `aria-hidden`.

**Movimiento reducido / táctil:** sin entrada. Titular estático.

## 2. Galería horizontal fija ("Hoy en el horno")

**Compu (≥ 821 px):**
- La sección mide `100vh + (anchoDelTrack − anchoDeVentana)` (calcular en carga y `resize`, guardar en `--rail-h`).
- Interior `position: sticky; top: 0; height: 100vh`.
- En scroll: `progreso = clamp(-rect.top / (alturaSeccion − innerHeight), 0, 1)`; el track se mueve `translateX(−progreso × extra)`.
- Contador "0n / 06" y barra con `scaleX(progreso)`.
- **Teclado:** al recibir foco una tarjeta fuera de vista (`focusin`), calcular el progreso que la deja a 30 % del borde izquierdo y hacer `scrollTo` a esa posición. Sin esto, el foco queda en algo invisible.
- Hover en la tarjeta: solo aparece una sombra suave bajo la foto. Nada se mueve, escala ni cambia de peso.

**Celular (≤ 820 px):** sección de alto automático, track con `overflow-x: auto; scroll-snap-type: x mandatory`, tarjetas al 78 % de ancho con `scroll-snap-align: start`. Sin sticky ni transform. Sin contador.

**Movimiento reducido:** igual que compu.

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

## 7. Nav, progreso, banda de horarios, sello

- Nav sólida cuando `scrollY > alturaHero − 80`.
- Barra de progreso: `scrollY / (scrollHeight − innerHeight)`.
- Banda de horarios: fija, sin animación.
- Sello: rotación CSS 22 s infinita.
- Todo el scroll en un solo listener `{ passive: true }` que agenda un `requestAnimationFrame`.

## 8. Movimiento reducido (resumen)

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
}
```
Más: en JS, no registrar la entrada del titular.
