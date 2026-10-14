import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlayBoard } from "@/components/play-board";
import {
  ContactScreen,
  CountScreen,
  HistoryScreen,
  MenuScreen,
  PresetEditor,
  PresetsScreen,
  ResultScreen,
  SetupScreen,
} from "@/components/screens";
import { Screen, KeyboardSpacer } from "@/components/chrome";
import { cleanRoster, emptyRoster, resizeRoster, type Roster } from "@/lib/roster";
import { useSadari, writeSadari, type HistoryEntry, type Preset } from "@/lib/storage";

export const Route = createFileRoute("/")({ component: Home });

type View =
  | { id: "menu" }
  | { id: "count"; back: "menu" | "setup" }
  | { id: "setup" }
  | { id: "play" }
  | { id: "result"; back: "menu" | "history" }
  | { id: "history" }
  | { id: "presets" }
  | { id: "preset"; slot: number }
  | { id: "contact" };

function Home() {
  const data = useSadari();
  const [view, setView] = useState<View>({ id: "menu" });
  const [roster, setRoster] = useState<Roster>(emptyRoster(4));
  const [result, setResult] = useState<HistoryEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [setupBack, setSetupBack] = useState<"count" | "presets">("count");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string) => setToast(message);

  const startPlay = () => {
    const cleaned = cleanRoster(roster);
    setRoster(cleaned);
    setView({ id: "play" });
  };

  const finishPlay = (ends: number[]) => {
    const cleaned = cleanRoster(roster);
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      playedAt: Date.now(),
      names: cleaned.names,
      prizes: cleaned.prizes,
      ends,
    };
    writeSadari((prev) => ({
      ...prev,
      history: [entry, ...prev.history].slice(0, 30),
    }));
    setResult(entry);
    setView({ id: "result", back: "menu" });
  };

  const playPreset = (preset: Preset) => {
    setRoster({ names: [...preset.names], prizes: [...preset.prizes] });
    setSetupBack("presets");
    setView({ id: "setup" });
  };

  const shell =
    view.id === "menu" ? (
      <MenuScreen
        onPlay={() => {
          setRoster(emptyRoster(4));
          setView({ id: "count", back: "menu" });
        }}
        onHistory={() => setView({ id: "history" })}
        onPresets={() => setView({ id: "presets" })}
        onContact={() => setView({ id: "contact" })}
      />
    ) : view.id === "count" ? (
      <CountScreen
        selected={view.back === "setup" ? roster.names.length : 0}
        onBack={() =>
          setView(view.back === "setup" ? { id: "setup" } : { id: "menu" })
        }
        onPick={(count) => {
          setRoster(resizeRoster(roster.names.length ? roster : emptyRoster(count), count));
          if (view.back === "menu") setSetupBack("count");
          setView({ id: "setup" });
        }}
      />
    ) : view.id === "setup" ? (
      <SetupScreen
        roster={roster}
        onChange={setRoster}
        onBack={() =>
          setView(setupBack === "presets" ? { id: "presets" } : { id: "count", back: "menu" })
        }
        onChangeCount={() => setView({ id: "count", back: "setup" })}
        onStart={startPlay}
      />
    ) : view.id === "play" ? (
      <Screen wide>
        <PlayBoard
          names={roster.names}
          prizes={roster.prizes}
          onBack={() => setView({ id: "setup" })}
          onDone={finishPlay}
        />
      </Screen>
    ) : view.id === "result" && result ? (
      <ResultScreen
        entry={result}
        onConfirm={() => setView(view.back === "history" ? { id: "history" } : { id: "menu" })}
        onNotify={notify}
      />
    ) : view.id === "history" ? (
      <HistoryScreen
        onBack={() => setView({ id: "menu" })}
        onOpen={(entry) => {
          setResult(entry);
          setView({ id: "result", back: "history" });
        }}
      />
    ) : view.id === "presets" ? (
      <PresetsScreen
        onBack={() => setView({ id: "menu" })}
        onEdit={(slot) => setView({ id: "preset", slot })}
        onPlay={playPreset}
      />
    ) : view.id === "preset" ? (
      <PresetEditor
        key={`${view.slot}-${data.presets[view.slot]?.savedAt ?? "new"}`}
        slot={view.slot}
        initial={data.presets[view.slot] ?? null}
        onBack={() => setView({ id: "presets" })}
        onSaved={notify}
      />
    ) : (
      <ContactScreen onBack={() => setView({ id: "menu" })} onNotify={notify} />
    );

  return (
    <>
      {shell}
      <KeyboardSpacer />
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}
