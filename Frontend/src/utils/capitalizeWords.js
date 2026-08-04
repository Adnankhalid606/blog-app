export function capitalizeWords(value = "") {
  return value.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}
