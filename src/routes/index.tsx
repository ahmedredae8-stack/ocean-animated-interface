import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

import island from "@/assets/bay.webp.asset.json";
import house from "@/assets/house.png.asset.json";
import stats from "@/assets/stats.png.asset.json";
import chest from "@/assets/chest.png.asset.json";
import shop from "@/assets/shop.png.asset.json";
import quest from "@/assets/quest.png.asset.json";
import skull from "@/assets/skull.png.asset.json";
import friends from "@/assets/friends.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Island Bay — Animated Village Map" },
      {
        name: "description",
        content:
          "A living island bay: drifting clouds, shimmering sea and a golden toolbar of village actions.",
      },
      { property: "og:title", content: "Island Bay — Animated Village Map" },
      {
        property: "og:description",
        content:
          "A living island bay: drifting clouds, shimmering sea and a golden toolbar of village actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const actions = [
  { key: "house", src: house.url, label: "القرية" },
  { key: "stats", src: stats.url, label: "الإحصائيات" },
  { key: "chest", src: chest.url, label: "المخزن" },
  { key: "shop", src: shop.url, label: "المتجر" },
  { key: "quest", src: quest.url, label: "المهام" },
  { key: "skull", src: skull.url, label: "المعركة" },
  { key: "friends", src: friends.url, label: "الأصدقاء" },
];

function Index() {
  const skyRef = useRef<HTMLDivElement>(null);

  const handlePointer = (e: React.PointerEvent<HTMLElement>) => {
    const el = skyRef.current;
    if (!el) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    el.style.setProperty("--px", String(x));
    el.style.setProperty("--py", String(y));
  };

  return (
    <main
      className="relative h-screen w-full overflow-hidden bg-sky"
      onPointerMove={handlePointer}
    >
      {/* Island scene */}
      <img
        src={island.url}
        alt="خليج الجزيرة برماله الذهبية ومياهه الزرقاء"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Real water motion: the sea area of the artwork is warped by an
          animated turbulence displacement filter (no overlays on top) */}
      <img
        src={island.url}
        alt=""
        aria-hidden="true"
        className="water-layer absolute inset-0 h-full w-full object-cover"
      />

      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <filter id="waterWarp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.02"
            numOctaves={2}
            seed={7}
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.006 0.02; 0.010 0.028; 0.006 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Soft breathing water glow */}
      <div className="pointer-events-none absolute inset-0 sea-glow" />

      {/* Sun rays */}
      <div className="pointer-events-none absolute inset-0 sun-rays" />

      {/* Drifting clouds */}
      <div ref={skyRef} className="cloud-field absolute inset-x-0 top-0 h-1/2">
        <span className="cloud cloud-a" />
        <span className="cloud cloud-b" />
        <span className="cloud cloud-c" />
      </div>

      {/* Floating sparkles on the water */}
      <div className="pointer-events-none absolute inset-0">
        {[
          { l: "22%", t: "62%", d: "0s" },
          { l: "44%", t: "70%", d: "1.2s" },
          { l: "63%", t: "55%", d: "2.1s" },
          { l: "78%", t: "68%", d: "0.6s" },
          { l: "35%", t: "48%", d: "2.8s" },
          { l: "70%", t: "42%", d: "1.7s" },
        ].map((s, i) => (
          <span
            key={i}
            className="sparkle"
            style={{ left: s.l, top: s.t, animationDelay: s.d }}
          />
        ))}
      </div>

      {/* Bottom toolbar */}
      <nav className="absolute inset-x-0 bottom-0 dock px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <ul className="mx-auto flex max-w-3xl items-end justify-between gap-1 sm:gap-2">
          {actions.map((a, i) => (
            <li key={a.key} className="flex-1">
              <button
                type="button"
                aria-label={a.label}
                className="dock-btn"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <img src={a.src} alt="" className="h-full w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
