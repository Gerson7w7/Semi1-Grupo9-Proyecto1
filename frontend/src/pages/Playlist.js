import React, { useState } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { Link } from "react-router-dom";

const Playlist = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [nombrePlaylist, setNombrePlaylist] = useState("");
  const [descripcionPlaylist, setDescripcionPlaylist] = useState("");
  const [imagenPlaylist, setImagenPlaylist] = useState(null);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleAceptar = () => {
    // Validar que se haya ingresado un nombre de playlist
    if (nombrePlaylist.trim() === "") {
      alert("Por favor ingrese un nombre de playlist.");
      return;
    }

    // Crear un objeto de playlist con los datos ingresados
    const nuevaPlaylist = {
      nombre: nombrePlaylist,
      descripcion: descripcionPlaylist,
      imagen: URL.createObjectURL(imagenPlaylist), // Utiliza la imagen seleccionada
    };

    // Agregar la nueva playlist a la lista de playlists
    setPlaylists([...playlists, nuevaPlaylist]);

    // Cerrar el formulario y limpiar los campos
    setMostrarFormulario(false);
    setNombrePlaylist("");
    setDescripcionPlaylist("");
    setImagenPlaylist(null);
  };

  const handleCancelar = () => {
    // Cerrar el formulario y limpiar los campos
    setMostrarFormulario(false);
    setNombrePlaylist("");
    setDescripcionPlaylist("");
    setImagenPlaylist(null);
  };

  const handleImagenChange = (e) => {
    // Actualizar el estado de la imagen cuando el usuario selecciona un archivo
    const imagenSeleccionada = e.target.files[0];
    setImagenPlaylist(imagenSeleccionada);
  };

  return (
    <main>
      <Navegacion />
      <div className="container">
        <h1 className="title">Tu Libreria</h1>
        <button className="btn btn-primary" onClick={toggleFormulario}>
          Crear Playlist
        </button>
        {mostrarFormulario && (
          <div className="formulario-crear-playlist">
            <h2>Crear Playlist</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre de la Playlist
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Escribe el nombre de la Playlist"
                  value={nombrePlaylist}
                  onChange={(e) => setNombrePlaylist(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción de la Playlist
                </label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  rows="3"
                  placeholder="Escribe una descripción para la Playlist"
                  value={descripcionPlaylist}
                  onChange={(e) => setDescripcionPlaylist(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">
                  Imagen de la Playlist
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imagen"
                  accept="image/*"
                  onChange={handleImagenChange}
                />
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={handleAceptar}
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="row g-3">
          <div className="col">
            <table className="table table-hover">
              <tbody>
                {playlists.map((playlist, index) => (
                  <tr key={index}>
                    <td className="align-middle">
                      <img
                        src={playlist.imagen}
                        alt=""
                        width="100"
                        height="60"
                      />
                    </td>
                    <td className="align-middle centered-cell">
                      <strong>{playlist.nombre}</strong>
                      
                    </td>
                    <td className="text-end align-middle">
                      <div className="btn-group">
                        {/* Utiliza Link para navegar a InPlaylist y pasa el nombre de la playlist como parámetro */}
                        <Link
                          to={{
                            pathname: "/inplaylist",
                            search: `?nombrePlaylist=${encodeURIComponent(
                              playlist.nombre
                            )}`,
                          }}
                        >
                            
                          <button type="button" className="btn btn-sm">
                            <img
                              className="bi pe-none me-2"
                              src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                              alt=""
                              width="50"
                              height="50"
                            />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Playlist;
