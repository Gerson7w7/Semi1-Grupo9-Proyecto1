import React, { useState } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { useLocation } from "react-router-dom";

const Favoritos = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    return (
        <main>
        <Navegacion />
        <div class="container">
          <h1>Canciones</h1>
          <div class="row g-3">
            <div class="col">
              <table class="table table-hover">
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
                </div>
        </main>
    );

};

export default Favoritos;

