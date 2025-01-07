import { pool } from "../db.js";
import { encrypt, compare } from "../helpers/handleBcrypt.js";

export const obtenerUsuarios = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT 
            idusuario, nombre, apellido, usuario, idrol, activo, telefono
            FROM usuarios 
            ORDER BY idusuario ASC`
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Error Internal Server" });
    }
};


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
        const contraseñaHash = await encrypt(data.password);
        
        const {rows} = await pool.query(
            "INSERT INTO usuarios (usuario, contraseña, nombre, apellido) VALUES ($1, $2, $3, $4) RETURNING *", [data.username, contraseñaHash, data.nombre, data.apellido]
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
    const { userId } = req.params;
    const data = req.body;

    // Obtener el usuario actual para comparar las contraseñas
    const { rows: usuario } = await pool.query(
        `SELECT * FROM usuarios WHERE idusuario = $1`,
        [userId]
    );

    if (usuario.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Encriptar la contraseña si se proporciona una nueva
    let contraseñaHash;

    if (data.password && data.password.trim() !== "") {
        // Encriptar la nueva contraseña
        contraseñaHash = await encrypt(data.password);
    } else {
        // Usar la contraseña actual del usuario
        contraseñaHash = usuario[0].contraseña;
    }

    // Realizar la actualización con la nueva contraseña (si se encriptó)
    const { rows } = await pool.query(`
        UPDATE usuarios 
        SET usuario = $1, contraseña = $2, nombre = $3, apellido = $4, idrol = $5, activo = $6, telefono = $7
        WHERE idusuario = $8 RETURNING *`,
        [data.username, contraseñaHash, data.nombre, data.apellido, data.idRol, data.activo, data.number, userId]
    );

    return res.json(rows[0]);
}