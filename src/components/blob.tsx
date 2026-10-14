import { useId } from "react";

type BlobProps = {
  index: number;
  size?: number;
  className?: string;
};

type Kind = "bob" | "side" | "buns" | "wave" | "cap" | "bow" | "phones" | "star" | "spike" | "antenna";

const LOOKS: { hair: string; blush: string; tilt: number; kind: Kind }[] = [
  { hair: "#2c2622", blush: "#f3b5a6", tilt: -12, kind: "bob" },
  { hair: "#e6b43e", blush: "#f6c2ae", tilt: -7, kind: "side" },
  { hair: "#ff5d45", blush: "#ffc4b6", tilt: 8, kind: "buns" },
  { hair: "#2fbfb2", blush: "#f4c3cc", tilt: -10, kind: "wave" },
  { hair: "#a56b45", blush: "#f0b8a6", tilt: 4, kind: "cap" },
  { hair: "#f48fb4", blush: "#f7b9c8", tilt: -6, kind: "bow" },
  { hair: "#3d4f6a", blush: "#f3c0b6", tilt: 10, kind: "phones" },
  { hair: "#d5c9bc", blush: "#f6c8bc", tilt: -11, kind: "star" },
  { hair: "#ff8a32", blush: "#ffc8b0", tilt: 6, kind: "spike" },
  { hair: "#14988e", blush: "#f4c4b8", tilt: -3, kind: "antenna" },
];

const FACE = "#fff6ec";
const EYE = "#17130f";
const INK = "#221c18";

export function Blob({ index, size = 64, className = "" }: BlobProps) {
  const uid = useId().replace(/:/g, "");
  const look = LOOKS[Math.abs(index) % LOOKS.length]!;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${uid}-clip`}>
          <circle cx="40" cy="40" r="38" />
        </clipPath>
      </defs>
      <circle cx="40" cy="40" r="38" fill="#171311" />
      <g clipPath={`url(#${uid}-clip)`} transform={`rotate(${look.tilt} 33 50)`}>
        <Back kind={look.kind} hair={look.hair} />
        <ellipse cx="33" cy="51" rx="20" ry="18" fill={FACE} />
        <Front kind={look.kind} hair={look.hair} />
        <ellipse cx="21.5" cy="59" rx="4.1" ry="2.5" fill={look.blush} />
        <ellipse cx="44.5" cy="59" rx="4.1" ry="2.5" fill={look.blush} />
        <rect x="24.4" y="43" width="5.3" height="13" rx="2.65" fill={EYE} />
        <rect x="38.2" y="43" width="5.3" height="13" rx="2.65" fill={EYE} />
      </g>
    </svg>
  );
}

function Back({ kind, hair }: { kind: Kind; hair: string }) {
  if (kind === "buns") {
    return (
      <>
        <circle cx="16" cy="30" r="11" fill={hair} />
        <circle cx="40" cy="16" r="10" fill={hair} />
        <ellipse cx="32" cy="50" rx="18" ry="14" fill={hair} />
      </>
    );
  }
  if (kind === "wave") {
    return (
      <path
        d="M8 52c2-16 8-12 14-20 6 10 8 4 14-8 8 12 12 8 16 2 4 10 8 16 2 24-12 8-24 10-36 6-6-2-10-2-10-4z"
        fill={hair}
      />
    );
  }
  if (kind === "spike" || kind === "antenna" || kind === "phones") {
    return <ellipse cx="32" cy="48" rx="21" ry="16" fill={hair} />;
  }
  if (kind === "side") {
    return <ellipse cx="36" cy="44" rx="24" ry="22" fill={hair} />;
  }
  return <ellipse cx="32" cy="43" rx="25" ry="23" fill={hair} />;
}

function Front({ kind, hair }: { kind: Kind; hair: string }) {
  if (kind === "bob" || kind === "star") {
    return (
      <>
        <path
          d="M14 42C16 24 24 16 34 16c12 0 20 10 16 24-8-8-14-9-20-7-6 2-12 5-16 9z"
          fill={hair}
        />
        {kind === "star" ? (
          <path d="M36 7.5l2.1 5.8h6.1l-4.9 3.6 1.9 5.8-5.2-3.7-5.2 3.7 1.9-5.8-4.9-3.6h6.1z" fill="#f0b429" />
        ) : null}
      </>
    );
  }
  if (kind === "side") {
    return (
      <>
        <path d="M16 40c6-16 20-20 34-12 2 2 2 5-1 6-10-5-22-3-30 8-1 2-4 1-3-2z" fill={hair} />
        <path d="M47 32c8 3 12 14 9 28-1 4-5 5-7 2-3-10-5-20-3-28-1-2 0-3 1-2z" fill={hair} />
      </>
    );
  }
  if (kind === "cap") {
    return (
      <>
        <path d="M15 39C17 22 28 14 38 16c11 2 16 12 14 23-8-1-16 0-24 1-6 1-11 1-13-1z" fill="#f0b429" />
        <path d="M16 40c10 4 22 5 34 1 8-2 16 0 16 6s-12 5-20 2c-10-2-22-2-30-3-2-2-2-5 0-6z" fill="#c48a12" />
      </>
    );
  }
  if (kind === "bow") {
    return (
      <>
        <path d="M14 42C16 24 24 16 34 16c12 0 20 10 16 24-8-8-14-9-20-7-6 2-12 5-16 9z" fill={hair} />
        <ellipse cx="46" cy="24" rx="7" ry="4.6" transform="rotate(-28 46 24)" fill="#ff5a36" />
        <ellipse cx="57" cy="25" rx="7" ry="4.6" transform="rotate(28 57 25)" fill="#ff5a36" />
        <circle cx="51.5" cy="25" r="2.5" fill={FACE} />
      </>
    );
  }
  if (kind === "phones") {
    return (
      <>
        <path
          d="M15 48C18 20 40 14 54 42"
          fill="none"
          stroke="#efe8e0"
          strokeWidth="3.3"
          strokeLinecap="round"
        />
        <circle cx="15" cy="50" r="6.3" fill={INK} stroke="#efe8e0" strokeWidth="2.5" />
        <circle cx="54" cy="44" r="6.3" fill={INK} stroke="#efe8e0" strokeWidth="2.5" />
      </>
    );
  }
  if (kind === "spike") {
    return (
      <>
        <polygon points="20,42 28,16 36,42" fill={hair} />
        <polygon points="32,40 43,10 52,38" fill={hair} />
        <polygon points="46,42 56,20 60,42" fill={hair} />
      </>
    );
  }
  if (kind === "antenna") {
    return (
      <>
        <path d="M16 44c2-12 8-16 16-16 6 0 12 3 14 10-8-4-14-3-20 0-4 2-8 3-10 6z" fill={hair} />
        <path d="M44 30 L58 12" fill="none" stroke={hair} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="60" cy="10.5" r="4.3" fill="#f0b429" />
      </>
    );
  }
  return null;
}
