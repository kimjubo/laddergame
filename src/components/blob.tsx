import { useId } from "react";

type BlobProps = {
  index: number;
  size?: number;
  className?: string;
};

export function Blob({ index, size = 64, className = "" }: BlobProps) {
  const uid = useId().replace(/:/g, "");
  const tone = index % 5;
  const face = index % 10;
  const color = `var(--color-blob-${tone})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-g`} cx="34%" cy="30%" r="72%">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="32%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <ellipse cx="42" cy="46" rx="27" ry="26" fill="var(--color-ink)" opacity="0.16" />
      <ellipse cx="40" cy="42" rx="27" ry="26" fill={`url(#${uid}-g)`} />
      <ellipse cx="31" cy="32" rx="10" ry="6.5" fill="white" opacity="0.55" />
      {face === 4 || face === 7 ? (
        <>
          <ellipse cx="22" cy="30" rx="7" ry="8" fill={color} />
          <ellipse cx="58" cy="30" rx="7" ry="8" fill={color} />
          <ellipse cx="22" cy="31" rx="3.2" ry="4" fill="var(--color-ink)" opacity="0.35" />
          <ellipse cx="58" cy="31" rx="3.2" ry="4" fill="var(--color-ink)" opacity="0.35" />
        </>
      ) : null}
      {face === 5 ? (
        <path
          d="M18 28h18l-4 8H24zM44 28h18l-6 8h-8z"
          fill="var(--color-ink)"
        />
      ) : null}
      {face === 1 ? (
        <>
          <path d="M40 16c2 6 2 6 8 8-6 1-6 2-8 8-2-6-2-7-8-8 6-2 6-2 8-8z" fill="var(--color-accent)" />
        </>
      ) : null}
      {face === 2 ? (
        <path d="M54 36c6 1 8 5 6 8-4-1-8-1-12 0 2-4 3-7 6-8z" fill="var(--color-primary)" />
      ) : null}
      {face === 9 ? (
        <path d="M28 22h6l6-8 6 8h6l-4 8H32z" fill="var(--color-accent)" />
      ) : null}
      <Face face={face} />
      <ellipse cx="22" cy="52" rx="4.2" ry="2.3" fill="white" opacity="0.42" />
      <ellipse cx="58" cy="52" rx="4.2" ry="2.3" fill="white" opacity="0.42" />
    </svg>
  );
}

function Face({ face }: { face: number }) {
  const wink = face === 2 || face === 6;
  const sleepy = face === 7;
  return (
    <>
      {wink ? (
        <path
          d="M26 44c3-3 8-3 10 0"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : sleepy ? (
        <path
          d="M26 45h10M46 45h10"
          stroke="var(--color-ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse cx="30" cy="44" rx="3.3" ry="4.3" fill="var(--color-ink)" />
          <ellipse cx="50" cy="44" rx="3.3" ry="4.3" fill="var(--color-ink)" />
          <circle cx="31.2" cy="42.6" r="1.25" fill="white" />
          <circle cx="51.2" cy="42.6" r="1.25" fill="white" />
        </>
      )}
      {wink ? (
        <>
          <ellipse cx="52" cy="44" rx="3.3" ry="4.3" fill="var(--color-ink)" />
          <circle cx="53.2" cy="42.6" r="1.25" fill="white" />
        </>
      ) : null}
      {sleepy ? null : face === 8 ? (
        <>
          <path d="M27 38c2-3 6-3 7 0" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M46 38c2-3 6-3 7 0" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : null}
      <Mouth face={face} />
    </>
  );
}

function Mouth({ face }: { face: number }) {
  if (face === 3) {
    return <ellipse cx="40" cy="55" rx="4" ry="4.5" fill="var(--color-ink)" />;
  }
  if (face === 4) {
    return (
      <path
        d="M33 54c2 2 4 2 7-1 3 3 5 3 7 1"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    );
  }
  if (face === 7) {
    return (
      <path
        d="M34 56h12"
        stroke="var(--color-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    );
  }
  if (face === 5 || face === 9) {
    return (
      <path
        d="M31 53c2.4 6 15.6 6 18 0"
        fill="var(--color-ink)"
      />
    );
  }
  return (
    <path
      d="M32 53c2.4 4.2 13.2 4.2 16 0"
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
  );
}
