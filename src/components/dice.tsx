const FACES: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Face({ n, className }: { n: number; className: string }) {
  const on = new Set(FACES[n]);
  return (
    <div className={className}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={on.has(i) ? "pip" : "pip-off"} />
      ))}
    </div>
  );
}

export function Dice() {
  return (
    <div className="dice-scene" aria-hidden="true">
      <div className="dice-cube">
        <Face n={1} className="dice-face dice-face-1" />
        <Face n={6} className="dice-face dice-face-2" />
        <Face n={3} className="dice-face dice-face-3" />
        <Face n={4} className="dice-face dice-face-4" />
        <Face n={2} className="dice-face dice-face-5" />
        <Face n={5} className="dice-face dice-face-6" />
      </div>
    </div>
  );
}
