import { useState } from "react";
import HomeScreen      from "./components/HomeScreen";
import AtBatScreen     from "./components/AtBatScreen";
import RunSummary      from "./components/RunSummary";
import TeamNameScreen  from "./components/TeamNameScreen";
import DraftScreen     from "./components/DraftScreen";
import LineupScreen    from "./components/LineupScreen";
import {
  loadIQ, saveIQ,
  loadHistory, saveRun,
  loadLineup, saveLineup, clearLineup,
  loadTeamName, saveTeamName, clearTeamName,
} from "./utils/storage";
import { SeededRNG } from "./utils/simEngine";
import { generateDraftPool } from "./utils/playerGenerator";
import "./index.css";

const VIEWS = {
  HOME:      "home",
  GAME:      "game",
  SUMMARY:   "summary",
  TEAM_NAME: "team-name",
  DRAFT:     "draft",
  LINEUP:    "lineup",
};

export default function App() {
  const [view,       setView]       = useState(VIEWS.HOME);
  const [iq,         setIQ]         = useState(loadIQ);
  const [history,    setHistory]    = useState(loadHistory);
  const [runData,    setRunData]    = useState(null);
  const [difficulty, setDifficulty] = useState("pro");

  // Draft flow state
  const [lineup,     setLineup]     = useState(loadLineup);
  const [teamName,   setTeamName]   = useState(loadTeamName);
  const [draftPicks, setDraftPicks] = useState(null);
  const [draftPool,  setDraftPool]  = useState(null);
  // Seed for the generated draft pool. Reseeded on roster change so each new
  // draft surfaces a fresh pool.
  const [draftSeed,  setDraftSeed]  = useState(() => Date.now() % 100000);

  // ── Routing ──

  function startRun() {
    // If no lineup yet, route through the draft flow.
    if (!lineup) {
      setView(VIEWS.TEAM_NAME);
      return;
    }
    setView(VIEWS.GAME);
  }

  function endRun(summary, finalIQ) {
    saveIQ(finalIQ);
    saveRun(summary);
    setIQ(finalIQ);
    setHistory(loadHistory());
    setRunData(summary);
    setView(VIEWS.SUMMARY);
  }

  function goHome() {
    setView(VIEWS.HOME);
  }

  function changeRoster() {
    clearLineup();
    clearTeamName();
    setLineup(null);
    setTeamName(null);
    setDraftPicks(null);
    setDraftPool(null);                  // force a fresh pool next draft
    setDraftSeed(Date.now() % 100000);   // ...with a fresh seed
    setView(VIEWS.TEAM_NAME);
  }

  // ── Draft step handlers ──

  function completeTeamName(name) {
    setTeamName(name);
    saveTeamName(name);
    // Generate the draft pool once when the draft flow begins.
    if (!draftPool) {
      const rng = new SeededRNG(draftSeed);
      setDraftPool(generateDraftPool(rng));
    }
    setView(VIEWS.DRAFT);
  }

  function completeDraft(picks) {
    setDraftPicks(picks);
    setView(VIEWS.LINEUP);
  }

  function completeLineup(finalLineup) {
    const full = { ...finalLineup, teamName };
    saveLineup(full);
    setLineup(full);
    setDraftPicks(null);
    setView(VIEWS.HOME);
  }

  return (
    <div className="app-root scanlines crt-vignette">
      {view === VIEWS.HOME && (
        <HomeScreen
          iq={iq}
          history={history}
          onStart={startRun}
          currentDifficulty={difficulty}
          onDifficultyChange={setDifficulty}
          lineup={lineup}
          teamName={teamName}
          onChangeRoster={changeRoster}
        />
      )}
      {view === VIEWS.TEAM_NAME && (
        <TeamNameScreen onComplete={completeTeamName} />
      )}
      {view === VIEWS.DRAFT && draftPool && (
        <DraftScreen
          draftPool={draftPool}
          teamName={teamName}
          onComplete={completeDraft}
          cap={100}
        />
      )}
      {view === VIEWS.LINEUP && draftPicks && (
        <LineupScreen picks={draftPicks} onComplete={completeLineup} />
      )}
      {view === VIEWS.GAME && (
        <AtBatScreen
          initialIQ={iq}
          difficulty={difficulty}
          isFirstRun={history.length === 0}
          lineup={lineup}
          teamName={teamName}
          onComplete={endRun}
        />
      )}
      {view === VIEWS.SUMMARY && runData && (
        <RunSummary
          runData={runData}
          onRunItBack={startRun}
          onHome={goHome}
        />
      )}
    </div>
  );
}
