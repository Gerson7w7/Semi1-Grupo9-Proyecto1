var sha256 = require('js-sha256')
var router = require('express').Router()
const conn = require('../database/db.js');

const { loginUsuario, registrarUsuario } = require('../controller/mysql')


router.get('/', (req, res) => {
    res.status(200).json({"message": "API corriendo"});
});

router.post('/login', async (req, res) => {
    const correo = req.body.email;
    const pass = sha256(req.body.password);

    try {
        const result = await loginUsuario(correo, pass);
        if (result.status) {
            res.status(200).json({ok: true})
        } else {
            res.status(400).json({ok: false})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/registro', async (req, res) => {
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const imagen = req.body.imagen;
    const correo = req.body.correo;
    const pass = sha256(req.body.password);
    const fecha = req.body.fecha;

    if (nombres === "" || apellidos === "" || correo === "" || imagen === "") {
        res.status(400).json({"ok": false});
    } else {
        //Pendiente guardar imagen en S3 y obtener link
        link_imagen = ''

        try {
            const result = await registrarUsuario(nombres, apellidos, link_imagen, correo, pass, fecha);
            if (result.status) {
                res.status(200).json({ok: true})
            } else {
                res.status(400).json({ok: false})
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ok: false})
        }
    }
});

module.exports = router;