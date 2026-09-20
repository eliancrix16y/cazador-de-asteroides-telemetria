export function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemento no encontrado: #${id}`);
  }
  return element;
}