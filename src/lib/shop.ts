import { useEffect, useState, useCallback } from "react";

export type Product = {
  id: number; name: string; category: string; price: number; oldPrice?: number;
  rating: number; sales: number; image: string; desc: string; isNew?: boolean;
};

const u = (id: string) => `https://images.unsplash.com/${id}?w=600&q=70&auto=format&fit=crop`;

export const categories = ["الكل", "إلكترونيات", "أزياء", "إكسسوارات", "عطور"];

export const products: Product[] = [
  { id: 1, name: "سماعات لاسلكية برو", category: "إلكترونيات", price: 12600, oldPrice: 16200, rating: 4.8, sales: 1820, image: u("photo-1505740420928-5e560c06d30e"), desc: "عزل ضوضاء نشط وبطارية تدوم 30 ساعة." },
  { id: 2, name: "ساعة كلاسيكية فضية", category: "إكسسوارات", price: 18700, rating: 4.6, sales: 960, image: u("photo-1523275335684-37898b6baf30"), desc: "تصميم أنيق مقاوم للماء بسوار جلدي." },
  { id: 3, name: "حذاء رياضي أحمر", category: "أزياء", price: 10400, oldPrice: 13000, rating: 4.7, sales: 1540, image: u("photo-1542291026-7eec264c27ff"), desc: "خفيف ومريح للجري والاستخدام اليومي." },
  { id: 4, name: "كاميرا فورية", category: "إلكترونيات", price: 14800, rating: 4.4, sales: 610, image: u("photo-1526170375885-4d8ecf77b99f"), desc: "التقط صورك واطبعها في ثوانٍ.", isNew: true },
  { id: 5, name: "نظارة شمسية", category: "إكسسوارات", price: 5400, oldPrice: 7600, rating: 4.5, sales: 1210, image: u("photo-1572635196237-14b3f281503f"), desc: "حماية كاملة من الأشعة فوق البنفسجية." },
  { id: 6, name: "ساعة ذكية", category: "إلكترونيات", price: 25200, rating: 4.9, sales: 2140, image: u("photo-1546868871-7041f2a55e12"), desc: "تتبع اللياقة والنوم والإشعارات.", isNew: true },
  { id: 7, name: "عطر فاخر", category: "عطور", price: 9400, rating: 4.7, sales: 880, image: u("photo-1585386959984-a4155224a1ad"), desc: "رائحة شرقية تدوم طويلاً.", isNew: true },
  { id: 8, name: "حقيبة ظهر عملية", category: "أزياء", price: 7000, oldPrice: 8600, rating: 4.3, sales: 730, image: u("photo-1553062407-98eeb64c6a62"), desc: "متعددة الجيوب ومناسبة للسفر." },
  { id: 9, name: "هاتف ذكي", category: "إلكترونيات", price: 90000, rating: 4.8, sales: 1390, image: u("photo-1511707171634-5f897ff02aa9"), desc: "شاشة رائعة وكاميرا احترافية.", isNew: true },
  { id: 10, name: "لابتوب نحيف", category: "إلكترونيات", price: 140400, oldPrice: 154800, rating: 4.6, sales: 540, image: u("photo-1496181133206-80ce9b88a853"), desc: "أداء سريع وخفة في الوزن." },
];

export const top5 = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);

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
