import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.jpg', { eager: true });

/** Devuelve la foto de src/assets/img por nombre de archivo ("hogaza.jpg"). */
export function foto(nombre: string): ImageMetadata {
  const mod = files[`../assets/img/${nombre}`];
  if (!mod) throw new Error(`No existe la foto ${nombre} en src/assets/img`);
  return mod.default;
}
