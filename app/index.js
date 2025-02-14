import express from 'express';
import { PORT } from './config.js';
import path from 'path';

// Rutas
import userRoutes from './routes/users.routes.js';
import loginRoutes from './routes/login.routes.js';
import productsRoutes from './routes/productos.routes.js';
import catalogosRoutes from './routes/catalogos.routes.js';
import cartRoutes from './routes/cart.routes.js'
import cotizacionesRoutes from './routes/cotizaciones.routes.js'
import admincotizacionresRoutes from './routes/admincotizaciones.routes.js'

// Servicios para el funcionamiento del backend
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Libreria para poder aceptar peticiones del frontend
import cors from 'cors';

const app = express()

app.use(morgan('dev'))
app.use(cors({
    origin: 'http://localhost:4200', // Especifica el origen permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));
app.use(express.json());

// Middleware para cookies
app.use(cookieParser())

// Configurar la ruta para servir archivos estaticos
app.use('/app/uploads', express.static(path.join(process.cwd(), 'app/uploads')));

// Rutas
app.use(loginRoutes);
app.use(userRoutes);
app.use(productsRoutes);
app.use(catalogosRoutes);
app.use(cartRoutes);
app.use(cotizacionesRoutes);
app.use(admincotizacionresRoutes);

//Middleware global para el manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// app.use((req, res, next) => {
//     const token = req.cookies.access_token
//     req.session = { usuario: null }

//     try {
//         data = jwt.verify(token, SECRET_JWT_KEY)
//         req.session.usuario = data
//     } catch {}

//     next() 
// })

app.listen(PORT, () => {
    console.log("Servidor en el puerto: ", PORT);
});

//De esta manera se tiene que crear el token
// Esto se obtiene del rows de repuesta
// const { idusuario } = rows[0];
// const token = generarToken(idusuario, nombre, apellido);
// .status(200)
// .cookie('access_token', token, {
//     httpOnly: true, // La cookie solo se puede acceder en el servidor
//     secure: process.env.NODE_ENV === 'production', // La cookie solo se puede acceder en HTTPS
//     sameSite: 'strict', // La cookie solo se puede acceder en el mismo sitio
//     maxAge: 1000 * 60 * 60, // La cookie tiene un tiempo de validez de 1 hora
// })