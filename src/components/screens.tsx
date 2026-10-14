import { useEffect, useRef, useState } from "react";
import { Bookmark, Dices, History, Mail, Trash2 } from "lucide-react";
import { Blob } from "@/components/blob";
import { Screen, TopBar } from "@/components/chrome";
import { LadderSvg } from "@/components/ladder-svg";
import { isRosterReady, resizeRoster, type Roster } from "@/lib/roster";
import {
  formatWhen,
  useSadari,
  writeSadari,
  type HistoryEntry,
  type Preset,
} from "@/lib/storage";

const MAIL = "skyswing@mail.grokbot.com";

export function MenuScreen({
  onPlay,
  onHistory,
  onPresets,
  onContact,
}: {
  onPlay: () => void;
  onHistory: () => void;
  onPresets: () => void;
  onContact: () => void;
}) {
  return (
    <Screen>
      <main className="flex min-h-dvh flex-col px-5 pb-28 pt-10">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-6 flex items-end">
            <Blob index={0} size={78} className="blob-bob -mr-3" />
            <Blob index={1} size={104} className="blob-bob relative z-10" />
            <Blob index={3} size={78} className="blob-bob -ml-3" />
          </div>
          <h1 className="font-display text-5xl tracking-tight">사다리타기</h1>
          <p className="mt-2 text-center text-muted">동글동글 캐릭터가 대신 걸어줄게요</p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button type="button" className="btn btn-block btn-primary" onClick={onPlay}>
              <Dices className="size-5" />
              사다리타기
            </button>
            <button type="button" className="btn btn-block btn-secondary" onClick={onHistory}>
              <History className="size-5" />
              지난 기록
            </button>
            <button type="button" className="btn btn-block btn-secondary" onClick={onPresets}>
              <Bookmark className="size-5" />
              세팅값
            </button>
          </div>
        </div>
      </main>
      <button type="button" className="fab" onClick={onContact}>
        <Mail className="size-4" />
        문의하기
      </button>
    </Screen>
  );
}

export function CountScreen({
  selected,
  onBack,
  onPick,
}: {
  selected: number;
  onBack: () => void;
  onPick: (count: number) => void;
}) {
  return (
    <Screen>
      <TopBar title="인원" onBack={onBack} />
      <main className="px-5 pb-10">
        <p className="mt-2 text-center font-display text-2xl">몇 명이 타나요?</p>
        <p className="mt-1 text-center text-sm text-muted">2명부터 10명까지 고를 수 있어요</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }, (_, index) => index + 2).map((count) => (
            <button
              key={count}
              type="button"
              className={`count-btn ${count === selected ? "count-btn-on" : ""}`}
              onClick={() => onPick(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </main>
    </Screen>
  );
}

export function SetupScreen({
  roster,
  onChange,
  onBack,
  onChangeCount,
  onStart,
}: {
  roster: Roster;
  onChange: (roster: Roster) => void;
  onBack: () => void;
  onChangeCount: () => void;
  onStart: () => void;
}) {
  const ready = isRosterReady(roster);
  const startRef = useRef<HTMLButtonElement>(null);
  const wasReady = useRef(false);
  const count = roster.names.length;

  useEffect(() => {
    if (ready && !wasReady.current) {
      startRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    wasReady.current = ready;
  }, [ready]);

  const setName = (index: number, value: string) => {
    const names = roster.names.slice();
    names[index] = value;
    onChange({ ...roster, names });
  };

  const setPrize = (index: number, value: string) => {
    const prizes = roster.prizes.slice();
    prizes[index] = value;
    onChange({ ...roster, prizes });
  };

  const focusId = (id: string) => {
    document.getElementById(id)?.focus();
  };

  return (
    <Screen>
      <TopBar
        title="사다리 놓기"
        onBack={onBack}
        right={
          <button type="button" className="text-sm font-medium text-primary" onClick={onChangeCount}>
            {count}명
          </button>
        }
      />
      <main className="px-4 pb-12">
        <section>
          <h2 className="px-1 font-display text-lg">이름</h2>
          <p className="px-1 text-sm text-muted">사다리 위에 설 사람이에요</p>
          <div className="mt-3 flex flex-col gap-2">
            {roster.names.map((name, index) => (
              <label key={index} className="flex items-center gap-2">
                <Blob index={index} size={44} />
                <input
                  id={`name-${index}`}
                  className="field"
                  value={name}
                  maxLength={12}
                  placeholder={`${index + 1}번 이름`}
                  aria-label={`${index + 1}번 이름`}
                  autoComplete="off"
                  enterKeyHint={index === count - 1 ? "next" : "next"}
                  onChange={(event) => setName(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    focusId(index === count - 1 ? "prize-0" : `name-${index + 1}`);
                  }}
                />
              </label>
            ))}
          </div>
        </section>

        <div className="relative my-5 h-56 overflow-hidden rounded-[1.5rem] border-2 border-sand bg-surface">
          <LadderSvg count={count} rows={6} rungs={[]} gap={24} padTop={18} padBottom={14} />
          <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
            {ready ? (
              <button
                ref={startRef}
                type="button"
                className="btn btn-primary pop-in"
                onClick={onStart}
              >
                사다리 타기
              </button>
            ) : (
              <p className="hint-pill">이름과 상·벌을 모두 입력하면 시작해요</p>
            )}
          </div>
        </div>

        <section>
          <h2 className="px-1 font-display text-lg">상 · 벌</h2>
          <p className="px-1 text-sm text-muted">사다리 아래에 둘 결과예요. 이름과 미리 연결되지 않아요</p>
          <div className="mt-3 flex flex-col gap-2">
            {roster.prizes.map((prize, index) => (
              <label key={index} className="flex items-center gap-2">
                <span className="num-badge">{index + 1}</span>
                <input
                  id={`prize-${index}`}
                  className="field"
                  value={prize}
                  maxLength={16}
                  placeholder={index % 2 === 0 ? "상" : "벌"}
                  aria-label={`${index + 1}번 상 또는 벌`}
                  autoComplete="off"
                  enterKeyHint={index === count - 1 ? "done" : "next"}
                  onChange={(event) => setPrize(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    if (index === count - 1) {
                      if (ready) startRef.current?.focus();
                    } else {
                      focusId(`prize-${index + 1}`);
                    }
                  }}
                />
              </label>
            ))}
          </div>
        </section>
      </main>
    </Screen>
  );
}

function Confetti() {
  const bits = [
    { left: "8%", delay: "0ms", gold: false, round: false },
    { left: "18%", delay: "80ms", gold: true, round: true },
    { left: "30%", delay: "20ms", gold: false, round: true },
    { left: "46%", delay: "140ms", gold: true, round: false },
    { left: "58%", delay: "40ms", gold: false, round: false },
    { left: "70%", delay: "110ms", gold: true, round: true },
    { left: "82%", delay: "60ms", gold: false, round: true },
    { left: "92%", delay: "160ms", gold: true, round: false },
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden" aria-hidden="true">
      {bits.map((bit) => (
        <span
          key={bit.left}
          className="confetti-bit"
          style={{
            left: bit.left,
            animationDelay: bit.delay,
            background: bit.gold ? "var(--color-accent)" : "var(--color-primary)",
            borderRadius: bit.round ? "999px" : "3px",
          }}
        />
      ))}
    </div>
  );
}

export function ResultScreen({
  entry,
  onConfirm,
  onNotify,
}: {
  entry: HistoryEntry;
  onConfirm: () => void;
  onNotify: (message: string) => void;
}) {
  const data = useSadari();
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState(`${entry.names.length}명 팀`);
  const [pending, setPending] = useState<number | null>(null);

  const saveTo = (slot: number) => {
    const preset: Preset = {
      teamName: teamName.trim() || `${slot + 1}번 팀`,
      names: entry.names,
      prizes: entry.prizes,
      savedAt: Date.now(),
    };
    writeSadari((prev) => {
      const presets = prev.presets.slice() as Array<Preset | null>;
      presets[slot] = preset;
      return { ...prev, presets };
    });
    setOpen(false);
    setPending(null);
    onNotify(`${slot + 1}번 칸에 저장했어요`);
  };

  return (
    <Screen>
      <TopBar title="결과" />
      <main className="relative px-4 pb-12">
        <Confetti />
        <p className="mt-2 text-center text-sm text-muted">
          {entry.names.length}명 · {formatWhen(entry.playedAt)}
        </p>
        <table className="result-table mt-4">
          <caption className="sr-only">사다리 결과</caption>
          <thead>
            <tr>
              <th>이름</th>
              <th>상 · 벌</th>
            </tr>
          </thead>
          <tbody>
            {entry.names.map((name, index) => (
              <tr key={`${name}-${index}`}>
                <td>
                  <span className="flex items-center gap-2">
                    <Blob index={index} size={36} />
                    <span className="font-medium">{name}</span>
                  </span>
                </td>
                <td>{entry.prizes[entry.ends[index] ?? 0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" className="btn btn-block btn-primary" onClick={onConfirm}>
            확인
          </button>
          <button type="button" className="btn btn-block btn-secondary" onClick={() => setOpen(true)}>
            세팅값 저장
          </button>
        </div>
      </main>
      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/45 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-title"
        >
          <div className="max-h-[88dvh] w-full max-w-md overflow-auto rounded-t-[1.5rem] bg-bg px-4 pt-5 pb-6 sm:rounded-[1.5rem]">
            <h2 id="save-title" className="font-display text-2xl">
              세팅값 저장
            </h2>
            <p className="mt-1 text-sm text-muted">1번부터 5번 칸 중 하나에 이 명단을 남겨요</p>
            <label className="mt-4 block text-sm text-muted" htmlFor="team-name">
              팀 이름
            </label>
            <input
              id="team-name"
              className="field mt-1"
              value={teamName}
              maxLength={20}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <div className="mt-4 flex flex-col gap-2">
              {data.presets.map((slot, index) =>
                pending === index ? (
                  <div key={index} className="card px-3 py-3">
                    <p className="text-sm">{index + 1}번 칸을 덮어쓸까요?</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" className="btn btn-primary flex-1" onClick={() => saveTo(index)}>
                        덮어쓰기
                      </button>
                      <button type="button" className="btn btn-secondary flex-1" onClick={() => setPending(null)}>
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    key={index}
                    type="button"
                    className="card flex min-h-14 items-center justify-between px-4 py-3 text-left"
                    onClick={() => (slot ? setPending(index) : saveTo(index))}
                  >
                    <span>
                      <span className="font-display text-lg">{index + 1}번</span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {slot ? `${slot.teamName} · ${slot.names.length}명` : "비어 있음"}
                      </span>
                    </span>
                    <span className="text-sm text-primary">{slot ? "바꾸기" : "저장"}</span>
                  </button>
                ),
              )}
            </div>
            <button type="button" className="btn btn-block btn-secondary mt-4" onClick={() => setOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

export function HistoryScreen({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen: (entry: HistoryEntry) => void;
}) {
  const data = useSadari();
  return (
    <Screen>
      <TopBar title="지난 기록" onBack={onBack} />
      <main className="px-4 pb-10">
        {data.history.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <Blob index={7} size={88} />
            <p className="mt-4 font-display text-xl">아직 기록이 없어요</p>
            <p className="mt-1 text-sm text-muted">사다리를 타고 나면 여기에 남아요</p>
          </div>
        ) : (
          <ul className="mt-2 flex flex-col gap-3">
            {data.history.map((entry) => (
              <li key={entry.id} className="card p-3">
                <button type="button" className="w-full text-left" onClick={() => onOpen(entry)}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg">{entry.names.length}명</span>
                    <span className="text-sm text-muted">{formatWhen(entry.playedAt)}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {entry.names.slice(0, 3).map((name, index) => (
                      <span key={index}>
                        {index > 0 ? " · " : ""}
                        {name} → {entry.prizes[entry.ends[index] ?? 0]}
                      </span>
                    ))}
                    {entry.names.length > 3 ? " …" : ""}
                  </span>
                </button>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-muted"
                  onClick={() =>
                    writeSadari((prev) => ({
                      ...prev,
                      history: prev.history.filter((item) => item.id !== entry.id),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                  지우기
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </Screen>
  );
}

export function PresetsScreen({
  onBack,
  onEdit,
  onPlay,
}: {
  onBack: () => void;
  onEdit: (slot: number) => void;
  onPlay: (preset: Preset) => void;
}) {
  const data = useSadari();
  const [confirm, setConfirm] = useState<number | null>(null);

  return (
    <Screen>
      <TopBar title="세팅값" onBack={onBack} />
      <main className="px-4 pb-10">
        <p className="mt-1 text-sm text-muted">팀 이름과 상·벌을 5칸까지 남겨 둘 수 있어요</p>
        <div className="mt-4 flex flex-col gap-3">
          {data.presets.map((slot, index) => (
            <article key={index} className="card p-4">
              <div className="flex items-start gap-3">
                <span className="num-badge">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-xl">
                    {slot ? slot.teamName : "비어 있는 칸"}
                  </h2>
                  {slot ? (
                    <>
                      <p className="mt-1 text-sm">
                        {slot.names.join(" · ")}
                      </p>
                      <p className="mt-1 text-sm text-muted">{slot.prizes.join(" · ")}</p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-muted">이름과 상·벌을 저장해 두세요</p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {slot ? (
                  <button type="button" className="btn btn-primary" onClick={() => onPlay(slot)}>
                    이 팀으로 타기
                  </button>
                ) : null}
                <button type="button" className="btn btn-secondary" onClick={() => onEdit(index)}>
                  {slot ? "수정" : "만들기"}
                </button>
                {slot ? (
                  confirm === index ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          writeSadari((prev) => {
                            const presets = prev.presets.slice();
                            presets[index] = null;
                            return { ...prev, presets };
                          });
                          setConfirm(null);
                        }}
                      >
                        지우기
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setConfirm(null)}>
                        취소
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={() => setConfirm(index)}>
                      삭제
                    </button>
                  )
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </main>
    </Screen>
  );
}

export function PresetEditor({
  slot,
  initial,
  onBack,
  onSaved,
}: {
  slot: number;
  initial: Preset | null;
  onBack: () => void;
  onSaved: (message: string) => void;
}) {
  const [teamName, setTeamName] = useState(initial?.teamName ?? `${slot + 1}번 팀`);
  const [roster, setRoster] = useState<Roster>(
    initial
      ? { names: [...initial.names], prizes: [...initial.prizes] }
      : { names: ["", "", "", ""], prizes: ["", "", "", ""] },
  );

  const setCount = (count: number) => setRoster((prev) => resizeRoster(prev, count));

  const save = () => {
    const names = roster.names.map((name) => name.trim());
    const prizes = roster.prizes.map((prize) => prize.trim());
    if (names.some((name) => !name) || prizes.some((prize) => !prize)) {
      onSaved("이름과 상·벌을 모두 적어 주세요");
      return;
    }
    writeSadari((prev) => {
      const presets = prev.presets.slice();
      presets[slot] = {
        teamName: teamName.trim() || `${slot + 1}번 팀`,
        names,
        prizes,
        savedAt: Date.now(),
      };
      return { ...prev, presets };
    });
    onSaved(`${slot + 1}번 칸에 저장했어요`);
    onBack();
  };

  return (
    <Screen>
      <TopBar title={`${slot + 1}번 칸`} onBack={onBack} />
      <main className="px-4 pb-12">
        <label className="text-sm text-muted" htmlFor="edit-team">
          팀 이름
        </label>
        <input
          id="edit-team"
          className="field mt-1"
          value={teamName}
          maxLength={20}
          onChange={(event) => setTeamName(event.target.value)}
        />
        <div className="mt-5 flex items-center justify-between">
          <p className="font-display text-lg">인원</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="icon-btn"
              aria-label="인원 줄이기"
              disabled={roster.names.length <= 2}
              onClick={() => setCount(roster.names.length - 1)}
            >
              −
            </button>
            <span className="w-12 text-center font-display text-2xl">{roster.names.length}명</span>
            <button
              type="button"
              className="icon-btn"
              aria-label="인원 늘리기"
              disabled={roster.names.length >= 10}
              onClick={() => setCount(roster.names.length + 1)}
            >
              +
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">이름과 상·벌은 아직 짝이 아니에요. 사다리가 섞어 줘요.</p>
        <div className="mt-3 flex flex-col gap-3">
          {roster.names.map((name, index) => (
            <div key={index} className="card p-3">
              <p className="mb-2 text-sm text-muted">{index + 1}번</p>
              <input
                className="field"
                value={name}
                maxLength={12}
                placeholder="이름"
                aria-label={`${index + 1}번 이름`}
                onChange={(event) => {
                  const names = roster.names.slice();
                  names[index] = event.target.value;
                  setRoster({ ...roster, names });
                }}
              />
              <input
                className="field mt-2"
                value={roster.prizes[index] ?? ""}
                maxLength={16}
                placeholder="상 또는 벌"
                aria-label={`${index + 1}번 상 또는 벌`}
                onChange={(event) => {
                  const prizes = roster.prizes.slice();
                  prizes[index] = event.target.value;
                  setRoster({ ...roster, prizes });
                }}
              />
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-block btn-primary mt-6" onClick={save}>
          이 칸에 저장
        </button>
      </main>
    </Screen>
  );
}

export function ContactScreen({
  onBack,
  onNotify,
}: {
  onBack: () => void;
  onNotify: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    const subject = `[사다리타기 문의] ${name.trim() || "익명"}`;
    const href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.trim())}`;
    window.location.href = href;
    onNotify("메일 앱으로 연결했어요");
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(MAIL);
      onNotify("메일 주소를 복사했어요");
    } catch {
      onNotify(MAIL);
    }
  };

  return (
    <Screen>
      <TopBar title="문의하기" onBack={onBack} />
      <main className="px-4 pb-12">
        <div className="mt-2 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-primary text-on-primary">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted">받는 사람</p>
            <p className="font-medium break-all">{MAIL}</p>
          </div>
        </div>
        <label className="mt-6 block text-sm text-muted" htmlFor="from-name">
          이름
        </label>
        <input
          id="from-name"
          className="field mt-1"
          value={name}
          maxLength={30}
          placeholder="불러 드릴 이름"
          onChange={(event) => setName(event.target.value)}
        />
        <label className="mt-4 block text-sm text-muted" htmlFor="mail-body">
          내용
        </label>
        <textarea
          id="mail-body"
          className="field field-area mt-1"
          value={message}
          maxLength={1000}
          placeholder="궁금한 점을 적어 주세요"
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          type="button"
          className="btn btn-block btn-primary mt-5"
          disabled={!message.trim()}
          onClick={send}
        >
          메일 보내기
        </button>
        <button type="button" className="btn btn-block btn-secondary mt-3" onClick={() => void copyAddress()}>
          주소 복사
        </button>
      </main>
    </Screen>
  );
}
