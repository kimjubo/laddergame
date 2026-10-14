export type Roster = {
  names: string[];
  prizes: string[];
};

export function emptyRoster(count: number): Roster {
  return {
    names: Array.from({ length: count }, () => ""),
    prizes: Array.from({ length: count }, () => ""),
  };
}

export function resizeRoster(roster: Roster, count: number): Roster {
  return {
    names: Array.from({ length: count }, (_, i) => roster.names[i] ?? ""),
    prizes: Array.from({ length: count }, (_, i) => roster.prizes[i] ?? ""),
  };
}

export function cleanRoster(roster: Roster): Roster {
  return {
    names: roster.names.map((name) => name.trim()),
    prizes: roster.prizes.map((prize) => prize.trim()),
  };
}

export function isRosterReady(roster: Roster): boolean {
  return (
    roster.names.length >= 2 &&
    roster.names.length <= 10 &&
    roster.names.length === roster.prizes.length &&
    roster.names.every((name) => name.trim().length > 0) &&
    roster.prizes.every((prize) => prize.trim().length > 0)
  );
}
