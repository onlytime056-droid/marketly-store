import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { dzd } from "@/lib/shop";

type Row = { id: number; name: string; category: string; price: number; stock: number };

export function AdminPanel({ onChanged }: { onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [catS, setCatS] = useState("S");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (t: string, f: () => Promise<void>) => { setBusy(true); setMsg(""); setTitle(t); try { await f(); } catch (e) { setMsg((e as Error).message.includes("not authenticated") ? "هذه المهمة تتطلب تسجيل الدخول بحساب مستخدم أولًا." : "خطأ: " + (e as Error).message); } setBusy(false); };

  const q1 = () => run(`1) منتجات الفئة "${catS}"`, async () => {
    const { data, error, count } = await supabase.from("products").select("id, name, category, price, stock", { count: "exact" }).or(`category.eq.${catS},category.ilike.${catS}%`).limit(50);
    if (error) throw error; setRows((data ?? []) as Row[]); setMsg(`عدد النتائج: ${count ?? 0} (يعرض أول 50)`);
  });
  const q2 = () => run("2) المنتجات ذات المخزون أقل من 3", async () => {
    const { data, error, count } = await supabase.from("products").select("id, name, category, price, stock", { count: "exact" }).lt("stock", 3).limit(50);
    if (error) throw error; setRows((data ?? []) as Row[]); setMsg(`عدد النتائج: ${count ?? 0} (يعرض أول 50)`);
  });
  const q3 = () => { if (!confirm("تخفيض أسعار جميع المنتجات بنسبة 20%؟")) return; run("3) تخفيض الأسعار 20%", async () => {
    const { data, error } = await supabase.rpc("tp_reduce_prices" as never, { _pct: 20 } as never);
    if (error) throw error; setRows([]); setMsg(`تم تخفيض سعر ${data} منتج بنسبة 20%`); onChanged();
  }); };
  const q4 = () => { if (!name.trim() || !confirm(`حذف المنتج "${name}"؟`)) return; run("4) حذف منتج بالاسم", async () => {
    const { data, error } = await supabase.rpc("tp_delete_product" as never, { _name: name.trim() } as never);
    if (error) throw error; setRows([]); setMsg(data ? `تم حذف ${data} منتج باسم "${name}"` : "لا يوجد منتج بهذا الاسم"); onChanged();
  }); };

  const sql = [
    `SELECT * FROM products WHERE category = '${catS}';`,
    "SELECT name, price FROM products WHERE stock < 3;",
    "UPDATE products SET price = price * 0.8;",
    `DELETE FROM products WHERE name = '${name || "..."}';`,
  ];

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-foreground shadow-card transition hover:scale-105">📋 مهام الـ TP (قاعدة البيانات)</button>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-foreground/40 p-4" onClick={() => setOpen(false)}>
          <div dir="rtl" className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl">🛠️ أدوات المسؤول — المهام التطبيقية</h2><button onClick={() => setOpen(false)} className="text-xl">✕</button></div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border p-3"><p className="font-bold">1) عرض منتجات الفئة</p>
                <div className="mt-2 flex gap-2"><input value={catS} onChange={(e) => setCatS(e.target.value)} className="w-24 rounded-lg border bg-background px-2" /><button disabled={busy} onClick={q1} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">تنفيذ</button></div>
                <code className="mt-2 block rounded-lg bg-foreground p-2 font-mono text-xs text-gold" dir="ltr">{sql[0]}</code></div>
              <div className="rounded-xl border p-3"><p className="font-bold">2) المخزون أقل من 3</p>
                <button disabled={busy} onClick={q2} className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">تنفيذ</button>
                <code className="mt-2 block rounded-lg bg-foreground p-2 font-mono text-xs text-gold" dir="ltr">{sql[1]}</code></div>
              <div className="rounded-xl border p-3"><p className="font-bold">3) تخفيض كل الأسعار 20%</p>
                <button disabled={busy} onClick={q3} className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground">تنفيذ</button>
                <code className="mt-2 block rounded-lg bg-foreground p-2 font-mono text-xs text-gold" dir="ltr">{sql[2]}</code></div>
              <div className="rounded-xl border p-3"><p className="font-bold">4) حذف منتج بالاسم</p>
                <div className="mt-2 flex gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المنتج" className="flex-1 rounded-lg border bg-background px-2" /><button disabled={busy} onClick={q4} className="rounded-lg bg-destructive px-3 py-1.5 text-sm font-bold text-destructive-foreground">حذف</button></div>
                <code className="mt-2 block rounded-lg bg-foreground p-2 font-mono text-xs text-gold" dir="ltr">{sql[3]}</code></div>
            </div>
            {(title || msg) && <div className="mt-4"><p className="font-bold">{title}</p><p className="text-sm text-muted-foreground">{busy ? "جارٍ التنفيذ..." : msg}</p></div>}
            {rows.length > 0 && (
              <table className="mt-3 w-full text-sm"><thead><tr className="border-b text-right"><th>#</th><th>الاسم</th><th>الفئة</th><th>السعر</th><th>المخزون</th></tr></thead>
                <tbody>{rows.map((r) => <tr key={r.id} className="border-b"><td>{r.id}</td><td>{r.name}</td><td>{r.category}</td><td>{dzd(r.price)}</td><td>{r.stock}</td></tr>)}</tbody></table>
            )}
          </div>
        </div>
      )}
    </>
  );
}
