import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors"
import cors, {CorsOptions} from "cors"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import swaggerSpec, {swaggerUIOptions} from "./config/swagger";


//conectar a base de datos

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.magenta("Conexion exitosa a la DB"))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold("Hubo un error al conectar a la base de datos"))
    }
}

//instancia de express
const server = express()

//Permitir conexiones 

const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        }else{
            callback(new Error("Error de CORS"))
        }
    }
}

server.use(cors(corsOptions))

//leer datos 
server.use(express.json())

connectDB()

server.use(morgan("dev"))
server.use("/api/products", router)

//Documentación
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions) )

export default server