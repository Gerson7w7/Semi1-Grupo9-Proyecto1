import React, { Component } from "react";
import Navegacion from "../components/Navegacion";
import "../assets/styles/Buscar.css";
import { useLocation } from "react-router-dom";

const InPlaylist = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const nombrePlaylist = params.get("nombrePlaylist");
    
  return (
    <main>
      <Navegacion />
      <div className="container">
        
          <div className="image-box">
            <img
              src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg" // Agrega la URL de la imagen aquí
              alt=""
              width="1300" // Ajusta el ancho según tus preferencias
              height="400" // Ajusta la altura según tus preferencias
            />
          </div>
        <h1 className="title2">
          {nombrePlaylist}
        </h1>
        <div className="row g-3">
          <div className="col">
            <table className="table table-hover">
              <tbody>
                <tr>
                  <th scope="row" className="align-middle">
                    <img
                      src="https://i.ytimg.com/vi/ymvYySd_P2E/maxresdefault.jpg"
                      alt=""
                      width="100"
                      height="60"
                    />
                  </th>
                  <td className="align-middle">Givenchy</td>
                  <td className="align-middle">Duki</td>
                  <td className="align-middle">3 mins</td>
                  <td className="text-end align-middle">
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm">
                        <img
                          className="bi pe-none me-2"
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

export default InPlaylist;
