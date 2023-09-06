import mysql.connector
from database.db import config  # Importa la configuración de tu archivo db.py

# Conecta a la base de datos utilizando la configuración importada
try:
    conn = mysql.connector.connect(**config)
    if conn.is_connected():
        cursor = conn.cursor()

        def loginUsuario(correo, password):
            query = "SELECT 1 FROM Usuarios WHERE correo = %s AND password = %s"
            cursor.execute(query, (correo, password))
            result = cursor.fetchall()

            if len(result) == 1:
                return {"status": True}
            else:
                return {"status": False}

        def registrarUsuario(nombres, apellidos, link_foto, correo, password, fecha):
            query_check = "SELECT 1 FROM Usuarios WHERE correo = %s"
            cursor.execute(query_check, (correo,))
            result_check = cursor.fetchall()

            if len(result_check) > 0:
                return {"status": False}
            else:
                query_insert = "INSERT INTO Usuarios (nombres, apellidos, foto, correo, password, fecha_nacimiento) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(query_insert, (nombres, apellidos, link_foto, correo, password, fecha))
                conn.commit()
                return {"status": True}

        # No olvides cerrar el cursor y la conexión al final
        cursor.close()
        conn.close()
    else:
        print('Error al iniciar conexion')
except mysql.connector.Error as e:
    print(f'Error al conectar a la base de datos: {e}')
