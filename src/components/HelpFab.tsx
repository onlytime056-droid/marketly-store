import { useState } from "react";

export function HelpFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="حول المشروع" onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl font-bold text-accent-foreground shadow-card transition hover:scale-110">?</button>
      {open && (
        <div className="fixed bottom-24 right-6 z-[60] w-72 rounded-2xl bg-card p-5 shadow-card animate-in fade-in slide-in-from-bottom-2">
          <p className="font-display text-lg text-primary">حول المشروع</p>
          <p className="mt-2 text-sm leading-relaxed">هذا العمل التطبيقي يمثّل <b>محاكاة لمتجر إلكتروني</b>، من إنجاز الطالب <b>رائد ساكر</b>.</p>
          <button onClick={() => setOpen(false)} className="mt-3 text-sm text-muted-foreground">إغلاق</button>
        </div>
      )}
    </>
  );
}
