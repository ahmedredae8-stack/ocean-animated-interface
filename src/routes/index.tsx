import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, Volume2, VolumeX } from "lucide-react";

import { IntroLoader } from "@/components/IntroLoader";
import { BackgroundShop } from "@/components/BackgroundShop";
import { usePlayer } from "@/hooks/usePlayer";
import { saveThemeToAccount } from "@/lib/player";
import { isMuted, playSfx, setMuted, startAmbient, stopAllSounds } from "@/lib/sound";
import { defaultTheme, getTheme, loadThemeId, saveThemeId } from "@/lib/themes";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "خليج الجزيرة — Island Bay" },
      {
        name: "description",
        content:
          "خليج حي: سحاب متحرك، بحر متموج، ومتجر خلفيات مجاني لتبديل عالم القرية.",
      },
      { property: "og:title", content: "خليج الجزيرة — Island Bay" },
      {
        property: "og:description",
        content:
          "خليج حي: سحاب متحرك، بحر متموج، ومتجر خلفيات مجاني لتبديل عالم القرية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const actions = [
  { key: "house", src: "/img/house.png", label: "القرية" },
  { key: "stats", src: "/img/stats.png", label: "الإحصائيات" },
  { key: "chest", src: "/img/chest.png", label: "المخزن" },
  { key: "shop", src: "/img/shop.png", label: "المتجر" },
  { key: "quest", src: "/img/quest.png", label: "المهام" },
  { key: "skull", src: "/img/skull.png", label: "المعركة" },
  { key: "friends", src: "/img/friends.png", label: "الأصدقاء" },
];


function Index() {
  const skyRef = useRef<HTMLDivElement>(null);
  const [sound, setSound] = useState(true);
  const [intro, setIntro] = useState(true);
  const [themeId, setThemeId] = useState(defaultTheme.id);
  const [shopOpen, setShopOpen] = useState(false);

  const theme = getTheme(themeId);

  useEffect(() => setThemeId(loadThemeId()), []);

  const selectTheme = (id: string) => {
    setThemeId(id);
    saveThemeId(id);
    setShopOpen(false);
  };

  const finishIntro = useCallback(() => setIntro(false), []);

  useEffect(() => {
    if (intro) return;
    const unlock = () => startAmbient();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    startAmbient();
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [intro]);

  // Silence everything the moment the page is left or unmounted.
  useEffect(() => stopAllSounds, []);

  const toggleSound = () => {
    const next = !isMuted() ? false : true;
    setMuted(!next);
    setSound(next);
    if (next) startAmbient();
  };

  const handlePointer = (e: React.PointerEvent<HTMLElement>) => {
    const el = skyRef.current;
    if (!el) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    el.style.setProperty("--px", String(x));
    el.style.setProperty("--py", String(y));
  };

  const seaMask = `radial-gradient(${theme.sea.w} ${theme.sea.h} at ${theme.sea.x} ${theme.sea.y}, #000 55%, transparent 100%), radial-gradient(${theme.hole.w} ${theme.hole.h} at ${theme.hole.x} ${theme.hole.y}, #000 45%, transparent 100%)`;

  return (
    <main
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-sky"
      onPointerMove={handlePointer}
    >
      {/* Island scene */}
      <img
        key={theme.id}
        src={theme.src}
        alt={`خلفية ${theme.name}`}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Real water motion: the sea area of the artwork is warped by an
          animated turbulence displacement filter (no overlays on top) */}
      <img
        src={theme.src}
        alt=""
        aria-hidden="true"
        className="water-layer absolute inset-0 h-full w-full object-cover object-center"
        style={{ maskImage: seaMask, WebkitMaskImage: seaMask }}
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
            scale={theme.scale}
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

      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={sound ? "كتم الصوت" : "تشغيل الصوت"}
        className="absolute right-3 top-3 z-10 rounded-full border border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[var(--dock-bg)] p-2 text-white backdrop-blur transition hover:scale-110"
      >
        {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

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
                onPointerEnter={() => playSfx("hover", 0.35)}
                onClick={() => {
                  playSfx("click", 0.75);
                  if (a.key === "shop") setShopOpen(true);
                }}

              >
                <img src={a.src} alt="" className="h-full w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {shopOpen && (
        <BackgroundShop
          activeId={themeId}
          onSelect={selectTheme}
          onClose={() => setShopOpen(false)}
        />
      )}

      {intro && <IntroLoader onDone={finishIntro} />}

    </main>
  );
}
