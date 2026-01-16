import React, { useState, useEffect } from "react";

// ---------------- MOCK DATA ----------------
const MONSTERS = [
  { id: "ymir30", name: "Ymir", level: 30, troop: "Cavalry", debuffs: "Def Down", difficulty: "Medium" },
  { id: "cerb35", name: "Cerberus", level: 35, troop: "Mounted + Ranged", debuffs: "Atk Down", difficulty: "Hard" },
];

// ---------------- APP ----------------
export default function App() {
  const [tab, setTab] = useState("home");
  const [mode, setMode] = useState("casual");
  const [alliances, setAlliances] = useState([]);
  const [activeAlliance, setActiveAlliance] = useState(null);
  const [rallies, setRallies] = useState([]);

  const createAlliance = (name) => {
    const a = { id: Date.now(), name };
    setAlliances([a]);
    setActiveAlliance(a);
  };

  const addRally = (rally) => {
    setRallies([rally, ...rallies]);
    setTab("home");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-neutral-800">
        <h1 className="font-bold">Evony Rally Planner</h1>
        <button
          className={`px-3 py-1 rounded ${mode === "casual" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setMode(mode === "casual" ? "hardcore" : "casual")}
        >
          {mode}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {tab === "home" && <Home rallies={rallies} />}
        {tab === "create" && <CreateRally onCreate={addRally} mode={mode} />}
        {tab === "monsters" && <Monsters mode={mode} />}
        {tab === "alliance" && (
          <Alliance
            alliances={alliances}
            active={activeAlliance}
            onCreate={createAlliance}
          />
        )}
      </main>

      <nav className="flex justify-around border-t border-neutral-800 p-2">
        {["home", "create", "monsters", "alliance"].map((t) => (
          <button
            key={t}
            className={tab === t ? "text-blue-400" : "text-neutral-400"}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ---------------- SCREENS ----------------
function Home({ rallies }) {
  return (
    <div>
      <h2 className="font-semibold mb-3">Upcoming Rallies</h2>
      {rallies.length === 0 && <p className="text-neutral-400">No rallies scheduled</p>}
      {rallies.map((r) => (
        <div key={r.id} className="bg-neutral-800 p-3 rounded mb-2">
          <div className="font-semibold">Lv{r.monster.level} {r.monster.name}</div>
          <div className="text-sm">{r.size}-man | Launch {r.launch}</div>
          <div className="text-xs text-neutral-400">Recommended: {r.monster.troop}</div>
        </div>
      ))}
    </div>
  );
}

function CreateRally({ onCreate, mode }) {
  const [monster, setMonster] = useState(MONSTERS[0]);
  const [size, setSize] = useState(20);
  const [launch, setLaunch] = useState(5);

  const submit = () => {
    onCreate({
      id: Date.now(),
      monster,
      size,
      launch: `${launch} min`,
      mode,
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Create Rally</h2>
      <select className="w-full p-2 bg-neutral-800" onChange={(e)=>setMonster(MONSTERS.find(m=>m.id===e.target.value))}>
        {MONSTERS.map(m=> <option key={m.id} value={m.id}>Lv{m.level} {m.name}</option>)}
      </select>
      <select className="w-full p-2 bg-neutral-800" value={size} onChange={(e)=>setSize(+e.target.value)}>
        {[5,10,20,25].map(s=> <option key={s}>{s}</option>)}
      </select>
      <input type="number" className="w-full p-2 bg-neutral-800" value={launch} onChange={(e)=>setLaunch(+e.target.value)} />
      <button className="w-full bg-blue-600 p-2 rounded" onClick={submit}>Create</button>
      {mode === "hardcore" && <p className="text-xs text-red-400">Hardcore assumptions enabled</p>}
    </div>
  );
}

function Monsters({ mode }) {
  return (
    <div>
      <h2 className="font-semibold mb-3">Monster Intelligence</h2>
      {MONSTERS.map(m => (
        <div key={m.id} className="bg-neutral-800 p-3 rounded mb-2">
          <div className="font-semibold">Lv{m.level} {m.name}</div>
          <div className="text-sm">Recommended: {m.troop}</div>
          {mode === "hardcore" && (
            <div className="text-xs text-neutral-400">Debuffs: {m.debuffs} | Difficulty: {m.difficulty}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function Alliance({ alliances, active, onCreate }) {
  const [name, setName] = useState("");

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Alliance</h2>
      {!active && (
        <>
          <input className="w-full p-2 bg-neutral-800" placeholder="Alliance name" value={name} onChange={(e)=>setName(e.target.value)} />
          <button className="w-full bg-green-600 p-2" onClick={()=>onCreate(name)}>Create Alliance</button>
        </>
      )}
      {active && <p className="text-green-400">Active Alliance: {active.name}</p>}
    </div>
  );
}
