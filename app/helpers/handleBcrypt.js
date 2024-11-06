import bcrypt from "bcryptjs";

export const encrypt = async(textoPlano) => {
    const hash = await bcrypt.hash(textoPlano, 10)
    return hash
}

export const compare = async(contraseñaPlana, hashPassword) => {
    return await bcrypt.compare(contraseñaPlana, hashPassword)
}