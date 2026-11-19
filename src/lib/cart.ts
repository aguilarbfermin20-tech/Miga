/* Estado del pedido y armado del mensaje de WhatsApp (docs/04-interacciones.md §3). */
import productosJson from '../data/productos.json';
import horarios from '../data/horarios.json';
import type { Pedido, Producto } from './types';
import { money } from './format';

const STORAGE_KEY = 'miga:pedido';

export const productos = productosJson as Producto[];
const porId = new Map(productos.map((p) => [p.id, p]));

export const producto = (id: string): Producto | undefined => porId.get(id);

function load(): Pedido {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return {};
    const limpio: Pedido = {};
    for (const [id, n] of Object.entries(data as Record<string, unknown>)) {
      if (porId.has(id) && typeof n === 'number' && Number.isInteger(n) && n > 0) limpio[id] = n;
    }
    return limpio;
  } catch {
    return {};
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
  } catch {
    /* modo privado o almacenamiento bloqueado: el pedido vive solo en memoria */
  }
}

let pedido: Pedido = load();

type Listener = (p: Readonly<Pedido>) => void;
const listeners = new Set<Listener>();

function emit() {
  save();
  listeners.forEach((fn) => fn(pedido));
}

/** Escucha cambios del pedido. Se llama de inmediato con el estado actual. */
export function subscribe(fn: Listener): void {
  listeners.add(fn);
  fn(pedido);
}

export const get = (): Readonly<Pedido> => pedido;
export const cantidad = (id: string): number => pedido[id] ?? 0;

export function add(id: string): void {
  if (!porId.has(id)) return;
  pedido = { ...pedido, [id]: (pedido[id] ?? 0) + 1 };
  emit();
}

/** Suma o resta. Si llega a 0, el producto sale del pedido. */
export function change(id: string, delta: number): void {
  if (!porId.has(id)) return;
  const n = (pedido[id] ?? 0) + delta;
  const next = { ...pedido };
  if (n <= 0) delete next[id];
  else next[id] = n;
  pedido = next;
  emit();
}

export function totals(): { unidades: number; total: number } {
  let unidades = 0;
  let total = 0;
  for (const [id, n] of Object.entries(pedido)) {
    const p = porId.get(id);
    if (!p) continue;
    unidades += n;
    total += p.precio * n;
  }
  return { unidades, total };
}

export function mensaje(pickup: string): string {
  const lineas = Object.entries(pedido).map(([id, n]) => `• ${n} × ${porId.get(id)?.nombre ?? id}`);
  return [
    'Hola Miga, quiero encargar:',
    ...lineas,
    `Total: ${money(totals().total)}`,
    `Paso a buscarlo: ${pickup}`,
  ].join('\n');
}

export function whatsappUrl(pickup: string): string {
  return `https://wa.me/${horarios.whatsapp}?text=${encodeURIComponent(mensaje(pickup))}`;
}
