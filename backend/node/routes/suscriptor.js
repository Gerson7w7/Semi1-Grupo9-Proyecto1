var router = require('express').Router();
const { readCanciones, readAlbumes, readArtistas,
        buscar,
        favorito, getFavoritos } = require('../controller/mysql');

router.get('/inicio', async (req, res) => {
    try {
        const c = await readCanciones();
        const alb = await readAlbumes();
        const art = await readArtistas();
        
        res.status(200).json({ canciones: c.canciones, albums: alb.albums, artistas: art.artistas });
    } catch (error) {
        console.log(error);
        res.status(400).json({canciones:[]}, {albums:[]}, {artistas:[]});
    }
});

router.post('/buscar', async (req, res) => {
    try {
        const palabra = req.body.buscar;
        const result = await buscar(palabra);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false });
    }
});

router.post('/favorito', async (req, res) => {
    try {
        const { id_usuario, fav } = req.body;
        const result = await favorito(id_usuario, fav);
        res.status(result.ok? 200: 400).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false });
    }
});

router.post('/favorites', async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const result = await getFavoritos(id_usuario);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] });
    }
});

module.exports = router;