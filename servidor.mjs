import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const raiz = fileURLToPath(new URL('./sitio/', import.meta.url));
const tipos = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.svg':'image/svg+xml' };
const puerto = Number(process.env.PORT || 5173);
http.createServer(async (req,res) => {
  try {
    const ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const archivo = path.resolve(raiz, '.' + (ruta === '/' ? '/index.html' : ruta));
    const relativa = path.relative(raiz,archivo);
    if (relativa.startsWith('..') || path.isAbsolute(relativa)) throw Error();
    const datos = await readFile(archivo);
    res.writeHead(200,{'Content-Type':(tipos[path.extname(archivo)] || 'application/octet-stream'),'Cache-Control':'no-store'}).end(datos);
  } catch { res.writeHead(404).end('Recurso no encontrado'); }
}).listen(puerto,'127.0.0.1',()=>console.log('Manos Locales en http://localhost:'+puerto));
