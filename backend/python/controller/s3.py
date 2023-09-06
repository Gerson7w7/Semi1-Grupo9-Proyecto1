import boto3
from botocore.exceptions import NoCredentialsError
import base64
from io import BytesIO
from flask import jsonify, request

# Configura las credenciales de AWS
AWS_ACCESS_KEY_ID = 'tu_access_key_id'
AWS_SECRET_ACCESS_KEY = 'tu_secret_access_key'
AWS_REGION = 'us-east-2'
S3_BUCKET_NAME = 'semi1proyecto1'

s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def guardar_imagen(req):
    id = req.json.get('id')
    img = req.json.get('img')

    nombre = f'Fotos/{id}.jpg'
    # Conversión de base64 a bytes
    buff = base64.b64decode(img)

    try:
        s3.upload_fileobj(BytesIO(buff), S3_BUCKET_NAME, nombre)
        return jsonify({"mensaje": "Imagen guardada correctamente", "status": True})
    except Exception as e:
        return jsonify({"mensaje": str(e), "status": False})

def guardar_cancion(req):
    id = req.json.get('id')
    cancion = req.json.get('cancion')

    nombre = f'Canciones/{id}.mp3'
    # Conversión de base64 a bytes
    buff = base64.b64decode(cancion)

    try:
        s3.upload_fileobj(BytesIO(buff), S3_BUCKET_NAME, nombre)
        return jsonify({"mensaje": "Canción guardada correctamente", "status": True})
    except Exception as e:
        return jsonify({"mensaje": str(e), "status": False})

def get_imagen(req):
    id = req.json.get('id')
    nombre = f'Fotos/{id}.jpg'

    try:
        response = s3.get_object(Bucket=S3_BUCKET_NAME, Key=nombre)
        data = response['Body'].read()
        data_base64 = base64.b64encode(data).decode('utf-8')
        return jsonify({"mensaje": data_base64})
    except Exception as e:
        return jsonify({"mensaje": str(e)})

def get_cancion(req):
    id = req.json.get('id')
    nombre = f'Canciones/{id}.mp3'

    try:
        response = s3.get_object(Bucket=S3_BUCKET_NAME, Key=nombre)
        data = response['Body'].read()
        data_base64 = base64.b64encode(data).decode('utf-8')
        return jsonify({"mensaje": data_base64})
    except Exception as e:
        return jsonify({"mensaje": str(e)})
