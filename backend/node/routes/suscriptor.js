var router = require('express').Router();
const { readCanciones, readAlbumes, readArtistas,
        getPerfil, buscar,
        favorito, getFavoritos,
        getIdPlaylist, createPlaylist, readPlaylists, addCancionPlaylist, deleteCancionPlaylist, readCancionesPlaylist,
        getTopCanciones, getTopArtistas, getTopAlbums, getHistorial } = require('../controller/mysql');

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

router.post('/perfil', async(req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const perfil = await getPerfil(id_usuario);
        res.status(200).json(perfil)
    } catch (error) {
        console.log(error);
        res.status(400).json({ imagen: '', nombre: '', apellido: '', email: '' })
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

router.post('/playlist', async (req, res) => {
    try {
        const { id_usuario, nombre, descripcion, imagen } = req.body;
        
        const existente = await getIdPlaylist(id_usuario, nombre);
        if (!existente.status) {
            const result = await createPlaylist(id_usuario, nombre, descripcion, imagen);
            if (result.status) {
                return res.status(200).json(result.listado_playlists);
            }
        }
        res.status(400).json({ok: false, playlist: [] });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false, playlist: [] })
    }
});

router.post('/playlists', async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const result = await readPlaylists(id_usuario);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ playlist: [] })
    }
});

router.post('/playlist/add-song', async(req, res) => {
    try {
        const { id_usuario, id_cancion, nombre_playlist } = req.body;
        const playlist = await getIdPlaylist(id_usuario, nombre_playlist);
        if (playlist.status) {
            const result = await addCancionPlaylist(id_cancion, playlist.id_playlist);
            return res.status(200).json(result);
        }
        res.status(400).json({songs: []});
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] })
    }
});

router.post('/playlist/delete-song', async(req, res) => {
    try {
        const { id_usuario, id_cancion, nombre_playlist } = req.body;
        const playlist = await getIdPlaylist(id_usuario, nombre_playlist);
        if (playlist.status) {
            const result = await deleteCancionPlaylist(id_cancion, playlist.id_playlist);
            return res.status(200).json(result);
        }
        res.status(400).json({songs: []});
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] })
    }
});

router.post('/inplaylist', async(req, res) => {
    try {
        const { id_usuario, nombre } = req.body;
        const playlist = await getIdPlaylist(id_usuario, nombre);
        if (playlist.status) {
            const result = await readCancionesPlaylist(playlist.id_playlist);
            return res.status(200).json( { songs: result.canciones });
        }
        res.status(400).json({ songs: [] });
    } catch (error) {
        console.log(error);
        res.status(400).json({ songs: [] })
    }
});

router.post('/historial', async(req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        const topC = await getTopCanciones(id_usuario);
        const topA = await getTopArtistas(id_usuario);
        const topAlb = await getTopAlbums(id_usuario);
        const historialC = await getHistorial(id_usuario);
        return res.status(200).json({ cancionesRep: topC.canciones, artistaRep: topA.artistas,
                                      albumRep: topAlb.albums, historial: historialC.canciones });
    } catch (error) {
        console.log(error);
        res.status(400).json({ cancionesRep: [], artistaRep: [], albumRep: [], historial: [] })
    }
});

module.exports = router;