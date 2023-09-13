var router = require('express').Router();
const { readArtistas } = require('../controller/mysql');

router.get('/inicio', async (req, res) => {
    try {

        let respuesta = [];
        const canciones = await readArtistas();
        const albums = await readArtistas();
        const artistas = await readArtistas();

        respuesta.push({"canciones":canciones}, {"albums":albums}, {"artistas":artistas});
        
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(400).json({"canciones":[]}, {"albums":[]}, {"artistas":[]});
    }
});