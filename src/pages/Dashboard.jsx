// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../api/api";

function handleLogout() {
  Swal.fire({
    title: "¿Cerrar sesión?",
    text: "Tu sesión será cerrada y se limpiarán los datos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, cerrar",
    cancelButtonText: "Cancelar",
    background: "#0A0F1C",
    color: "white",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire({
        title: "Cerrado",
        text: "Has cerrado sesión exitosamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0A0F1C",
        color: "white",
      });
      setTimeout(() => (window.location.href = "/login"), 1500);
    }
  });
}

export default function Dashboard() {
  const username = localStorage.getItem("username") || "Usuario";

  const [stats, setStats] = useState(null);
  const [recos, setRecos] = useState([]);
  const [result, setResult] = useState(null);


  useEffect(() => {
    API.get("/metrics/stats?user_id=1")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error stats:", err));
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("result"));
    if (stored) {
      stored.label = mapPrediction(stored.prediction);
      setResult(stored);
    }
  }, []);
  useEffect(() => { const result = JSON.parse(localStorage.getItem("result")); if (!result?.prediction) 
    return; const payload = { prediction: mapPrediction(result.prediction), StressLevel: result?.StressLevel ?? 0, }; 
    API.post("/recommendations", payload).then((res) => setRecos(res.data.recommendations)).catch((err) => console.log("ERROR →", err.response?.data)); }, []); 
    function mapPrediction(score) { if (score < 4) 
      return "Insomnia"; if (score < 7) 
        return "Sleep Apnea"; 
    return "Normal"; }

  if (!stats || !result) {
    return (
      <div className="text-white text-center mt-20">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="font-display min-h-screen bg-[#0A0F1C] text-white flex flex-col">

      <HeaderBar />

      <main className="flex flex-col gap-8 p-6 max-w-[1280px] mx-auto w-full">

        <DashboardHeader username={username} />

        {/* --- Resultado del modelo --- */}
        <PredictionSummary result={result} />

        {/* --- SHAP: Interpretación + Chart --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShapInsights
            shap_values={result.shap_values}
            feature_names={FEATURE_NAMES}
          />
          <ShapImpactChart
            shap_values={result.shap_values}
            feature_names={FEATURE_NAMES}
          />
        </div>

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TrendChart trend={stats.trend} />
          <div className="flex flex-col gap-6">
            <SleepStagesCard />
            <TipsCard />
          </div>
        </div>

        <Recommendations recos={recos} />
      </main>
    </div>
  );
}

const FEATURE_NAMES = [
  "ID de Persona",
  "Género",
  "Edad",
  "Ocupación",
  "Duración del Sueño (hrs)",
  "Actividad Física (%)",
  "Nivel de Estrés",
  "Categoría de BMI",
  "Presión Arterial",
  "Frecuencia Cardíaca",
  "Pasos Diarios",
  "Trastorno del Sueño"
];


function PredictionSummary({ result }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-2">Resultado del Análisis</h3>

      <p className="text-gray-300">
        Predicción numérica: <b>{Number(result.prediction).toFixed(2)}</b>
      </p>

      <p className="text-2xl font-bold mt-2">
        Calidad del sueño:
        <span className="text-blue-400 ml-2">{result.label}</span>
      </p>
    </div>
  );
}

/* ---------------- COMPONENTE: Gráfico SHAP ---------------- */
function ShapImpactChart({ shap_values, feature_names }) {
  const pairs = feature_names.map((name, i) => ({
    name,
    value: shap_values[i]
  }));

  const top = pairs
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 8);

  const maxVal = Math.max(...top.map(t => Math.abs(t.value)));

  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Impacto de cada variable</h3>

      <div className="space-y-3">
        {top.map((t, i) => {
          const width = (Math.abs(t.value) / maxVal) * 100;
          const color = t.value >= 0 ? "bg-green-500" : "bg-red-500";

          return (
            <div key={i}>
              <p className="text-sm mb-1 text-gray-300">{t.name}</p>
              <div className="h-3 bg-gray-700 rounded">
                <div
                  className={`h-3 ${color} rounded`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function ShapInsights({ shap_values, feature_names }) {
  const items = feature_names.map((f, i) => ({
    name: f,
    value: shap_values[i]
  }));

  const positives = items
    .filter(x => x.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const negatives = items
    .filter(x => x.value < 0)
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);

  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <h3 className="text-lg font-bold mb-3">Interpretación del Modelo</h3>

      <p className="text-green-400 font-semibold">✔ Factores que mejoran tu sueño:</p>
      <ul className="text-gray-300 mb-4">
        {positives.map((p, i) => (
          <li key={i}>• {p.name}</li>
        ))}
      </ul>

      <p className="text-red-400 font-semibold">✘ Factores que empeoran tu sueño:</p>
      <ul className="text-gray-300">
        {negatives.map((n, i) => (
          <li key={i}>• {n.name}</li>
        ))}
      </ul>
    </div>
  );
}


function HeaderBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0F1C]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center bg-blue-500/10 rounded-full text-blue-500">
          <span className="material-symbols-outlined text-3xl">nights_stay</span>
        </div>
        <h2 className="text-xl font-bold">Sleep Quality</h2>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm">
        <a className="text-blue-400 font-medium hover:text-blue-300">Inicio</a>
        <a href="/form" className="text-gray-400 hover:text-white">Nuevo Análisis</a>
        <a href="/history" className="text-gray-400 hover:text-white">Historial</a>
        <a href="/admin" className="text-gray-400 hover:text-white">Configuración</a>
        <a href="/adminUser" className="text-gray-400 hover:text-white">Usuarios</a>
      </nav>

      <button
        onClick={handleLogout}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 hover:text-red-300 transition"
      >
        <span className="material-symbols-outlined text-2xl">logout</span>
      </button>
    </header>
  );
}

function DashboardHeader({ username }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div>
        <p className="text-3xl font-black">Bienvenido, {username}</p>
        <p className="text-gray-400">Aquí tienes un resumen de tu descanso más reciente.</p>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm">
          Hoy
        </button>
        <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300">
          Últimos 7 días
        </button>
        <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300">
          Últimos 30 días
        </button>
      </div>
    </div>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Puntuación de Sueño" value={`${stats.sleep_score}/100`} change={`${stats.sleep_score_change}%`} red={stats.sleep_score_change < 0} />
      <StatCard title="Duración Total" value={stats.duration} change={`${stats.duration_change}%`} red={stats.duration_change < 0} />
      <StatCard title="Tiempo en Cama" value={stats.time_in_bed} change={`${stats.time_in_bed_change}%`} red={stats.time_in_bed_change < 0} />
      <StatCard title="Eficiencia" value={stats.efficiency} change={`${stats.efficiency_change}%`} red={stats.efficiency_change < 0} />
    </div>
  );
}

function StatCard({ title, value, change, red }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl flex flex-col gap-2">
      <p className="text-gray-300">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className={`${red ? "text-red-400" : "text-green-400"} text-sm`}>
        {change} vs ayer
      </p>
    </div>
  );
}

function TrendChart({ trend }) {
  const safeTrend = Array.isArray(trend) && trend.length === 7
    ? trend
    : [0, 0, 0, 0, 0, 0, 0];

  const maxY = Math.max(...safeTrend);
  const minY = Math.min(...safeTrend);
  const range = maxY - minY || 1;

  const points = safeTrend
    .map((v, i) => {
      const x = i * 60;
      const y = 150 - ((v - minY) / range) * 140;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="lg:col-span-2 bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-lg font-medium">Tendencia de Puntuación</p>
          <p className="text-gray-400 text-sm">Últimos 7 días</p>
        </div>
      </div>

      <svg width="100%" height="180">
        <polyline fill="none" stroke="#3B82F6" strokeWidth="3" points={points} />
      </svg>
    </div>
  );
}

function SleepStagesCard() {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <p className="text-lg font-medium mb-4">Fases del Sueño</p>
      <div className="flex items-center justify-center gap-6">
        <CircularGraph />

        <div className="flex flex-col gap-3">
          <Legend color="bg-teal-400" label="Ligero" value="3h 52m" />
          <Legend color="bg-blue-400" label="Profundo" value="1h 56m" />
          <Legend color="bg-purple-500" label="REM" value="1h 33m" />
        </div>
      </div>
    </div>
  );
}

function CircularGraph() {
  return (
    <div className="relative size-32">
      <svg viewBox="0 0 36 36" className="size-full">
        <path className="stroke-purple-500" d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" strokeWidth="3" strokeDasharray="20, 80" />
        <path className="stroke-teal-400" d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" strokeWidth="3" strokeDasharray="50, 50" strokeDashoffset="-20" />
        <path className="stroke-blue-400" d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" strokeWidth="3" strokeDasharray="25, 75" strokeDashoffset="-70" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">7h 45m</span>
        <span className="text-xs text-gray-400">Total</span>
      </div>
    </div>
  );
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-3 rounded-full ${color}`} />
      <span className="text-sm">{label}: {value}</span>
    </div>
  );
}

function TipsCard() {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-blue-400 text-2xl">
          tips_and_updates
        </span>
        <p className="text-lg font-medium">Consejo del Día</p>
      </div>

      <p className="text-gray-300 text-sm">
        Tu sueño REM fue un poco bajo. Intenta evitar pantallas 1 hora antes de dormir.
      </p>
    </div>
  );
}

function Recommendations({ recos }) {
  return (
    <div className="bg-[#111827] border border-gray-700 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Recomendaciones Personalizadas</h3>

      <ul className="space-y-3">
        {recos.map((r, i) => (
          <li key={i} className="bg-white/5 border border-gray-700 p-3 rounded-lg">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
