import React, { useState, useRef } from 'react';
import '../assets/styles/Perfil.css'; // Importa el archivo CSS
import Navegacion from "../components/Navegacion";
import logo from "../logo.svg"

function Perfil() {
  const [nombre, setNombre] = useState('JohnXD');
  const [apellido, setApellido] = useState('Doe');
  const [fotoPerfil, setFotoPerfil] = useState(logo);
  const [correoElectronico, setCorreoElectronico] = useState('john@example.com');
  const [contrasena, setContrasena] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const ip = "localhost";
  const fileInputRef = useRef(null);
  console.log("PERFIL");
    let inicioExitoso = false;
    const url = `http://${ip}:5000/perfil`;
    let data = { nombre: nombre, apellido:apellido, contrasena: contrasena, correoElectronico: correoElectronico };
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
    //fetchData();

  const handleModificarDatosClick = () => {
    setModoEdicion(true);
  };

  const handleGuardarDatosClick = () => {
    // Aquí puedes implementar la lógica para guardar los datos y verificar la contraseña.
    const contrasenaCorrecta = true; // Cambia esto según tu lógica de autenticación.

    if (contrasenaCorrecta) {
      setModoEdicion(false);
    } else {
      alert('Contraseña incorrecta. No se guardaron los datos.');
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Aquí puedes procesar el archivo seleccionado (por ejemplo, cargarlo y mostrarlo como imagen de perfil).

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFotoPerfil(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleAgregarImagenClick = () => {
    // Abre el explorador de archivos cuando el usuario hace clic en el botón.
    fileInputRef.current.click();
  };

  return (
    <main>
        <Navegacion/>
    <div className="contenedor">
      <h1>Perfil de Usuario</h1>
      {modoEdicion ? (
        <div className="form-contenedor">
        <div className="profile-picture-contenedor">
          <img className="profile-picture bigger" src={fotoPerfil} alt="Foto de Perfil" />
          <button className="add-button" onClick={handleAgregarImagenClick}>+</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>
          <div className="form-fields">
            <div className="editable-field">
              <label>Nombre:</label>
              <input
                className="input-field"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="editable-field">
              <label>Apellido:</label>
              <input
                className="input-field"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="editable-field">
              <label>Correo Electrónico:</label>
              <input
                className="input-field"
                type="email"
                value={correoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </div>
            <div className="editable-field">
              <label>Contraseña:</label>
              <input
                className="input-field"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
            <button className="button" onClick={handleGuardarDatosClick}>Guardar Datos</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="profile-photo">
            <img className="profile-picture bigger" src={fotoPerfil} alt="Foto de Perfil" />
          </div>
          <div className="user-info">
            <div className="user-info-row">
              <label>Nombre:</label>
              <span>{nombre}</span>
            </div>
            <div className="user-info-row">
              <label>Apellido:</label>
              <span>{apellido}</span>
            </div>
            <div className="user-info-row">
              <label>Correo Electrónico:</label>
              <span>{correoElectronico}</span>
            </div>
          </div>
          <button className="button" onClick={handleModificarDatosClick}>Modificar Datos</button>
        </div>
      )}
    </div>
    </main>
  );
}

export default Perfil;
