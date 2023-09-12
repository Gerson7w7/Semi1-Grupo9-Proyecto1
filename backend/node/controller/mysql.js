const conn = require('../database/db.js');
const { getImagen } = require('../controller/s3');

function loginUsuario(correo, password) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT 1 FROM Usuarios WHERE correo = ? AND password = ?', [correo, password], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: result.length == 1 });
            }
        }));
    });
}

function existeUsuario(correo) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT 1 FROM Usuarios WHERE correo = ?', correo, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: (result.length > 0)});
             }
        }));
    });
}

function registrarUsuario(nombres, apellidos, correo, pass, fecha) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Usuarios (nombres, apellidos, correo, password, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)',
            [nombres, apellidos, correo, pass, fecha], ((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true });
                }
            }));
    });
}

//========================================== CRUD ARTISTAS ==========================================
function existeArtista(nombre) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT 1 FROM Artistas WHERE nombre = ?', nombre, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: (result.length > 0)});
             }
        }));
    });
}

function createArtista(nombre, fecha_nacimiento) {
    return new Promise((resolve, reject) => {
        if (fecha_nacimiento != null && fecha_nacimiento != undefined && fecha_nacimiento != '') {
            conn.query('INSERT INTO Artistas (nombre, fecha_nacimiento) VALUES (?, ?)',
            [nombre, fecha_nacimiento], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true })
                }
            });
        } else {
            conn.query('INSERT INTO Artistas (nombre) VALUES (?)',
            [nombre, link_foto], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true })
                }
            });
        }
    });
}

function readArtistas() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Artistas', (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let artistas = [];
                for (let artista of result) {
                    try {
                        const result = await getImagen('artistas/' + artista.nombre);
                        const string_date = `${artista.fecha_nacimiento.getUTCFullYear()}/${artista.fecha_nacimiento.getUTCMonth()+1}/${artista.fecha_nacimiento.getUTCDate()}`;
                        artistas.push({
                            id: artista.id_artista,
                            imagen: result.image,
                            nombre: artista.nombre,
                            nacimiento: string_date
                        })
                    } catch (err) {
                        console.log(err);
                    }
                }
                resolve({ 'artistas': artistas });
            }
        }));
    });
}

function getNombreArtista(id){
    return new Promise((resolve, reject) => {
        conn.query('SELECT nombre FROM Artistas WHERE id_artista = ?', id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ ok: true });
            }
        }));
    });
}

function updateArtista(id, nombre, fecha) {
    let actualizacion = 'SET '
    actualizacion += nombre == ''? '' : `nombre = ${nombre}`;

    if (actualizacion.length > 4) {
        actualizacion += fecha == ''? '' : `, fecha = ${fecha}`;
    } else {
        actualizacion += fecha == ''? '' : `fecha = ${fecha}`;
    }
    return new Promise((resolve, reject) => {
        conn.query('UPDATE Artistas ? WHERE id_artista = ?', [actualizacion, id], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ ok: true });
            }
        }));
    });
}

function deleteArtista(id) {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE Artistas FROM Artistas
                        LEFT JOIN Canciones ON Canciones.id_artista = Artistas.id_artista
                        LEFT JOIN Albumes ON Albumes.id_artista = Artistas.id_artista
                        LEFT JOIN Reproducciones ON Reproducciones.id_cancion = Canciones.id_cancion
                        LEFT JOIN Favoritos ON Favoritos.id_cancion = Canciones.id_cancion
                        LEFT JOIN Playlist_canciones ON Playlist_canciones.id_cancion = Canciones.id_cancion
                        WHERE Artistas.id_artista = ?`, id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ ok: true})
            }
        }));
    });
}

//========================================= CRUD CANCIONES ==========================================
function createCancion(nombre, link_img, duracion, nombre_artista, link_mp3) {//pendiente
    return new Promise((resolve, reject) => {
        conn.query('SELECT id FROM Artistas WHERE nombre = ?', nombre_artista, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {//Existe el artista
                    //pendiente aquí
                    if (fecha_nacimiento != null) {
                        conn.query('INSERT INTO Artistas (nombre, foto, fecha_nacimiento) VALUES (?, ?, ?)',
                        [nombre, link_foto, fecha_nacimiento], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ status: true })
                            }
                        });
                    } else {
                        conn.query('INSERT INTO Artistas (nombre, foto) VALUES (?, ?)',
                        [nombre, link_foto], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ status: true })
                            }
                        });
                    }
                } else {
                    resolve({ status: false });
                }
            }
        }));
    });
}

function readCanciones() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.imagen, c.duracion, c.mp3, art.nombre AS artista FROM Artistas art
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista`, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    //Pendiente obtener imagen y mp3 en base64 de bucket con cancion.imagen y cancion.mp3
                    let imagen64 = 'img'
                    let mp3_64 = 'cancion'
                    canciones.push({
                        id: cancion.id_cancion,
                        imagen: imagen64,
                        nombre: cancion.nombre,
                        duracion: cancion.duracion,
                        mp3: mp3_64,
                        artista: cancion.artista
                    })
                }
                resolve({ 'canciones': canciones });
            }
        }));
    });
}

function updateCancion(id, nombre, imagen, duracion, artista, mp3) {
    let actualizacion = 'SET '
    actualizacion += nombre == ''? '' : `nombre = ${nombre}`;
    if (actualizacion.length > 4) {
        actualizacion += imagen == ''? '' : `, imagen = ${imagen}`;
    } else {
        actualizacion += imagen == ''? '' : `imagen = ${imagen}`;
    }

    if (actualizacion.length > 4) {
        actualizacion += duracion == -1? '' : `, duracion = ${duracion}`;
    } else {
        actualizacion += duracion == -1? '' : `duracion = ${duracion}`;
    }

    if (actualizacion.length > 4) {
        actualizacion += mp3 == ''? '' : `, mp3 = ${mp3}`;
    } else {
        actualizacion += mp3 == ''? '' : `mp3 = ${mp3}`;
    }

    if (artista == '') {
        return new Promise((resolve, reject) => {
            conn.query('UPDATE Canciones ? WHERE id_cancion = ?', [actualizacion, id], ((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ ok: true });
                }
            }));
        });
    }
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_artista FROM Artistas WHERE nombre = ?', artista, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (actualizacion.length > 4) {
                    actualizacion += artista == ''? '' : `, id_artista = ${result[0].id_artista}`;
                } else {
                    actualizacion += artista == ''? '' : `id_artista = ${result[0].id_artista}`;
                }
                conn.query('UPDATE Canciones ? WHERE id_cancion = ?', [actualizacion, id], ((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ ok: true });
                    }
                }));
            }
        }));

    });
}

function deleteCancion(id) {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE Canciones FROM Canciones
                        LEFT JOIN Reproducciones ON Reproducciones.id_cancion = Canciones.id_cancion
                        LEFT JOIN Favoritos ON Favoritos.id_cancion = Canciones.id_cancion
                        LEFT JOIN Playlist_canciones ON Playlist_canciones.id_cancion = Canciones.id_cancion
                        WHERE id_cancion = ?`, id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ ok: true })
            }
        }));
    });
}



module.exports = {
    loginUsuario,
    existeUsuario,
    registrarUsuario,

    existeArtista,
    getNombreArtista,
    createArtista,
    readArtistas,
    updateArtista,
    deleteArtista,

    createCancion,
    readCanciones,
    updateCancion,
    deleteCancion
}