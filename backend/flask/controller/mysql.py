import mysql.connector
from database.db import config  # Importa la configuración de tu archivo db.py
from controller.s3 import getImagen, getCancion  # Importa las funciones de s3

# Conecta a la base de datos utilizando la configuración importada
try:
    conn = mysql.connector.connect(**config)
    if conn.is_connected():
        print("conectado")
        cursor = conn.cursor()

        def loginUsuario(correo, password):
            print("login acceso")
            try:
                cursor.execute('SELECT id_usuario FROM Usuarios WHERE correo = %s AND password = %s', (correo, password))
                result = cursor.fetchall()
                if len(result) > 0:
                    return {"status": True, "id_usuario": result[0][0]}
                else:
                    return {"status": False}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def existeUsuario(correo):
            try:
                cursor.execute('SELECT 1 FROM Usuarios WHERE correo = %s', (correo,))
                result = cursor.fetchall()
                return {"status": len(result) > 0}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def registrarUsuario(nombres, apellidos, correo, password, fecha):
            try:
                cursor.execute('INSERT INTO Usuarios (nombres, apellidos, correo, password, fecha_nacimiento) VALUES (%s, %s, %s, %s, %s)',
                               (nombres, apellidos, correo, password, fecha))
                conn.commit()
                return {"status": True, "id_usuario": cursor.lastrowid}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def getIdArtista(nombre):
            try:
                cursor.execute('SELECT id_artista FROM Artistas WHERE nombre = %s', (nombre,))
                result = cursor.fetchall()
                if len(result) > 0:
                    return {"status": True, "id_artista": result[0][0]}
                else:
                    return {"status": False}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def createArtista(nombre, fecha_nacimiento=None):
            try:
                if fecha_nacimiento is not None:
                    cursor.execute('INSERT INTO Artistas (nombre, fecha_nacimiento) VALUES (%s, %s)',
                                   (nombre, fecha_nacimiento))
                else:
                    cursor.execute('INSERT INTO Artistas (nombre) VALUES (%s)', (nombre,))
                conn.commit()
                return {"status": True, "id_artista": cursor.lastrowid}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def readArtistas():
            try:
                cursor.execute('SELECT * FROM Artistas')
                result = cursor.fetchall()
                artistas = []
                for artista in result:
                    try:
                        imagen64 = getImagen('artistas/' + str(artista[0]))
                        string_date = f'{artista[2].year}/{artista[2].month}/{artista[2].day}'
                        artistas.append({
                            'id': artista[0],
                            'imagen': imagen64.image,
                            'nombre': artista[1],
                            'nacimiento': string_date
                        })
                    except Exception as err:
                        print(err)
                return {'artistas': artistas}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {'artistas': []}

        def getNombreArtista(id):
            try:
                cursor.execute('SELECT nombre FROM Artistas WHERE id_artista = %s', (id,))
                result = cursor.fetchall()
                if len(result) > 0:
                    return {"ok": True}
                else:
                    return {"ok": False}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"ok": False}

        def updateArtista(id, nombre, fecha):
            actualizacion = 'SET '
            params = []

            if nombre:
                actualizacion += 'nombre = %s, '
                params.append(nombre)
            if fecha:
                actualizacion += 'fecha = %s, '
                params.append(fecha)

            if actualizacion.endswith(', '):
                actualizacion = actualizacion[:-2]  # Eliminar la última coma y espacio

            params.append(id)

            try:
                cursor.execute(f'UPDATE Artistas {actualizacion} WHERE id_artista = %s', params)
                conn.commit()
                return {"ok": True}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"ok": False}

        def deleteArtista(id):
            try:
                cursor.execute('DELETE Artistas FROM Artistas '
                               'LEFT JOIN Canciones ON Canciones.id_artista = Artistas.id_artista '
                               'LEFT JOIN Albumes ON Albumes.id_artista = Artistas.id_artista '
                               'LEFT JOIN Reproducciones ON Reproducciones.id_cancion = Canciones.id_cancion '
                               'LEFT JOIN Favoritos ON Favoritos.id_cancion = Canciones.id_cancion '
                               'LEFT JOIN Playlist_canciones ON Playlist_canciones.id_cancion = Canciones.id_cancion '
                               'WHERE Artistas.id_artista = %s', (id,))
                if cursor.rowcount > 0:
                    conn.commit()
                    return {"ok": True}
                else:
                    return {"ok": False}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"ok": False}
        #========================================= CRUD CANCIONES ==========================================
        def getIdCancion(nombre, id_artista):
            try:
                cursor.execute('SELECT id_cancion FROM Canciones WHERE nombre = %s AND id_artista = %s', (nombre, id_artista))
                result = cursor.fetchall()
                if len(result) > 0:
                    return {"status": True, "id_cancion": result[0][0]}
                else:
                    return {"status": False}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def createCancion(nombre, duracion, id_artista):
            try:
                cursor.execute('INSERT INTO Canciones (nombre, duracion, id_artista) VALUES (%s, %s, %s)', (nombre, duracion, id_artista))
                conn.commit()
                return {"status": True, "id_cancion": cursor.lastrowid}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"status": False}

        def readCanciones():
            try:
                cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, a.nombre AS artista FROM Canciones c '
                            'INNER JOIN Artistas a ON a.id_artista = c.id_artista')
                result = cursor.fetchall()
                canciones = []
                for cancion in result:
                    try:
                        imagen64 = getImagen('canciones/' + str(cancion[0]))
                        mp3_64 = getCancion(cancion[0])
                        canciones.append({
                            'id': cancion[0],
                            'imagen': imagen64.image,
                            'nombre': cancion[1],
                            'duracion': cancion[2],
                            'mp3': mp3_64.song,
                            'artista': cancion[3]
                        })
                    except Exception as err:
                        print(err)
                return {'canciones': canciones}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {'canciones': []}

        def updateCancion(id, nombre, imagen, duracion, artista, mp3):
            actualizacion = 'SET '
            params = []

            if nombre:
                actualizacion += 'nombre = %s, '
                params.append(nombre)
            if imagen:
                actualizacion += 'imagen = %s, '
                params.append(imagen)
            if duracion != -1:
                actualizacion += 'duracion = %s, '
                params.append(duracion)
            if mp3:
                actualizacion += 'mp3 = %s, '
                params.append(mp3)

            if actualizacion.endswith(', '):
                actualizacion = actualizacion[:-2]  # Eliminar la última coma y espacio

            params.append(id)

            try:
                cursor.execute(f'UPDATE Canciones {actualizacion} WHERE id_cancion = %s', params)
                conn.commit()
                return {"ok": True}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"ok": False}

        def deleteCancion(id):
            try:
                cursor.execute('DELETE FROM Canciones '
                            'LEFT JOIN Reproducciones ON Reproducciones.id_cancion = Canciones.id_cancion '
                            'LEFT JOIN Favoritos ON Favoritos.id_cancion = Canciones.id_cancion '
                            'LEFT JOIN Playlist_canciones ON Playlist_canciones.id_cancion = Canciones.id_cancion '
                            'WHERE Canciones.id_cancion = %s', (id,))
                conn.commit()
                if cursor.rowcount > 0:
                    return {"ok": True}
                else:
                    return {"ok": False}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"ok": False}

        #========================================== CRUD ALBUMES ==========================================
        def readAlbumes():
            try:
                cursor.execute('SELECT alb.id_album, alb.nombre, alb.descripcion, a.nombre AS artista FROM Albumes alb '
                            'INNER JOIN Artistas a ON a.id_artista = alb.id_artista')
                result = cursor.fetchall()
                albumes = []
                for album in result:
                    try:
                        imagen64 = getImagen('albumes/' + str(album[0]))
                        albumes.append({
                            'id': album[0],
                            'imagen': imagen64.image,
                            'nombre': album[1],
                            'artista': album[3]
                        })
                    except Exception as err:
                        print(err)
                return {'albums': albumes}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {'albums': []}

        #============================================= BUSCAR =============================================
        def buscar(palabra):
            try:
                cursor.execute('SELECT * FROM Canciones WHERE nombre LIKE %s', ('%' + palabra + '%',))
                result = cursor.fetchall()
                # Realiza las operaciones necesarias con los resultados de la búsqueda
                # y devuelve la respuesta adecuada.
                # ...
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                # Maneja el error y devuelve la respuesta adecuada.

        #=========================================== FAVORITOS ============================================
        def isFavorito():
            # Implementa la lógica para verificar si una canción es favorita.
            # ...
            print('pendiente')

        def favorito(id_usuario, id_cancion):
            try:
                cursor.execute('SELECT 1 FROM Favoritos WHERE id_usuario = %s AND id_cancion = %s', (id_usuario, id_cancion))
                result = cursor.fetchall()
                if len(result) > 0:
                    # Se quita de favoritos
                    cursor.execute('DELETE FROM Favoritos WHERE id_usuario = %s AND id_cancion = %s', (id_usuario, id_cancion))
                    conn.commit()
                    if cursor.rowcount > 0:
                        return {"ok": True}
                    else:
                        return {"ok": False}
                else:
                    # Se agrega a favoritos
                    cursor.execute('INSERT INTO Favoritos (id_usuario, id_cancion) VALUES (%s, %s)', (id_usuario, id_cancion))
                    conn.commit()
                    return {"ok": True}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {"ok": False}

        def getFavoritos(id_usuario):
            try:
                cursor.execute('SELECT c.id_cancion, c.nombre, c.duracion, art.nombre AS artista FROM Favoritos f '
                            'LEFT JOIN Canciones c ON c.id_cancion = f.id_cancion '
                            'LEFT JOIN Artistas art ON art.id_artista = c.id_artista '
                            'WHERE f.id_usuario = %s', (id_usuario,))
                result = cursor.fetchall()
                canciones = []
                for cancion in result:
                    try:
                        imagen64 = getImagen('canciones/' + str(cancion[0]))
                        canciones.append({
                            'id': cancion[0],
                            'imagen': imagen64.image,
                            'nombre': cancion[1],
                            'duracion': cancion[2],
                            'artista': cancion[3]
                        })
                    except Exception as err:
                        print(err)
                return {'songs': canciones}
            except mysql.connector.Error as e:
                print(f'Error al ejecutar la consulta: {e}')
                return {'songs': []}
        # No olvides cerrar el cursor y la conexión al final
        cursor.close()
        conn.close()
    else:
        print('Error al iniciar conexión')
except mysql.connector.Error as e:
    print(f'Error al conectar a la base de datos: {e}')
