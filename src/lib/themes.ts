export type Theme = {
  id: string;
  name: string;
  src: string;
  /** Sea region for the water-ripple filter: radial-gradient(<w> <h> at <x> <y>) */
  sea: { w: string; h: string; x: string; y: string };
  /** Static hole kept out of the ripple (pier / rocks). Empty = no hole. */
  hole: { w: string; h: string; x: string; y: string };
  /** Ripple strength (feDisplacementMap scale) */
  scale: number;
};

export const themes: Theme[] = [
  {
    id: "bay",
    name: "الخليج الذهبي",
    src: "/bg/bay.webp",
    sea: { w: "46%", h: "26%", x: "62%", y: "58%" },
    hole: { w: "15%", h: "8%", x: "29%", y: "69%" },
    scale: 14,
  },
  {
    id: "summer",
    name: "الشاطئ الصيفي",
    src: "/bg/summer.webp",
    sea: { w: "62%", h: "34%", x: "60%", y: "72%" },
    hole: { w: "14%", h: "7%", x: "25%", y: "76%" },
    scale: 15,
  },
  {
    id: "tuscany",
    name: "توسكانا",
    src: "/bg/tuscany.webp",
    sea: { w: "60%", h: "32%", x: "62%", y: "74%" },
    hole: { w: "10%", h: "6%", x: "18%", y: "72%" },
    scale: 13,
  },
  {
    id: "spring",
    name: "ربيع الجبال",
    src: "/bg/spring.webp",
    sea: { w: "62%", h: "33%", x: "60%", y: "76%" },
    hole: { w: "13%", h: "6%", x: "24%", y: "78%" },
    scale: 15,
  },
  {
    id: "egypt",
    name: "أهرامات مصر",
    src: "/bg/egypt.webp",
    sea: { w: "64%", h: "34%", x: "58%", y: "76%" },
    hole: { w: "14%", h: "7%", x: "24%", y: "79%" },
    scale: 14,
  },
  {
    id: "riyadh",
    name: "الرياض",
    src: "/bg/riyadh.webp",
    sea: { w: "60%", h: "32%", x: "62%", y: "78%" },
    hole: { w: "12%", h: "7%", x: "12%", y: "82%" },
    scale: 12,
  },
  {
    id: "paris",
    name: "باريس",
    src: "/bg/paris.webp",
    sea: { w: "58%", h: "30%", x: "62%", y: "76%" },
    hole: { w: "13%", h: "6%", x: "23%", y: "79%" },
    scale: 12,
  },
  {
    id: "china",
    name: "سور الصين",
    src: "/bg/china.webp",
    sea: { w: "58%", h: "30%", x: "62%", y: "74%" },
    hole: { w: "13%", h: "6%", x: "24%", y: "79%" },
    scale: 13,
  },
  {
    id: "winter",
    name: "الشتاء المتجمد",
    src: "/bg/winter.webp",
    sea: { w: "60%", h: "30%", x: "58%", y: "78%" },
    hole: { w: "14%", h: "7%", x: "24%", y: "78%" },
    scale: 8,
  },
  {
    id: "volcano",
    name: "جزيرة البركان",
    src: "/bg/volcano.webp",
    sea: { w: "60%", h: "30%", x: "60%", y: "76%" },
    hole: { w: "14%", h: "7%", x: "24%", y: "80%" },
    scale: 16,
  },
];

export const defaultTheme = themes[0]!;

const KEY = "bay:theme";

export function loadThemeId(): string {
  if (typeof window === "undefined") return defaultTheme.id;
  try {
    return window.localStorage.getItem(KEY) ?? defaultTheme.id;
  } catch {
    return defaultTheme.id;
  }
}

export function saveThemeId(id: string) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) ?? defaultTheme;
}
