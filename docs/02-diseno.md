# 02 · Diseño

Dirección: **revista de panadería viva**. Fotos grandes, tipografía serif variable que reacciona, capas que se mueven con el puntero y el scroll. Un solo tema claro elegido a propósito (no hay modo oscuro), con bandas oscuras para el hero y el proceso.

## Colores (`src/styles/tokens.css`)

| Token | Hex | Uso |
| --- | --- | --- |
| `--paper` | `#F3EFE7` | Fondo general (harina) |
| `--ink` | `#1A1512` | Texto, bandas oscuras, botón secundario |
| `--yolk` | `#F2B31B` | Acento: botón principal, cinta, reloj, contador de la bolsa |
| `--olive` | `#4A5A26` | Acento secundario: palabra en itálica, producto agregado |
| `--crumb` | `#E6DDCC` | Superficies y separadores |
| `--muted` | `#6D6257` | Texto secundario |
| `--wa` | `#1F8A4C` | Solo el botón flotante de WhatsApp y el estado "Abierto" |
| `--hot` | `#E0702B` | Punto "recién salido" |

Contraste: todo texto de cuerpo ≥ 4.5:1. El amarillo nunca lleva texto blanco encima (siempre `--ink`).

## Tipografía

| Rol | Fuente | Detalle |
| --- | --- | --- |
| Display | **Fraunces** variable | Ejes `wght` 200–900, `SOFT` 100, `WONK` 1. Peso de reposo 300 en títulos grandes. Itálica para la palabra destacada |
| Cuerpo | **Hanken Grotesk** | 400/500/600/700, 17 px base, interlineado 1.6 |
| Datos | **JetBrains Mono** | Horarios, precios, etiquetas: 11–15 px, mayúsculas, `letter-spacing: .06–.08em` |

Escala de títulos (clamp): H1 `clamp(60px, 10.5vw, 168px)`, H2 `clamp(56px, 8vw, 128px)`, H3 tarjeta 32 px. Interlineado de títulos 0.9. `text-wrap: balance` en todos los títulos.

## Espaciado y forma

- Contenedor máximo 1280 px, margen lateral `max(16px, env(safe-area-inset-left))`.
- Secciones: `padding-block` 96–120 px en compu, 72–80 px en celular.
- Radios: fotos de producto 18 px, foto del proceso 20 px, botones y chips 999 px.
- Sombras solo en: tarjeta en hover, cajón del pedido y botón flotante.
- Grano: textura de ruido SVG al 8 % sobre el hero (`mix-blend-mode: overlay`).

## Movimiento

- Curva única: `--ease: cubic-bezier(.2,.8,.2,1)`.
- Duraciones: microinteracciones 200–300 ms, entradas 700–900 ms, cajón 450 ms.
- Un momento orquestado: la entrada del titular letra por letra (28 ms entre letras). El resto es respuesta a lo que hace el usuario.
- Con `prefers-reduced-motion: reduce`: sin parallax, sin rotación del sello, sin cinta animada, sin entradas; los cambios de estado son instantáneos.

## Íconos

Mínimos y en SVG inline con `stroke: currentColor` (WhatsApp, cerrar, flechas). Nada de emoji como ícono.
