"use client";

import { useState } from "react";
import players, { type Player } from "@/app/data/players";

const stats = [
  "clubGoals",
  "clubAssists",
  "clubAppearances",
  "internationalGoals",
  "internationalAssists",
  "internationalAppearances",
] as const;

type StatKey = (typeof stats)[number];

const statLabels: Record<StatKey, string> = {
  clubGoals: "Club Goals",
  clubAssists: "Club Assists",
  clubAppearances: "Club Appearances",
  internationalGoals: "International Goals",
  internationalAssists: "International Assists",
  internationalAppearances: "International Appearances",
};

function getRandomTarget(stat: StatKey) {
  const values = players.map((player) => player[stat]).sort((a, b) => a - b);
  const minSum = values[0] + values[1] + values[2];
  const maxSum =
    values[values.length - 1] +
    values[values.length - 2] +
    values[values.length - 3];

  return Math.floor(minSum + Math.random() * (maxSum - minSum + 1));
}

function getRandomStat() {
  return stats[Math.floor(Math.random() * stats.length)];
}

function createRound() {
  const stat = getRandomStat();
  return {
    currentStat: stat,
    targetNumber: getRandomTarget(stat),
  };
}

function getResultPresentation(difference: number) {
  if (difference === 0) {
    return {
      message: "Perfect Match",
      card: "border-amber-400/60 bg-linear-to-br from-amber-950/70 via-emerald-950/60 to-zinc-950 shadow-amber-500/25",
      headline: "text-amber-300",
      badge: "bg-amber-500/20 text-amber-200 ring-amber-400/40",
    };
  }
  if (difference <= 3) {
    return {
      message: "Incredible",
      card: "border-emerald-400/60 bg-linear-to-br from-emerald-900/70 via-emerald-950/50 to-zinc-950 shadow-emerald-500/30",
      headline: "text-emerald-300",
      badge: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/40",
    };
  }
  if (difference <= 8) {
    return {
      message: "Great Guess",
      card: "border-emerald-600/50 bg-linear-to-br from-emerald-950/80 via-zinc-900/80 to-zinc-950 shadow-emerald-900/20",
      headline: "text-emerald-400",
      badge: "bg-emerald-600/15 text-emerald-300 ring-emerald-600/30",
    };
  }
  if (difference <= 15) {
    return {
      message: "Not Bad",
      card: "border-zinc-600/60 bg-linear-to-br from-zinc-800/80 via-zinc-900/80 to-zinc-950 shadow-zinc-900/30",
      headline: "text-zinc-200",
      badge: "bg-zinc-700/40 text-zinc-300 ring-zinc-500/30",
    };
  }
  return {
    message: "Tough Round",
    card: "border-zinc-700/60 bg-linear-to-br from-zinc-900 via-zinc-950 to-black shadow-black/40",
    headline: "text-zinc-400",
    badge: "bg-zinc-800/60 text-zinc-400 ring-zinc-600/30",
  };
}

export default function GameContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [round, setRound] = useState(createRound);
  const { currentStat, targetNumber } = round;
  const [result, setResult] = useState<null | {
    total: number;
    difference: number;
  }>(null);

  const currentStatLabel = statLabels[currentStat];

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTotal = selectedPlayers.reduce((sum, player) => {
    return sum + player[currentStat];
  }, 0);

  const canSubmit = selectedPlayers.length === 3 && result === null;

  function handleSelectPlayer(player: Player) {
    if (selectedPlayers.length === 3) return;

    const alreadySelected = selectedPlayers.some(
      (selectedPlayer) => selectedPlayer.id === player.id
    );

    if (alreadySelected) return;

    setSelectedPlayers([...selectedPlayers, player]);
    setSearchTerm("");
  }

  function handleRemovePlayer(playerId: number) {
    if (result) return;

    setSelectedPlayers(
      selectedPlayers.filter((player) => player.id !== playerId)
    );
  }

  function handleSubmit() {
    if (!canSubmit) return;

    setResult({
      total: selectedTotal,
      difference: Math.abs(targetNumber - selectedTotal),
    });
  }

  function handleNextRound() {
    setSelectedPlayers([]);
    setSearchTerm("");
    setResult(null);
    setRound(createRound());
  }

  const resultPresentation = result
    ? getResultPresentation(result.difference)
    : null;

  return (
    <main className="flex min-h-dvh w-full flex-1 items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-900/60 bg-zinc-900/90 shadow-2xl shadow-black/50 ring-1 ring-white/5 backdrop-blur-sm">
        <div className="border-b border-emerald-900/40 bg-linear-to-b from-emerald-950/80 to-zinc-900 px-6 py-8 text-center">
          <h1 className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400/90">
            Footly
          </h1>

          <p className="mt-6 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Target
          </p>
          <p className="mt-1 text-7xl font-bold tabular-nums tracking-tight text-white">
            {targetNumber}
          </p>

          <span className="mt-4 inline-flex items-center rounded-full border border-emerald-700/50 bg-emerald-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            {currentStatLabel}
          </span>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Pick 3 players whose combined{" "}
            <span className="font-medium text-emerald-300">{currentStatLabel}</span>{" "}
            gets closest.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={result !== null}
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {searchTerm && !result && (
              <div className="absolute top-full z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-zinc-700/80 bg-zinc-950 shadow-xl">
                {filteredPlayers.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-zinc-500">No players found</p>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handleSelectPlayer(player)}
                      className="cursor-pointer border-b border-zinc-800/80 px-4 py-3 transition last:border-b-0 hover:bg-emerald-950/60"
                    >
                      <p className="text-sm font-medium text-white">{player.name}</p>
                      <p className="text-xs text-zinc-500">{player.currentClub}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Selected Players
              </h2>
              <span className="text-xs font-medium tabular-nums text-zinc-400">
                {selectedPlayers.length}/3
              </span>
            </div>

            {selectedPlayers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-700/60 bg-zinc-950/40 px-4 py-6 text-center text-sm text-zinc-500">
                No players selected yet
              </p>
            ) : (
              <ul className="space-y-2">
                {selectedPlayers.map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {player.name}
                      </p>
                      {result && (
                        <p className="text-xs text-zinc-500">
                          <span className="font-semibold tabular-nums text-emerald-400">
                            {player[currentStat]}
                          </span>{" "}
                          {currentStatLabel}
                        </p>
                      )}
                    </div>

                    {!result && (
                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(player.id)}
                        className="shrink-0 rounded-lg border border-zinc-600/80 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-900/60 hover:bg-red-950/40 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
          >
            Submit
          </button>

          {result && resultPresentation && (
            <div
              className={`relative overflow-hidden rounded-2xl border px-5 py-6 text-center shadow-lg ${resultPresentation.card}`}
            >
              <div className="pointer-events-none absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 right-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

              <span
                className={`relative inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ring-1 ring-inset ${resultPresentation.badge}`}
              >
                Round Complete
              </span>

              <p
                className={`relative mt-4 text-2xl font-bold tracking-tight sm:text-3xl ${resultPresentation.headline}`}
              >
                {resultPresentation.message}
              </p>

              <p className="relative mt-2 text-xs text-zinc-500">
                {result.difference === 0 ? (
                  "Bullseye — you hit the target exactly."
                ) : (
                  <>
                    You were{" "}
                    <span className="font-semibold tabular-nums text-zinc-300">
                      {result.difference}
                    </span>{" "}
                    {result.difference === 1 ? "point" : "points"} away
                  </>
                )}
              </p>

              <div className="relative mt-6 grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-black/25 p-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-white">
                    {result.total}
                  </p>
                </div>
                <div className="border-x border-white/5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Target
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-white">
                    {targetNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Difference
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-emerald-300">
                    {result.difference}
                  </p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <button
              type="button"
              onClick={handleNextRound}
              className="w-full rounded-xl border border-emerald-700/60 bg-transparent px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500 hover:bg-emerald-950/50"
            >
              Next Round
            </button>
          )}
        </div>
      </div>
    </main>
  );
}