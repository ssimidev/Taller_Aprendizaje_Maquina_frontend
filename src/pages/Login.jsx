import { useState } from "react";
import API from "../api/api";
import "../styles/global.css";

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");

  async function login() {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        window.location.href = "/form";
      } else {
        alert("Error: el servidor no devolvió token");
      }
    } catch (err) {
      alert("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Iniciar sesión</h2>

        <label>Usuario</label>
        <input onChange={(e) => setUser(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" onChange={(e) => setPass(e.target.value)} />

        <button className="button" onClick={login}>Ingresar</button>
      </div>
    </div>
  );
}
