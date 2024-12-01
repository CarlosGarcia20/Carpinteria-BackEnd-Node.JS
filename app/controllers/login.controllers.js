import express from 'express'
import { pool } from "../db.js";
import { compare, encrypt } from "../helpers/handleBcrypt.js";
import validarSesion from '../middlewares/user.token.js';  // Importa el middleware
import generarToken from '../middlewares/generate.token.js';
import { generarRefreshToken } from '../middlewares/generate.token.js';
import { token } from 'morgan';

const app = express()

app.use(validarSesion);

export const login = async(req, res) => {
    const { username, password } = req.body

    if (!username) {
        return res.status(400).json({ message: "Ingresa un usuario para continuar" });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const { idusuario, nombre, apellido, contraseña, idrol } = rows[0]
        const contraseñaHash = await compare(password, contraseña)
        
        if(contraseñaHash) {
            const token = generarToken(idusuario, nombre, apellido, idrol)
            // const refreshToken = generarRefreshToken(idusuario, nombre, apellido, idrol)

            res
            .status(200)
            .json( { token: token } );
            // .cookie('refreshToken', refreshToken, {
            //     httpOnly: true,     //La cookie solo se puede acceder en el servidor
            //     secure: process.env.NODE_ENV == 'production', //la cookie solo se puede acceder en https
            //     sameSite: 'strict',         // la cookie solo se puede acceder en el mismo sitio
            //     maxAge: 1000 * 60 * 60 * 24  // la cookie tiene un tiempo de valiz de 1 hora
            // });                
        } else {
            return res.status(401).json({ message: "La contraseña es incorrecta"} );
        }
    } catch (error) {
        console.error("Error al obtener el usuario: ", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const logout = ((req, res) => {
    res
        .clearCookie('access_token')
        .json({ mensaje: 'Sesión cerrada con exito' })
})

export const registrarUsuario = async (req, res) => {
    const { username, password, nombre, apellido } = req.body;

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await pool.query(
            "SELECT usuario FROM usuarios WHERE usuario = $1",
            [username]
        );

        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ message: `Ya existe un usuario con el nombre ${username}` });
        }

        // Encriptar la contraseña
        const contraseñaHash = await encrypt(password);

        // Insertar el nuevo usuario
        const { rows } = await pool.query(
            "INSERT INTO usuarios (usuario, contraseña, nombre, apellido) VALUES ($1, $2, $3, $4) RETURNING idusuario",
            [username, contraseñaHash, nombre, apellido]
        );

        // Enviar respuesta de exito al frontend
        res.status(200).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error interno del servidor");
    }
};


export const principal = ((req, res) => {
    const { usuario } = req.session
    res.render('index', usuario)
    // if (req.session.usuario) {
    // } else {
    //     res.status(401).json({ message: 'No tienes acceso' });
    // }
})

export const viewProtected = async(req, res) => {
    const { usuario } = req.session
    
    if(!usuario)  return res.status(403).send('Acceso no autorizado')
    res.render('protected', usuario)


    // const token = req.cookies.access_token
    // if(!token) {
    //     return res.status(403).render('index')
    // }

    // try {
    //     const data = jwt.verify(token, SECRET_JWT_KEY)
    //     res.render('protected', data)       //data debe de contener el usernmame
    // } catch (error) {
    //     res.status(401).send('Acceso no autorizado')
    // }
}