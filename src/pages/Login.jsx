import { useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function login() {
    try {
      if (!email || !password) {
        Swal.fire({
          title: "Campos incompletos",
          text: "Ingresa usuario y contraseña.",
          icon: "warning",
          background: "#0A0F1C",
          color: "white",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      const res = await API.post("/auth/login", {
        username: email,
        password,
      });

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("username", email);

        Swal.fire({
          title: "Bienvenido",
          text: "Inicio de sesión exitoso.",
          icon: "success",
          background: "#0A0F1C",
          color: "white",
          timer: 1200,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.href = "/form";
        }, 1200);
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        icon: "error",
        background: "#0A0F1C",
        color: "white",
        confirmButtonColor: "#d33",
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    login();
  }

  return (
    <div id="login-wrapper">
      <div className="flex min-h-screen w-full font-display bg-[#0A0F1C]">

        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDu_u029nJnRuzX3SL5NBtl4AwmTNujJmjxfXOFdHQqrNEJM_XjRd8EXXPuIDOdXzbqSQzt1jVJIjVa6kxbkHNTt7fKVGONAdYmpP1BF-vwUqqGJ1GIciaLLrdKLL9DDHVrt228P7MaTHHoCypJlssBd3xrXC4kO-nCpvYpX5M6kmjcxoFNHbkq6HgaQXXKdvQLj5ACsr60dP-bG-Mg7UAaLbJWBYY04uaWqH-mhHPeixPCboPUXXzO0AxqWxrAov5wEF8DIfGWAfI')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

          <div className="relative z-10 text-center text-white px-10 max-w-xl">
            <h2 className="mb-4 text-5xl font-bold tracking-tight">
              Tu camino hacia un mejor descanso
            </h2>
            <p className="text-lg opacity-80">
              Monitorea, analiza y mejora la calidad de tu sueño con nuestras herramientas inteligentes.
            </p>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#0A0F1C] px-10">
          <div className="w-full max-w-md space-y-8">

            {/* LOGO */}
            <div className="flex flex-col text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 flex items-center justify-center bg-blue-500/10 rounded-full text-blue-500">
                  <span className="material-symbols-outlined text-3xl">nights_stay</span>
                </div>
                <span className="text-2xl font-bold">SleepQuality</span>
              </div>

              <h1 className="text-3xl font-bold">Bienvenido de nuevo</h1>
              <p className="mt-1 text-sm text-gray-400">
                Inicia sesión para continuar con tu viaje.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <label className="flex flex-col text-gray-300">
                <span className="pb-1 text-sm">Usuario</span>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    Person
                  </span>

                  <input
                    type="text"
                    placeholder="Usuario"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-[#111827] border border-gray-700 rounded-lg pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>
              <label className="flex flex-col text-gray-300">
                <span className="pb-1 text-sm">Contraseña</span>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    lock
                  </span>

                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full h-12 bg-[#111827] border border-gray-700 rounded-lg pl-10 pr-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    <span className="material-symbols-outlined">
                      {showPass ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              <div className="flex justify-end">
                <a className="text-sm text-blue-400 hover:underline" href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-semibold"
              >
                Iniciar Sesión
              </button>
            </form>

            <p className="text-center text-sm text-gray-400">
              ¿No tienes una cuenta?{" "}
              <a className="text-blue-400 hover:underline" href="#">
                Crear cuenta
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
