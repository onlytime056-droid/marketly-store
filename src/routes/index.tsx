import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | متجر سوق" },
      { name: "description", content: "سجّل الدخول إلى متجر سوق الإلكتروني." },
      { property: "og:title", content: "تسجيل الدخول | متجر سوق" },
      { property: "og:description", content: "سجّل الدخول إلى متجر سوق الإلكتروني." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === "admin" && p === "123456") {
      sessionStorage.setItem("admin", "1");
      nav({ to: "/store" });
    } else setErr("اسم المستخدم أو كلمة المرور غير صحيحة");
  };
  return (
    <div className="grid min-h-screen place-items-center bg-hero p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-card">
        <h1 className="text-center text-4xl text-primary">سوق</h1>
        <p className="mb-6 mt-1 text-center text-muted-foreground">تسجيل دخول المسؤول</p>
        <label className="text-sm font-medium">اسم المستخدم</label>
        <input value={u} onChange={(e) => setU(e.target.value)} className="mb-4 mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
        <label className="text-sm font-medium">كلمة المرور</label>
        <input type="password" value={p} onChange={(e) => setP(e.target.value)} className="mb-4 mt-1 w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
        {err && <p className="mb-3 text-sm text-destructive">{err}</p>}
        <button className="w-full rounded-lg bg-primary py-2.5 font-bold text-primary-foreground hover:opacity-90">دخول</button>
        <p className="mt-4 text-center text-xs text-muted-foreground">للتجربة: admin / 123456</p>
      </form>
    </div>
  );
}
