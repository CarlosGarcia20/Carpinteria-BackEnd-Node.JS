import { Resend } from 'resend';
import dotenv from "dotenv";

// Variables de entorno
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía un correo utilizando Resend
 * @param {string} to - Correo del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido en HTML del correo
 * @param {string} from - Correo del remitente (opcional, si no quieres usar el predeterminado)
 * @returns {Promise<Object>} - Respuesta de Resend
 */

export const enviarCorreo = async (to, subject, html, from = "Acme <onboarding@resend.dev>") => {
    const response = await resend.emails.send({
        from: from,
        to: to,
        subject: subject,
        html: html
    });

    return response;
}
