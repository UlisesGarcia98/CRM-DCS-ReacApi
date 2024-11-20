const users = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    //Leer los datos del usuario y colocarlos en Usuarios
    const userRegister = new users(req.body);
    try {
        //console.log("Password before hashing:", userRegister.user_strPassword);  // Verificar el valor de la contraseña
        
        // Hashear la contraseña
        userRegister.user_strPassword = await bcrypt.hash(userRegister.user_strPassword, 12);
        await userRegister.save();
        res.json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error(error);
        res.json({ mensaje: 'Hubo un error' });
    }
}


exports.loginUser = async (req, res ,next) => {


    const { user_strEmail } = req.body;
    const userFind = await users.findOne({ user_strEmail });

    if (!userFind){
         return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }else{
        //El usuario existe y verificar si el password es correcto o no
        const passwordCorrecto = await bcrypt.compare(req.body.user_strPassword, userFind.user_strPassword);
        
        if (!passwordCorrecto){
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
            next();
        }else{
            //Password correcto firmar el token con jsonwebtoken
            const token = jwt.sign({ 
                id: userFind._id,
                emailUser: userFind.user_strEmail,
                password: userFind.user_strPassword}, 
                'DATACOMPUTERSUPPORT', 
                { expiresIn: '1h' });
            res.json({ token });
        }
    }
}