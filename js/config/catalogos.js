export const categorias = ['Alimentos','Artesanías','Textil','Bienestar'];
export const imagenes = {alfajores:'Alfajores',brownie:'Brownie',cookies:'Cookies',lemon:'Lemon pie',trufas:'Trufas',budin:'Budín',general:'Manos Locales'};

const normalizar = s => s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filtrar(lista, texto, categoria, localidad) {
  const q=normalizar(texto);
  return lista.filter(p=>(!categoria||p.categoria===categoria)&&(!localidad||p.tienda.localidad===localidad)&&
    normalizar(p.nombre+' '+p.tienda.nombre).includes(q));
}
