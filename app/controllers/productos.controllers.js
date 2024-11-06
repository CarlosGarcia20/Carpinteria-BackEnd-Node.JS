import { pool } from "../db.js";


export const obtenerProductos = async(req, res) => {
    const { rows } = await pool.query(`
        SELECT 
            conf_productos.idproducto,
            conf_marcas.nombre AS marca,
            conf_productos.descripcion,
            conf_productos.claveproducto,
            conf_unidades.nombre AS unidad,
            conf_productos.fechaalta,
            conf_productos.activo,
            conf_productos.costo,
            conf_productos.stockactual,
            conf_productos.stockmin,
            conf_productos.stockmax
        FROM conf_productos 
        JOIN conf_unidades ON conf_unidades.idunidad = conf_productos.idunidad
        JOIN conf_marcas ON conf_marcas.idmarca = conf_productos.idmarca
        ORDER BY idproducto ASC
    `)
    console.log(rows);
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
        const data = req.body;
        
        const { rows } = await pool.query(
            "INSERT INTO conf_productos (descripcion, claveproducto, idunidad, costo, idmarca, stockmin, stockmax) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [data.descripcion, data.claveproducto, data.idunidad, data.costo, data.idmarca, data.stockmin, data.stockmax]
        );
        return res.status(200).json({ message: "Producto creado con éxito" });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
}

// Actualiza el stock manualmente
export const actualizarStockProducto = async (req, res) => {
    try {
        const { productId } = req.params;
        const { stockactual } = req.body;

        // Consulta el stock actual del producto
        const { rows: stockRows, rowCount: stockCount } = await pool.query(
            `SELECT stockactual FROM conf_productos WHERE idproducto = $1`,
            [productId]
        );

        // Verifica si el producto existe
        if (stockCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const stockActualActual = stockRows[0].stockactual;

        // Valida que el nuevo stock no sea menor al actual
        if (stockactual < stockActualActual) {
            return res.status(400).json({
                message: "El nuevo stock no puede ser menor al stock actual",
                stockActualActual,
            });
        }

        // Actualiza el stock del producto si pasa la validación
        const { rowCount } = await pool.query(
            `UPDATE conf_productos SET stockactual = $1 WHERE idproducto = $2 RETURNING *`,
            [stockactual, productId]
        );

        return res.status(200).json({ message: "Stock del producto actualizado correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
};

 
export const eliminarProducto = async (req, res) => {
    try {
        const { productId } = req.params
        const { rows, rowCount } = await pool.query("DELETE FROM conf_productos WHERE idproducto = $1 RETURNING *",
            [productId]
        );
        console.log(rows);
        
        if(rowCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error. " + error });
    }
}

export const habilitarProducto = async (req, res) => {
    try {
        const { productId } = req.params
        const { rows } = await pool.query(
            "UPDATE conf_productos SET activo = 'S' WHERE idproducto = $1 RETURNING *", 
            [productId]
        )

        if(rows.length === 0 ) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto habilitado correctamente" });
    } catch (error) {
        console.log(error);
        
        return res.status(404).json({ message: "Internal Server Error. " + error })
    }
}

export const deshabilitarProducto = async (req, res) => {
    try {
        const { productId } = req.params
        const { rows } = await pool.query(
            "UPDATE conf_productos SET activo = 'N' WHERE idproducto = $1 RETURNING *", 
            [productId]
        )

        if(rows.length === 0 ) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json({ message: "Producto deshabilitado correctamente" });
    } catch (error) {
        console.log(error);
        
        return res.status(404).json({ message: "Internal Server Error. " + error })
    }
}