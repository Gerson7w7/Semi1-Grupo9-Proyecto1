const conn = require('../database/db.js');

function loginUsuario(correo, password) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 1 FROM Usuarios WHERE correo = '${correo}' AND password = '${password}'`, ((err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve({ status: result.length == 1 });
            }
        }));
    });
}

function registrarUsuario(nombres, apellidos, link_foto, correo, pass, fecha) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 1 FROM Usuarios WHERE correo = '${correo}'`, ((err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: false });
                } else {
                    conn.query(`INSERT INTO Usuarios (nombres, apellidos, foto, correo, password, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?)`,
                    [nombres, apellidos, link_foto, correo, pass, fecha], ((err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve({
                                status: true
                            });
                        }
                    }));
                }
            }
        }));
    });
}

module.exports = {
    loginUsuario,
    registrarUsuario
}