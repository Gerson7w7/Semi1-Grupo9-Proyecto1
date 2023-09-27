from flask import Blueprint, request, jsonify
from controller.db_admin import (
    getIdArtista, createArtista, readArtistas, updateArtista, deleteArtista,
    getIdCancion, createCancion, readCanciones, updateCancion, deleteCancion,
    getIdAlbum, createAlbum, deleteAlbum, readCancionesAlbum, addCancionAlbum, deleteCancionAlbum
)
from controller.s3 import guardarImagen, guardarCancion

admin_routes = Blueprint('admin_routes', __name__)

@admin_routes.route('/crear-artista', methods=['POST'])
def crear_artista():
    try:
        data = request.json
        nombre = data.get('nombre')
        imagen = data.get('imagen')
        fecha = data.get('fecha')

        existente = getIdArtista(nombre)
        if not existente['status']:
            result = createArtista(nombre, fecha)
            if result['status']:
                guardarImagen('artistas/' + str(result['id_artista']), imagen)
                return jsonify({"ok": True}), 200

        return jsonify({"ok": False}), 400

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/get-artistas', methods=['GET'])
def get_artistas():
    try:
        result = readArtistas()
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({'artistas': []}), 400

@admin_routes.route('/actualizar-artista', methods=['POST'])
def actualizar_artista():
    try:
        data = request.json
        id = data.get('id')
        nombre = data.get('nombre')
        imagen = data.get('imagen')
        fecha = data.get('fecha')

        nombre = nombre if nombre else ''
        if imagen:
            nombre_original = getIdArtista(id)['nombre']
            guardarImagen('artistas/' + nombre_original, imagen)
        else:
            imagen = ''

        fecha = fecha if fecha else ''
        result = updateArtista(id, nombre, fecha)
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/eliminar-artista', methods=['POST'])
def eliminar_artista():
    try:
        data = request.json
        id = data.get('id')

        result = deleteArtista(id)
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/crear-cancion', methods=['POST'])
def crear_cancion():
    try:
        data = request.json
        nombre = data.get('nombre')
        imagen = data.get('imagen')
        duracion = data.get('duracion')
        artista = data.get('artista')
        mp3 = data.get('mp3')

        res_artista = getIdArtista(artista)
        if res_artista['status']:
            existente = getIdCancion(nombre, res_artista['id_artista'])
            if not existente['status']:
                result = createCancion(nombre, duracion, res_artista['id_artista'])
                if result['status']:
                    guardarImagen('canciones/' + str(result['id_cancion']), imagen)
                    guardarCancion(result['id_cancion'], mp3)
                    return jsonify({"ok": True}), 200

        return jsonify({"ok": False}), 400

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/get-canciones', methods=['GET'])
def get_canciones():
    try:
        result = readCanciones()
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({'canciones': []}), 400

@admin_routes.route('/actualizar-cancion', methods=['POST'])
def actualizar_cancion():
    try:
        data = request.json
        id = data.get('id')
        nombre = data.get('nombre')
        imagen = data.get('imagen')
        duracion = data.get('duracion')
        artista = data.get('artista')
        mp3 = data.get('mp3')

        nombre = nombre if nombre else ''
        if imagen:
            # guardar imagen en S3 y obtener link, guardar en imagen
            pass
        else:
            imagen = ''

        duracion = duracion if duracion else -1
        artista = artista if artista else ''
        if mp3:
            # guardar cancion en S3 y obtener link, guardar en cmp3
            pass
        else:
            mp3 = ''

        result = updateCancion(id, nombre, imagen, duracion, artista, mp3)
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/eliminar-cancion', methods=['POST'])
def eliminar_cancion():
    try:
        data = request.json
        id = data.get('id')

        result = deleteCancion(id)
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/crear-album', methods=['POST'])
def crear_album():
    try:
        data = request.json
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        imagen = data.get('imagen')
        artista = data.get('artista')

        res_artista = getIdArtista(artista)
        if res_artista['status']:
            existente = getIdAlbum(nombre, res_artista['id_artista'])
            if not existente['status']:
                result = createAlbum(nombre, descripcion, res_artista['id_artista'])
                if result['status']:
                    guardarImagen('albumes/' + str(result['id_album']), imagen)
                    return jsonify({"ok": True}), 200

        return jsonify({"ok": False}), 400

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/delete-album', methods=['POST'])
def eliminar_album():
    try:
        data = request.json
        id_album = data.get('id')

        result = deleteAlbum(id_album)
        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/album', methods=['POST'])
def album():
    try:
        nombre = request.json
        id_album = getIdAlbum(nombre)
        if id_album['status']:
            result = readCancionesAlbum(id_album['id_album'])
            return jsonify({"songs": result['canciones']}), 200
        return jsonify({"songs": []}), 400

    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@admin_routes.route('/album/<nombre>', methods=['GET'])
def obtener_album(nombre):
    try:
        album = getIdAlbum(nombre)
        if album['status']:
            result = readCancionesAlbum(album['id_album'])
            return jsonify({"songs": result['canciones']}), 200
        return jsonify({"songs": []}), 200

    except Exception as e:
        print(e)
        return jsonify({"songs": []}), 200

@admin_routes.route('/add-song-album', methods=['POST'])
def agregar_cancion_album():
    try:
        data = request.json
        id_cancion = data.get('id_cancion')
        nombre_album = data.get('nombre_album')
        artista = data.get('artista')

        res_artista = getIdArtista(artista)
        if res_artista['status']:
            album = getIdAlbum(nombre_album, res_artista['id_artista'])
            if not album['status']:
                result = addCancionAlbum(id_cancion, album['id_album'])
                if result['status']:
                    c = readCancionesAlbum(album['id_album'])
                    return jsonify({"songs": c['canciones']}), 200

        return jsonify({"songs": []}), 400

    except Exception as e:
        print(e)
        return jsonify({"songs": []}), 400

@admin_routes.route('/delete-song-album', methods=['POST'])
def eliminar_cancion_album():
    try:
        data = request.json
        id_cancion = data.get('id_cancion')
        nombre_album = data.get('nombre_album')
        artista = data.get('artista')

        res_artista = getIdArtista(artista)
        if res_artista['status']:
            album = getIdAlbum(nombre_album, res_artista['id_artista'])
            if not album['status']:
                result = deleteCancionAlbum(id_cancion, album['id_album'])
                if result['status']:
                    c = readCancionesAlbum(album['id_album'])
                    return jsonify({"songs": c['canciones']}), 200

        return jsonify({"songs": []}), 400

    except Exception as e:
        print(e)
        return jsonify({"songs": []}), 400
