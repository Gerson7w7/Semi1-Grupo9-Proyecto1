from flask import Blueprint, request, jsonify
import hashlib
from controller.db_admin import (
    readCanciones, readAlbumes, readArtistas, getIdArtistaCancion
)
from controller.db_user import (
    getPerfil, passwordCorrecto, modificarPerfil, buscarCanciones, buscarAlbumes, buscarArtistas,
    favorito, getFavoritos,
    getIdPlaylist, createPlaylist, readPlaylists, addCancionPlaylist, deleteCancionPlaylist, readCancionesPlaylist,
    getTopCanciones, getTopArtistas, getTopAlbums, getHistorial,
    reproducirAlbum, reproducirArtista, reproducirAleatorio
)
from controller.s3 import guardarImagen

suscriptor_routes = Blueprint('suscriptor_routes', __name__)

@suscriptor_routes.route('/inicio', methods=['GET'])
def inicio():
    try:
        c = readCanciones()
        alb = readAlbumes()
        art = readArtistas()

        return jsonify({"canciones": c["canciones"], "albums": alb["albums"], "artistas": art["artistas"]}), 200

    except Exception as error:
        print(error)
        return jsonify({"canciones": [], "albums": [], "artistas": []}), 400

@suscriptor_routes.route('/perfil', methods=['POST'])
def obtener_perfil():
    try:
        id_usuario = request.json.get('id_usuario')
        perfil = getPerfil(id_usuario)
        return jsonify(perfil), 200

    except Exception as error:
        print(error)
        return jsonify({"imagen": '', "nombre": '', "apellido": '', "email": ''}), 400

@suscriptor_routes.route('/modificar-perfil', methods=['POST'])
def modificar_perfil():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        imagen = data.get('imagen')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        password = data.get('password')

        correcto = passwordCorrecto(id_usuario, hashlib.sha256(password.encode()).hexdigest())

        if correcto['status']:
            result = modificarPerfil(id_usuario, nombre, apellido, email)
            if imagen != "":
                guardarImagen('usuarios/' + id_usuario, imagen)
                result['ok'] = True
            return jsonify(result), 200

        return jsonify({"ok": False}), 400

    except Exception as error:
        print(error)
        return jsonify({"ok": False}), 400

@suscriptor_routes.route('/buscar', methods=['POST'])
def buscar_palabra():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        buscar = data.get('buscar')

        c = buscarCanciones(id_usuario, buscar)
        alb = buscarAlbumes(buscar)
        art = buscarArtistas(buscar)

        return jsonify({"canciones": c["canciones"], "albums": alb["albums"], "artistas": art["artistas"]}), 200

    except Exception as error:
        print(error)
        return jsonify({"ok": False}), 400

@suscriptor_routes.route('/favorito', methods=['POST'])
def marcar_favorito():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        fav = data.get('fav')

        result = favorito(id_usuario, fav)
        status_code = 200 if result['ok'] else 400

        return jsonify(result), status_code

    except Exception as error:
        print(error)
        return jsonify({"ok": False}), 400

@suscriptor_routes.route('/favorites', methods=['POST'])
def obtener_favoritos():
    try:
        id_usuario = request.json.get('id_usuario')
        result = getFavoritos(id_usuario)
        return jsonify(result), 200

    except Exception as error:
        print(error)
        return jsonify({"songs": []}), 400

# Resto de las rutas y controladores...

@suscriptor_routes.route('/playlist', methods=['POST'])
def crear_o_actualizar_playlist():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        imagen = data.get('imagen')

        existente = getIdPlaylist(id_usuario, nombre)
        
        if not existente['status']:
            result = createPlaylist(id_usuario, nombre, descripcion, imagen)
            if result['status']:
                return jsonify(result['listado_playlists']), 200

        return jsonify({"ok": False, "playlist": []}), 400

    except Exception as error:
        print(error)
        return jsonify({"ok": False, "playlist": []}), 400

@suscriptor_routes.route('/playlists', methods=['POST'])
def obtener_playlists():
    try:
        id_usuario = request.json.get('id_usuario')
        result = readPlaylists(id_usuario)
        return jsonify(result), 200

    except Exception as error:
        print(error)
        return jsonify({"playlist": []}), 400

@suscriptor_routes.route('/playlist/add-song', methods=['POST'])
def agregar_cancion_a_playlist():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        id_cancion = data.get('id_cancion')
        nombre_playlist = data.get('nombre_playlist')

        playlist = getIdPlaylist(id_usuario, nombre_playlist)
        
        if playlist['status']:
            result = addCancionPlaylist(id_cancion, playlist['id_playlist'])
            return jsonify(result), 200

        return jsonify({"songs": []}), 400

    except Exception as error:
        print(error)
        return jsonify({"songs": []}), 400

@suscriptor_routes.route('/playlist/delete-song', methods=['POST'])
def eliminar_cancion_de_playlist():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        id_cancion = data.get('id_cancion')
        nombre_playlist = data.get('nombre_playlist')

        playlist = getIdPlaylist(id_usuario, nombre_playlist)
        
        if playlist['status']:
            result = deleteCancionPlaylist(id_cancion, playlist['id_playlist'])
            return jsonify(result), 200

        return jsonify({"songs": []}), 400

    except Exception as error:
        print(error)
        return jsonify({"songs": []}), 400

@suscriptor_routes.route('/inplaylist', methods=['POST'])
def obtener_canciones_de_playlist():
    try:
        data = request.json
        id_usuario = data.get('id_usuario')
        nombre = data.get('nombre')

        playlist = getIdPlaylist(id_usuario, nombre)
        
        if playlist['status']:
            result = readCancionesPlaylist(playlist['id_playlist'])
            return jsonify({"songs": result['canciones']}), 200

        return jsonify({"songs": []}), 400

@suscriptor_routes.route('/historial', methods=['POST'])
def obtener_historial():
    try:
        id_usuario = request.json.get('id_usuario')
        topC = getTopCanciones(id_usuario)
        topA = getTopArtistas(id_usuario)
        topAlb = getTopAlbums(id_usuario)
        historialC = getHistorial(id_usuario)
        return jsonify({"cancionesRep": topC['canciones'], "artistaRep": topA['artistas'],
                        "albumRep": topAlb['albums'], "historial": historialC['canciones']}), 200

    except Exception as error:
        print(error)
        return jsonify({"cancionesRep": [], "artistaRep": [], "albumRep": [], "historial": []}), 400

@suscriptor_routes.route('/reproducir', methods=['POST'])
def reproducir():
    try:
        data = request.json
        id = data.get('id')
        tipo = data.get('tipo')
        id_usuario = data.get('id_usuario')
        
        if tipo == 0:  # Canciones
            resultArtista = getIdArtistaCancion(id)
            if resultArtista['status']:
                result = reproducirArtista(id_usuario, resultArtista['id_artista'])
                return jsonify(result), 200
        elif tipo == 1:  # Album
            result = reproducirAlbum(id_usuario, id)
            return jsonify(result), 200
        elif tipo == 2:  # Artista
            result = reproducirArtista(id_usuario, id)
            return jsonify(result), 200

        return jsonify({"tracks": []}), 400

    except Exception as error:
        print(error)
        return jsonify({"tracks": []}), 400

@suscriptor_routes.route('/reproducir-aleatorio', methods=['POST'])
def reproducir_aleatorio():
    try:
        id_usuario = request.json.get('id_usuario')
        result = reproducirAleatorio(id_usuario)
        return jsonify(result), 200

    except Exception as error:
        print(error)
        return jsonify({"tracks": []}), 400

# Finalmente, exportamos el blueprint

