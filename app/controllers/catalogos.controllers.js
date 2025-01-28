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

// Funciones a exportar para el catalogo de muebles
export const getFurniture = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM conf_muebles
            ORDER BY descripcion ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const addFurniture = async(req, res) => {
    try {
        const data = req.body;

        const { rowCount } = await pool.query(
            `INSERT INTO conf_muebles (descripcion, activo)
            VALUES ($1, $2) RETURNING *`,
            [data.descripcion, data.activo]
        );

        if(rowCount < 1) {
            return res.status(401).json({ message: "Ocurrió un error al agregar el mueble" });
        }

        return res.status(200).json({ message: "Linea agregada con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const modifyFurniture = async (req, res) => {
    try {
        const { furnitureId } = req.params;  // Obtener el parámetro de la ruta
        const { descripcion, activo } = req.body;

        // Verificar que exista la unidad en la base de datos
        const { rows } = await pool.query(
            `SELECT idmueble FROM conf_muebles WHERE idmueble = $1`,
            [furnitureId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Unidad no encontrada" });
        }

        // Actualizar la unidad
        await pool.query(
            `UPDATE conf_muebles 
            SET descripcion = $1, activo = $2
            WHERE idmueble = $3
            RETURNING *`,  // Opcional: Devuelve la fila actualizada
            [descripcion, activo, furnitureId]
        );

        return res.status(200).json({ message: "Mueble modificado con éxito" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteFurniture = async(req, res) => {
    try {
        const { furnitureId } = req.params;
    
        // Verificar que exista la unidad en la base de datos
        const verificar = await pool.query(
            `SELECT idmueble FROM conf_muebles WHERE idmueble = $1`,
            [furnitureId]
        );

        if(verificar.rows.length === 0) {
            return res.status(404).json({ message: "Mueble no encontrado" });
        }
    
        await pool.query(
            `DELETE FROM conf_muebles WHERE idmueble = $1`, [furnitureId]
        );
    
        return res.status(200).json({ message: "Mueble eliminado con éxito" });        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Funciones a exportar para el catalogo de materiales
export const getMaterial = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM conf_materiales
            ORDER BY descripcion ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const addMaterial = async(req, res) => {
    try {
        const data = req.body;

        const { rowCount } = await pool.query(
            `INSERT INTO conf_materiales (descripcion, activo)
            VALUES ($1, $2) RETURNING *`,
            [data.descripcion, data.activo]
        );

        if(rowCount < 1) {
            return res.status(401).json({ message: "Ocurrió un error al agregar el material" });
        }

        return res.status(200).json({ message: "Material agregado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const modifyMaterial = async (req, res) => {
    try {
        const { idMaterial } = req.params;  // Obtener el parámetro de la ruta
        const { descripcion, activo } = req.body;

        // Verificar que exista la unidad en la base de datos
        const { rows } = await pool.query(
            `SELECT idmaterial FROM conf_materiales WHERE idmaterial = $1`,
            [idMaterial]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Material no encontrado" });
        }

        // Actualizar la unidad
        await pool.query(
            `UPDATE conf_materiales 
            SET descripcion = $1, activo = $2
            WHERE idmaterial = $3
            RETURNING *`,  // Opcional: Devuelve la fila actualizada
            [descripcion, activo, idMaterial]
        );

        return res.status(200).json({ message: "Material modificado con éxito" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteMaterial = async(req, res) => {
    try {
        const { idMaterial } = req.params;
    
        // Verificar que exista la unidad en la base de datos
        const verificar = await pool.query(
            `SELECT idmaterial FROM conf_materiales WHERE idmaterial = $1`,
            [idMaterial]
        );

        if(verificar.rows.length === 0) {
            return res.status(404).json({ message: "Material no encontrado" });
        }
    
        await pool.query(
            `DELETE FROM conf_materiales WHERE idmaterial = $1`, [idMaterial]
        );
    
        return res.status(200).json({ message: "Material eliminado con éxito" });        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Funciones a exportar para el catalogo de tipo de muebles
export const obtenerTipoMueble = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT 
                conf_tipomueble.*,
                conf_muebles.descripcion AS mueble
            FROM conf_tipomueble
            INNER JOIN conf_muebles ON conf_muebles.idmueble = conf_tipomueble.idmueble
            ORDER BY descripcion ASC`
        )

        return res.status(200).json( rows );
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const añadirTipoMueble = async(req, res) => {
    try {
        const data = req.body;

        const { rowCount } = await pool.query(
            `INSERT INTO conf_tipomueble (idmueble, descripcion, activo)
            VALUES ($1, $2, $3) RETURNING *`,
            [data.idMueble, data.descripcion, data.activo]
        );

        if(rowCount < 1) {
            return res.status(401).json({ message: "Ocurrió un error al agregar el tipo de mueble" });
        }

        return res.status(200).json({ message: "Tipo de mueble agregado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error."  });
    }
}

export const modificarTipoMueble = async (req, res) => {
    try {
        const { idTipoMueble } = req.params;  // Obtener el parámetro de la ruta
        const { idMueble, descripcion, activo } = req.body;
        console.log(idMueble)
        console.log(descripcion)
        console.log(activo)
        // Verificar que exista la unidad en la base de datos
        const { rows } = await pool.query(
            `SELECT idtipomueble FROM conf_tipomueble WHERE idtipomueble = $1`,
            [idTipoMueble]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tipo de mueble no encontrado" });
        }

        // Actualizar
        await pool.query(
            `UPDATE conf_tipomueble 
            SET idmueble = $1, descripcion = $2, activo = $3
            WHERE idtipomueble = $4
            RETURNING *`,  // Opcional: Devuelve la fila actualizada
            [idMueble, descripcion, activo, idTipoMueble]
        );

        return res.status(200).json({ message: "Tipo de mueble modificado con éxito" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const eliminarTipoMueble = async(req, res) => {
    try {
        const { idTipoMueble } = req.params;
    
        // Verificar que exista la unidad en la base de datos
        const verificar = await pool.query(
            `SELECT idtipomueble FROM conf_tipomueble WHERE idtipomueble = $1`,
            [idTipoMueble]
        );

        if(verificar.rows.length === 0) {
            return res.status(404).json({ message: "Tipo de mueble no encontrado" });
        }
    
        await pool.query(
            `DELETE FROM conf_tipomueble WHERE idtipomueble = $1`, [idTipoMueble]
        );
    
        return res.status(200).json({ message: "Tipo de mueble eliminado con éxito" });        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}