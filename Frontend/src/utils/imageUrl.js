export function getImageUrl(image) {
  if (!image) return "https://placehold.co/800x450/e5e7eb/374151?text=No+image";
  if (image.startsWith("http")) return image;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return `${apiUrl.replace(/\/api\/?$/, "")}/uploads/${image}`;
}
