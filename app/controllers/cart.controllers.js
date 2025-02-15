import { pool } from "../db.js";

export const guardarDatosDePago = async(req, res) => {
    try {
        const { idPayment, correo, totalCompra, estado, productos, idUsuario } = req.body;

        const { rows: compraRows } = await pool.query(
            `INSERT INTO  com_compras (idpaypalpago, correousuario, totalcompra, idusuariocompro, estadopago)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING idpago`,
            [
                idPayment,
                correo,
                totalCompra,
                idUsuario,
                estado
            ]
        );

        const idCompra = compraRows[0].idpago;

        // Recorrer el arreglo de productos e insertar cada producto en la tabla de detalles
        for (const producto of productos) {
            await pool.query(
                `INSERT INTO com_comprasd (idpago, idproducto, cantidad)
                VALUES ($1, $2, $3)`,
                [
                    idCompra,
                    producto.idProducto,
                    producto.cantidad
                ]
            );

            await actualizarStockProducto(producto.idProducto, producto.cantidad);
        }

        return res.status(200).json({ message: "Compra realizada con éxito" });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error", error: error });
    }
}

const actualizarStockProducto = async(idProducto, cantidad) => {
    try {
        await pool.query(
            `UPDATE conf_productos
            SET stockactual = stockactual - $1
            WHERE idproducto = $2`,
            [
                cantidad,
                idProducto
            ]
        );
    } catch (error) {
        console.log(error);

        throw error;
    }
}

export const obtenerProductosPorUsuario = async(req, res) => {
    try {
        const { idUsuario, year } = req.params;

        const { rows, rowCount } = await pool.query(
            `SELECT 
                com_compras.*, 
                com_comprasd.idproducto, 
                com_comprasd.cantidad, 
                conf_productos.descripcion,
                conf_productos.imagen,
                CONCAT(usuarios.nombre, ' ', usuarios.apellido) AS nombreUsuario
            FROM com_compras
            JOIN com_comprasd ON com_comprasd.idpago = com_compras.idpago
            JOIN conf_productos ON conf_productos.idproducto = com_comprasd.idproducto
            JOIN usuarios ON usuarios.idusuario = com_compras.idusuariocompro
            WHERE idusuariocompro = $1
            AND EXTRACT(YEAR FROM com_compras.fechacompra) = $2`,
            [
                idUsuario,
                year
            ]
        );

        if(rowCount == 0) {
            return res.status(200).json({ status: "NOT FOUND" })
        }

        return res.status(200).json(rows);
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error" });
    }
}