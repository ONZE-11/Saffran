import axios from "axios"


export async function fetchProducts(): Promise<any[]> {
  const response = await axios.get("http://localhost:3000/api/products")
  const rawProducts = response.data

  return rawProducts.map((p: any) => ({
  id: p.id,
  slug: `saffron-${p.weight_gram}g`,
  image: p.image_url,
  alt: p.title_en,
  name: {
    en: p.title_en,
    es: p.title_es,
  },
  description: {
    en: p.description_en,
    es: p.description_es,
  },
  price: Number(p.price),       // <-- اینجا تبدیل به عدد
  available: p.available,
  originalPrice: p.original_price ? Number(p.original_price) : null, // اگر مقدار داری، تبدیل کن
}))

}
