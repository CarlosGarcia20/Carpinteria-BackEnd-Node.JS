import multer from "multer";
import { pool } from "../db.js";
import path from 'path';

// Configuracion de multer para almacenar imagenes en el servidor
const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre unico para evitar duplicados y conflictos
    },
});

const upload = multer({ storage });


export const obtenerProductos = async(req, res) => {
    const { rows } = await pool.query(`
        SELECT 
            conf_productos.idproducto,
            conf_productos.idmarca,
            conf_marcas.nombre AS marca,
            conf_productos.descripcion,
            conf_productos.claveproducto,
            conf_productos.idunidad,
            conf_unidades.nombre AS unidad,
            conf_productos.fechaalta,
            conf_productos.activo,
            conf_productos.costo,
            conf_productos.stockactual,
            conf_productos.stockmin,
            conf_productos.stockmax,
            conf_productos.imagen
        FROM conf_productos 
        JOIN conf_unidades ON conf_unidades.idunidad = conf_productos.idunidad
        JOIN conf_marcas ON conf_marcas.idmarca = conf_productos.idmarca
        ORDER BY idproducto ASC
    `)
    // console.log(rows);
    res.json(rows);  
}

export const obtenerProducto = async(req, res) => {
    const { productId } = req.params
    const { rows } = await pool.query('SELECT * FROM conf_productos WHERE idproducto = $1', [productId]);

    if(rows.length === 0 ) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(rows[0])
}

export const insertarProducto = async(req, res) => {
    try {
        const { description, claveProducto, idUnidad, costo, idMarca, stockMin, stockMax, stockActual, activo } = req.body;
        const imagenRuta = req.file ? req.file.path : null; // Ruta donde se almacena la imagen

        
        const { rows } = await pool.query(
            `INSERT INTO conf_productos (descripcion, claveproducto, idunidad, costo, idmarca, stockmin, stockmax, stockactual, activo, imagen) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [
              description,
              claveProducto,
              idUnidad,
              costo,
              idMarca,
              stockMin,
              stockMax,
              stockActual,
              activo,
              imagenRuta,
            ]
        );

        return res.status(200).json({ message: "Producto creado con éxito" });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
}
 
export const eliminarProducto = async (req, res) => {
    try {
        const { productId } = req.params
        const { rows, rowCount } = await pool.query("DELETE FROM conf_productos WHERE idproducto = $1 RETURNING *",
            [productId]
        );
        
        if(rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
}

export const guardarEditarProducto = async (req, res) => {
    try {
        const { productId } = req.params;
        const { description, claveProducto, idUnidad, costo, idMarca, stockMin, stockMax, stockActual, activo } = req.body;
        const imagenRuta = req.file ? req.file.path : null; // Ruta donde se almacena la imagen

        const { rows, rowCount } = await pool.query(
            `UPDATE conf_productos
            SET descripcion = $1, claveproducto = $2, idunidad = $3, activo = $4, costo = $5, idmarca = $6, stockmin = $7, 
            stockmax = $8, stockactual = $9, imagen = $10
            WHERE idproducto = $11 RETURNING *`,
            [
                description,
                claveProducto,
                idUnidad,
                activo,
                costo,
                idMarca,
                stockMin,
                stockMax,
                stockActual,
                imagenRuta,
                productId // Ahora se incluye en el arreglo de parámetros
            ]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar producto:", error); // Log del error para depuración
        return res.status(500).json({ message: "Internal Server Error." });
    }
};