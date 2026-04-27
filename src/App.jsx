import { useState } from "react";
import HomeScreen   from "./components/HomeScreen";
import AtBatScreen  from "./components/AtBatScreen";
import RunSummary   from "./components/RunSummary";
import { loadIQ, saveIQ, loadHistory, saveRun } from "./utils/storage";
import "./index.css";

const VIEWS = { HOME: "home", GAME: "game", SUMMARY: "summary" };

export default function App() {
  const [view,    setView]    = useState(VIEWS.HOME);
  const [iq,      setIQ]      = useState(loadIQ);
  const [history, setHistory] = useState(loadHistory);
  const [runData, setRunData] = useState(null);

  function startRun() {
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

  return (
    <div className="app-root scanlines crt-vignette">
      {view === VIEWS.HOME && (
        <HomeScreen
          iq={iq}
          history={history}
          onStart={startRun}
        />
      )}
      {view === VIEWS.GAME && (
        <AtBatScreen
          initialIQ={iq}
          difficulty="pro"
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
