import { useState } from "react";
import { Anchor, Loader2 } from "lucide-react";
import { createPlayer, type Player } from "@/lib/player";

export function NameGate({ onReady }: { onReady: (p: Player) => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await createPlayer(name);
    setBusy(false);
    if (res.error) return setError(res.error);
    if (res.player) onReady(res.player);
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-5" dir="rtl">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[var(--dock-bg)] p-6 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-deep)] text-black shadow-lg">
          <Anchor className="h-7 w-7" />
        </div>
        <h1 className="text-center text-xl font-bold">اختر اسم القبطان</h1>
        <p className="mt-1 text-center text-sm text-white/70">
          اسمك يظهر للاعبين في الدردشة وقائمة الأصدقاء.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="مثال: قبطان الخليج"
          className="mt-5 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-center outline-none transition focus:border-[var(--gold)]"
        />
        {error && <p className="mt-2 text-center text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[var(--gold-deep)] to-[var(--gold)] px-4 py-3 font-bold text-black transition hover:brightness-110 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} ابدأ الإبحار
        </button>
      </form>
    </div>
  );
}
