import { useEffect, useMemo, useRef, useState } from "react";
import { Blob } from "@/components/blob";
import { Dice } from "@/components/dice";
import { LadderSvg } from "@/components/ladder-svg";
import { TopBar } from "@/components/chrome";
import {
  boardHeight,
  easeInOut,
  generateLadder,
  levelY,
  pathDurationMs,
  pointAlong,
  rowCountFor,
  tracePath,
  type Ladder,
  type PathPoint,
} from "@/lib/ladder";

type PlayBoardProps = {
  names: string[];
  prizes: string[];
  onBack: () => void;
  onDone: (ends: number[]) => void;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function Mover({
  points,
  count,
  active,
  index,
  reduced,
  onArrive,
}: {
  points: PathPoint[];
  count: number;
  active: boolean;
  index: number;
  reduced: boolean;
  onArrive: () => void;
}) {
  const [pos, setPos] = useState(points[0] ?? { col: index, y: levelY(0) });
  const arriveRef = useRef(onArrive);
  arriveRef.current = onArrive;
  const pointsRef = useRef(points);
  pointsRef.current = points;

  useEffect(() => {
    if (!active) return;
    const path = pointsRef.current;
    const duration = pathDurationMs(path, reduced);
    let frame = 0;
    let dead = false;
    const started = performance.now();
    const step = (now: number) => {
      if (dead) return;
      const raw = Math.min(1, (now - started) / duration);
      setPos(pointAlong(path, easeInOut(raw)));
      if (raw < 1) frame = requestAnimationFrame(step);
      else arriveRef.current();
    };
    frame = requestAnimationFrame(step);
    return () => {
      dead = true;
      cancelAnimationFrame(frame);
    };
  }, [active, reduced]);

  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{
        left: `${((pos.col + 0.5) / count) * 100}%`,
        top: pos.y,
        transform: `translate(-50%, -84%) scale(${active ? 1.08 : 0.92})`,
      }}
    >
      <Blob index={index} size={52} />
    </div>
  );
}

export function PlayBoard({ names, prizes, onBack, onDone }: PlayBoardProps) {
  const count = names.length;
  const rows = rowCountFor(count);
  const height = boardHeight(rows);
  const reduced = useReducedMotion();
  const [ladder, setLadder] = useState<Ladder | null>(null);
  const [armed, setArmed] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [landed, setLanded] = useState<number[]>([]);
  const ended = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLadder(generateLadder(count));
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    if (!ladder) return;
    const timer = window.setTimeout(() => setArmed(true), reduced ? 80 : 420);
    return () => window.clearTimeout(timer);
  }, [ladder, reduced]);

  const paths = useMemo(
    () => (ladder ? names.map((_, index) => tracePath(ladder, index)) : []),
    [ladder, names],
  );

  const finish = (ends: number[]) => {
    if (ended.current) return;
    ended.current = true;
    onDoneRef.current(ends);
  };

  useEffect(() => {
    if (!ladder || paths.length === 0 || cursor < count) return;
    const ends = paths.map((path) => path.end);
    const timer = window.setTimeout(() => finish(ends), reduced ? 200 : 650);
    return () => window.clearTimeout(timer);
  }, [cursor, count, ladder, paths, reduced]);

  useEffect(() => {
    if (!ladder || cursor >= count) return;
    document.getElementById(`runner-name-${cursor}`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [cursor, ladder, count, reduced]);

  const status = !ladder
    ? "주사위를 굴리는 중"
    : cursor >= count
      ? "도착"
      : `${cursor + 1} / ${count}`;

  return (
    <div className="flex h-dvh flex-col">
      <TopBar
        title={status}
        onBack={onBack}
        right={
          ladder ? (
            <button
              type="button"
              className="min-h-11 shrink-0 whitespace-nowrap rounded-full px-2 text-sm font-medium text-primary"
              onClick={() => finish(paths.map((path) => path.end))}
            >
              결과 보기
            </button>
          ) : null
        }
      />
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      <div className="min-h-0 flex-1 overflow-auto px-3 pb-8">
        <div className="board-wrap overflow-x-auto">
          <div className="board-inner" style={{ ["--cols" as string]: String(count) }}>
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
            >
              {names.map((name, index) => (
                <p
                  id={`runner-name-${index}`}
                  key={name + index}
                  className={`line-clamp-3 break-all px-1 pb-2 text-center text-xs font-medium leading-tight ${
                    armed && index === cursor && cursor < count ? "text-primary" : "text-ink"
                  }`}
                  title={name}
                >
                  {name}
                </p>
              ))}
            </div>
            <div className="relative" style={{ height }}>
              <LadderSvg
                count={count}
                rows={rows}
                rungs={ladder?.rungs ?? []}
                animateRungs={Boolean(ladder)}
              />
              {!ladder
                ? names.map((_, index) => (
                    <div
                      key={index}
                      className="pointer-events-none absolute"
                      style={{
                        left: `${((index + 0.5) / count) * 100}%`,
                        top: levelY(0),
                        transform: "translate(-50%, -84%)",
                      }}
                    >
                      <Blob index={index} size={52} />
                    </div>
                  ))
                : paths.map((path, index) => (
                    <Mover
                      key={index}
                      points={path.points}
                      count={count}
                      index={index}
                      active={armed && index === cursor && cursor < count}
                      reduced={reduced}
                      onArrive={() => {
                        setLanded((prev) =>
                          prev.includes(path.end) ? prev : [...prev, path.end],
                        );
                        setCursor((value) => value + 1);
                      }}
                    />
                  ))}
            </div>
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
            >
              {prizes.map((prize, index) => {
                const hit = landed.includes(index);
                return (
                  <p
                    key={prize + index}
                    className={`mx-1 mt-2 line-clamp-3 break-all rounded-2xl px-1 py-2 text-center text-xs leading-tight ${
                      hit ? "bg-accent text-on-accent" : "bg-surface text-ink"
                    }`}
                    title={prize}
                  >
                    {prize}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {!ladder ? (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink/55 px-6">
          <Dice />
          <p className="mt-8 font-display text-3xl text-on-primary">주사위를 굴리는 중</p>
          <p className="mt-1 text-sm text-on-primary">3초 뒤 사다리가 정해져요</p>
          <div className="mt-5 h-2 w-48 overflow-hidden rounded-full bg-on-primary/30">
            <div className="dice-timer" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
