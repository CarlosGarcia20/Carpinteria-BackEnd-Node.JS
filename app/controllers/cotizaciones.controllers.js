import e, { json } from "express";
import { pool } from "../db.js";

// Funciones a exportar del catalogo
export const getFurniture = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM conf_muebles
            WHERE activo = 'S'
            ORDER BY descripcion ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const getMaterial = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM conf_materiales
            WHERE activo = 'S'
            ORDER BY descripcion ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const obtenerTipoMueble = async (req, res) => {
    try {
        const { idMueble } = req.params;

         const { rows } = await pool.query(
            `SELECT 
                conf_tipomueble.*,
                conf_muebles.descripcion AS mueble
            FROM conf_tipomueble
            INNER JOIN conf_muebles ON conf_muebles.idmueble = conf_tipomueble.idmueble
            WHERE conf_tipomueble.idmueble = $1 
            AND conf_tipomueble.activo = 'S'
            ORDER BY descripcion ASC`,
            [
                idMueble
            ]
        );

        if(rows.length == 0) {
            return res.status(404).json({ error: "data0" });
        }

        return res.status(200).json( rows );
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

// A partir de aqui son cotizaciones

export const crearCotizacion = async(req, res) => {
    try {
        const {
            idMueble, idMaterial, dimensiones, cantidad, idUsuarioCreo, color, fecha, imagen
        } = req.body;
        const imagenRuta = req.file ? req.file.path : null;  // Ruta donde se almacena la imagen

        const { rows } = await pool.query(
            `INSERT INTO com_cotizaciones (
                idmueble, idmaterial, dimensiones, cantidad, estado, idusuariocreo, colorhex, fecha, imagen
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                idMueble,
                idMaterial,
                dimensiones,
                cantidad,
                "PA",
                idUsuarioCreo,
                color,
                fecha,
                imagenRuta
            ]
        );

        return res.status(200).json({ message: "Cotización creada con éxito" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const obtenerCotizacionesPorUsuario = async(req, res) => {
    try {
        const { idUser } = req.params;

        const { rows, rowCount } = await pool.query(`
            SELECT 
                com_cotizaciones.idcotizacion,
                com_cotizaciones.dimensiones,
                com_cotizaciones.cantidad,
                com_cotizaciones.estado,
                com_cotizaciones.colorhex,
                com_cotizaciones.fecha,
                com_cotizaciones.imagen,
                com_cotizaciones.mensajecorreo,
                conf_muebles.descripcion AS mueble,
                conf_materiales.descripcion AS material,
                com_cotizaciones.idmaterial,
                com_cotizaciones.idmueble
            FROM com_cotizaciones
            INNER JOIN conf_muebles ON conf_muebles.idmueble = com_cotizaciones.idmueble
            INNER JOIN conf_materiales ON conf_materiales.idmaterial = com_cotizaciones.idmaterial
            WHERE idusuariocreo = $1
            `,
            [idUser]
        );

        if(rowCount < 1) {
            return res.status(404).json({ message: "Aún no ha creado cotizaciones" });
        }

        return res.status(200).json({ rows });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const obtenerCotizacionesAceptadasPorUsuario = async(req, res) => {
    try {
        const { idUser } = req.params;

        const { rows, rowCount } = await pool.query(`
            SELECT 
                com_cotizaciones.idcotizacion,
                com_cotizaciones.dimensiones,
                com_cotizaciones.cantidad,
                com_cotizaciones.estado,
                com_cotizaciones.colorhex,
                com_cotizaciones.fecha,
                com_cotizaciones.imagen,
                conf_muebles.descripcion AS mueble,
                conf_materiales.descripcion AS material,
                com_cotizaciones.idmaterial,
                com_cotizaciones.idmueble
            FROM com_cotizaciones
            INNER JOIN conf_muebles ON conf_muebles.idmueble = com_cotizaciones.idmueble
            INNER JOIN conf_materiales ON conf_materiales.idmaterial = com_cotizaciones.idmaterial
            WHERE idusuariocreo = $1 AND
            estado = "A"
            `,
            [idUser]
        );

        if(rowCount < 1) {
            return res.status(404).json({ message: "Aún no ha creado cotizaciones" });
        }

        return res.status(200).json({ rows });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const eliminarCotizacion = async(req, res) => {
    try {
        const { idQuotation } = req.params;

        const { rows } = await pool.query(`
            DELETE FROM com_cotizaciones
            WHERE idcotizacion = $1 RETURNING *
            `,
            [
                idQuotation
            ]
        );

        return res.status(200).json({ message: "Cotización eliminada con éxito" });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}