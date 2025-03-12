// src/utils/colorUtils.js

/**
 * Función para convertir nombres de colores a códigos HEX
 * @param {string} colorName - Nombre del color en español
 * @returns {string} Código hexadecimal del color
 */
export const getColorCode = (colorName) => {
  if (!colorName) return '#cccccc';
  
  const colorMap = {
    'rojo': '#ff0000',
    'verde': '#00ff00',
    'azul': '#0000ff',
    'amarillo': '#ffff00',
    'negro': '#000000',
    'blanco': '#ffffff',
    'gris': '#808080',
    'naranja': '#ffa500',
    'morado': '#800080',
    'rosa': '#ffc0cb',
    'marrón': '#a52a2a',
    'celeste': '#87ceeb',
    'dorado': '#ffd700',
    'plateado': '#c0c0c0',
    'cromado': '#e8e8e8'
  };
  
  return colorMap[colorName.toLowerCase()] || '#cccccc';
};

/**
 * Función para obtener el nombre de color CSS estándar a partir de un nombre en español
 * @param {string} colorName - Nombre del color en español
 * @returns {string} Nombre del color en inglés para CSS
 */
export const getColorName = (colorName) => {
  if (!colorName) return 'gray';
  
  const nameMap = {
    'rojo': 'red',
    'verde': 'green',
    'azul': 'blue',
    'amarillo': 'yellow',
    'negro': 'black',
    'blanco': 'white',
    'gris': 'gray',
    'naranja': 'orange',
    'morado': 'purple',
    'rosa': 'pink',
    'marrón': 'brown',
    'celeste': 'skyblue',
    'dorado': 'gold',
    'plateado': 'silver',
    'cromado': 'lightgray'
  };
  
  return nameMap[colorName.toLowerCase()] || 'gray';
};

/**
 * Determina si un color es oscuro basado en su código hexadecimal
 * @param {string} hexColor - Código de color en formato hexadecimal
 * @returns {boolean} true si el color es oscuro, false si es claro
 */
export const isDarkColor = (hexColor) => {
  // Eliminar el símbolo # si está presente
  const hex = hexColor.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calcular la luminosidad (fórmula simplificada)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminosidad es menor a 0.5, es un color oscuro
  return luminance < 0.5;
};

export default {
  getColorCode,
  getColorName,
  isDarkColor
};