var router = require('express').Router();
const { readCanciones, readAlbumes, readArtistas, favorito } = require('../controller/mysql');

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

router.post('/favorito', async (req, res) => {
    try {
        const id = req.body.id;

    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false })
    }
});

module.exports = router;