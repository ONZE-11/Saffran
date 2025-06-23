// import { Product } from "@/lib/products";
export type Product = {

  id: number
  title_en: string
  title_es: string
  description_en:string
  description_es:string
  weight_gram:number
  price: number
  image_url:string
  available:number

}

export default async function UserServer() {
  const response = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  const products = (await response.json()) as Product[];

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
        <p>{product.title_en}</p>
          <p>${product.price}</p>
          <p>gram : {product.weight_gram}</p>
          
        </div>
      ))}
    </div>
  );
}
