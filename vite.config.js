import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';

const paginas = readdirSync('html').filter(nombre => nombre.endsWith('.html'));
const rutasAnteriores = {
  '/html/panel.html': '/html/panel-emprendedor.html',
  '/html/admin.html': '/html/panel-admin.html',
};

function redirigirEnlacesAnteriores(servidor) {
  servidor.middlewares.use((req, res, next) => {
    const ruta = new URL(req.url, 'http://localhost');
    const destino = Object.hasOwn(rutasAnteriores, ruta.pathname) && rutasAnteriores[ruta.pathname];
    if (!destino) return next();
    res.writeHead(302, { Location: destino + ruta.search });
    res.end();
  });
}

export default defineConfig({
  appType: 'mpa',
  server: { host: 'localhost', port: 5173, strictPort: true },
  preview: { host: 'localhost', port: 4173, strictPort: true },
  build: { rolldownOptions: { input: ['index.html', ...paginas.map(nombre => 'html/' + nombre)] } },
  plugins: [{
    name: 'enlaces-anteriores',
    configureServer: redirigirEnlacesAnteriores,
    configurePreviewServer: redirigirEnlacesAnteriores,
    generateBundle() {
      for (const [ruta, destino] of Object.entries(rutasAnteriores)) {
        this.emitFile({ type: 'asset', fileName: ruta.slice(1), source:
          '<!doctype html><html lang="es"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=' +
          destino + '"><title>Manos Locales</title><a href="' + destino + '">Continuar al panel</a></html>' });
      }
    },
  }],
});
