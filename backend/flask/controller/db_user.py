
import mysql.connector 
import os

db_config = {
    'host': 'semi-p1.ct2boqzs8ewg.us-east-1.rds.amazonaws.com',
    'user': 'admin',
    'password': '123456789',
    'database': 'db_semi1_p1',
    'port': 3306
}

# Inicializa la variable global de conexión
conn = None

# Función para conectar a la base de datos
def connect_to_database():
    global conn
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            print("Conexión a la base de datos establecida.")
    except mysql.connector.Error as e:
        print("Error al conectar a la base de datos:", e)

# Llama a la función para establecer la conexión al iniciar la aplicación
connect_to_database()

prefijoBucket = os.environ.get('PREFIJO_BUCKET')

#============================================= AUTENTICACIÓN ========================================
def loginUsuario(correo, password):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id_usuario FROM Usuarios WHERE correo = %s AND password = %s', (correo, password))
        result = cursor.fetchall()
        if result:
            return {'status': True, 'id_usuario': result[0][0]}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def passwordCorrecto(id_usuario, password):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT password FROM Usuarios WHERE id_usuario = %s AND password = %s', (id_usuario, password))
        result = cursor.fetchall()
        if result:
            return {'status': True}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def existeUsuario(correo):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT 1 FROM Usuarios WHERE correo = %s', (correo,))
        result = cursor.fetchall()
        return {'status': len(result) > 0}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def registrarUsuario(nombres, apellidos, correo, password, fecha):
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO Usuarios (nombres, apellidos, correo, password, fecha_nacimiento) VALUES (%s, %s, %s, %s, %s)', (nombres, apellidos, correo, password, fecha))
        conn.commit()
        return {'status': True, 'id_usuario': cursor.lastrowid}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

#============================================= BÚSQUEDA =============================================
def buscarCanciones(id_usuario, palabra):
    palabra = f'%{palabra}%'
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista, 
                               IF(f.id_usuario IS NOT NULL, true, false) AS esFavorito
                          FROM Canciones c
                          INNER JOIN Artistas a ON a.id_artista = c.id_artista
                          LEFT JOIN Favoritos f ON f.id_cancion = c.id_cancion
                          WHERE c.nombre LIKE %s AND (f.id_usuario = %s OR f.id_usuario IS NULL)''', (palabra, id_usuario))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'id': cancion['id_cancion'],
                'nombre': cancion['nombre'],
                'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                'duracion': cancion['duracion'],
                'artista': cancion['artista'],
                'esFavorito': cancion['esFavorito']
            })
        return {'canciones': canciones}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def buscarAlbumes(palabra):
    palabra = f'%{palabra}%'
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista
                          FROM Albumes alb
                          INNER JOIN Artistas a ON a.id_artista = alb.id_artista
                          WHERE alb.nombre LIKE %s''', (palabra,))
        albumes = []
        for album in cursor:
            cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c INNER JOIN Artistas a ON a.id_artista = c.id_artista WHERE c.id_album = %s', (album['id_album'],))
            canciones = []
            for cancion in cursor:
                canciones.append({
                    'id': cancion['id_cancion'],
                    'nombre': cancion['nombre'],
                    'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                    'duracion': cancion['duracion'],
                    'artista': cancion['artista']
                })
            albumes.append({
                'id': album['id_album'],
                'nombre': album['nombre'],
                'imagen': f"{prefijoBucket}Fotos/albumes/{album['id_album']}.jpg",
                'artista': album['artista'],
                'canciones': canciones
            })
        return {'albums': albumes}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def buscarArtistas(palabra):
    palabra = f'%{palabra}%'
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT id_artista, nombre FROM Artistas
                          WHERE nombre LIKE %s''', (palabra,))
        artistas = []
        for artista in cursor:
            cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c INNER JOIN Artistas a ON a.id_artista = c.id_artista WHERE c.id_artista = %s', (artista['id_artista'],))
            canciones = []
            for cancion in cursor:
                canciones.append({
                    'id': cancion['id_cancion'],
                    'nombre': cancion['nombre'],
                    'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                    'duracion': cancion['duracion'],
                    'artista': cancion['artista']
                })
            artistas.append({
                'id': artista['id_artista'],
                'nombre': artista['nombre'],
                'imagen': f"{prefijoBucket}Fotos/artistas/{artista['id_artista']}.jpg",
                'canciones': canciones
            })
        return {'artistas': artistas}
    except Exception as e:
        raise e
    finally:
        cursor.close()

#============================================= PERFIL =============================================
def getPerfil(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT id_usuario, nombres, apellidos, correo FROM Usuarios WHERE id_usuario = %s', (id_usuario,))
        result = cursor.fetchone()
        if result:
            return {
                'nombre': result['nombres'],
                'apellido': result['apellidos'],
                'imagen': f"{prefijoBucket}Fotos/usuarios/{result['id_usuario']}.jpg",
                'email': result['correo']
            }
        else:
            raise Exception("No existe el usuario")
    except Exception as e:
        raise e
    finally:
        cursor.close()

def modificarPerfil(id_usuario, nombres, apellidos, correo):
    cursor = conn.cursor()
    try:
        cursor.execute('''UPDATE Usuarios
                          SET nombres = CASE WHEN LENGTH(%s) > 0 THEN %s ELSE nombres END,
                          apellidos = CASE WHEN LENGTH(%s) > 0 THEN %s ELSE apellidos END,
                          correo = CASE WHEN LENGTH(%s) > 0 THEN %s ELSE correo END
                          WHERE id_usuario = %s''', (nombres, nombres, apellidos, apellidos, correo, correo, id_usuario))
        conn.commit()
        if cursor.rowcount > 0:
            return {'ok': True}
        else:
            return {'ok': False}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

#=========================================== FAVORITOS ============================================
def favorito(id_usuario, id_cancion):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT 1 FROM Favoritos WHERE id_usuario = %s AND id_cancion = %s', (id_usuario, id_cancion))
        result = cursor.fetchall()
        if result:
            cursor.execute('DELETE FROM Favoritos WHERE id_usuario = %s AND id_cancion = %s', (id_usuario, id_cancion))
            conn.commit()
            if cursor.rowcount > 0:
                return {'ok': True}
            else:
                return {'ok': False}
        else:
            cursor.execute('INSERT INTO Favoritos (id_usuario, id_cancion) VALUES (%s, %s)', (id_usuario, id_cancion))
            conn.commit()
            return {'ok': True}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def getFavoritos(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista 
                          FROM Favoritos f
                          LEFT JOIN Canciones c ON c.id_cancion = f.id_cancion
                          LEFT JOIN Artistas a ON a.id_artista = c.id_artista
                          WHERE f.id_usuario = %s''', (id_usuario,))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'id': cancion['id_cancion'],
                'nombre': cancion['nombre'],
                'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                'duracion': cancion['duracion'],
                'artista': cancion['artista']
            })
        return {'songs': canciones}
    except Exception as e:
        raise e
    finally:
        cursor.close()

#========================================= CRUD PLAYLISTS ==========================================
def getIdPlaylist(id_usuario, nombre):
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT id_playlist FROM Playlists WHERE id_usuario = %s AND nombre = %s', (id_usuario, nombre))
        result = cursor.fetchall()
        if result:
            return {'status': True, 'id_playlist': result[0][0]}
        else:
            return {'status': False}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def createPlaylist(id_usuario, nombre, descripcion, imagen):
    cursor = conn.cursor()
    try:
        descripcion = descripcion if descripcion else ''
        cursor.execute('INSERT INTO Playlists (nombre, descripcion, id_usuario) VALUES (%s, %s, %s)', (nombre, descripcion, id_usuario))
        conn.commit()
        guardarImagen('playlists/' + str(cursor.lastrowid), imagen)
        return {'status': True, 'listado_playlists': readPlaylists(id_usuario)}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def readPlaylists(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT id_playlist, nombre, descripcion FROM Playlists WHERE id_usuario = %s', (id_usuario,))
        playlists = []
        for playlist in cursor:
            playlists.append({
                'nombre': playlist['nombre'],
                'descripcion': playlist['descripcion'],
                'imagen': f"{prefijoBucket}Fotos/playlists/{playlist['id_usuario']}.jpg"
            })
        return {'playlist': playlists}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def addCancionPlaylist(id_cancion, id_playlist):
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO Playlist_canciones (id_playlist, id_cancion) VALUES (%s, %s)', (id_playlist, id_cancion))
        conn.commit()
        canciones = readCancionesPlaylist(id_playlist)
        return {'songs': canciones['canciones']}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def deleteCancionPlaylist(id_cancion, id_playlist):
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM Playlist_canciones WHERE id_playlist = %s AND id_cancion = %s', (id_playlist, id_cancion))
        conn.commit()
        canciones = readCancionesPlaylist(id_playlist)
        return {'songs': canciones['canciones']}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def readCancionesPlaylist(id_playlist):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista 
                          FROM Playlist_canciones pc
                          LEFT JOIN Canciones c ON c.id_cancion = pc.id_cancion
                          INNER JOIN Artistas a ON a.id_artista = c.id_artista
                          WHERE pc.id_playlist = %s''', (id_playlist,))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'id': cancion['id_cancion'],
                'nombre': cancion['nombre'],
                'duracion': cancion['duracion'],
                'imagen': f"{prefijoBucket}Fotos/canciones/{cancion['id_cancion']}.jpg",
                'artista': cancion['artista']
            })
        return {'canciones': canciones}
    except Exception as e:
        raise e
    finally:
        cursor.close()

#============================================ HISTÓRICO ============================================
def getTopCanciones(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT c.nombre, a.nombre AS artista, COUNT(*) AS veces
                          FROM Reproducciones r
                          LEFT JOIN Canciones c ON c.id_cancion = r.id_cancion
                          INNER JOIN Artistas a ON a.id_artista = c.id_artista
                          WHERE r.id_usuario = %s
                          GROUP BY r.id_cancion
                          ORDER BY veces DESC''', (id_usuario,))
        return {'canciones': cursor.fetchall()}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def getTopArtistas(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT a.nombre, COUNT(*) AS veces
                          FROM Reproducciones r
                          INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                          INNER JOIN Artistas a ON a.id_artista = c.id_artista
                          WHERE r.id_usuario = %s
                          GROUP BY a.nombre
                          ORDER BY veces DESC''', (id_usuario,))
        return {'artistas': cursor.fetchall()}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def getTopAlbums(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT alb.nombre, a.nombre AS artista, COUNT(*) AS veces
                          FROM Reproducciones r
                          INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                          INNER JOIN Albumes alb ON alb.id_album = c.id_album
                          INNER JOIN Artistas a ON a.id_artista = alb.id_artista
                          WHERE r.id_usuario = %s
                          GROUP BY alb.nombre, artista
                          ORDER BY veces DESC''', (id_usuario,))
        return {'albums': cursor.fetchall()}
    except Exception as e:
        raise e
    finally:
        cursor.close()

def getHistorial(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''SELECT c.nombre, a.nombre AS artista, c.duracion
                          FROM Reproducciones r
                          INNER JOIN Canciones c ON c.id_cancion = r.id_cancion
                          INNER JOIN Artistas a ON a.id_artista = c.id_artista
                          WHERE r.id_usuario = %s
                          ORDER BY r.id_reproduccion DESC''', (id_usuario,))
        return {'canciones': cursor.fetchall()}
    except Exception as e:
        raise e
    finally:
        cursor.close()

#========================================== REPRODUCCIÓN ==========================================
def reproducirAlbum(id_usuario, id_album):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT id_cancion, nombre FROM Canciones c WHERE id_album = %s', (id_album,))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'nombre': cancion['nombre'],
                'url': f"{prefijoBucket}Canciones/{cancion['id_cancion']}.mp3"
            })
            cursor.execute('INSERT INTO Reproducciones (id_usuario, id_cancion) VALUES (%s, %s)', (id_usuario, cancion['id_cancion']))
        return {'tracks': canciones}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def reproducirArtista(id_usuario, id_artista):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT id_cancion, nombre FROM Canciones c WHERE id_artista = %s', (id_artista,))
        canciones = []
        for cancion in cursor:
            canciones.append({
                'nombre': cancion['nombre'],
                'url': f"{prefijoBucket}Canciones/{cancion['id_cancion']}.mp3"
            })
            cursor.execute('INSERT INTO Reproducciones (id_usuario, id_cancion) VALUES (%s, %s)', (id_usuario, cancion['id_cancion']))
        return {'tracks': canciones}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def reproducirAleatorio(id_usuario):
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT id_cancion, nombre FROM Canciones ORDER BY RAND()')
        canciones = []
        for cancion in cursor:
            canciones.append({
                'nombre': cancion['nombre'],
                'url': f"{prefijoBucket}Canciones/{cancion['id_cancion']}.mp3"
            })
            cursor.execute('INSERT INTO Reproducciones (id_usuario, id_cancion) VALUES (%s, %s)', (id_usuario, cancion['id_cancion']))
        return {'tracks': canciones}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

