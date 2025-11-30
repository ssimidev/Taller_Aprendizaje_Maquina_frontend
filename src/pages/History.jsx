import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../api/api";
import ExcelJS from "exceljs";

export default function History() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    API.get("/users/history")
      .then((res) => {
        setItems(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Error loading history:", err));
  }, []);

  useEffect(() => {
    const f = items.filter((i) => {
      const text = search.toLowerCase();
      return (
        i.prediction_value.toString().toLowerCase().includes(text) ||
        i.timestamp.toLowerCase().includes(text)
      );
    });
    setFiltered(f);
    setPage(1);
  }, [search, items]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  function openDetails(item) {
    setSelected(item);
  }

  function closeModal() {
    setSelected(null);
  }

  function mapQuality(score) {
    if (score < 4)
      return {
        label: "Mala",
        container: "bg-red-500/20 text-red-400",
        dot: "bg-red-500",
      };

    if (score < 7)
      return {
        label: "Buena",
        container: "bg-blue-500/20 text-blue-400",
        dot: "bg-blue-500",
      };

    return {
      label: "Excelente",
      container: "bg-green-500/20 text-green-400",
      dot: "bg-green-500",
    };
  }

  async function exportExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Historial");

    sheet.columns = [
      { header: "Fecha", key: "date", width: 25 },
      { header: "Calidad", key: "quality", width: 15 },
      { header: "Duración", key: "duration", width: 15 },
      { header: "Estrés", key: "stress", width: 10 },
      { header: "Actividad Física", key: "activity", width: 18 },
    ];

    filtered.forEach((h) => {
      const f = h.features ? JSON.parse(h.features) : {};
      const q = mapQuality(h.prediction_value);

      sheet.addRow({
        date: new Date(h.timestamp).toLocaleString(),
        quality: q.label,
        duration: f["Sleep Duration"] ?? "—",
        stress: f["Stress Level"] ?? "—",
        activity: f["Physical Activity Level"] ?? "—",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "historial_Personal.xlsx";
    a.click();

    URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "Descargado",
      text: "Archivo Excel generado",
      background: "#0A0F1C",
      color: "white",
    });
  }

  function handleLogout() {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión será cerrada y se limpiarán los datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar",
      background: "#0A0F1C",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });
  }

  return (
    <div className="font-display min-h-screen bg-[#0A0F1C] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-500/20 rounded-full text-blue-400">
            <span className="material-symbols-outlined text-3xl">history</span>
          </div>
          <h2 className="text-xl font-bold">Sleep Quality</h2>
        </div>

        <nav className="hidden md:flex gap-8 text-sm">
          <a href="/dashboard" className="text-gray-400 hover:text-white">
            Inicio
          </a>
          <a href="/form" className="text-gray-400 hover:text-white">
            Nuevo Análisis
          </a>
          <a className="text-blue-400 font-medium">Historial</a>
          <a href="/admin" className="text-gray-400 hover:text-white">
            Configuración
          </a>
           <a href="/adminUser" className="text-gray-400 hover:text-white">Usuarios</a>
        </nav>

        <button
          onClick={handleLogout}
          className="h-10 w-10 flex items-center justify-center rounded-full
          bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 transition"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
        </button>
      </header>

      <main className="flex flex-col gap-8 p-6 max-w-[1280px] mx-auto w-full">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Historial de Predicciones</h1>
            <p className="text-gray-400"></p>
          </div>

          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
          >
            Descargar Excel
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por fecha o calidad..."
          className="w-full md:w-72 px-4 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-[#111827] border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Registros</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3">Calidad</th>
                  <th className="pb-3">Duración</th>
                  <th className="pb-3">Estrés</th>
                  <th className="pb-3">Actividad</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No hay resultados.
                    </td>
                  </tr>
                )}

                {paginated.map((h) => {
                  const features = h.features ? JSON.parse(h.features) : {};
                  const quality = mapQuality(h.prediction_value);

                  return (
                    <tr key={h.id} className="text-sm">
                      <td className="py-3">
                        {new Date(h.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${quality.container}`}
                        >
                          <span className={`size-2 rounded-full ${quality.dot}`} />
                          {quality.label}
                        </span>
                      </td>

                      <td className="py-3">
                        {features["Sleep Duration"] ?? "—"} hrs
                      </td>

                      <td className="py-3">{features["Stress Level"] ?? "—"}</td>

                      <td className="py-3">
                        {features["Physical Activity Level"] ?? "—"}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() => openDetails(h)}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-400">
              Página {page} de {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-700/40 disabled:opacity-40 rounded-lg"
              >
                ←
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-700/40 disabled:opacity-40 rounded-lg"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <DetailsModal item={selected} close={closeModal} />
      )}
    </div>
  );
}

function DetailsModal({ item, close }) {
  const f = JSON.parse(item.features || "{}");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 w-[90%] max-w-lg shadow-xl animate-fadeIn">

        <h2 className="text-2xl font-bold mb-4">Detalles del Análisis</h2>

        <p className="text-gray-300 mb-2">
          <b>Fecha:</b> {new Date(item.timestamp).toLocaleString()}
        </p>

        <p className="text-gray-300 mb-2">
          <b>Predicción:</b> {item.prediction_value}
        </p>

        <p className="text-gray-300 mb-2">
          <b>Duración:</b> {f["Sleep Duration"] ?? "—"} hrs
        </p>

        <p className="text-gray-300 mb-2">
          <b>Estrés:</b> {f["Stress Level"] ?? "—"}
        </p>

        <p className="text-gray-300 mb-2">
          <b>Actividad:</b> {f["Physical Activity Level"] ?? "—"}
        </p>

        <p className="text-gray-300 mb-2">
          <b>Trastorno:</b> {f["Sleep Disorder"] ?? "Ninguno"}
        </p>

        <button
          onClick={close}
          className="mt-6 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
