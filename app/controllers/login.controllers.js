import express from 'express'
import { pool } from "../db.js";
import { compare, encrypt } from "../helpers/handleBcrypt.js";
import validarSesion from '../middlewares/user.token.js';  // Importa el middleware
import generarToken from '../middlewares/generate.token.js';
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
            return res.status(404).send("Usuario no encontrado");
        }
        const { idusuario, nombre, apellido, contraseña, idrolusuario } = rows[0]
        const contraseñaHash = await compare(password, contraseña)
        
        if(contraseñaHash) {
            const token = generarToken(idusuario, nombre, apellido, idrolusuario)

            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,     //La cookie solo se puede acceder en el servidor
                    secure: process.env.NODE_ENV == 'production', //la cookie solo se puede acceder en https
                    sameSite: 'strict',         // la cookie solo se puede acceder en el mismo sitio
                    maxAge: 1000 * 60 * 60  // la cookie tiene un tiempo de valiz de 1 hora
                })
                .send("Inicio correcto")
                
        } else {
            return res.status(401).send("La contraseña es incorrecta");
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

export const registrarUsuario = async(req, res) => {
    const { usuario, contraseña, nombre, apellido } = req.body
    console.log({ usuario, contraseña });
    
    try {
        const contraseñaHash = await encrypt(contraseña);
        const { rows } = await pool.query(
            "INSERT INTO  usuarios (usuario, contraseña, nombre, apellido) VALUES ($1, $2, $3, $4) RETURNING idusuario", [usuario, contraseñaHash, nombre, apellido]
        )
        const { idusuario, idrolusuario } = rows[0]
        const token = generarToken(idusuario, nombre, apellido, idrolusuario)

        return res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,     //La cookie solo se puede acceder en el servidor
                secure: process.env.NODE_ENV == 'production', //la cookie solo se puede acceder en https
                sameSite: 'strict',         // la cookie solo se puede acceder en el mismo sitio
                maxAge: 1000 * 60 * 60  // la cookie tiene un tiempo de valiz de 1 hora
            })
            .send("Usuario creado con éxito")
    } catch (error) {
        return res.status(500).send("Error interno del servidor")
    }
    
}

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