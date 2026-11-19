export const moneda = centavos => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(centavos/100);
