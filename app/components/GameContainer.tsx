"use client";

import { useState, useEffect } from "react";
import players from "@/app/data/players";

const stats = ["goals", "assists", "appearances"] as const;

function getRandomTarget() {
    return Math.floor(Math.random() * 40) + 20;
  }
  
  function getRandomStat() {
    return stats[Math.floor(Math.random() * stats.length)];
  }



export default function GameContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<typeof players>([]);
  const [targetNumber, setTargetNumber] = useState(50);
  const [currentStat, setCurrentStat] = useState<(typeof stats)[number]>(getRandomStat());
  const [result, setResult] = useState<null | {
    total: number;
    difference: number;
  }>(null);

  useEffect(() => {
    setTargetNumber(getRandomTarget());
    setCurrentStat(getRandomStat());
  }, []);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelectPlayer(player: (typeof players)[number]) {
    if (selectedPlayers.length === 3) return;

    const alreadySelected = selectedPlayers.some(
      (selectedPlayer) => selectedPlayer.id === player.id
    );

    if (alreadySelected) return;

    setSelectedPlayers([...selectedPlayers, player]);
    setSearchTerm("");
  }

  function handleSubmit() {
    const total = selectedPlayers.reduce((sum, player) => {
      return sum + player[currentStat];
    }, 0);

    setResult({
      total,
      difference: Math.abs(targetNumber - total),
    });
  }

  function handleNextRound() {
    setSelectedPlayers([]);
    setSearchTerm("");
    setResult(null);
    setTargetNumber(getRandomTarget());
    setCurrentStat(getRandomStat());
  }

  return (
    <main>
      <h1>Footly</h1>

      <h2>Target: {targetNumber}</h2>
      <p>Pick 3 players whose combined {currentStat} gets closest.</p>

      <input
        type="text"
        placeholder="Search player..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <div>
          {filteredPlayers.map((player) => (
            <div key={player.id} onClick={() => handleSelectPlayer(player)}>
              {player.name} - {player.club}
            </div>
          ))}
        </div>
      )}

      <h2>Selected Players</h2>

      {selectedPlayers.map((player) => (
        <div key={player.id}>
          {player.name} — {player[currentStat]} {currentStat}
        </div>
      ))}

      <button disabled={selectedPlayers.length !== 3} onClick={handleSubmit}>
        Submit
      </button>

      {result && (
        <div>
          <h2>Result</h2>
          <p>Total: {result.total}</p>
          <p>Target: {targetNumber}</p>
          <p>Difference: {result.difference}</p>
        </div>
      )}

    <button onClick={handleNextRound}>Next Round</button>
    </main>
  );
}