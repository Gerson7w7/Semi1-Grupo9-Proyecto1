import React, { useState, useEffect } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { useLocation } from "react-router-dom";

const InAlbum = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const nombreAlbum = params.get("nombreAlbum");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null); // Almacena el ID de la canción a eliminar
  /*const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Givenchy",
      artist: "Duki",
      duration: "3 mins",
    },
    {
      id: 2,
      title: "Givenchy2",
      artist: "Duki",
      duration: "3 mins",
    },
    {
      id: 3,
      title: "Givenchy3",
      artist: "Duki",
      duration: "3 mins",
    },
    // Agrega más canciones aquí
  ]);*/

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchForm, setShowSearchForm] = useState(false); // Controla si se muestra el formulario de búsqueda
  const [songs, setSongs] = useState([]); // Inicialmente, el arreglo de canciones está vacío
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    const url = `${ip}album`;
    // Realizar una solicitud GET al servidor para obtener las canciones de la album
    
    const searchParams = new URLSearchParams(location.search);
    const nombrealbumParam = searchParams.get("nombreAlbum");
    const decodedNombrealbum = decodeURIComponent(nombrealbumParam);
    const encode = encodeURI(decodedNombrealbum)
    console.log( url+`/${encode}`)
    fetch(url+`/${encode}`)
      .then((response) => response.json())
      .then((data) => {
        // Actualizar el estado con los datos de las canciones obtenidas
        setSongs(data);
      })
      .catch((error) => {
        console.error("Error al obtener las canciones:", error);
      });
  }, [nombreAlbum]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filtrar las canciones que coinciden con la búsqueda
    const filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredSongs);
  };

  const handleAddToalbum = (songId) => {
    // Encuentra la canción seleccionada por su ID
    const selectedSong = songs.find((song) => song.id === songId);
  
    // Realizar una solicitud POST al backend para agregar la canción
    const url = `${ip}add-song-album`; // URL del endpoint del servidor para agregar canciones
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedSong), // Envía los datos de la canción como datos JSON
    };
  
    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          // La canción se agregó con éxito en el servidor
          // Actualiza el estado en el frontend para reflejar la adición
          setSongs(response);
  
          // Limpia el campo de búsqueda y los resultados
          setSearchQuery("");
          setSearchResults([]);
  
          // Puedes realizar alguna acción adicional si es necesario
          console.log('Canción agregada con éxito.');
        } else {
          // Manejar el error si la solicitud no fue exitosa
          console.error('Error al agregar la canción.');
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };
  

  const handleDeleteClick = (songId) => {
    setSongToDelete(songId); // Guarda el ID de la canción a eliminar
    setShowConfirmation(true);
  };

  const handleCancelClick = () => {
    setShowConfirmation(false);
    setSongToDelete(null); // Restablece el valor de songToDelete
  };

  const handleConfirmDelete = () => {
    if (songToDelete !== null) {
      // Realizar la solicitud POST al backend para eliminar la canción
      const url = `${ip}delete-song-album`; // URL del endpoint del servidor para eliminar canciones
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: songToDelete }), // Envía el ID de la canción a eliminar como datos JSON
      };
  
      fetch(url, requestOptions)
        .then((response) => {
          if (response.ok) {
            // La canción se eliminó con éxito en el servidor
            // Actualiza el estado en el frontend para reflejar la eliminación
            setSongToDelete(response)
            setShowConfirmation(false);
            setSongToDelete(null);
          } else {
            // Manejar el error si la solicitud no fue exitosa
            console.error('Error al eliminar la canción.');
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud:', error);
        });
    }
  };
  

  return (
    <main>
      <Navegacion />
      <div className="container">
        <div className="image-box">
          <img
            src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
            alt=""
            width="1300"
            height="400"
          />
        </div>
        <h1 className="title2">{nombreAlbum}</h1>

        {/* Agregar botón para mostrar el formulario de búsqueda */}
        <button
          className="btn btn-primary"
          onClick={() => setShowSearchForm(!showSearchForm)}
        >
          {showSearchForm ? "Ocultar formulario" : "Agregar canción"}
        </button>

        {/* Mostrar el formulario de búsqueda si showSearchForm es true */}
        {showSearchForm && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar canción"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        )}

        {/* Mostrar resultados de búsqueda */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-3">
            <table className="table table-hover">
              <tbody>
                {searchResults.map((song) => (
                  <tr key={song.id}>
                    <th scope="row" className="align-middle">
                      <img
                        src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td className="align-middle">{song.title}</td>
                    <td className="align-middle">{song.artist}</td>
                    <td className="align-middle">{song.duration}</td>
                    <td className="text-end align-middle">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddToalbum(song.id)}
                      >
                        Agregar a la album
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="row g-3">
          <div className="col">
          <table className="table table-hover red-background-table">
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id}>
                    <th scope="row" className="align-middle">
                      <img
                        src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td className="align-middle">{song.title}</td>
                    <td className="align-middle">{song.artist}</td>
                    <td className="align-middle">{song.duration}</td>
                    <td className="text-end align-middle">
                      <div className="btn-group">
                        {/* Botón original */}
                        <button type="button" className="btn btn-sm">
                          <img
                            className="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(song.id)}
                        >
                          Eliminar canción
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="modal" style={{ top: "350px", left: "775px" }}>
          <div className="modal-content">
            <div className="centered-modal">
              <p>¿Estás seguro de eliminar esta canción?</p>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Aceptar
              </button>
              <button className="btn btn-secondary" onClick={handleCancelClick}>
                Cancelar
              </button>
            </div>
            
          </div>
        </div>
      )}
    </main>
  );
};

export default InAlbum;

