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
    try {
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
                conf_productos.imagen,
                conf_productos.ancho,
                conf_productos.largo,
                conf_productos.alto,
                conf_productos.profundidad,
                conf_productos.informacion
            FROM conf_productos 
            JOIN conf_unidades ON conf_unidades.idunidad = conf_productos.idunidad
            JOIN conf_marcas ON conf_marcas.idmarca = conf_productos.idmarca
            WHERE conf_productos.activo = 'S' AND stockactual > 0
            ORDER BY idproducto ASC
        `)
        // console.log(rows);
        res.json(rows);  
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export const obtenerProducto = async(req, res) => {
    try {
        const { productId } = req.params
        const { rows } = await pool.query(
            `SELECT * FROM conf_productos 
            WHERE idproducto = $1 AND activo = 'S' AND stockactual >= 1 `, 
            [productId]
        );
    
        if(rows.length === 0 ) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(rows[0])
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error. " + error });
    }


}

export const insertarProducto = async(req, res) => {
    try {
        const { 
            description, claveProducto, idUnidad, costo, idMarca, stockMin, stockMax, stockActual, activo, informacion,
            ancho, largo, alto, profundidad
        } = req.body;
        const imagenRuta = req.file ? req.file.path : null; // Ruta donde se almacena la imagen

        
        const { rows } = await pool.query(
            `INSERT INTO conf_productos (descripcion, claveproducto, idunidad, costo, idmarca, stockmin, stockmax, stockactual, activo, imagen, 
            ancho, largo, alto, profundidad, informacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
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
              ancho,
              largo,
              alto,
              profundidad,
              informacion,
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
        const { description, claveProducto, idUnidad, costo, idMarca, stockMin, stockMax, stockActual, activo, informacion,
            ancho, largo, alto, profundidad, imagen
        } = req.body;
        const imagenRuta = req.file ? req.file.path : imagen; // Ruta donde se almacena la imagen

        const { rows, rowCount } = await pool.query(
            `UPDATE conf_productos
            SET descripcion = $1, claveproducto = $2, idunidad = $3, activo = $4, costo = $5, idmarca = $6, stockmin = $7, 
            stockmax = $8, stockactual = $9, imagen = $10, ancho = $11, largo = $12, alto = $13, profundidad = $14, informacion = $15
            WHERE idproducto = $16 RETURNING *`,
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
                ancho,
                largo,
                alto,
                profundidad,
                informacion,
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

export const verificarStock = async(req, res) =>  {
    try {
        const { productId } = req.params;
        const { cantidad } = req.body;

        console.log(productId)
        console.log(cantidad)

        const { rows, rowCount } = await pool.query(
            `SELECT stockactual FROM conf_productos WHERE idproducto = $1`, [productId]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const stockActualizado = rows[0].stockactual;
        if(stockActualizado < cantidad) {
            return res.status(409).json({ message: "El stock actual ha cambiado durante su proceso de compra" });
        }

        return res.status(200).json({ message: "Stock disponible" });

    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Internal Server Error." });
    }
}