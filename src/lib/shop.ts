import { useEffect, useState, useCallback } from "react";

export type Product = {
  id: number; name: string; category: string; price: number; oldPrice?: number | undefined;
  rating: number; sales: number; image: string; desc: string; isNew?: boolean;
};

export type ProductRow = { id: number; name: string; category: string; price: number; image: string; stock: number; sold: number };

// Database rows lack rating/description/discount, so derive stable demo values from the id.
export const fromRow = (r: ProductRow, newestIds: Set<number>): Product => ({
  id: r.id, name: r.name, category: r.category, price: r.price, image: r.image, sales: r.sold,
  rating: Math.round((3.8 + ((r.id * 37) % 12) / 10) * 10) / 10,
  oldPrice: r.id % 7 === 0 ? Math.round((r.price * 1.25) / 100) * 100 : undefined,
  isNew: newestIds.has(r.id),
  desc: r.stock > 0 ? `متوفر في المخزون: ${r.stock} قطعة` : "غير متوفر حاليًا",
});

function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) setV(JSON.parse(raw));
    const h = () => { const r = localStorage.getItem(key); setV(r ? JSON.parse(r) : init); };
    window.addEventListener("ls-" + key, h);
    return () => window.removeEventListener("ls-" + key, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((n: T) => {
    localStorage.setItem(key, JSON.stringify(n));
    window.dispatchEvent(new Event("ls-" + key));
  }, [key]);
  return [v, set] as const;
}

export const useCart = () => useLS<Record<number, number>>("cart", {});
export const isAdminIn = () => typeof window !== "undefined" && sessionStorage.getItem("admin") === "1";

export const dzd = (n: number) => `${n.toLocaleString("ar-DZ")} د.ج`;
