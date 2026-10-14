import { useEffect, type ReactNode } from "react";
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

function keyboardOverlap() {
  const viewport = window.visualViewport;
  if (!viewport) return 0;
  return Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
}

export function KeyboardSpacer() {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const measured = keyboardOverlap();
      const active = document.activeElement;
      const editing =
        active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      const narrow = window.matchMedia("(max-width: 720px)").matches;
      const inset =
        editing && narrow && measured < 80 ? Math.round(window.innerHeight * 0.52) : measured;
      root.style.setProperty("--keyboard-inset", `${Math.round(inset)}px`);
    };

    const lift = (el: HTMLElement) => {
      el.scrollIntoView({ block: "start", behavior: "auto" });
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      apply();
      requestAnimationFrame(() => requestAnimationFrame(() => lift(target)));
      window.setTimeout(() => lift(target), 320);
    };

    const onFocusOut = () => {
      window.setTimeout(apply, 60);
    };

    apply();
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      window.visualViewport?.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("scroll", apply);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      root.style.removeProperty("--keyboard-inset");
    };
  }, []);

  return null;
}
