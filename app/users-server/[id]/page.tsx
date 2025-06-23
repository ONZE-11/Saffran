interface PageProps {
  params: { id: string };  // همیشه در URL پارامتر id رشته است
}

export default async function ProductPage({ params }: PageProps) {
  const res = await fetch(`http://localhost:3000/api/products/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>خطا در دریافت محصول</div>;
  }

  const product = await res.json();

  return (
    <div>
      <h1>{product.title_en}</h1>
      <p>{product.description_en}</p>
      <p>weight: {product.weight_gram} gram</p>
      <p>price: ${product.price} </p>
    </div>
  );
}
