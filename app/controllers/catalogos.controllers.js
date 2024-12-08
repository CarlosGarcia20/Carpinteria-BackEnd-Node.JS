import { json } from "express";
import { pool } from "../db.js";

// Funciones a exportar para el catalogo de marcas
export const obtenerMarcas = async (req, res) => {   
    try {
        const { rows } = await pool.query(
            `SELECT * FROM conf_marcas
            ORDER BY nombre ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
}

export const addBrand = async(req, res) => {
    try {
        const data = req.body;

        const { rows } = await pool.query(
            `INSERT INTO conf_marcas (nombre, activo)
            VALUES ($1, $2)`, [data.name, data.active]
        );

        return res.status(200).json({ message: "Marca creada con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error. " + error })
    }
}

export const deleteBrand = async(req, res) => {
    try {
        const { marcaId } = req.params;

        const { rows } = await pool.query(
            `SELECT idmarca FROM conf_marcas
            WHERE idmarca = $1`, [marcaId]
        );

        if(rows.length === 0) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }

        const { row } = await pool.query(
            `DELETE FROM conf_marcas WHERE idmarca = $1 RETURNING *`, [marcaId]
        );

        return res.status(200).json({ message: "Marca eliminada correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const actualizarMarca = async (req, res) => {
    try {
        const { marcaId } = req.params; // Obtener el parámetro de ruta
        const { name, active } = req.body; // Desestructurar datos del cuerpo de la solicitud

        // Verificar si la marca existe
        const marcaExistente = await pool.query(
            `SELECT idmarca FROM conf_marcas WHERE idmarca = $1`,
            [marcaId]
        );

        if (marcaExistente.rows.length === 0) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }

        // Actualizar la marca
        const resultado = await pool.query(
            `UPDATE conf_marcas 
            SET nombre = $1, activo = $2
            WHERE idmarca = $3
            RETURNING *`, // Opcional: devuelve la fila actualizada
            [name, active, marcaId]
        );

        return res.status(200).json({ message: "Marca modificada con éxito" });
    } catch (error) {
        console.error("Error en actualizarMarca:", error); // Log para depuración
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

 
// Funciones a exportar para el catalogo de marcas
export const obtenerUnidades = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM conf_unidades
            WHERE activo = 'S'
            ORDER BY nombre ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
}

export const addUnit = async(req, res) => {
    try {
        const data = req.body;

        const resultado = await pool.query(
            `INSERT INTO conf_unidades (nombre, siglas, activo)
            VALUES ($1, $2, $3) RETURNING *`,
            [data.name, data.siglas, data.active]
        );

        return res.status(200).json({ message: "Unidad creada con éxito" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const modifyUnit = async (req, res) => {
    try {
        const { unitId } = req.params;  // Obtener el parámetro de la ruta
        const { name, siglas, active } = req.body;  // Desestructurar datos del cuerpo de la solicitud

        // Verificar que exista la unidad en la base de datos
        const { rows } = await pool.query(
            `SELECT idunidad FROM conf_unidades WHERE idunidad = $1`,
            [unitId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Unidad no encontrada" });
        }

        // Actualizar la unidad
        await pool.query(
            `UPDATE conf_unidades 
            SET nombre = $1, siglas = $2, activo = $3
            WHERE idunidad = $4
            RETURNING *`,  // Opcional: Devuelve la fila actualizada
            [name, siglas, active, unitId]
        );

        return res.status(200).json({ message: "Unidad modificada con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteUnit = async(req, res) => {
    try {
        const { unitId } = req.params;
    
        // Verificar que exista la unidad en la base de datos
        const verificar = await pool.query(
            `SELECT idunidad FROM conf_unidades WHERE idunidad = $1`,
            [unitId]
        );

        if(verificar.rows.length === 0) {
            return res.status(404).json({ message: "Unidad no encontrada" });
        }
    
        await pool.query(
            `DELETE FROM conf_unidades WHERE idunidad = $1`, [unitId]
        );
    
        return res.status(200).json({ message: "Unidad eliminada con éxito" });        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}