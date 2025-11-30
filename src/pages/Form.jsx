import { useEffect, useState } from "react";
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
    "Sleep Disorder": "None",
  });


  useEffect(() => {
    localStorage.removeItem("result");
  }, []);


  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function sendData() {
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
    <div className="min-h-screen bg-[#0A0F1C] text-white flex justify-center items-center px-6 py-10 font-display">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Hábitos Diarios</h1>
          <p className="text-white/60">Completa tu información para analizar tu calidad de sueño.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 text-white/80">Género</label>
            <select
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2"
              value={form.Gender}
              onChange={(e) => updateField("Gender", e.target.value)}
            >
              <option value="Male">Hombre</option>
              <option value="Female">Mujer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-white/80">Ocupación</label>
            <select
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2"
              value={form.Occupation}
              onChange={(e) => updateField("Occupation", e.target.value)}
            >
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
              <option>Fonoaudiólogo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Categoría BMI</label>
            <select
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2"
              value={form["BMI Category"]}
              onChange={(e) => updateField("BMI Category", e.target.value)}
            >
              <option>Normal</option>
              <option>Sobrepeso</option>
              <option>Obesidad</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Presión sanguínea</label>
            <select
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2"
              value={form["Blood Pressure"]}
              onChange={(e) => updateField("Blood Pressure", e.target.value)}
            >
              <option>120/80</option>
              <option>130/90</option>
              <option>140/95</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-white/80">Trastorno del sueño</label>
            <select
              className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2"
              value={form["Sleep Disorder"]}
              onChange={(e) => updateField("Sleep Disorder", e.target.value)}
            >
              <option value="None">Ninguno</option>
              <option value="Insomnia">Insomnio</option>
              <option value="Sleep Apnea">Apnea del Sueño</option>
            </select>
          </div>
          {[
            ["Edad", "Age", 10, 80],
            ["Duración del sueño (hrs)", "Sleep Duration", 1, 12],
            ["Actividad física", "Physical Activity Level", 1, 100],
            ["Nivel de estrés", "Stress Level", 1, 10],
            ["Frecuencia cardiaca", "Heart Rate", 40, 120],
            ["Pasos diarios", "Daily Steps", 100, 20000],
          ].map(([label, key, min, max]) => (
            <div key={key} className="md:col-span-2">
              <label className="block text-sm text-white/80 mb-1">
                {label}: {form[key]}
              </label>
              <input
                type="range"
                min={min}
                max={max}
                value={form[key]}
                onChange={(e) => updateField(key, Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={sendData}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition rounded-xl font-semibold text-white"
        >
          Predecir Calidad del Sueño
        </button>
      </div>
    </div>
  );
}
