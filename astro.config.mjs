// @ts-check
import { defineConfig } from 'astro/config';

// En Vercel, VERCEL_PROJECT_PRODUCTION_URL trae el dominio de producción
// (sin protocolo). Lo usamos para las URLs absolutas de OG, canonical y sitemap.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: vercelUrl ? `https://${vercelUrl}` : 'http://localhost:4321',
  output: 'static',
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
