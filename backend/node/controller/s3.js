var AWS = require('aws-sdk')

var guardarImagen = async (req, res) => {
    var id = req.body.id;
    var img = req.body.img;

    var nombre = `Fotos/${id}/.jpg`;
    //Conversión de base64 a bytes
    let buff = new Buffer.from(img, 'base64');

    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: '',
        secretAccessKey: ''
    });

    var s3 = new AWS.S3()

    const params = {
        Bucket: 'semi1proyecto1',
        Key: nombre, // Nombre de ubicacion
        Body: buff,
        ContentType: 'image',
    }
    
    const putResult = s3.putObject(params).promise();
    res.json({ mensaje: putResult, status: true })
}

var guardarCancion = async (req, res) => {
    var id = req.body.id;
    var cancion = req.body.cancion;

    var nombre = `Canciones/${id}/.mp3`;
    //Conversión de base64 a bytes
    let buff = new Buffer.from(cancion, 'base64');

    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: '',
        secretAccessKey: ''
    });

    var s3 = new AWS.S3()

    const params = {
        Bucket: 'semi1proyecto1',
        Key: nombre, // Nombre de ubicacion
        Body: buff,
        ContentType: 'song',
    }
    
    const putResult = s3.putObject(params).promise();
    res.json({ mensaje: putResult, status: true })
}

var getImagen = async (req, res) => {
    var id = req.body.id;
    var nombre = `Fotos/${id}.jpg`;

    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: '',
        secretAccessKey: '',
    })

    var S3 = new AWS.S3()

    var getParams = {
        Bucket: 'semi1proyecto1',
        Key: nombre,
    }

    S3.getObject(getParams, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            var dataBase64 = Buffer.from(data.Body).toString('base64'); //resgresar de byte a base 64
            res.json({ mensaje: dataBase64 });
        }
    });
}

var getCancion = async (req, res) => {
    var id = req.body.id;
    var nombre = `Canciones/${id}.jpg`;

    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: '',
        secretAccessKey: '',
    })

    var S3 = new AWS.S3();

    var getParams = {
        Bucket: 'semi1proyecto1',
        Key: nombre,
    }

    S3.getObject(getParams, function (err, data) {
        if (err) {
            res.json(err)
        } else {
            var dataBase64 = Buffer.from(data.Body).toString('base64'); //resgresar de byte a base 64
            res.json({ mensaje: dataBase64 });
        }
    });
}


module.exports = {
    guardarImagen,
    guardarCancion,
    getImagen,
    getCancion
  }