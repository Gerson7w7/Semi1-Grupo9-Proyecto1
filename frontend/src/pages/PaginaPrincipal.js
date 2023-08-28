import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/PaginaPrincipal.css";
// import { useEffect, useState } from "react";

const PaginaPrincipal = () => {
  // const [canciones, setCanciones] = useState([]);
  // const [albums, setAlbums] = useState([]);
  // const [artistas, setArtistas] = useState([]);
  // const ip = "localhost";

  // useEffect(() => {
  //   const url = `http://${ip}:5000/inicio`;

  //   const fetchData = async () => {
  //     fetch(url)
  //       .then((res) => res.json())
  //       .catch((error) => console.error("Error:", error))
  //       .then((res) => {
  //         console.log("res: ", res);
  //         setCanciones(res.canciones);
  //         setAlbums(res.albums);
  //         setArtistas(res.artistas);
  //       });
  //   };
  //   fetchData();
  // }, []);

  const reproducir = (id) => {
    console.log("reproduciendo...", id);
  };

  const irAlbum = (id) => {
    console.log("ir album...", id);
  };

  const irArtista = (id) => {
    console.log("ir artista...", id);
  };

  return (
    <main>
      <Navegacion />
      <div class="contenido album py-5 ">
        <div class="container">
          <h1>Canciones</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {/* {canciones.map((c) => (
              <div class="col">
                <div class="card shadow-sm">
                  <img
                    src={c.imagen}
                    alt=""
                    width="342"
                    height="250"
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>{c.nombre}</strong>
                      <br />
                      {c.artista}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm" onClick={ () => reproducir(c.id) }>
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                      <small class="text-body-secondary">{c.duracion} min</small>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
            <div class="col">
              <div class="card shadow-sm">
                <img
                  src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                  alt=""
                  width="342"
                  height="250"
                />
                <div class="card-body">
                  <p class="card-text">
                    <strong>Givenchy</strong>
                    <br />
                    Duki
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-sm"
                        onClick={() => reproducir("5")}
                      >
                        <img
                          class="bi pe-none me-2"
                          src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                          alt=""
                          width="50"
                          height="50"
                        />
                      </button>
                    </div>
                    <small class="text-body-secondary">3 mins</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1>Albumes</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {/* {albums.map((a) => (
              <div class="col">
                <div class="card shadow-sm">
                  <img
                    src={a.imagen}
                    alt=""
                    width="342"
                    height="250"
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>{a.nombre}</strong>
                      <br />
                      {a.artista}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm" onClick={ () => irAlbum(a.id) }>
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
            <div class="col">
              <div class="card shadow-sm">
                <img
                  src="https://www.lahiguera.net/musicalia/artistas/varios/disco/12974/duki_antes_de_ameri-portada.jpg"
                  alt=""
                  width="342"
                  height="250"
                />
                <div class="card-body">
                  <p class="card-text">
                    <strong>Antes de Ameri</strong>
                    <br />
                    Duki
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-sm"
                        onClick={() => irAlbum(50)}
                      >
                        <img
                          class="bi pe-none me-2"
                          src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                          alt=""
                          width="50"
                          height="50"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1>Artistas</h1>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {/* {artistas.map((a) => (
              <div class="col">
                <div class="card shadow-sm">
                  <img
                    src={a.imagen}
                    alt=""
                    width="342"
                    height="250"
                  />
                  <div class="card-body">
                    <p class="card-text">
                      <strong>a.nombre</strong>
                      <br />
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm" onClick={ () => irArtista(a.id) }>
                          <img
                            class="bi pe-none me-2"
                            src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                            alt=""
                            width="50"
                            height="50"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
            <div class="col">
              <div class="card shadow-sm">
                <img
                  src="https://i0.wp.com/ossom.cl/wp-content/uploads/2021/08/Captura-de-pantalla-2021-08-20-a-las-11.57.40.png?fit=763%2C492&ssl=1"
                  alt=""
                  width="342"
                  height="250"
                />
                <div class="card-body">
                  <p class="card-text">
                    <strong>Lit Killah</strong>
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-sm"
                        onClick={() => irArtista(1)}
                      >
                        <img
                          class="bi pe-none me-2"
                          src="https://cdn-icons-png.flaticon.com/512/1709/1709973.png"
                          alt=""
                          width="50"
                          height="50"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaginaPrincipal;
