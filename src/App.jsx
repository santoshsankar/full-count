import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import ScenarioRun from "./components/ScenarioRun";
import RunSummary from "./components/RunSummary";
import scenarios from "./data/scenarios";
import { loadIQ, saveIQ, loadHistory, saveRunToHistory, selectRunScenarios } from "./utils/scoring";
import "./App.css";

const SCREENS = { HOME: "home", RUN: "run", SUMMARY: "summary" };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [iq, setIQ] = useState(loadIQ);
  const [history, setHistory] = useState(loadHistory);
  const [runScenarios, setRunScenarios] = useState([]);
  const [summary, setSummary] = useState(null);
  const [runStartIQ, setRunStartIQ] = useState(iq);

  function startRun() {
    const selected = selectRunScenarios(scenarios);
    setRunScenarios(selected);
    setRunStartIQ(iq);
    setScreen(SCREENS.RUN);
  }

  function handleRunComplete(runSummary, finalIQ) {
    saveIQ(finalIQ);
    saveRunToHistory(runSummary);
    setIQ(finalIQ);
    setHistory(loadHistory());
    setSummary(runSummary);
    setScreen(SCREENS.SUMMARY);
  }

  function handleHome() {
    setScreen(SCREENS.HOME);
  }

  return (
    <div className="app-root">
      {screen === SCREENS.HOME && (
        <HomeScreen iq={iq} history={history} onStart={startRun} />
      )}
      {screen === SCREENS.RUN && (
        <ScenarioRun
          scenarios={runScenarios}
          startIQ={runStartIQ}
          onComplete={handleRunComplete}
        />
      )}
      {screen === SCREENS.SUMMARY && summary && (
        <RunSummary
          summary={summary}
          onRunItBack={startRun}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
