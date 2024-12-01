import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config.js";

export const generarToken = (idusuario, nombre, apellido, idrolusuario) => {
    return jwt.sign(
        { usuario: nombre + " " + apellido, idusuario: idusuario, idrol: idrolusuario }, 
        SECRET_JWT_KEY, {
            expiresIn: '1h'
        }
    );
};

export const generarRefreshToken = (idusuario, nombre, apellido, idrolusuario) => {
    return jwt.sign(
        { usuario: nombre + " " + apellido, idusuario: idusuario, idrol: idrolusuario }, 
        SECRET_JWT_KEY, {
            expiresIn: '7d'
        }
    );
};

export default generarToken