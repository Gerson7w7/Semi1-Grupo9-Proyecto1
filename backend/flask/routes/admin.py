from flask import Blueprint, request, jsonify
from controller.mysql import (
    getIdArtista, getNombreArtista, createArtista, readArtistas, updateArtista, deleteArtista,
    getIdCancion, createCancion, readCanciones, updateCancion, deleteCancion
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
            nombre_original = getNombreArtista(id)
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
