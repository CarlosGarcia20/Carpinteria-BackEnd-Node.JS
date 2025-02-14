import { json } from "express";
import { pool } from "../db.js";
import { enviarCorreo } from "../helpers/resend.js";

export const obtenerCotizacionesUsuarios = async (req, res) => {
    const { rows, rowCount } = await pool.query(`
        SELECT
            com_cotizaciones.*,
            conf_muebles.descripcion AS mueble,
            conf_materiales.descripcion AS material,
            CONCAT(usuarios.nombre, ' ', usuarios.apellido) AS nombreusuario
        FROM com_cotizaciones
        INNER JOIN conf_muebles ON conf_muebles.idmueble = com_cotizaciones.idmueble
        INNER JOIN conf_materiales ON conf_materiales.idmaterial = com_cotizaciones.idmaterial
        INNER JOIN usuarios ON usuarios.idusuario = com_cotizaciones.idusuariocreo
    `);

    if(rowCount === 0) {
        return res.status(404).json({ message: "No hay datos disponibles" });
    }

    return res.status(200).json({ rows });
}

export const cambiarEstadoCotizacion = async (req, res) => {
    const { destinatario, asunto, contenido, idCotizacion, estado } = req.body;

    const { rowCount } = await pool.query(`
        UPDATE com_cotizaciones
        SET estado = $1, mensajecorreo = $2
        WHERE idcotizacion = $3
        RETURNING *`,
        [
            estado,
            contenido,
            idCotizacion
        ]
    );

    if(rowCount === 0) {
        return res.status(500).json({ message: "Ocurrió un error al cambiar el estado de la cotización" });
    }

    try {
        const respuesta = await enviarCorreoUsuario(destinatario, asunto, contenido);
    
        if(respuesta.data === null) {
            return res.status(500).json({ message: "Error al enviar el correo", error: respuesta.error });
        }
    
        return res.status(200).json({ message: "Correo enviado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al enviar el correo" });
    }

}

const enviarCorreoUsuario = async (destinatario, asunto, contenido) => {
    const respuesta = await enviarCorreo(destinatario, asunto, contenido);

    return respuesta;
}