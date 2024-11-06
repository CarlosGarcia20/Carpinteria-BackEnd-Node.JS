import jwt from 'jsonwebtoken';  // Asegúrate de importar jwt
import { SECRET_JWT_KEY } from '../config.js';  // Importa tu clave secreta

const validarSesion = (req, res, next) => {
    const token = req.cookies.access_token;  // Obtener el token de las cookies
    req.session = { usuario: null };  // Inicializar la sesión

    // if (!token) return res.render('index')

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);  // Verificar el token
        req.session.usuario = data; 
    } catch {}

    next();
};

export default validarSesion;
