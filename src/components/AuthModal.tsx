import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const inp = "mt-1 mb-3 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring";
const wilayas = ["الجزائر", "وهران", "قسنطينة", "عنابة", "سطيف", "البليدة", "باتنة", "تلمسان", "بجاية", "ورقلة", "أخرى"];

export function AuthModal() {
  const [tab, setTab] = useState<"login" | "signup" | "sent">("login");
  const [f, setF] = useState({ full_name: "", email: "", phone: "", wilaya: "", address: "", password: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.full_name.trim() || !f.wilaya || !f.address.trim()) return setMsg("يرجى ملء جميع الحقول");
    if (!/^0[5-7]\d{8}$/.test(f.phone)) return setMsg("رقم الهاتف غير صحيح (مثال: 0551234567)");
    if (f.password.length < 6) return setMsg("كلمة المرور 6 أحرف على الأقل");
    if (f.password !== f.confirm) return setMsg("كلمتا المرور غير متطابقتين");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: f.email.trim(), password: f.password,
      options: { emailRedirectTo: `${window.location.origin}/store`, data: { full_name: f.full_name, phone: f.phone, wilaya: f.wilaya, address: f.address } },
    });
    setBusy(false);
    if (error) return setMsg(error.message);
    setMsg(""); setTab("sent");
  };
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: f.email.trim(), password: f.password });
    setBusy(false);
    if (error) setMsg(error.message.includes("confirm") ? "يجب تفعيل الحساب عبر الرابط المرسل إلى بريدك أولًا" : "البريد أو كلمة المرور غير صحيحة");
  };
  const resend = async () => {
    await supabase.auth.resend({ type: "signup", email: f.email.trim(), options: { emailRedirectTo: `${window.location.origin}/store` } });
    setMsg("أُعيد إرسال رابط التفعيل");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-overlay p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-7 shadow-card animate-in zoom-in-95">
        <h2 className="text-center text-2xl text-primary">مرحبًا بك في سوق</h2>
        {tab !== "sent" && (
          <div className="my-5 grid grid-cols-2 rounded-lg bg-muted p-1">
            {(["login", "signup"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setMsg(""); }} className={`rounded-md py-2 text-sm font-bold ${tab === t ? "bg-card shadow-card" : "text-muted-foreground"}`}>
                {t === "login" ? "تسجيل الدخول" : "حساب جديد"}
              </button>
            ))}
          </div>
        )}
        {msg && <p className="mb-3 rounded-lg bg-secondary p-2 text-center text-sm">{msg}</p>}
        {tab === "login" && (
          <form onSubmit={login}>
            <label className="text-sm">البريد الإلكتروني</label><input type="email" required className={inp} value={f.email} onChange={set("email")} />
            <label className="text-sm">كلمة المرور</label><input type="password" required className={inp} value={f.password} onChange={set("password")} />
            <button disabled={busy} className="w-full rounded-lg bg-primary py-2.5 font-bold text-primary-foreground disabled:opacity-60">{busy ? "..." : "دخول"}</button>
          </form>
        )}
        {tab === "signup" && (
          <form onSubmit={signup} className="max-h-[60vh] overflow-auto px-1">
            <label className="text-sm">الاسم الكامل</label><input className={inp} value={f.full_name} onChange={set("full_name")} />
            <label className="text-sm">البريد الإلكتروني</label><input type="email" required className={inp} value={f.email} onChange={set("email")} />
            <label className="text-sm">رقم الهاتف</label><input dir="ltr" placeholder="0551234567" className={inp} value={f.phone} onChange={set("phone")} />
            <label className="text-sm">الولاية</label>
            <select className={inp} value={f.wilaya} onChange={set("wilaya")}><option value="">اختر الولاية</option>{wilayas.map((w) => <option key={w}>{w}</option>)}</select>
            <label className="text-sm">عنوان التوصيل</label><input className={inp} value={f.address} onChange={set("address")} />
            <label className="text-sm">كلمة المرور</label><input type="password" className={inp} value={f.password} onChange={set("password")} />
            <label className="text-sm">تأكيد كلمة المرور</label><input type="password" className={inp} value={f.confirm} onChange={set("confirm")} />
            <button disabled={busy} className="w-full rounded-lg bg-accent py-2.5 font-bold text-accent-foreground disabled:opacity-60">{busy ? "..." : "إنشاء الحساب"}</button>
          </form>
        )}
        {tab === "sent" && (
          <div className="mt-4 text-center">
            <p className="text-4xl">📧</p>
            <p className="mt-2 font-bold">تم إرسال رابط التفعيل إلى</p>
            <p className="text-accent" dir="ltr">{f.email}</p>
            <p className="mt-3 text-sm text-muted-foreground">افتح بريدك واضغط على رابط التفعيل، ثم سجّل الدخول. (تحقق من مجلد الرسائل غير المرغوب فيها)</p>
            <button onClick={resend} className="mt-4 text-sm font-bold text-primary underline">إعادة إرسال الرابط</button>
            <button onClick={() => { setTab("login"); setMsg(""); }} className="mt-3 block w-full rounded-lg bg-primary py-2.5 font-bold text-primary-foreground">الذهاب لتسجيل الدخول</button>
          </div>
        )}
      </div>
    </div>
  );
}
