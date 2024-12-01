import jwt from 'jsonwebtoken';  // Asegúrate de importar jwt
import { SECRET_JWT_KEY } from '../config.js';  // Importa tu clave secreta

const validarSesion = (req, res, next) => {
    // const token = req.cookies.access_token;  // Obtener el token de las cookies
    const headerToken = req.headers['authorization'];

    req.session = { usuario: null };  // Inicializar la sesión

    // if (!token) return res.render('index')
    if(headerToken && headerToken.startsWith('Bearer ')) {
        // Tiene token
        try {
            const bearerToken = headerToken.slice(7);
            jwt.verify(bearerToken, SECRET_JWT_KEY);  // Verificar el token

            next();
        } catch (error) {
            return res.status(401).json({ message: "Token no válido" });
        }
    } else {
        return res.status(401).json({ message: "Token no proporcionado" });
    }
};

export default validarSesion;
