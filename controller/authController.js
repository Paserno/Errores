const { response } = require("express");
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



// Crear Usuario
const crearUsuario = async (req, res = response) => {


    try {
        const { email, password } = req.body;
        //verificar que el email no existe
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }
        const usuario = new Usuario(req.body);
        //encripar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        //Guardar usuario en BD
        await usuario.save();

        //Generar el JWToken
        const token = await generarJWT(usuario.id);



        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        });
    }
}
// Login
const Login = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        // Verificar existencia del correo
        const usuarioDB= await Usuario.findOne({email});
        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        //Validar la contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no es correcta'
            });
        }

        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        });
    }


   
}
// RenewToken
const RevalidarToken = async (req, res = response) => {

    const uid = req.uid;
    // Generar un nuevo JWT
    const token = await generarJWT(uid);
    //Obtener usuario por UID
    const usuario= await Usuario.findById(uid);
    res.json({
        ok: true,
        usuario,
        token
    });

}

module.exports = {
    crearUsuario,
    Login,
    RevalidarToken
}