import { useEffect, useState } from "react";
import Gauge from "../components/Gauge";
import ShapCard from "../components/ShapCard";
import API from "../api/api";

export default function Dashboard() {
  const [data] = useState(JSON.parse(localStorage.getItem("result")));
  const [recos, setRecos] = useState([]);

  useEffect(() => {
    API.post("/recommendations", data.prediction).then((res) =>
      setRecos(res.data.suggestions)
    );
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Resultado de Predicción</h2>
        <Gauge value={data.prediction} />
      </div>

      <ShapCard shap={data.shap_values} />

      <div className="card">
        <h3>Recomendaciones</h3>
        <ul>
          {recos.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
