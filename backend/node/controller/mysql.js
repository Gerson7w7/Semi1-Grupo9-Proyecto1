const conn = require('../database/db.js');
const { guardarImagen } = require('../controller/s3');
const { getImagen, getCancion } = require('../controller/s3');
const prefijoBucket = 'https://multimedia-semi1-g9.s3.amazonaws.com/';

function loginUsuario(correo, password) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_usuario FROM Usuarios WHERE correo = ? AND password = ?', [correo, password], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_usuario: result[0].id_usuario });
                } else {
                    resolve({ status: false });
                }
                
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
                        const string_date = `${artista.fecha_nacimiento.getUTCFullYear()}/${artista.fecha_nacimiento.getUTCMonth()+1}/${artista.fecha_nacimiento.getUTCDate()}`;
                        artistas.push({
                            id: artista.id_artista,
                            nombre: artista.nombre,
                            imagen: `${prefijoBucket}Fotos/artistas/${artista.id_artista}.jpg`,
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
        conn.query('DELETE FROM Artistas WHERE id_artista = ?', id, ((err, result) => {
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
                    canciones.push({
                        id: cancion.id_cancion,
                        nombre: cancion.nombre,
                        imagen: `${prefijoBucket}Fotos/canciones/${cancion.id_cancion}.jpg`,
                        duracion: cancion.duracion,
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
        conn.query('DELETE FROM Canciones WHERE id_cancion = ?', id, ((err, result) => {
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
function getIdAlbum(nombre, id_artista) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_album FROM Albumes WHERE nombre = ? AND id_artista = ?', [nombre, id_artista], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_album: result[0].id_album });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createAlbum(nombre, descripcion, id_artista) {
    return new Promise((resolve, reject) => {     
        conn.query('INSERT INTO Albumes (nombre, descripcion, id_artista) VALUES (?, ?, ?)',
        [nombre, descripcion, id_artista], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: true, id_album: result.insertId })
            }
        });
    });
}

function readAlbumes() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista FROM Albumes alb
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista`, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let albumes = [];
                for (let album of result) {
                    albumes.push({
                        id: album.id_album,
                        nombre: album.nombre,
                        imagen: `${prefijoBucket}Fotos/albumes/${album.id_album}.jpg`,
                        artista: album.artista
                    })
                }
                resolve({ 'albums': albumes });
            }
        }));
    });
}

//============================================= BUSCAR =============================================
function buscar(palabra) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Canciones WHERE nombre LIKE %?%', palabra, (async (err, result) => {
            
        }));
    });
}

//============================================= PERFIL =============================================
function getPerfil(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_usuario, nombres, apellidos, correo FROM Usuarios WHERE id_usuario = ?', id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({
                        nombre: result[0].nombres,
                        apellido: result[0].apellidos, 
                        imagen: `${prefijoBucket}Fotos/usuarios/${result[0].id_usuario}.jpg`,
                        email: result[0].correo 
                    });
                } else {
                    reject("No existe el usuario")
                }
            }
        }));
    });
}

//=========================================== FAVORITOS ============================================
function favorito(id_usuario, id_cancion) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT 1 FROM Favoritos WHERE id_usuario = ? AND id_cancion = ?', [id_usuario, id_cancion], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {//Se quita de favoritos
                    conn.query('DELETE FROM Favoritos WHERE id_usuario = ? AND id_cancion = ?', [id_usuario, id_cancion], ((err, res) => {
                        if (res.affectedRows > 0) {
                            resolve({ ok: true })
                        } else {
                            resolve({ ok: false })
                        }
                    }));
                } else {//Se agrega a favoritos
                    conn.query('INSERT INTO Favoritos (id_usuario, id_cancion) VALUES (?, ?)', [id_usuario, id_cancion], ((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ ok: true });
                        }
                    }));
                }
            }
        }));
    });
}

function getFavoritos(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, art.nombre AS artista FROM Favoritos f
                    LEFT JOIN Canciones c ON c.id_cancion = f.id_cancion
                    LEFT JOIN Artistas art ON art.id_artista = c.id_artista
                    WHERE f.id_usuario = ?`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        id: cancion.id_cancion,
                        nombre: cancion.nombre,
                        imagen: `${prefijoBucket}Fotos/canciones/${cancion.id_cancion}.jpg`,
                        duracion: cancion.duracion,
                        artista: cancion.artista
                    })
                }
                resolve({ 'songs': canciones });
            }
        }));
    });
}

//========================================= CRUD PLAYLISTS ==========================================
function getIdPlaylist(id_usuario, nombre) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_playlist FROM Playlists WHERE id_usuario = ? AND nombre = ?', [id_usuario, nombre], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_playlist: result[0].id_playlist });
                } else {
                    resolve({ status: false });
                }
             }
        }));
    });
}

function createPlaylist(id_usuario, nombre, descripcion, imagen) {
    return new Promise((resolve, reject) => {
        descripcion = descripcion? descripcion : '';
        conn.query('INSERT INTO Playlists (nombre, descripcion, id_usuario) VALUES (?, ?, ?)', [nombre, descripcion, id_usuario], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                guardarImagen('playlists/'+ result.insertId, imagen);
                resolve({ status: true, listado_playlists: await readPlaylists(id_usuario) });
            }
        }));
    });
}

function readPlaylists(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id_playlist, nombre, descripcion FROM Playlists
                    WHERE id_usuario = ?`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let playlists = [];
                for (let playlist of result) {
                    playlists.push({
                        nombre: playlist.nombre,
                        descripcion: playlist.descripcion,
                        imagen: `${prefijoBucket}Fotos/playlists/${playlist.id_usuario}.jpg`
                    })
                }
                resolve({ 'playlist': playlists });
            }
        }));
    });
}

function addCancionPlaylist(id_cancion, id_playlist) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Playlist_canciones (id_playlist, id_cancion) VALUES (?, ?)',
                   [id_playlist, id_cancion], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                const canciones = await readCancionesPlaylist(id_playlist);
                resolve({ 'songs': canciones.canciones });
            }
        }));
    });
}

function deleteCancionPlaylist(id_cancion, id_playlist) {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Playlist_canciones WHERE id_playlist = ? AND id_cancion = ?',
                   [id_playlist, id_cancion], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                const canciones = await readCancionesPlaylist(id_playlist);
                resolve({ 'songs': canciones.canciones });
            }
        }));
    });
}

function readCancionesPlaylist(id_playlist) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Playlist_canciones pc
                    LEFT JOIN Canciones c ON c.id_cancion = pc.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE pc.id_playlist = ?`, id_playlist, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                let canciones = [];
                for (let cancion of result) {
                    canciones.push({
                        id: cancion.id_cancion,
                        nombre: cancion.nombre,
                        duracion: cancion.duracion,
                        imagen: `${prefijoBucket}Fotos/canciones/${cancion.id_cancio}.jpg`,
                        artista: cancion.artista
                    })
                }
                resolve({ 'canciones': canciones });
            }
        }));
    });
}


//============================================ HISTÓRICO ============================================
function getTopCanciones(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.nombre, a.nombre AS artista, r.contador AS veces FROM Reproducciones r
                    LEFT JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE r.id_usuario = ?
                    ORDER BY veces DESC`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'canciones': result });
            }
        }));
    });
}

function getTopArtistas(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT a.nombre, SUM(r.contador) AS veces FROM Reproducciones r
                    INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = c.id_artista
                    WHERE r.id_usuario = ?
                    GROUP BY a.nombre
                    ORDER BY veces DESC`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'artistas': result });
            }
        }));
    });
}

function getTopAlbums(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT alb.nombre, a.nombre AS artista, SUM(r.contador) AS veces FROM Reproducciones r
                    INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Albumes alb ON alb.id_album = c.id_album
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista
                    WHERE r.id_usuario = ?
                    GROUP BY alb.nombre
                    ORDER BY veces DESC`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'albums': result });
            }
        }));
    });
}

function getHistorial(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT c.nombre, a.nombre AS artista, c.duracion FROM Reproducciones r
                    INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                    INNER JOIN Artistas a ON a.id_artista = alb.id_artista
                    WHERE r.id_usuario = ?
                    GROUP BY alb.nombre
                    ORDER BY r.orden DESC`, id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ 'canciones': result });
            }
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

    getIdAlbum,
    createAlbum,
    readAlbumes,

    getPerfil,
    buscar,

    favorito,
    getFavoritos,

    getIdPlaylist,
    createPlaylist,
    readPlaylists,
    addCancionPlaylist,
    deleteCancionPlaylist,
    readCancionesPlaylist,

    getTopCanciones,
    getTopArtistas,
    getTopAlbums,
    getHistorial
}