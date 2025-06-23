// import type { Locale } from "./translations"



// export type Product = {
//   title_en: string
//   id: string
//   slug: string
//   name: { [key in Locale]: string }
//   price: number
//   originalPrice?: number
//   description: { [key in Locale]: string }
//   longDescription: { [key in Locale]: string }
//   image: string
//   alt: string
//   category: string
//   rating: number
//   reviews: number
// }

// export const products: Product[] = [
//   {
//     id: "1",
//     slug: "premium-saffron-threads",
//     name: { en: "Premium Saffron Threads", es: "Hebras de Azafrán Premium" },
//     price: 29.99,
//     originalPrice: 35.0,
//     description: {
//       en: "Finest quality, rich aroma, vibrant color.",
//       es: "La mejor calidad, aroma rico, color vibrante.",
//     },
//     longDescription: {
//       en: "Our premium saffron threads are meticulously hand-picked from the finest crocus sativus flowers, ensuring unparalleled quality. Known for their intense aroma, vibrant red color, and distinct flavor, these threads are perfect for enhancing a wide range of culinary dishes, from paella to biryani, and even desserts. Each strand is carefully selected to guarantee purity and potency, delivering an authentic saffron experience.",
//       es: "Nuestras hebras de azafrán premium son meticulosamente recolectadas a mano de las mejores flores de crocus sativus, asegurando una calidad inigualable. Conocidas por su aroma intenso, color rojo vibrante y sabor distintivo, estas hebras son perfectas para realzar una amplia gama de platos culinarios, desde paella hasta biryani, e incluso postres. Cada hebra es cuidadosamente seleccionada para garantizar pureza y potencia, ofreciendo una auténtica experiencia de azafrán.",
//     },
//     image: "/placeholder-ljnte.png", // Specific placeholder
//     alt: "Premium Saffron Threads",
//     category: "Threads",
//     rating: 4.9,
//     reviews: 128,
//   },
//   {
//     id: "2",
//     slug: "pure-saffron-powder",
//     name: { en: "Pure Saffron Powder", es: "Azafrán en Polvo Puro" },
//     price: 24.99,
//     description: {
//       en: "Convenient and potent for all your culinary needs.",
//       es: "Conveniente y potente para todas tus necesidades culinarias.",
//     },
//     longDescription: {
//       en: "Experience the convenience of our pure saffron powder, ground from the same high-quality threads. This finely milled powder dissolves easily, making it ideal for quick infusions and consistent flavor distribution in your recipes. It retains all the aromatic and coloring properties of whole threads, perfect for baking, sauces, and beverages where a smooth texture is desired.",
//       es: "Experimenta la comodidad de nuestro azafrán en polvo puro, molido a partir de las mismas hebras de alta calidad. Este polvo finamente molido se disuelve fácilmente, lo que lo hace ideal para infusiones rápidas y una distribución consistente del sabor en tus recetas. Conserva todas las propiedades aromáticas y colorantes de las hebras enteras, perfecto para hornear, salsas y bebidas donde se desea una textura suave.",
//     },
//     image: "/saffron-powder-bowl.png", // Specific placeholder
//     alt: "Saffron Powder",
//     category: "Powder",
//     rating: 4.7,
//     reviews: 85,
//   },
//   {
//     id: "3",
//     slug: "luxury-saffron-gift-set",
//     name: { en: "Luxury Saffron Gift Set", es: "Set de Regalo de Azafrán de Lujo" },
//     price: 49.99,
//     description: {
//       en: "The perfect gift for culinary enthusiasts.",
//       es: "El regalo perfecto para los entusiastas culinarios.",
//     },
//     longDescription: {
//       en: "Delight your loved ones with our exquisite Luxury Saffron Gift Set. This beautifully packaged collection includes a generous quantity of our premium saffron threads, along with a guide to its uses and benefits. It's an ideal present for foodies, home cooks, or anyone who appreciates the finer things in life. A truly golden gift for any occasion.",
//       es: "Deleita a tus seres queridos con nuestro exquisito Set de Regalo de Azafrán de Lujo. Esta colección bellamente empaquetada incluye una generosa cantidad de nuestras hebras de azafrán premium, junto con una guía de sus usos y beneficios. Es un regalo ideal para amantes de la comida, cocineros caseros o cualquiera que aprecie las cosas buenas de la vida. Un regalo verdaderamente dorado para cualquier ocasión.",
//     },
//     image: "/placeholder-4r690.png", // Specific placeholder
//     alt: "Saffron Gift Set",
//     category: "Gift Sets",
//     rating: 5.0,
//     reviews: 42,
//   },
//   {
//     id: "4",
//     slug: "organic-saffron-threads",
//     name: { en: "Organic Saffron Threads", es: "Hebras de Azafrán Orgánico" },
//     price: 32.5,
//     description: {
//       en: "Certified organic, sustainably sourced saffron.",
//       es: "Azafrán orgánico certificado, de origen sostenible.",
//     },
//     longDescription: {
//       en: "Our organic saffron threads are cultivated without pesticides or synthetic fertilizers, ensuring a pure and natural product. Sourced from certified organic farms, these threads offer the same exceptional aroma, color, and flavor as our premium selection, with the added assurance of sustainable and environmentally friendly practices. Perfect for those seeking a natural and wholesome culinary ingredient.",
//       es: "Nuestras hebras de azafrán orgánico se cultivan sin pesticidas ni fertilizantes sintéticos, asegurando un producto puro y natural. Procedentes de granjas orgánicas certificadas, estas hebras ofrecen el mismo aroma, color y sabor excepcional que nuestra selección premium, con la garantía adicional de prácticas sostenibles y respetuosas con el medio ambiente. Perfecto para quienes buscan un ingrediente culinario natural y saludable.",
//     },
//     image: "/organic-saffron-jar.png", // Specific placeholder
//     alt: "Organic Saffron Threads",
//     category: "Threads",
//     rating: 4.8,
//     reviews: 60,
//   },
//   {
//     id: "5",
//     slug: "saffron-extract-liquid",
//     name: { en: "Saffron Extract Liquid", es: "Extracto Líquido de Azafrán" },
//     price: 18.75,
//     description: {
//       en: "Concentrated liquid saffron for easy use.",
//       es: "Azafrán líquido concentrado para un uso fácil.",
//     },
//     longDescription: {
//       en: "Discover the versatility of our saffron extract liquid. This concentrated form of saffron offers all the benefits of the spice in a convenient liquid format, ideal for beverages, desserts, and recipes where precise measurement is key. A few drops are all you need to infuse your creations with the distinctive flavor and color of saffron.",
//       es: "Descubre la versatilidad de nuestro extracto líquido de azafrán. Esta forma concentrada de azafrán ofrece todos los beneficios de la especia en un formato líquido conveniente, ideal para bebidas, postres y recetas donde la medición precisa es clave. Unas pocas gotas son todo lo que necesitas para infundir tus creaciones con el sabor y color distintivos del azafrán.",
//     },
//     image: "/placeholder-dvb7v.png", // Specific placeholder
//     alt: "Saffron Extract Liquid",
//     category: "Extracts",
//     rating: 4.5,
//     reviews: 30,
//   },
// ]
