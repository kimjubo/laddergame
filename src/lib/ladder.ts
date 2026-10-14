export type Rung = { row: number; col: number };

export type Ladder = {
  count: number;
  rows: number;
  rungs: Rung[];
};

export type PathPoint = { col: number; y: number };

export type TracedPath = {
  end: number;
  points: PathPoint[];
};

export const PLAY_GAP = 32;
export const PLAY_PAD_TOP = 58;
export const PLAY_PAD_BOTTOM = 18;

export function rowCountFor(count: number): number {
  return Math.min(11, Math.max(6, count + 2));
}

export function levelY(
  level: number,
  gap = PLAY_GAP,
  padTop = PLAY_PAD_TOP,
): number {
  return padTop + level * gap;
}

export function boardHeight(
  rows: number,
  gap = PLAY_GAP,
  padTop = PLAY_PAD_TOP,
  padBottom = PLAY_PAD_BOTTOM,
): number {
  return levelY(rows + 1, gap, padTop) + padBottom;
}

export function generateLadder(
  count: number,
  rng: () => number = Math.random,
): Ladder {
  const rows = rowCountFor(count);
  const rungs: Rung[] = [];

  for (let row = 0; row < rows; row++) {
    let col = 0;
    while (col < count - 1) {
      const chance = col === count - 2 ? 0.72 : 0.56;
      if (rng() < chance) {
        rungs.push({ row, col });
        col += 2;
      } else {
        col += 1;
      }
    }
  }

  for (let col = 0; col < count - 1; col++) {
    if (rungs.some((rung) => rung.col === col)) continue;
    for (let row = 0; row < rows; row++) {
      const blocked = rungs.some(
        (rung) => rung.row === row && Math.abs(rung.col - col) <= 1,
      );
      if (!blocked) {
        rungs.push({ row, col });
        break;
      }
    }
  }

  return { count, rows, rungs };
}

export function tracePath(
  ladder: Ladder,
  start: number,
  gap = PLAY_GAP,
  padTop = PLAY_PAD_TOP,
): TracedPath {
  const right = new Set(ladder.rungs.map((rung) => `${rung.row}:${rung.col}`));
  let col = start;
  const points: PathPoint[] = [{ col, y: levelY(0, gap, padTop) }];

  for (let row = 0; row < ladder.rows; row++) {
    const y = levelY(row + 1, gap, padTop);
    points.push({ col, y });
    if (right.has(`${row}:${col}`)) {
      col += 1;
      points.push({ col, y });
    } else if (col > 0 && right.has(`${row}:${col - 1}`)) {
      col -= 1;
      points.push({ col, y });
    }
  }

  points.push({ col, y: levelY(ladder.rows + 1, gap, padTop) });
  return { end: col, points };
}

export function pathDurationMs(points: PathPoint[], reduced = false): number {
  if (reduced) return 700;
  let dist = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = (points[i].col - points[i - 1].col) * 86;
    const dy = points[i].y - points[i - 1].y;
    dist += Math.hypot(dx, dy);
  }
  return Math.min(5000, Math.max(2000, Math.round(dist * 3.4)));
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

export function pointAlong(points: PathPoint[], t: number): PathPoint {
  const last = points[points.length - 1] ?? { col: 0, y: 0 };
  if (points.length < 2 || t <= 0) return points[0] ?? last;
  if (t >= 1) return last;

  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = (points[i].col - points[i - 1].col) * 86;
    const dy = points[i].y - points[i - 1].y;
    const len = Math.hypot(dx, dy) || 0.0001;
    lengths.push(len);
    total += len;
  }

  let remain = t * total;
  for (let i = 0; i < lengths.length; i++) {
    const len = lengths[i] ?? 0.0001;
    const from = points[i];
    const to = points[i + 1];
    if (!from || !to) break;
    if (remain <= len) {
      const u = remain / len;
      return {
        col: from.col + (to.col - from.col) * u,
        y: from.y + (to.y - from.y) * u,
      };
    }
    remain -= len;
  }
  return last;
}
