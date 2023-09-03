import { useState, useRef } from "react";
import photo_default from "../images/registro_default.webp";
import "../assets/styles/RegistroUsuario.css"; // Importa el archivo CSS

function RegistroUsuario() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [foto, setFoto] = useState(photo_default); // Para subir la foto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [showError, setShowError] = useState(false);
  const fileInputRef = useRef(null);
  const registrarUsuario = (event) => {
    event.preventDefault();

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setShowError(true);
      alert("Error! Las contraseñas no coinciden.");
      return;
    }
    window.location.href = "http://localhost:3000/inicio";
    setShowError(false);
  };

  const mostrarError = () => {
    if (showError) {
      // Agrega aquí el código para mostrar un mensaje de error o validación al usuario si es necesario.
    }
  };

  const handleAgregarImagenClick = () => {
    // Abre el explorador de archivos cuando el usuario hace clic en el botón.
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Aquí puedes procesar el archivo seleccionado (por ejemplo, cargarlo y mostrarlo como imagen de perfil).

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFoto(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="registroUsuario">
      {showError && mostrarError()}
      <main className="form-signin w-100 m-auto">
        <div className="profile-picture-container">
          <h1 className="h3 mb-3 fw-normal">Registro de Usuario</h1>

          <img
            className="profile-picture bigger"
            src={foto}
            alt="Foto de Perfil"
          />
          <button className="add-button" onClick={handleAgregarImagenClick}>
            +
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </div>
        <br />
        <form onSubmit={registrarUsuario}>
          <div className="container-form">
            <div className="form-floating input-container">
              <input
                type="text"
                className="form-control"
                id="nombres"
                placeholder="Nombres"
                onChange={(event) => setNombres(event.target.value)}
                value={nombres}
                required
              />
              <label htmlFor="nombres">Nombres</label>
            </div>

            <div className="form-floating input-container">
              <input
                type="text"
                className="form-control"
                id="apellidos"
                placeholder="Apellidos"
                onChange={(event) => setApellidos(event.target.value)}
                value={apellidos}
                required
              />
              <label htmlFor="apellidos">Apellidos</label>
            </div>
            <div className="form-floating input-container">
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                placeholder="Fecha de Nacimiento"
                onChange={(event) => setFechaNacimiento(event.target.value)}
                value={fechaNacimiento}
                required
              />
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            </div>

            <div className="form-floating input-container">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                required
              />
              <label htmlFor="email">Correo Electrónico</label>
            </div>
            <div className="form-floating input-container">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Contraseña"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                required
              />
              <label htmlFor="password">Contraseña</label>
            </div>

            <div className="form-floating input-container">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirmar Contraseña"
                onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword}
                required
              />
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            </div>
            <button
              className="btn btn-primary w-100 py-2 animated-button"
              type="submit"
            >
              Registrarse
            </button>
            <p className="mt-5 mb-3 text-body-secondary">&copy; Grupo 9</p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default RegistroUsuario;
