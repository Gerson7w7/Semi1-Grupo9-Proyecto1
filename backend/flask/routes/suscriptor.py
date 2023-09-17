from flask import Blueprint, request, jsonify
from controller.mysql import (
    readCanciones, readAlbumes, readArtistas,
    buscar, favorito, getFavoritos
)

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

@suscriptor_routes.route('/buscar', methods=['POST'])
def buscar_palabra():
    try:
        palabra = request.json.get('buscar')
        result = buscar(palabra)
        return jsonify(result), 200

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
        return jsonify(result if result['ok'] else {"ok": False}), 200 if result['ok'] else 400

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
