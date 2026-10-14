import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function TopBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 bg-bg/95 px-3 py-3 backdrop-blur-sm">
      {onBack ? (
        <button type="button" className="icon-btn" onClick={onBack} aria-label="뒤로">
          <ChevronLeft className="size-5" />
        </button>
      ) : (
        <span className="size-11" />
      )}
      <h1 className="min-w-0 flex-1 truncate text-center font-display text-xl">{title}</h1>
      <div className="flex min-w-11 justify-end">{right}</div>
    </header>
  );
}

export function Screen({
  wide = false,
  children,
}: {
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`app-shell ${wide ? "max-w-3xl" : "max-w-md"}`}>{children}</div>
  );
}
