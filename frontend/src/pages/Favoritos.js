import React, { useState, useEffect } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import AudioPlayer from "../components/Reproductor";

const Favoritos = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  //const [favoriteSongs, setFavoriteSongs] = useState([]); // Estado para almacenar las canciones favoritas
  const [favoriteSongs, setFavoriteSongs] = useState([
    {
      id: 1,
      nombre: "Canción 1",
      artista: "Artista 1",
      duracion: "3:30",
      imagen: "url_de_la_imagen_1",
      isFavorite: true, // Puedes marcarlo como favorito por defecto si lo deseas
    },
    {
      id: 2,
      nombre: "Canción 2",
      artista: "Artista 2",
      duracion: "4:15",
      imagen: "url_de_la_imagen_2",
      isFavorite: true, // O no marcarlo como favorito por defecto
    },
    // Agrega más canciones favoritas aquí si lo deseas
  ]);
  const ip = "http://balancer-semi1-p1-830674914.us-east-1.elb.amazonaws.com/";

  useEffect(() => {
    // Obtén el ID del usuario desde localStorage
    const id_usuario = localStorage.getItem("id_usuario");

    // Crea un objeto con el ID de usuario
    const requestData = {
      id_usuario: id_usuario,
    };

    const url = `${ip}favorites`; // Cambia la URL y el endpoint según tu backend

    // Realizar una solicitud POST al servidor para obtener las canciones favoritas
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData), // Envía el objeto como datos JSON
    })
      .then((response) => response.json())
      .then((data) => {
        // Actualizar el estado con los datos de las canciones favoritas obtenidas
        setFavoriteSongs(data);
      })
      .catch((error) => {
        console.error("Error al obtener las canciones favoritas:", error);
      });
  }, []); // El array de dependencias vacío asegura que esta solicitud solo se realice una vez al montar el componente


  return (
    <main>
      <Navegacion />
      <div class="container">
        <h1>Canciones Favoritas</h1>
        <div class="row g-3">
          <div class="col">
            <table class="table table-hover">
              <tbody>
                {favoriteSongs.map((song) => (
                  <tr key={song.id}>
                    <th scope="row" class="align-middle">
                      <img
                        src={song.imagen}
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td class="align-middle">{song.nombre}</td>
                    <td class="align-middle">{song.artista}</td>
                    <td class="align-middle">{song.duracion}</td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button
                          type="button"
                          class={`btn btn-sm ${
                            song.isFavorite ? "btn-success" : "btn-secondary"
                          } favorite-button`}
                          onClick={() => {
                            // Aquí puedes implementar la lógica para cambiar el estado de favorito
                            // Puedes realizar una solicitud al servidor para marcar o desmarcar como favorito
                            // Actualizar el estado en el frontend, etc.
                            // Ejemplo: toggleFavorite(song.id);
                          }}
                        >
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/73/73814.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm">
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
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
    </main>
  );
};

export default Favoritos;
