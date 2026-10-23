import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { products, categories, top5, useCart, useCurrent, useUsers, isAdminIn, type Product } from "@/lib/shop";
import { AuthModal } from "@/components/AuthModal";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "متجر سوق | تسوّق أفضل المنتجات" },
      { name: "description", content: "إلكترونيات وأزياء وإكسسوارات وعطور بأفضل الأسعار." },
      { property: "og:title", content: "متجر سوق" },
      { property: "og:description", content: "إلكترونيات وأزياء وإكسسوارات وعطور بأفضل الأسعار." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Store,
});

const Stars = ({ r }: { r: number }) => <span className="text-gold">{"★".repeat(Math.round(r))}<span className="text-muted-foreground"> {r}</span></span>;

function Store() {
  const nav = useNavigate();
  const [current, setCurrent] = useCurrent();
  const [users] = useUsers();
  const [cart, setCart] = useCart();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [cartOpen, setCartOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => { if (!isAdminIn()) nav({ to: "/" }); else setReady(true); }, [nav]);
  const user = users.find((x) => x.email === current);
  const filtered = useMemo(() => products.filter((p) => (cat === "الكل" || p.category === cat) && p.name.includes(q.trim())), [q, cat]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((s, [id, n]) => s + (products.find((p) => p.id === +id)?.price ?? 0) * n, 0);
  const add = (p: Product) => { setCart({ ...cart, [p.id]: (cart[p.id] ?? 0) + 1 }); setToast(`أضيف "${p.name}" إلى السلة`); setTimeout(() => setToast(""), 1800); };
  const change = (id: number, d: number) => { const n = { ...cart, [id]: (cart[id] ?? 0) + d }; if ((n[id] ?? 0) <= 0) delete n[id]; setCart(n); };
  if (!ready) return null;

  const Card = ({ p }: { p: Product }) => (
    <div className="group overflow-hidden rounded-2xl bg-card shadow-card">
      <button onClick={() => setDetail(p)} className="relative block aspect-square w-full overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        {p.oldPrice && <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">خصم {Math.round(100 - (p.price / p.oldPrice) * 100)}%</span>}
        {p.isNew && <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">جديد</span>}
      </button>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{p.category}</p>
        <h3 className="mt-1 font-bold">{p.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{p.desc}</p>
        <div className="mt-2 text-sm"><Stars r={p.rating} /></div>
        <div className="mt-3 flex items-center justify-between">
          <div><span className="text-lg font-bold text-primary">{p.price} ر.س</span>{p.oldPrice && <span className="mr-2 text-sm text-muted-foreground line-through">{p.oldPrice}</span>}</div>
          <button onClick={() => add(p)} className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">+ للسلة</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={!user ? "pointer-events-none select-none blur-md" : ""}>
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
            <h1 className="text-3xl text-primary">سوق</h1>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن منتج..." className="order-3 w-full flex-1 rounded-full border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring sm:order-none sm:w-auto" />
            <div className="mr-auto flex gap-2">
              <button onClick={() => setAcctOpen(true)} className="rounded-full bg-secondary px-4 py-2 text-sm font-bold">👤 حسابي</button>
              <button onClick={() => setCartOpen(true)} className="relative rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">🛒 السلة
                {count > 0 && <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-accent-foreground">{count}</span>}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-14 px-4 py-8">
          <section className="bg-hero overflow-hidden rounded-3xl p-8 text-primary-foreground md:p-14">
            <p className="font-bold text-gold">عروض الموسم</p>
            <h2 className="mt-2 max-w-xl text-4xl leading-tight md:text-5xl">خصومات تصل إلى 30% على أفضل المنتجات</h2>
            <p className="mt-3 max-w-md opacity-80">شحن مجاني للطلبات فوق 200 ر.س وإرجاع سهل خلال 14 يومًا.</p>
            <a href="#offers" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">تسوّق العروض</a>
          </section>

          <section>
            <h2 className="mb-4 text-2xl">التصنيفات</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-5 py-2 text-sm font-bold ${cat === c ? "bg-primary text-primary-foreground" : "bg-card"}`}>{c}</button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl">🏆 أفضل 5 منتجات مبيعًا</h2>
            <div className="grid gap-3 md:grid-cols-5">
              {top5.map((p, i) => (
                <div key={p.id} className="relative rounded-2xl bg-card p-4 shadow-card">
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-gold font-bold text-foreground">#{i + 1}</span>
                  <img src={p.image} alt={p.name} className="mx-auto aspect-square w-full rounded-xl object-cover" />
                  <h3 className="mt-3 font-bold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.sales.toLocaleString("ar")} عملية بيع</p>
                  <div className="text-sm"><Stars r={p.rating} /></div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-primary">{p.price} ر.س</span>
                    <button onClick={() => add(p)} className="rounded-lg bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">أضف</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl">جميع المنتجات {cat !== "الكل" && `— ${cat}`}</h2>
            {filtered.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{filtered.map((p) => <Card key={p.id} p={p} />)}</div>
              : <p className="text-muted-foreground">لا توجد منتجات مطابقة.</p>}
          </section>

          <section><h2 className="mb-5 text-2xl">✨ وصل حديثًا</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.filter((p) => p.isNew).map((p) => <Card key={p.id} p={p} />)}</div>
          </section>

          <section id="offers"><h2 className="mb-5 text-2xl">🔥 العروض</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">{products.filter((p) => p.oldPrice).map((p) => <Card key={p.id} p={p} />)}</div>
          </section>
        </main>

        <footer className="mt-10 border-t bg-card py-8 text-center text-sm text-muted-foreground">
          <p className="font-display text-xl text-primary">سوق</p>
          <p className="mt-2">🚚 شحن سريع · 🔒 دفع آمن · ↩️ إرجاع مجاني</p>
          <p className="mt-2">© 2026 متجر سوق — مشروع جامعي</p>
        </footer>
      </div>

      {!user && <AuthModal />}

      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-overlay" onClick={() => setCartOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="mr-auto flex h-full w-full max-w-sm flex-col bg-card p-5 animate-in slide-in-from-left">
            <div className="flex justify-between"><h2 className="text-2xl">سلة التسوق</h2><button onClick={() => setCartOpen(false)}>✕</button></div>
            <div className="mt-4 flex-1 space-y-3 overflow-auto">
              {count === 0 && <p className="text-muted-foreground">السلة فارغة.</p>}
              {Object.entries(cart).map(([id, n]) => { const p = products.find((x) => x.id === +id)!; return (
                <div key={id} className="flex items-center gap-3 rounded-xl border p-2">
                  <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1"><p className="text-sm font-bold">{p.name}</p><p className="text-sm text-primary">{p.price * n} ر.س</p></div>
                  <div className="flex items-center gap-2"><button onClick={() => change(p.id, -1)} className="h-7 w-7 rounded bg-muted">−</button>{n}<button onClick={() => change(p.id, 1)} className="h-7 w-7 rounded bg-muted">+</button></div>
                </div>); })}
            </div>
            <div className="border-t pt-4">
              <div className="mb-3 flex justify-between font-bold"><span>الإجمالي</span><span>{total} ر.س</span></div>
              <button disabled={!count} onClick={() => { setCart({}); setCartOpen(false); setToast("تم إتمام الطلب بنجاح 🎉"); setTimeout(() => setToast(""), 2500); }} className="w-full rounded-lg bg-accent py-3 font-bold text-accent-foreground disabled:opacity-50">إتمام الشراء</button>
            </div>
          </aside>
        </div>
      )}

      {acctOpen && user && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-overlay p-4" onClick={() => setAcctOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-card">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-3xl">👤</div>
            <h2 className="mt-3 text-xl">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email} · ✅ بريد مؤكَّد</p>
            <p className="mt-3 text-sm">عناصر في السلة: {count}</p>
            <button onClick={() => { setCurrent(null); setAcctOpen(false); }} className="mt-5 w-full rounded-lg border py-2 font-bold">تسجيل الخروج</button>
            <button onClick={() => { sessionStorage.removeItem("admin"); setCurrent(null); nav({ to: "/" }); }} className="mt-2 w-full text-sm text-muted-foreground">خروج المسؤول</button>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-overlay p-4" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} className="grid w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-card md:grid-cols-2">
            <img src={detail.image} alt={detail.name} className="h-full w-full object-cover" />
            <div className="p-6">
              <p className="text-sm text-muted-foreground">{detail.category}</p>
              <h2 className="mt-1 text-2xl">{detail.name}</h2>
              <Stars r={detail.rating} /><p className="text-sm text-muted-foreground">{detail.sales} عملية بيع</p>
              <p className="mt-3">{detail.desc}</p>
              <p className="mt-4 text-2xl font-bold text-primary">{detail.price} ر.س</p>
              <button onClick={() => { add(detail); setDetail(null); }} className="mt-4 w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground">أضف إلى السلة</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-card">{toast}</div>}
    </>
  );
}
