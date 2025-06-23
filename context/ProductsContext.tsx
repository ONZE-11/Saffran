"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Product = {
  id: number;
  slug: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  image_url: string;
  price: number;
  originalPrice?: number;
  weight_gram: number;
  alt: string;
  rating: number;
  reviews: number;
};

type ProductsContextType = Product[];

const ProductsContext = createContext<ProductsContextType>([]);

type ProductsProviderProps = {
  children: ReactNode;
};

export const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
