import { pool } from "../db.js";

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