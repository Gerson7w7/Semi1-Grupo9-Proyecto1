const conn = require('../database/db.js');
const { getImagen, getCancion } = require('../controller/s3');

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
                    resolve({ status: true, id_usuario: result.insertId});
                }
            }));
    });
}

//========================================== CRUD ARTISTAS ==========================================
function getIdArtista(nombre) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_artista FROM Artistas WHERE nombre = ?', nombre, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_artista: result[0].id_artista });
                } else {
                    resolve({ status: false });
                }
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
                    resolve({ status: true, id_artista: result.insertId })
                }
            });
        } else {
            conn.query('INSERT INTO Artistas (nombre) VALUES (?)',
            [nombre, link_foto], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true, id_artista: result.insertId })
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
                        const result = await getImagen('artistas/' + artista.id_artista);
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
                if (result.affectedRows > 0) {
                    resolve({ ok: true })
                } else {
                    resolve({ ok: false })
                }
            }
        }));
    });
}

//========================================= CRUD CANCIONES ==========================================
function getIdCancion(nombre, id_artista) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_cancion FROM Canciones WHERE nombre = ? AND id_artista = ?', [nombre, id_artista], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_cancion: result[0].id_cancion });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createCancion(nombre, duracion, id_artista) {
    return new Promise((resolve, reject) => {     
        conn.query('INSERT INTO Canciones (nombre, duracion, id_artista) VALUES (?, ?, ?)',
        [nombre, duracion, id_artista], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: true, id_cancion: result.insertId })
            }
        });
    });
}

function readCanciones() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista`, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    const imagen64 = await getImagen('canciones/' + cancion.id_cancion);
                    const mp3_64 = await getCancion(cancion.id_cancion);
                    canciones.push({
                        id: cancion.id_cancion,
                        imagen: imagen64.image,
                        nombre: cancion.nombre,
                        duracion: cancion.duracion,
                        mp3: mp3_64.song,
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
                        WHERE Canciones.id_cancion = ?`, id, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows > 0) {
                    resolve({ ok: true })
                } else {
                    resolve({ ok: false })
                }
            }
        }));
    });
}

//========================================== CRUD ALBUMES ==========================================
function readAlbumes() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista FROM Albumes alb
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista`, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let albumes = [];
                for (let album of result) {
                    const imagen64 = await getImagen('albumes/' + album.id_album);
                    albumes.push({
                        id: album.id_cancion,
                        imagen: imagen64.image,
                        nombre: album.nombre,
                        artista: album.artista
                    })
                }
                resolve({ 'albums': albumes });
            }
        }));
    });
}

//=========================================== FAVORITOS ============================================
function favorito(id_usuario, id_cancion) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Favoritos WHERE id_usuario = ? AND id_cancion = ?', [id_usuario, id_cancion], (async (err, result) => {

        }));
    });
}

module.exports = {
    loginUsuario,
    existeUsuario,
    registrarUsuario,

    getIdArtista,
    getNombreArtista,
    createArtista,
    readArtistas,
    updateArtista,
    deleteArtista,

    getIdCancion,
    createCancion,
    readCanciones,
    updateCancion,
    deleteCancion,

    readAlbumes
}