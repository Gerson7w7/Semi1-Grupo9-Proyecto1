require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const router = require('./routes')

const app = express();

app.set('port', 2000);
app.use(bodyParser.json());
app.set('json spaces', 2);

const cors = require('cors')
var corsOptions = { origin: true, optionsSuccessStatus: 200 }
app.use(cors(corsOptions))


app.use('/', router)

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});
