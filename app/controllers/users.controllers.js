import { pool } from "../db.js";
import { encrypt } from "../helpers/handleBcrypt.js";

export const obtenerUsuarios = async(req, res) => {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY idusuario ASC")
    console.log(rows);
    res.json(rows);  
}

export const obtenerUsuario = async(req, res) => {
    const {userId} = req.params
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE idusuario = $1', [userId]);

    if(rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(rows[0])
}

export const crearUsuario = async(req, res) => {
    try {
        const data = req.body
        const contraseñaHash = await encrypt(data.contraseña);
        
        const {rows} = await pool.query(
            "INSERT INTO usuarios (usuario, contraseña, nombre, apellido) VALUES ($1, $2, $3, $4) RETURNING *", [data.usuario, contraseñaHash, data.nombre, data.apellido]
        );
        return res.status(200).json({ message: "Usuario creado con éxito" });
        
    } catch (error) {
        console.log(error);

        // if (error?.code === "23505") {
        //     return res.status(409).json({ message: "" })
        // }

        return res.status(500).json({ message: "Internal Server Error" })
    }
    
}

export const eliminarUsuario = async(req, res) => {
    const {userId} = req.params
    const {rows, rowCount} = await pool.query('DELETE FROM usuarios WHERE idusuario = $1 RETURNING *', [userId]);
    console.log(rows);
    
    if(rowCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Usuario eliminado" });
}

export const actualizarUsuario = async(req, res) => {
    const {userId} = req.params
    const data = req.body;
    const {rows} = await pool.query(
        "UPDATE usuarios SET nombre = $1, apellido = $2 WHERE idusuario = $3 RETURNING *", [data.nombre, data.apellido, userId]
    )

    return res.json(rows[0]);
}