import { useSyncExternalStore } from "react";

export type Preset = {
  teamName: string;
  names: string[];
  prizes: string[];
  savedAt: number;
};

export type HistoryEntry = {
  id: string;
  playedAt: number;
  names: string[];
  prizes: string[];
  ends: number[];
};

export type SadariData = {
  presets: Array<Preset | null>;
  history: HistoryEntry[];
};

const KEY = "sadari.v1";
const EVENT = "sadari-change";

const EMPTY: SadariData = {
  presets: [null, null, null, null, null],
  history: [],
};

let cachedRaw: string | null | undefined;
let cached: SadariData = EMPTY;

function asStringList(value: unknown, max: number, itemMax: number): string[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length < 2 || value.length > max) return null;
  return value.map((item) => String(item ?? "").slice(0, itemMax));
}

function parse(raw: string | null): SadariData {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<SadariData>;
    const presets = Array.from({ length: 5 }, (_, index) => {
      const slot = data.presets?.[index];
      if (!slot) return null;
      const names = asStringList(slot.names, 10, 12);
      const prizes = asStringList(slot.prizes, 10, 16);
      if (!names || !prizes || names.length !== prizes.length) return null;
      return {
        teamName: String(slot.teamName || `${index + 1}번 팀`).slice(0, 20),
        names,
        prizes,
        savedAt: Number(slot.savedAt) || Date.now(),
      } satisfies Preset;
    });
    const history = Array.isArray(data.history)
      ? data.history.filter(isHistory).slice(0, 30)
      : [];
    return { presets, history };
  } catch {
    return EMPTY;
  }
}

function isHistory(entry: unknown): entry is HistoryEntry {
  if (!entry || typeof entry !== "object") return false;
  const item = entry as HistoryEntry;
  return (
    typeof item.id === "string" &&
    typeof item.playedAt === "number" &&
    Array.isArray(item.names) &&
    Array.isArray(item.prizes) &&
    Array.isArray(item.ends) &&
    item.names.length >= 2 &&
    item.names.length === item.prizes.length &&
    item.ends.length === item.names.length
  );
}

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

export function getSadariData(): SadariData {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = parse(raw);
  return cached;
}

function getServerSnapshot(): SadariData {
  return EMPTY;
}

export function writeSadari(mutator: (prev: SadariData) => SadariData) {
  const next = mutator(getSadariData());
  const raw = JSON.stringify(next);
  localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cached = next;
  window.dispatchEvent(new Event(EVENT));
}

export function useSadari(): SadariData {
  return useSyncExternalStore(subscribe, getSadariData, getServerSnapshot);
}

export function formatWhen(ts: number): string {
  return new Date(ts).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
