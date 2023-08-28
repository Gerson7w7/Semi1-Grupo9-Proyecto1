import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { useState } from "react";

const Buscar = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [canciones, setCanciones] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [buscar, setBuscar] = useState('');
  const ip = "localhost";

  const buscarFn = () => {
    const url = `http://${ip}:5000/buscar`;
    const fetchData = async () => {
      let data = { buscar: buscar };
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
          setCanciones(res.canciones)
          setAlbums(res.albums)
          setArtistas(res.artistas)
          let favoritos = []
          for (const f in canciones) {
            favoritos.push(f.esFavorito)
          }
        });
    };
    fetchData();
  };

  const favorito = (index, id) => {
    // buscamos el id de la canción de se puso/quito de favoritos
    let favs = favoritos;
    favs[index] = !favs[index];
    setFavoritos(favs); // se actualiza los favoritos

    const url = `http://${ip}:5000/favorito`;
    const fetchData = async () => {
      let data = { fav: id };
      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error))
        .then((res) => {});
    };
    fetchData();
  };

  const reproducir = (id) => {
    console.log("reproduciendo...", id);
  };

  return (
    <main>
      <Navegacion />

      <div class="contenido album py-5 ">
        <div class="form-group narrow-search">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="¿Qué quieres escuchar?"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={(event) => setBuscar(event.target.value)}
            />
            <button class="btn btn-primary" type="button" id="button-addon2">
              <img
                class="bi pe-none me-2"
                src="https://www.liberty.edu/staging/library/wp-content/uploads/sites/193/2021/03/magnifying-glass-icon-white.png"
                alt=""
                width="25"
                height="25"
              />
            </button>
          </div>
        </div>

        <div class="container">
          <h1>Canciones</h1>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {/* {canciones.map((c, index) => (
                    <tr>
                      <th scope="row" class="align-middle">
                        <img src={c.imagen} alt="" width="100" height="60" />
                      </th>
                      <td class="align-middle">{c.nombre}</td>
                      <td class="align-middle">{c.artista}</td>
                      <td class="align-middle">{c.duracion} mins</td>
                      <td class="text-end align-middle">
                        <div class="btn-group">
                          <button
                            type="button"
                            class={`btn btn-sm  ${
                              favoritos[index] ? "btn-success" : "btn-secondary"
                            } favorite-button`}
                            onClick={() => favorito(index, c.id)}
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
                          <button
                            type="button"
                            class="btn btn-sm"
                            onClick={() => reproducir(c.id)}
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
                      </td>
                    </tr>
                  ))} */}
                  <tr>
                    <th scope="row" class="align-middle">
                      <img
                        src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td class="align-middle">Givenchy</td>
                    <td class="align-middle">Duki</td>
                    <td class="align-middle">3 mins</td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button
                          type="button"
                          class={`btn btn-sm  ${
                            isFavorite ? "btn-success" : "btn-secondary"
                          } favorite-button`}
                          onClick={() => setIsFavorite(!isFavorite)}
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
                </tbody>
              </table>
            </div>
          </div>

          <h1>Albumes</h1>
          <div class="row g-3">
            {/* {albums.map((a) => (
              <div class="col">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" class="align-middle">
                        <img src={a.imagen} alt="" width="100" height="60" />
                      </th>
                      <th scope="col" class="align-middle">
                        {a.nombre}
                      </th>
                      <th scope="col" class="align-middle">
                        {a.artista}
                      </th>
                      <th scope="col" class="align-middle">
                        {a.descripcion}
                      </th>
                      <th scope="col" class="text-end align-middle"></th>
                      <th scope="col" class="text-end align-middle"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.map((c) => (
                      <tr>
                        <th scope="row" class="align-middle">
                          <img
                            src={c.imagen}
                            alt=""
                            width="100"
                            height="60"
                          />
                        </th>
                        <td class="align-middle">{c.nombre}</td>
                        <td class="align-middle">{c.artista}</td>
                        <td class="align-middle">{c.duracion} mins</td>
                        <td class="text-end align-middle"></td>
                        <td class="text-end align-middle">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm"
                              onClick={() => reproducir(c.id)}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))} */}
            <div class="col">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="align-middle">
                      <img
                        src="https://www.lahiguera.net/musicalia/artistas/varios/disco/12974/duki_antes_de_ameri-portada.jpg"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <th scope="col" class="align-middle">
                      Antes de Ameri
                    </th>
                    <th scope="col" class="align-middle">
                      Duki
                    </th>
                    <th scope="col" class="align-middle">
                      Descripcion
                      dasfdasfdsfsdfsdfadssfadfasdfadsfadfasdffsda...
                    </th>
                    <th scope="col" class="text-end align-middle"></th>
                    <th scope="col" class="text-end align-middle"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" class="align-middle">
                      <img
                        src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td class="align-middle">Givenchy</td>
                    <td class="align-middle">Duki</td>
                    <td class="align-middle">3 mins</td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button
                          type="button"
                          class={`btn btn-sm  ${
                            isFavorite ? "btn-success" : "btn-secondary"
                          } favorite-button`}
                          onClick={() => setIsFavorite(!isFavorite)}
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
                        <button
                          type="button"
                          class="btn btn-sm"
                          // onClick={() => reproducir("5")}
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h1>Artistas</h1>
          <div class="row g-3">
            {/* {artistas.map((a) => (
              <div class="col">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" class="align-middle">
                        <img src={a.imagen} alt="" width="100" height="60" />
                      </th>
                      <th scope="col" class="align-middle">
                        {a.nombre}
                      </th>
                      <th scope="col" class="align-middle">
                        Nacimiento: {a.nacimiento}
                      </th>
                      <th scope="col" class="align-middle"></th>
                      <th scope="col" class="text-end align-middle"></th>
                      <th scope="col" class="text-end align-middle"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.map((c) => (
                      <tr>
                        <th scope="row" class="align-middle">
                          <img
                            src={c.imagen}
                            alt=""
                            width="100"
                            height="60"
                          />
                        </th>
                        <td class="align-middle">{c.nombre}</td>
                        <td class="align-middle">{c.artista}</td>
                        <td class="align-middle">{c.duracion} mins</td>
                        <td class="text-end align-middle"></td>
                        <td class="text-end align-middle">
                          <div class="btn-group">
                            <button
                              type="button"
                              class="btn btn-sm"
                              onClick={() => reproducir(c.id)}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))} */}
            <div class="col">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="align-middle">
                      <img
                        src="https://bucket.somosohlala.com.ar/s3fs-public/styles/internal_990/public/2023-06/diseno_sin_titulo_1_70.jpg.webp?itok=Zg9cFysC"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <th scope="col" class="align-middle">
                      Duki
                    </th>
                    <th scope="col" class="align-middle">
                      Nacimiento: 14/07/1997
                    </th>
                    <th scope="col" class="align-middle"></th>
                    <th scope="col" class="text-end align-middle"></th>
                    <th scope="col" class="text-end align-middle"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" class="align-middle">
                      <img
                        src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                        alt=""
                        width="100"
                        height="60"
                      />
                    </th>
                    <td class="align-middle">Givenchy</td>
                    <td class="align-middle">Duki</td>
                    <td class="align-middle">3 mins</td>
                    <td class="text-end align-middle">
                      <div class="btn-group">
                        <button
                          type="button"
                          class={`btn btn-sm  ${
                            isFavorite ? "btn-success" : "btn-secondary"
                          } favorite-button`}
                          onClick={() => setIsFavorite(!isFavorite)}
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
                        <button
                          type="button"
                          class="btn btn-sm"
                          // onClick={() => reproducir("5")}
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Buscar;
