import express from 'express'
import { PORT } from './config.js'
import userRoutes from './routes/users.routes.js'
import loginRoutes from './routes/login.routes.js'
import productsRoutes from './routes/productos.routes.js'
import morgan from "morgan";
import cookieParser from "cookie-parser";
import validarSesion from './middlewares/user.token.js';  // Importa el middleware

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(validarSesion)

app.set('view engine', 'ejs')

// app.use((req, res, next) => {
//     const token = req.cookies.access_token
//     req.session = { usuario: null }

//     try {
//         data = jwt.verify(token, SECRET_JWT_KEY)
//         req.session.usuario = data
//     } catch {}

//     next() 
// })


app.use(morgan('dev'))
app.use(userRoutes);
app.use(loginRoutes);
app.use(productsRoutes);


app.listen(PORT);
console.log("Servidor en el puerto: ", PORT);
