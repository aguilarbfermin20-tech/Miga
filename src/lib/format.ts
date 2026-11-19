/** Formato de precios del sitio: "$ 14.550". */
export const money = (n: number): string => `$ ${n.toLocaleString('es-AR')}`;
