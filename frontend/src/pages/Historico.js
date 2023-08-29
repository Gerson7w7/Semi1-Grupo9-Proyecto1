import React from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Historico.css";
// import { useEffect, useState } from "react";

const Historico = () => {
  // const [cancionesRep, setCancionesRep] = useState([]);
  // const [albumRep, setAlbumRep] = useState([]);
  // const [artistaRep, setArtistaRep] = useState([]);
  // const [historial, setHistorial] = useState([]);
  // const ip = "localhost";

  // useEffect(() => {
  //   const url = `http://${ip}:5000/historial`;

  //   const fetchData = async () => {
  //     fetch(url)
  //       .then((res) => res.json())
  //       .catch((error) => console.error("Error:", error))
  //       .then((res) => {
  //         console.log("res: ", res);
  //         setCancionesRep(res.cancionesRep);
  //         setAlbumRep(res.albumRep);
  //         setArtistaRep(res.artistaRep);
  //         setHistorial(res.historial);
  //       });
  //   };
  //   fetchData();
  // }, []);

  return (
    <main>
      <Navegacion />
      <div class="contenido album py-5 ">
        <div class="container">
          <h3>Top 5 canciones más reproducidas</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {/* {cancionesRep.map((c, index) => (
                    <tr class="table-primary">
                      <th scope="row">{index + 1}</th>
                      <td>{c.nombre}</td>
                      <td>{c.artista}</td>
                      <td>Veces reproducidas: {c.veces}</td>
                    </tr>
                  ))} */}

                  <tr class="table-primary">
                    <th scope="row">1</th>
                    <td>Ultiom Tren a Ameri</td>
                    <td>Duki</td>
                    <td>Veces reproducidas: 120</td>
                  </tr>
                  <tr class="table-primary">
                    <th scope="row">2</th>
                    <td>AEROBICO REMIX</td>
                    <td>Bhavi</td>
                    <td>Veces reproducidas: 110</td>
                  </tr>
                  <tr class="table-primary">
                    <th scope="row">3</th>
                    <td>Remember Me</td>
                    <td>Duki</td>
                    <td>Veces reproducidas: 105</td>
                  </tr>
                  <tr class="table-primary">
                    <th scope="row">4</th>
                    <td>Los del Espacio</td>
                    <td>LIT Killah</td>
                    <td>Veces reproducidas: 100</td>
                  </tr>
                  <tr class="table-primary">
                    <th scope="row">5</th>
                    <td>NUNCA VOY SOLO</td>
                    <td>KHEA</td>
                    <td>Veces reproducidas: 88</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3>Top 3 artistas más escuchados</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {/* {artistaRep.map((a, index) => (
                    <tr class="table-info">
                      <th scope="row">{index + 1}</th>
                      <td>{a.nombre}</td>
                      <td></td>
                      <td>Veces reproducidas: {a.veces}</td>
                    </tr>
                  ))} */}

                  <tr class="table-info">
                    <th scope="row">1</th>
                    <td>Duki</td>
                    <td></td>
                    <td>Veces reproducidas: 120</td>
                  </tr>
                  <tr class="table-info">
                    <th scope="row">2</th>
                    <td>Milo J</td>
                    <td></td>
                    <td>Veces reproducidas: 110</td>
                  </tr>
                  <tr class="table-info">
                    <th scope="row">3</th>
                    <td>LIT Killah</td>
                    <td></td>
                    <td>Veces reproducidas: 105</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3> Top 5 álbumes más reproducidos</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {/* {albumRep.map((a, index) => (
                    <tr class="table-light">
                      <th scope="row">{index + 1}</th>
                      <td>{a.nombre}</td>
                      <td>{a.artista}</td>
                      <td>Veces reproducidas: {a.veces}</td>
                    </tr>
                  ))} */}

                  <tr class="table-light">
                    <th scope="row">1</th>
                    <td>Antes de Ameri</td>
                    <td>Duki</td>
                    <td>Veces reproducidas: 120</td>
                  </tr>
                  <tr class="table-light">
                    <th scope="row">2</th>
                    <td>Desde el Espacio</td>
                    <td>FMK</td>
                    <td>Veces reproducidas: 110</td>
                  </tr>
                  <tr class="table-light">
                    <th scope="row">3</th>
                    <td>3MEN2 KBRN</td>
                    <td>Eladio Carrion</td>
                    <td>Veces reproducidas: 105</td>
                  </tr>
                  <tr class="table-light">
                    <th scope="row">4</th>
                    <td>SnipeZ</td>
                    <td>LIT Killah</td>
                    <td>Veces reproducidas: 100</td>
                  </tr>
                  <tr class="table-light">
                    <th scope="row">5</th>
                    <td>511</td>
                    <td>Milo J</td>
                    <td>Veces reproducidas: 88</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3>Historial de canciones reproducidas</h3>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
                <tbody>
                  {/* {historial.map((h) => (
                    <tr class="table-secondary">
                      <td>{h.nombre}</td>
                      <td>{h.artista}</td>
                      <td>{}</td>
                      <td>{h.duracion} mins</td>
                    </tr>
                  ))} */}

                  <tr class="table-secondary">
                    <td>Ultiom Tren a Ameri</td>
                    <td>Duki</td>
                    <td></td>
                    <td>3 mins</td>
                  </tr>
                  <tr class="table-secondary">
                    <td>AEROBICO REMIX</td>
                    <td>Bhavi</td>
                    <td></td>
                    <td>3 mins</td>
                  </tr>
                  <tr class="table-secondary">
                    <td>Remember Me</td>
                    <td>Duki</td>
                    <td></td>
                    <td>5 mins</td>
                  </tr>
                  <tr class="table-secondary">
                    <td>Los del Espacio</td>
                    <td>LIT Killah</td>
                    <td></td>
                    <td>6 mins</td>
                  </tr>
                  <tr class="table-secondary">
                    <td>NUNCA VOY SOLO</td>
                    <td>KHEA</td>
                    <td></td>
                    <td>3 mins</td>
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

export default Historico;
