import { X, Check } from "lucide-react";

import { themes } from "@/lib/themes";
import { playSfx } from "@/lib/sound";

type Props = {
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function BackgroundShop({ activeId, onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="متجر الخلفيات"
      onClick={onClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[var(--dock-bg)] p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">متجر الخلفيات — مجاني</h2>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
            className="rounded-full border border-white/20 p-1.5 text-white transition hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {themes.map((t) => {
            const active = t.id === activeId;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("click", 0.7);
                    onSelect(t.id);
                  }}
                  className={`group relative w-full overflow-hidden rounded-2xl border-2 transition hover:scale-[1.03] ${
                    active
                      ? "border-[var(--gold)] shadow-[0_0_18px_color-mix(in_oklab,var(--gold)_60%,transparent)]"
                      : "border-white/15"
                  }`}
                >
                  <img
                    src={t.src}
                    alt={t.name}
                    loading="lazy"
                    className="h-28 w-full object-cover"
                  />
                  <span className="flex items-center justify-between gap-1 bg-black/50 px-2 py-1.5 text-xs font-semibold text-white">
                    {t.name}
                    {active ? (
                      <Check className="h-3.5 w-3.5 text-[var(--gold)]" />
                    ) : (
                      <span className="text-[10px] text-[var(--gold)]">مجاناً</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
