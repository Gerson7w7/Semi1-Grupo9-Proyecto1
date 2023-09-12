const sha256 = require('js-sha256');
const router = require('express').Router();

const { loginUsuario, registrarUsuario, existeUsuario } = require('../controller/mysql')
const { guardarImagen } = require('../controller/s3');


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
        try {
            const result1 = await existeUsuario(correo);
            if (!result1.status) {
                guardarImagen('usuarios/' + correo, imagen);
                const result = await registrarUsuario(nombres, apellidos, correo, pass, fecha);
                if (result.status) {
                    res.status(200).json({ok: true})
                } else {
                    res.status(400).json({ok: false})
                }
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