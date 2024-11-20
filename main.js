const express = require('express');
const routes = require('./routes/mainRoutes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path: 'variables.env'});

// Cors permite que un cliente se conecte a otro servidor para el intercambio de recursos
const cors = require('cors');

// Conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL_MONGOATLAS);

// Crear el servidor
const app = express();

// Habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Definir un dominio para recibir las peticiones
const whiteList = [process.env.FRONEND_URL];
const corsOptions = {
    origin: (origin, callback) =>{
        //console.log(origin);
        //Revisar si la petición viene de un servidor de la WhiteList
        const exists = whiteList.some(dominio => dominio === origin);
        if(exists){
            callback(null, true);
        } else {
            callback(new Error('No permitido'), false);
        }
    }
}

// Habilitar cors
app.use(cors(corsOptions));

// Rutas de la API
app.use('/', routes());

// Ruta pública de imágenes
app.use(express.static('uploads'));

// Manejador de errores global (debe ir después de todas las rutas y middlewares) Solo colocar al final de terminar el proyecto
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;  // Código de estado por defecto es 500
    const message = error.message || 'Algo salió mal';  // Mensaje de error por defecto
    res.status(statusCode).json({ message });  // Solo devolvemos el mensaje del error
});

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// Puerto
app.listen(port, host, () => {
    console.log('Server running on http://localhost:5000');
});
