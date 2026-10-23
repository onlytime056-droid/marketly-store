import { useState } from "react";
import { useUsers, useCurrent } from "@/lib/shop";

const inp = "mt-1 mb-3 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

export function AuthModal() {
  const [users, setUsers] = useUsers();
  const [, setCurrent] = useCurrent();
  const [tab, setTab] = useState<"login" | "signup" | "verify">("login");
  const [f, setF] = useState({ name: "", email: "", password: "", code: "" });
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState<string>("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const signup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email.includes("@") || f.password.length < 6) return setMsg("أدخل بيانات صحيحة (كلمة المرور 6 أحرف على الأقل)");
    if (users.some((x) => x.email === f.email)) return setMsg("البريد مسجّل مسبقًا");
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setUsers([...users, { name: f.name, email: f.email, password: f.password, verified: false, code }]);
    setPending(code); setMsg(""); setTab("verify");
  };
  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const usr = users.find((x) => x.email === f.email);
    if (!usr || usr.code !== f.code.trim()) return setMsg("رمز التأكيد غير صحيح");
    setUsers(users.map((x) => (x.email === f.email ? { ...x, verified: true } : x)));
    setMsg("تم تأكيد بريدك! سجّل الدخول الآن."); setTab("login");
  };
  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const usr = users.find((x) => x.email === f.email && x.password === f.password);
    if (!usr) return setMsg("البريد أو كلمة المرور غير صحيحة");
    if (!usr.verified) { setPending(usr.code); setTab("verify"); return setMsg("يجب تأكيد البريد أولًا"); }
    setCurrent(usr.email);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-7 shadow-card animate-in zoom-in-95">
        <h2 className="text-center text-2xl text-primary">مرحبًا بك في سوق</h2>
        {tab !== "verify" && (
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
            <label className="text-sm">البريد الإلكتروني</label><input className={inp} value={f.email} onChange={set("email")} />
            <label className="text-sm">كلمة المرور</label><input type="password" className={inp} value={f.password} onChange={set("password")} />
            <button className="w-full rounded-lg bg-primary py-2.5 font-bold text-primary-foreground">دخول</button>
          </form>
        )}
        {tab === "signup" && (
          <form onSubmit={signup}>
            <label className="text-sm">الاسم</label><input className={inp} value={f.name} onChange={set("name")} />
            <label className="text-sm">البريد الإلكتروني</label><input className={inp} value={f.email} onChange={set("email")} />
            <label className="text-sm">كلمة المرور</label><input type="password" className={inp} value={f.password} onChange={set("password")} />
            <button className="w-full rounded-lg bg-accent py-2.5 font-bold text-accent-foreground">إنشاء الحساب وإرسال رسالة التأكيد</button>
          </form>
        )}
        {tab === "verify" && (
          <form onSubmit={verify} className="mt-4">
            <div className="mb-4 rounded-xl border border-dashed p-4 text-sm">
              <p className="font-bold">📧 صندوق البريد (محاكاة)</p>
              <p className="mt-1 text-muted-foreground">إلى: {f.email}</p>
              <p className="mt-2">رمز تأكيد حسابك هو: <span className="font-bold tracking-widest text-accent">{pending}</span></p>
            </div>
            <label className="text-sm">أدخل رمز التأكيد</label><input className={inp} value={f.code} onChange={set("code")} />
            <button className="w-full rounded-lg bg-primary py-2.5 font-bold text-primary-foreground">تأكيد البريد</button>
          </form>
        )}
      </div>
    </div>
  );
}
