var router = require('express').Router();

const { getIdArtista, getNombreArtista, createArtista, readArtistas, updateArtista, deleteArtista,
        getIdCancion, createCancion, readCanciones, updateCancion, deleteCancion,
        getIdAlbum, createAlbum } = require('../controller/mysql');

const { guardarImagen, guardarCancion } = require('../controller/s3');

router.post('/crear-artista', async (req, res) => {
    const { nombre, imagen, fecha } = req.body;
    try {
        const existente = await getIdArtista(nombre);
        if (!existente.status) {
            const result = await createArtista(nombre, fecha);
            if (result.status) {
                guardarImagen('artistas/'+ result.id_artista, imagen);
                return res.status(200).json({ok: true});
            }
        }
        res.status(400).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.get('/get-artistas', async (req, res) => {
    try {
        const result = await readArtistas();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ 'artistas': [] });
    }
});

router.post('/actualizar-artista', async (req, res) => {
    let { id, nombre, imagen, fecha } = req.body;
    try {
        nombre = nombre? nombre : '';
        if (imagen) {
            const nombre_original = await getNombreArtista(id);
            guardarImagen('artistas/'+ nombre_original, imagen);
        } else {
            imagen = ''
        }
        fecha = fecha? fecha : '';
        const result = await updateArtista(id, nombre, fecha);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.post('/eliminar-artista', async (req, res) => {
    const id = req.body.id;
    try {
        const result = await deleteArtista(id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.post('/crear-cancion', async (req, res) => {
    const { nombre, imagen, duracion, artista, mp3 } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const existente = await getIdCancion(nombre, res_artista.id_artista);
            if (!existente.status) {
                const result = await createCancion(nombre, duracion, res_artista.id_artista);
                if (result.status) {
                    guardarImagen('canciones/'+ result.id_cancion, imagen);
                    guardarCancion(result.id_cancion, mp3)
                    return res.status(200).json({ok: true});
                }   
            }
        }
        res.status(400).json({ok: false})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.get('/get-canciones', async (req, res) => {
    try {
        const result = await readCanciones();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({canciones: []});
    }
});

router.post('/actualizar-cancion', async (req, res) => {
    const { id, nombre, imagen, duracion, artista, mp3 } = req.body;
    try {
        nombre = nombre? nombre : '';
        if (imagen) {
            //guardar imagen en S3 y obtener link, guardar en imagen
        } else {
            imagen = ''
        }
        duracion = duracion? duracion: -1;
        artista = artista? artista: '';
        if (mp3) {
            //guardar cancion en S3 y obtener link, guardar en cmp3
        } else {
            mp3 = ''
        }
        const result = await updateCancion(id, nombre, imagen, duracion, artista, mp3);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false});
    }
});

router.post('/eliminar-cancion', async (req, res) => {
    const id = req.body.id;
    try {
        const result = await deleteCancion(id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

router.post('/crear-album', async (req, res) => {
    const { nombre, descripcion, imagen, artista } = req.body;
    try {
        const res_artista = await getIdArtista(artista);
        if (res_artista.status) {
            const existente = await getIdAlbum(nombre, res_artista.id_artista);
            if (!existente.status) {
                const result = await createAlbum(nombre, descripcion, res_artista.id_artista);
                if (result.status) {
                    guardarImagen('albumes/'+ result.id_album, imagen);
                    return res.status(200).json({ok: true});
                }   
            }
        }
        res.status(400).json({ok: false})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

module.exports = router;