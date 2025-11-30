import { useEffect, useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";

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

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  });
}


export default function Settings() {
  const [user, setUser] = useState({});
  const [newData, setNewData] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });

  useEffect(() => {
    API.get("/users/me")
      .then((res) => {
        setUser(res.data);
        setNewData({
          username: res.data.username,
          email: res.data.email ?? "",
        });
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
      });
  }, []);

  function updateProfile() {
    API.put("/users/update", newData)
      .then(() =>
        Swal.fire("Actualizado", "Datos guardados correctamente", "success")
      )
      .catch(() =>
        Swal.fire("Error", "No se pudo actualizar el perfil", "error")
      );
  }

  function changePassword() {
    if (!passwords.old_password || !passwords.new_password) {
      return Swal.fire("Error", "Llena ambos campos", "warning");
    }

    API.put("/users/change-password", passwords)
      .then(() =>
        Swal.fire("Contraseña Actualizada", "Tu nueva contraseña ha sido guardada.", "success")
      )
      .catch(() =>
        Swal.fire("Error", "Contraseña incorrecta", "error")
      );
  }

  function clearHistory() {
    Swal.fire({
      title: "¿Eliminar historial?",
      text: "Se borrarán todas tus predicciones almacenadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      background: "#0A0F1C",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete("/users/history").then(() =>
          Swal.fire("Eliminado", "Historial borrado exitosamente", "success")
        );
      }
    });
  }

  function deleteAccount() {
    Swal.fire({
      title: "¿Eliminar cuenta?",
      text: "Esta acción no se puede deshacer.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar Cuenta",
      background: "#0A0F1C",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete("/users/delete-account").then(() => {
          Swal.fire("Cuenta Eliminada", "Lamentamos que te vayas.", "success");
          localStorage.clear();
          setTimeout(() => (window.location.href = "/login"), 1500);
        });
      }
    });
  }

  return (
    <div className="font-display min-h-screen bg-[#0A0F1C] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0F1C]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-500/10 rounded-full text-blue-500">
            <span className="material-symbols-outlined text-3xl">settings</span>
          </div>
          <h2 className="text-xl font-bold">Sleep Quality</h2>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="/dashboard" className="text-gray-400 hover:text-white">Inicio</a>
          <a className="text-blue-400 font-medium">Configuración</a>
           <a href="/adminUser" className="text-gray-400 hover:text-white">Usuarios</a>
        </nav>

        <button
          onClick={handleLogout}
          className="h-10 w-10 flex items-center justify-center rounded-full
               bg-red-500/10 text-red-400 border border-red-500/40
               hover:bg-red-500/20 hover:text-red-300 transition"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
        </button>
      </header>

      <main className="p-6 max-w-[900px] mx-auto w-full flex flex-col gap-10">
        <section className="bg-[#111827] border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Información de Perfil</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-300">Nombre de usuario</label>
              <input
                type="text"
                className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg px-3 py-2 mt-1"
                value={newData.username}
                onChange={(e) => setNewData({ ...newData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Correo electrónico</label>
              <input
                type="email"
                className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg px-3 py-2 mt-1"
                value={newData.email}
                onChange={(e) => setNewData({ ...newData, email: e.target.value })}
              />
            </div>

          </div>

          <button
            onClick={updateProfile}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            Guardar Cambios
          </button>
        </section>
        <section className="bg-[#111827] border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-300">Contraseña actual</label>
              <input
                type="password"
                className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg px-3 py-2 mt-1"
                onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Nueva contraseña</label>
              <input
                type="password"
                className="w-full bg-[#0A0F1C] border border-gray-700 rounded-lg px-3 py-2 mt-1"
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
              />
            </div>

          </div>

          <button
            onClick={changePassword}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Actualizar Contraseña
          </button>
        </section>

        <section className="bg-red-900/20 border border-red-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-3">¡Importante!</h3>

          <button
            onClick={clearHistory}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Eliminar Historial
          </button>

          <button
            onClick={deleteAccount}
            className="w-full px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 transition"
          >
            Eliminar Cuenta Permanentemente
          </button>
        </section>

      </main>
    </div>
  );
}
