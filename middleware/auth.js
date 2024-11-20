const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Autorización por el header
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error('No autenticado, no hay JWT');
        error.status = 401;
        throw error;
    }
    //Obtener el token
    const token = authHeader.split(' ')[1];
    let verificateToken;
    //Verificar el token
    try {
        verificateToken = jwt.verify(token, 'DATACOMPUTERSUPPORT');
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    //Si es un token valido, pero hay algún error
    if (!verificateToken) {
        const error = new Error('No autenticado');
        error.status = 401;
        throw error;
    }
    next();
}