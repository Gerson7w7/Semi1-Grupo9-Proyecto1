from flask import Blueprint, request, jsonify
from controller.mysql import loginUsuario, registrarUsuario
import sha256  # Asegúrate de tener la biblioteca necesaria para el hash SHA-256

router = Blueprint('router', __name__)

@router.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API corriendo"})

@router.route('/login', methods=['POST'])
def login():
    correo = request.json.get('email')
    password = sha256(request.json.get('password'))

    try:
        result = loginUsuario(correo, password)
        if result['status']:
            return jsonify({"ok": True}), 200
        else:
            return jsonify({"ok": False}), 400
    except Exception as e:
        print(e)
        return jsonify({"ok": False}), 400

@router.route('/registro', methods=['POST'])
def registro():
    nombres = request.json.get('nombres')
    apellidos = request.json.get('apellidos')
    imagen = request.json.get('imagen')
    correo = request.json.get('correo')
    password = sha256(request.json.get('password'))
    fecha = request.json.get('fecha')

    if nombres == "" or apellidos == "" or correo == "" or imagen == "":
        return jsonify({"ok": False}), 400
    else:
        # Pendiente guardar imagen en S3 y obtener link
        link_imagen = ''

        try:
            result = registrarUsuario(nombres, apellidos, link_imagen, correo, password, fecha)
            if result['status']:
                return jsonify({"ok": True}), 200
            else:
                return jsonify({"ok": False}), 400
        except Exception as e:
            print(e)
            return jsonify({"ok": False}), 400
