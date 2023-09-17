import boto3
import base64

bucket = 'semi1-ht-p1-202004707'
region='us-east-1'  # Reemplaza 'tu_region' con la región de AWS apropiada
access_key_id = 'tu_access_key_id'  # Reemplaza 'tu_access_key_id' con tus credenciales de AWS
secret_access_key = 'tu_secret_access_key'  # Reemplaza 'tu_secret_access_key' con tus credenciales de AWS

# Configura las credenciales de AWS
s3 = boto3.client(
    's3',
    aws_access_key_id=access_key_id,
    aws_secret_access_key=secret_access_key,
    region_name=region
)

def guardarImagen(id, img_base64):
    nombre = f'Fotos/{id}.jpg'
    # Conversión de base64 a bytes
    img_bytes = base64.b64decode(img_base64)

    try:
        s3.put_object(Bucket=bucket, Key=nombre, Body=img_bytes, ContentType='image')
    except Exception as e:
        print(e)

def guardarCancion(id, mp3_base64):
    nombre = f'Canciones/{id}.mp3'
    # Conversión de base64 a bytes
    mp3_bytes = base64.b64decode(mp3_base64)

    try:
        s3.put_object(Bucket=bucket, Key=nombre, Body=mp3_bytes, ContentType='audio/mpeg')
    except Exception as e:
        print(e)

def getImagen(id):
    nombre = f'Fotos/{id}.jpg'

    try:
        response = s3.get_object(Bucket=bucket, Key=nombre)
        data = response['Body'].read()
        data_base64 = base64.b64encode(data).decode('utf-8')
        return data_base64
    except Exception as e:
        print(e)
        return ''

def getCancion(id):
    nombre = f'Canciones/{id}.mp3'

    try:
        response = s3.get_object(Bucket=bucket, Key=nombre)
        data = response['Body'].read()
        data_base64 = base64.b64encode(data).decode('utf-8')
        return data_base64
    except Exception as e:
        print(e)
        return ''

# Utiliza estas funciones en tu código Python según sea necesario.
