import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const emptyForm = {
    username: "",
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    role: "user",
    is_active: 1,
  };

  const [form, setForm] = useState(emptyForm);

  async function loadUsers() {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreateModal() {
    setForm(emptyForm);
    setEditingUser(null);
    setOpenModal(true);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email ?? "",
      name: user.name ?? "",
      age: user.age ?? "",
      gender: user.gender ?? "",
      role: user.role,
      is_active: user.is_active,
      password: "",
    });
    setOpenModal(true);
  }
  async function saveUser() {
    try {
      if (editingUser) {
        await API.put(`/users/${editingUser.id}`, form);

        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
      } else {
        const payload = { ...form };
        if (!payload.password) {
          return Swal.fire("Error", "La contraseña es obligatoria", "warning");
        }

        await API.post("/users", payload);

        Swal.fire("Creado", "Usuario creado correctamente", "success");
      }

      setOpenModal(false);
      loadUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el usuario", "error");
    }
  }
  function deleteUser(id) {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      background: "#0A0F1C",
      color: "white",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await API.delete(`/users/${id}`);
          loadUsers();
          Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  }

  function handleLogout() {
    Swal.fire({
      title: "Cerrar sesión",
      icon: "warning",
      showCancelButton: true,
      background: "#0A0F1C",
      color: "white",
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });
  }

  return (
    <div className="font-display bg-[#0A0F1C] text-white min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-blue-500/10 rounded-full text-blue-500">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
          <h2 className="text-xl font-bold">Sleep Quality</h2>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="/dashboard" className="text-gray-400 hover:text-white">Inicio</a>
          <a href="/history" className="text-gray-400 hover:text-white">Historial</a>
          <a href="/form" className="text-gray-400 hover:text-white">Nuevo Análisis</a>
          <a href="/admin" className="text-gray-400 hover:text-white">Configuración</a>
          <a className="text-blue-400 font-medium">Usuarios</a>
        </nav>

        <button
          onClick={handleLogout}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 transition"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
        </button>
      </header>
      <main className="p-6 max-w-[1280px] w-full mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black">Usuarios del Sistema</h1>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            + Agregar Usuario
          </button>
        </div>

        <div className="bg-[#111827] border border-gray-700 rounded-xl p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="pb-3">Usuario</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Rol</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="text-sm">
                  <td className="py-3">{u.username}</td>
                  <td className="py-3">{u.email ?? "—"}</td>
                  <td className="py-3">{u.name ?? "—"}</td>
                  <td className="py-3">{u.role}</td>
                  <td className="py-3">
                    {u.is_active ? (
                      <span className="text-green-400">Activo</span>
                    ) : (
                      <span className="text-red-400">Inactivo</span>
                    )}
                  </td>

                  <td className="py-3 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(u)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Editar
                    </button>

                    {u.role !== "admin" && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Editar Usuario" : "Agregar Usuario"}
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <Input label="Usuario" value={form.username}
                onChange={(v) => setForm({ ...form, username: v })} />

              <Input label="Email" value={form.email}
                onChange={(v) => setForm({ ...form, email: v })} />

              {!editingUser && (
                <Input label="Contraseña" type="password" value={form.password}
                  onChange={(v) => setForm({ ...form, password: v })} />
              )}

              <Input label="Nombre" value={form.name}
                onChange={(v) => setForm({ ...form, name: v })} />

              <Input label="Edad" type="number" value={form.age}
                onChange={(v) => setForm({ ...form, age: v })} />

              <Select label="Género" value={form.gender}
                onChange={(v) => setForm({ ...form, gender: v })}
                options={["Masculino", "Femenino", "Otro"]} />

              <Select label="Rol" value={form.role}
                onChange={(v) => setForm({ ...form, role: v })}
                options={["user", "admin"]} />

              <Select label="Estado" value={form.is_active}
                onChange={(v) => setForm({ ...form, is_active: Number(v) })}
                options={[
                  { value: 1, label: "Activo" },
                  { value: 0, label: "Inactivo" },
                ]}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={saveUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="flex flex-col text-sm">
      <span className="mb-1 text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0A0F1C] border border-gray-700 rounded-lg px-3 py-2 text-white"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col text-sm">
      <span className="mb-1 text-gray-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0A0F1C] border border-gray-700 rounded-lg px-3 py-2 text-white"
      >
        <option value="">Seleccionar...</option>

        {options.map((o, i) => {
          if (typeof o === "string") {
            return (
              <option key={i} value={o}>
                {o}
              </option>
            );
          }
          return (
            <option key={i} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
