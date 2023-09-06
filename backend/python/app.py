from flask import Flask
from routes.index import router  # Importa el objeto 'router' desde el archivo de rutas

app = Flask(__name__)

# Agrega las rutas al servidor Flask
app.register_blueprint(router)

if __name__ == '__main__':
    app.run(debug=True)

'''
pip install Flask
pip install flask-cors
pip install mysql-connector-python
pip install boto3
'''