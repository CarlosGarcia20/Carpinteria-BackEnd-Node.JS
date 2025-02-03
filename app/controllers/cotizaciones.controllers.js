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
            idMueble, idMaterial, dimensiones, cantidad, adicional, idTipoMueble, idUsuarioCreo, color, fecha
        } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO com_cotizaciones (
                idmueble, idmaterial, dimensiones, cantidad, adicional, estado, idtipomueble, idusuariocreo, colorhex, fecha
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                idMueble,
                idMaterial,
                dimensiones,
                cantidad,
                adicional,
                "PA",
                idTipoMueble,
                idUsuarioCreo,
                color,
                fecha
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
                com_cotizaciones.adicional,
                com_cotizaciones.estado,
                com_cotizaciones.colorhex,
                com_cotizaciones.fecha,
                conf_muebles.descripcion AS mueble,
                conf_materiales.descripcion AS material,
                conf_tipomueble.descripcion AS tipoMueble
            FROM com_cotizaciones
            INNER JOIN conf_muebles ON conf_muebles.idmueble = com_cotizaciones.idmueble
            INNER JOIN conf_materiales ON conf_materiales.idmaterial = com_cotizaciones.idmaterial
            INNER JOIN conf_tipomueble ON conf_tipomueble.idtipomueble = com_cotizaciones.idtipomueble
            WHERE idusuariocreo = $1
            `,
            [idUser]
        );

        if(rowCount < 1) {
            return res.status(404).json({ message: "Aún no ha creado cotizaciones" });
        }

        return res.status(200).json({ rows });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const eliminarCotizacion = async(req, res) => {
    try {
        const { idQuotation } = req.params;
        const {idUser, motivo} = req.body;

        const { rows } = await pool.query(`
            DELETE FROM com_cotizaciones
            WHERE idcotizacion = $1 RETURNING *
            `,
            [
                idQuotation
            ]
        );

        const { rowCount } = await pool.query(`
            INSERT INTO com_cotizacioneseliminadas (idcotizacion, motivo, idusuarioelimino)
            VALUES ($1, $2, $3)    
            `,
            [
                idQuotation,
                motivo,
                idUser
            ]
        );

        if(rowCount > 0) {
            return res.status(200).json({ message: "Cotización eliminada con éxito" });
        } else {
            return res.status(500).json({ message: "Internal Server Error."  });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}