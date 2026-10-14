import {
  boardHeight,
  levelY,
  PLAY_GAP,
  PLAY_PAD_BOTTOM,
  PLAY_PAD_TOP,
  type Rung,
} from "@/lib/ladder";

type LadderSvgProps = {
  count: number;
  rows: number;
  rungs: Rung[];
  gap?: number;
  padTop?: number;
  padBottom?: number;
  animateRungs?: boolean;
};

export function LadderSvg({
  count,
  rows,
  rungs,
  gap = PLAY_GAP,
  padTop = PLAY_PAD_TOP,
  padBottom = PLAY_PAD_BOTTOM,
  animateRungs = false,
}: LadderSvgProps) {
  const height = boardHeight(rows, gap, padTop, padBottom);
  const vbW = count * 100;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${vbW} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => {
        const x = (index + 0.5) * 100;
        return (
          <line
            key={index}
            x1={x}
            x2={x}
            y1={8}
            y2={height - 8}
            stroke="var(--color-ink)"
            strokeWidth={9}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {rungs.map((rung, index) => (
        <line
          key={`${rung.row}-${rung.col}`}
          x1={(rung.col + 0.5) * 100}
          x2={(rung.col + 1.5) * 100}
          y1={levelY(rung.row + 1, gap, padTop)}
          y2={levelY(rung.row + 1, gap, padTop)}
          stroke="var(--color-primary)"
          strokeWidth={8}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={animateRungs ? "rung-draw" : undefined}
          style={animateRungs ? { animationDelay: `${Math.min(index, 14) * 28}ms` } : undefined}
        />
      ))}
    </svg>
  );
}
