import { useEffect, useState } from "react";
import API from "../api/api";

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/users/history").then((res) => setItems(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Historial</h2>

      {items.map((h, i) => (
        <div className="card" key={i}>
          <p><b>Predicción:</b> {h.prediction_value}</p>
          <p><b>Fecha:</b> {h.timestamp}</p>
        </div>
      ))}
    </div>
  );
}
