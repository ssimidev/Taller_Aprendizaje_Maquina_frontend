import { useState } from "react";
import API from "../api/api";

export default function Form() {
  const [form, setForm] = useState({
    "Person ID": 1,

    Gender: "Male",
    Age: 30,
    Occupation: "Engineer",

    "Sleep Duration": 7,
    "Physical Activity Level": 50,
    "Stress Level": 5,
    "Heart Rate": 70,
    "Daily Steps": 4000,

    "BMI Category": "Normal",
    "Blood Pressure": "120/80",

    // IMPORTANTE: El modelo entrenado usaba Sleep Disorder como feature
    "Sleep Disorder": "None",
  });

  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function sendData() {
  console.log("Enviando formulario:", form);

  try {
    const res = await API.post("/predict", form);
    localStorage.setItem("result", JSON.stringify(res.data));
    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err);
    alert("Error al predecir");
  }
}

  return (
    <div className="container">
      <div className="card">
        <h2>Hábitos diarios</h2>

        {/* Gender */}
        <label>Género</label>
        <select value={form.Gender}
          onChange={(e) => updateField("Gender", e.target.value)}>
          <option value="Male">Hombre</option>
          <option value="Female">Mujer</option>
        </select>

        {/* Occupation */}
        <label>Ocupación</label>
        <select value={form.Occupation}
          onChange={(e) => updateField("Occupation", e.target.value)}>
          <option>Ingeniero</option>
        <option>Médico</option>
        <option>Enfermero</option>
        <option>Profesor</option>
        <option>Abogado</option>
        <option>Contador Auditor</option>
        <option>Técnico en Enfermería (TENS)</option>
        <option>Paramédico</option>
        <option>Estudiante</option>
        <option>Administrativo</option>
        <option>Secretaria</option>
        <option>Carabinero</option>
        <option>Bombero</option>
        <option>Comerciante</option>
        <option>Vendedor</option>
        <option>Operario</option>
        <option>Soldador</option>
        <option>Electricista</option>
        <option>Gasfiter</option>
        <option>Chofer</option>
        <option>Transportista</option>
        <option>Constructor</option>
        <option>Maestro de Obra</option>
        <option>Jardinero</option>
        <option>Agricultor</option>
        <option>Panadero</option>
        <option>Cocinero</option>
        <option>Garzón</option>
        <option>Cajero</option>
        <option>Supervisor</option>
        <option>Analista</option>
        <option>Técnico Informático</option>
        <option>Desarrollador</option>
        <option>Diseñador Gráfico</option>
        <option>Arquitecto</option>
        <option>Psicólogo</option>
        <option>Fonoaudi</option>
                </select>

        {/* BMI Category */}
        <label>Categoría BMI</label>
        <select value={form["BMI Category"]}
          onChange={(e) => updateField("BMI Category", e.target.value)}>
          <option>Normal</option>
          <option>Sobrepeso</option>
          <option>Obesidad</option>
        </select>

        {/* Blood Pressure */}
        <label>Presión sanguínea</label>
        <select value={form["Blood Pressure"]}
          onChange={(e) => updateField("Blood Pressure", e.target.value)}>
          <option>120/80</option>
          <option>130/90</option>
          <option>140/95</option>
        </select>

        {/* Sleep Disorder */}
        <label>Trastorno del sueño</label>
        <select value={form["Sleep Disorder"]}
          onChange={(e) => updateField("Sleep Disorder", e.target.value)}>
          <option>Ninguno</option>
          <option>Insomnio</option>
          <option>Apnea del Sueño</option>
        </select>

        {/* SLIDERS NUMÉRICOS */}
        <label>Edad: {form.Age}</label>
        <input type="range" min="10" max="80" value={form.Age}
          onChange={(e) => updateField("Age", Number(e.target.value))} />

        <label>Duración del sueño (hrs): {form["Sleep Duration"]}</label>
        <input type="range" min="1" max="12" value={form["Sleep Duration"]}
          onChange={(e) => updateField("Sleep Duration", Number(e.target.value))} />

        <label>Actividad física: {form["Physical Activity Level"]}</label>
        <input type="range" min="1" max="100" value={form["Physical Activity Level"]}
          onChange={(e) => updateField("Physical Activity Level", Number(e.target.value))} />

        <label>Nivel de estrés: {form["Stress Level"]}</label>
        <input type="range" min="1" max="10" value={form["Stress Level"]}
          onChange={(e) => updateField("Stress Level", Number(e.target.value))} />

        <label>Frecuencia cardiaca: {form["Heart Rate"]}</label>
        <input type="range" min="40" max="120" value={form["Heart Rate"]}
          onChange={(e) => updateField("Heart Rate", Number(e.target.value))} />

        <label>Pasos diarios: {form["Daily Steps"]}</label>
        <input type="range" min="100" max="20000" value={form["Daily Steps"]}
          onChange={(e) => updateField("Daily Steps", Number(e.target.value))} />

        <button className="button" onClick={sendData}>Predecir</button>
      </div>
    </div>
  );
}
