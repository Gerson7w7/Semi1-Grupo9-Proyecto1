import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/PaginaPrincipal.css";
import AudioPlayer from "../components/Reproductor";
// import { useEffect, useState } from "react";

const PaginaPrincipal = () => {
  // const [canciones, setCanciones] = useState([]);
  // const [albums, setAlbums] = useState([]);
  // const [artistas, setArtistas] = useState([]);
  const ip = "localhost";

  // useEffect(() => {
  // 0 = canción
  // 1 = album
  // 2 = artista
  // const url = `http://${ip}:5000/reproducir`;
  // let data = { id: id, tipo: tipo};
  // const fetchData = async () => {
  //   fetch(url, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .catch((error) => console.error("Error:", error))
  //     .then((res) => {
  //       const tracksAux = res.tracks
  //       let tracks = []
  //       for (const t of tracksAux) {
  //         tracks.push(t.url)
  //       }
  //       // seteamos la cola de tracks
  //       localStorage.setItem("audioTracks", tracks);
  //     });
  // };
  // fetchData();
  // }, []);

  return (
    <main>
      <Navegacion />
      <div class="contenido album py-5 ">
        <div className="d-flex align-items-center justify-content-center">
          <img
            class="bi pe-none me-2"
            src="https://cdn-icons-png.flaticon.com/512/4345/4345594.png"
            alt=""
            width="500"
            height="500"
          />
        </div>
      </div>
      <AudioPlayer />
    </main>
  );
};

export default PaginaPrincipal;
