const SRC = {
  waves: "/sfx/waves.mp3",
  click: "/sfx/click.mp3",
  hover: "/sfx/hover.mp3",
} as const;

type Key = keyof typeof SRC;

let muted = false;
const pools = new Map<Key, HTMLAudioElement[]>();
let ambient: HTMLAudioElement | null = null;

function pool(key: Key, size = 4) {
  let list = pools.get(key);
  if (!list) {
    list = Array.from({ length: size }, () => {
      const a = new Audio(SRC[key]);
      a.preload = "auto";
      return a;
    });
    pools.set(key, list);
  }
  return list;
}

export function playSfx(key: Extract<Key, "click" | "hover">, volume = 0.6) {
  if (typeof window === "undefined" || muted) return;
  const list = pool(key);
  const a = list.find((x) => x.paused || x.ended) ?? list[0];
  if (!a) return;
  a.currentTime = 0;
  a.volume = volume;
  void a.play().catch(() => {});
}

export function startAmbient(volume = 0.35) {
  if (typeof window === "undefined" || muted) return;
  if (!ambient) {
    ambient = new Audio(SRC.waves);
    ambient.loop = true;
    ambient.preload = "auto";
    ambient.volume = 0;
  }
  void ambient.play().then(() => fadeTo(volume, 1400)).catch(() => {});
}

function fadeTo(target: number, ms: number) {
  const el = ambient;
  if (!el) return;
  const from = el.volume;
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / ms);
    el.volume = from + (target - from) * p;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (ambient) {
    if (value) ambient.pause();
    else void ambient.play().catch(() => {});
  }
}
