import React from "react";
import "../assets/styles/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);
  const [showError, setShowError] = useState(false);
  const ip = 'localhost'

  const inicioSesion = (event) => {
    event.preventDefault();
    console.log(email);
    console.log(password);
    console.log(rememberme);
    if (email === "admin@admin.com") {
      if (password === "123") {
        console.log("ADMIN");
        navigate("/inicio");
        localStorage.setItem("isAdmin", 1);
      } else {
        console.log("ERROR");
        setShowError(true);
      }
    } else {
      console.log("USER");
      let inicioExitoso = false;
      const url = `http://${ip}:5000/login`;
      let data = { email: email, password: password, rememberme: rememberme };
      const fetchData = async () => {
        fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .catch((error) => console.error("Error:", error))
          .then((res) => {
            console.log("res: ", res);
            inicioExitoso = res.exito; // true o false
          });
      };
      fetchData();

      if (inicioExitoso) {
        navigate("/inicio");
        localStorage.setItem("isAdmin", 0);
      } else {
        console.log("ERROR");
        setShowError(true);
      }
    }
  };

  const mostrarError = (event) => {
    return (
      <div className="alert alert-dismissible alert-danger">
        <strong>Oh no!</strong> Parece ser que te has equivocado de correo o
        contraseña. Por favor, vuelve a intentarlo.
      </div>
    );
  };

  return (
    <div className="mainlogin">
    {showError && mostrarError()}
      <main class="form-signin w-100 m-auto">
        <form onSubmit={inicioSesion}>
          <img
            class="mb-4 logo"
            src="https://www.nodoughmusic.com/music/wp-content/uploads/2013/06/SoundStreanMotion.jpg"
            alt=""
            width="200"
            height="200"
          />
          <h1 class="h3 mb-3 fw-normal">Unicio de Sesión</h1>

          <div class="form-floating">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(event) => setEmail(event.target.value)}
            />
            <label for="floatingInput">Correo electronico</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <label for="floatingPassword">Contraseña</label>
          </div>

          <div class="form-check text-start my-3">
            <input
              class="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
              onChange={(event) => setRememberme(event.target.checked)}
            />
            <label class="form-check-label" for="flexCheckDefault">
              Recordarme
            </label>
          </div>
          <button class="btn btn-primary w-100 py-2" type="submit">
            Iniciar sesión
          </button>
          <br />
          <br />
          <br />
          <br />
          <p class="mt-5 mb-3 text-body-secondary">&copy; Grupo 9</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
